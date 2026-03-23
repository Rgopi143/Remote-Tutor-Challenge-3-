import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Circle as KonvaCircle } from 'react-konva';
import { HexColorPicker } from 'react-colorful';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pencil, 
  Eraser, 
  Trash2, 
  X, 
  Download,
  Square,
  Circle,
  Undo,
  Redo,
  Palette,
  ChevronDown,
  Layers,
  Plus,
  Eye,
  EyeOff,
  GripVertical,
  MoreVertical,
  Save,
  FolderOpen
} from 'lucide-react';
import { cn } from '../lib/utils';

interface DrawingCanvasProps {
  onClose: () => void;
  theme: 'light' | 'dark';
}

interface DrawingLine {
  tool: string;
  points: number[];
  color: string;
  strokeWidth: number;
}

interface LayerData {
  id: string;
  name: string;
  visible: boolean;
  lines: DrawingLine[];
}

export default function DrawingCanvas({ onClose, theme }: DrawingCanvasProps) {
  const [tool, setTool] = useState('pen');
  const [layers, setLayers] = useState<LayerData[]>([
    { id: 'layer-1', name: 'Layer 1', visible: true, lines: [] }
  ]);
  const [activeLayerId, setActiveLayerId] = useState('layer-1');
  const [color, setColor] = useState('#5A5A40');
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [history, setHistory] = useState<LayerData[][]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLayersPanel, setShowLayersPanel] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const isDrawing = useRef(false);
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const activeLayer = layers.find(l => l.id === activeLayerId) || layers[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight - 80 // Subtract toolbar height
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleMouseDown = (e: any) => {
    if (!activeLayer.visible) return;
    const stage = e.target.getStage();
    if (!stage) return;
    isDrawing.current = true;
    const pos = stage.getPointerPosition();
    setHistory([...history, JSON.parse(JSON.stringify(layers))]);
    
    const newLayers = layers.map(l => {
      if (l.id === activeLayerId) {
        return {
          ...l,
          lines: [...l.lines, { 
            tool, 
            points: [pos.x, pos.y, pos.x, pos.y], 
            color: tool === 'eraser' ? (theme === 'dark' ? '#0c0a09' : '#ffffff') : color,
            strokeWidth: tool === 'eraser' ? 20 : strokeWidth
          }]
        };
      }
      return l;
    });
    setLayers(newLayers);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current || !activeLayer.visible) return;

    const stage = e.target.getStage();
    if (!stage) return;
    const point = stage.getPointerPosition();
    
    const newLayers = layers.map(l => {
      if (l.id === activeLayerId) {
        const lastLine = { ...l.lines[l.lines.length - 1] };
        
        if (tool === 'pen' || tool === 'eraser') {
          lastLine.points = lastLine.points.concat([point.x, point.y]);
        } else {
          // For shapes, we only update the end point
          lastLine.points = [lastLine.points[0], lastLine.points[1], point.x, point.y];
        }
        
        const newLines = [...l.lines];
        newLines[newLines.length - 1] = lastLine;
        return { ...l, lines: newLines };
      }
      return l;
    });
    setLayers(newLayers);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleClear = () => {
    setHistory([...history, JSON.parse(JSON.stringify(layers))]);
    setLayers(layers.map(l => l.id === activeLayerId ? { ...l, lines: [] } : l));
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setLayers(prev);
  };

  const handleAddLayer = () => {
    const newId = `layer-${Date.now()}`;
    const newLayer: LayerData = {
      id: newId,
      name: `Layer ${layers.length + 1}`,
      visible: true,
      lines: []
    };
    setLayers([newLayer, ...layers]);
    setActiveLayerId(newId);
  };

  const handleDeleteLayer = (id: string) => {
    if (layers.length <= 1) return;
    const newLayers = layers.filter(l => l.id !== id);
    setLayers(newLayers);
    if (activeLayerId === id) {
      setActiveLayerId(newLayers[0].id);
    }
  };

  const toggleLayerVisibility = (id: string) => {
    setLayers(layers.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
  };

  const moveLayer = (id: string, direction: 'up' | 'down') => {
    const index = layers.findIndex(l => l.id === id);
    if (direction === 'up' && index > 0) {
      const newLayers = [...layers];
      [newLayers[index - 1], newLayers[index]] = [newLayers[index], newLayers[index - 1]];
      setLayers(newLayers);
    } else if (direction === 'down' && index < layers.length - 1) {
      const newLayers = [...layers];
      [newLayers[index + 1], newLayers[index]] = [newLayers[index], newLayers[index + 1]];
      setLayers(newLayers);
    }
  };

  const handleSaveToLocalStorage = () => {
    const data = {
      layers,
      activeLayerId,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('tutor-canvas-save', JSON.stringify(data));
    setStatusMessage('Canvas state saved successfully!');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleLoadFromLocalStorage = () => {
    const savedData = localStorage.getItem('tutor-canvas-save');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setHistory([...history, JSON.parse(JSON.stringify(layers))]);
        setLayers(parsed.layers);
        setActiveLayerId(parsed.activeLayerId);
        setStatusMessage('Canvas state loaded successfully!');
        setTimeout(() => setStatusMessage(null), 3000);
      } catch (e) {
        console.error('Failed to load canvas data', e);
        setStatusMessage('Failed to load saved canvas data.');
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } else {
      setStatusMessage('No saved canvas data found.');
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const handleDownload = () => {
    if (!stageRef.current) return;
    const uri = stageRef.current.toDataURL();
    const link = document.createElement('a');
    link.download = 'tutor-drawing.png';
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const colors = [
    '#5A5A40', // Brand Olive
    '#EF4444', // Red
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Amber
    '#8B5CF6', // Violet
    '#000000', // Black
    '#FFFFFF'  // White
  ];

  return (
    <div 
      ref={containerRef}
      className={cn(
        "fixed inset-0 z-[100] flex flex-col transition-colors duration-300",
        theme === 'dark' ? "bg-stone-950" : "bg-white"
      )}
    >
      {/* Toolbar */}
      <div className={cn(
        "h-20 px-6 flex items-center justify-between border-b",
        theme === 'dark' ? "border-stone-800 bg-stone-900" : "border-stone-100 bg-stone-50"
      )}>
        <div className="flex items-center gap-4">
          <div className="flex bg-white dark:bg-stone-800 rounded-xl p-1 shadow-sm border border-stone-200 dark:border-stone-700">
            <button
              onClick={() => setTool('pen')}
              className={cn(
                "p-2 rounded-lg transition-all",
                tool === 'pen' ? "bg-stone-100 dark:bg-stone-700 text-stone-900 dark:text-white" : "text-stone-400 hover:text-stone-600"
              )}
              title="Pencil"
            >
              <Pencil size={20} />
            </button>
            <button
              onClick={() => setTool('rect')}
              className={cn(
                "p-2 rounded-lg transition-all",
                tool === 'rect' ? "bg-stone-100 dark:bg-stone-700 text-stone-900 dark:text-white" : "text-stone-400 hover:text-stone-600"
              )}
              title="Rectangle"
            >
              <Square size={20} />
            </button>
            <button
              onClick={() => setTool('circle')}
              className={cn(
                "p-2 rounded-lg transition-all",
                tool === 'circle' ? "bg-stone-100 dark:bg-stone-700 text-stone-900 dark:text-white" : "text-stone-400 hover:text-stone-600"
              )}
              title="Circle"
            >
              <Circle size={20} />
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={cn(
                "p-2 rounded-lg transition-all",
                tool === 'eraser' ? "bg-stone-100 dark:bg-stone-700 text-stone-900 dark:text-white" : "text-stone-400 hover:text-stone-600"
              )}
              title="Eraser"
            >
              <Eraser size={20} />
            </button>
          </div>

          <div className="h-8 w-px bg-stone-200 dark:bg-stone-700 hidden sm:block" />

          <div className="relative" ref={colorPickerRef}>
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all",
                theme === 'dark' 
                  ? "bg-stone-800 border-stone-700 hover:border-stone-600" 
                  : "bg-white border-stone-200 hover:border-stone-300"
              )}
            >
              <div 
                className="w-5 h-5 rounded-full border border-black/10 shadow-inner"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs font-medium text-stone-600 dark:text-stone-300 hidden md:block">
                Color
              </span>
              <ChevronDown size={14} className={cn("text-stone-400 transition-transform", showColorPicker && "rotate-180")} />
            </button>

            <AnimatePresence>
              {showColorPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className={cn(
                    "absolute top-full left-0 mt-2 p-3 rounded-2xl shadow-2xl z-[110] border",
                    theme === 'dark' ? "bg-stone-900 border-stone-800" : "bg-white border-stone-100"
                  )}
                >
                  <HexColorPicker color={color} onChange={setColor} />
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 h-8 rounded-lg border border-stone-200 dark:border-stone-700 flex items-center px-2 font-mono text-xs text-stone-500">
                      {color.toUpperCase()}
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      {['#5A5A40', '#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#000000', '#FFFFFF'].map(c => (
                        <button
                          key={c}
                          onClick={() => setColor(c)}
                          className="w-4 h-4 rounded-sm border border-black/5"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-8 w-px bg-stone-200 dark:bg-stone-700 hidden sm:block" />

          <div className="flex items-center gap-1">
            <button
              onClick={handleUndo}
              disabled={history.length === 0}
              className="p-2 text-stone-400 hover:text-stone-600 disabled:opacity-30"
              title="Undo"
            >
              <Undo size={20} />
            </button>
            <button
              onClick={handleClear}
              className="p-2 text-stone-400 hover:text-red-500"
              title="Clear Active Layer"
            >
              <Trash2 size={20} />
            </button>
          </div>

          <div className="h-8 w-px bg-stone-200 dark:bg-stone-700 hidden sm:block" />

          <button
            onClick={() => setShowLayersPanel(!showLayersPanel)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all",
              showLayersPanel 
                ? "bg-stone-900 text-white border-stone-900" 
                : theme === 'dark' 
                  ? "bg-stone-800 border-stone-700 text-stone-300 hover:border-stone-600" 
                  : "bg-white border-stone-200 text-stone-600 hover:border-stone-300"
            )}
          >
            <Layers size={18} />
            <span className="text-xs font-medium hidden md:block">Layers</span>
            <div className="bg-stone-500/20 px-1.5 rounded text-[10px]">{layers.length}</div>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1 bg-white dark:bg-stone-800 rounded-xl p-1 shadow-sm border border-stone-200 dark:border-stone-700">
            <button
              onClick={handleSaveToLocalStorage}
              className="p-2 text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors"
              title="Save to Browser"
            >
              <Save size={18} />
            </button>
            <button
              onClick={handleLoadFromLocalStorage}
              className="p-2 text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors"
              title="Load from Browser"
            >
              <FolderOpen size={18} />
            </button>
          </div>

          <button
            onClick={handleDownload}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 transition-all font-bold text-sm"
          >
            <Download size={18} />
            Export PNG
          </button>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl hover:opacity-90 transition-all shadow-lg"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative cursor-crosshair overflow-hidden flex">
        <AnimatePresence>
          {statusMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[120] px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-full shadow-2xl"
            >
              {statusMessage}
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex-1 relative">
          {dimensions.width > 0 && (
            <Stage
              width={dimensions.width}
              height={dimensions.height}
              onMouseDown={handleMouseDown}
              onMousemove={handleMouseMove}
              onMouseup={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchMove={handleMouseMove}
              onTouchEnd={handleMouseUp}
              ref={stageRef}
            >
              {[...layers].reverse().map((layer) => (
                <Layer key={layer.id} visible={layer.visible}>
                  {layer.lines.map((line, i) => {
                    if (line.tool === 'rect') {
                      return (
                        <Rect
                          key={i}
                          x={line.points[0]}
                          y={line.points[1]}
                          width={line.points[2] - line.points[0]}
                          height={line.points[3] - line.points[1]}
                          stroke={line.color}
                          strokeWidth={line.strokeWidth}
                        />
                      );
                    }
                    if (line.tool === 'circle') {
                      const radius = Math.sqrt(
                        Math.pow(line.points[2] - line.points[0], 2) +
                        Math.pow(line.points[3] - line.points[1], 2)
                      );
                      return (
                        <KonvaCircle
                          key={i}
                          x={line.points[0]}
                          y={line.points[1]}
                          radius={radius}
                          stroke={line.color}
                          strokeWidth={line.strokeWidth}
                        />
                      );
                    }
                    return (
                      <Line
                        key={i}
                        points={line.points}
                        stroke={line.color}
                        strokeWidth={line.strokeWidth}
                        tension={0.5}
                        lineCap="round"
                        lineJoin="round"
                        globalCompositeOperation={
                          line.tool === 'eraser' ? 'destination-out' : 'source-over'
                        }
                      />
                    );
                  })}
                </Layer>
              ))}
            </Stage>
          )}
        </div>

        {/* Layers Panel */}
        <AnimatePresence>
          {showLayersPanel && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className={cn(
                "w-72 border-l flex flex-col z-50",
                theme === 'dark' ? "bg-stone-900 border-stone-800" : "bg-stone-50 border-stone-200"
              )}
            >
              <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <h3 className="font-bold text-sm text-stone-900 dark:text-white">Layers</h3>
                <button 
                  onClick={handleAddLayer}
                  className="p-1.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-lg hover:opacity-90"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {layers.map((layer, index) => (
                  <div
                    key={layer.id}
                    onClick={() => setActiveLayerId(layer.id)}
                    className={cn(
                      "group p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3",
                      activeLayerId === layer.id
                        ? "bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-600 shadow-sm"
                        : "border-transparent hover:bg-stone-200/50 dark:hover:bg-stone-800/50"
                    )}
                  >
                    <div className="flex flex-col gap-1">
                      <button 
                        onClick={(e) => { e.stopPropagation(); moveLayer(layer.id, 'up'); }}
                        disabled={index === 0}
                        className="p-0.5 text-stone-400 hover:text-stone-600 disabled:opacity-0"
                      >
                        <ChevronDown size={12} className="rotate-180" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); moveLayer(layer.id, 'down'); }}
                        disabled={index === layers.length - 1}
                        className="p-0.5 text-stone-400 hover:text-stone-600 disabled:opacity-0"
                      >
                        <ChevronDown size={12} />
                      </button>
                    </div>
                    
                    <div className="flex-1">
                      <div className="text-xs font-bold text-stone-900 dark:text-white truncate">
                        {layer.name}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        {layer.lines.length} objects
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleLayerVisibility(layer.id); }}
                        className={cn(
                          "p-1.5 rounded-lg transition-colors",
                          layer.visible ? "text-stone-400 hover:text-stone-600" : "text-red-400 hover:text-red-600"
                        )}
                      >
                        {layer.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteLayer(layer.id); }}
                        disabled={layers.length <= 1}
                        className="p-1.5 text-stone-400 hover:text-red-500 disabled:opacity-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Color Picker */}
      <div className={cn(
        "sm:hidden p-4 border-t flex flex-col items-center gap-4",
        theme === 'dark' ? "border-stone-800 bg-stone-900" : "border-stone-100 bg-stone-50"
      )}>
        <div className="flex items-center gap-4 w-full overflow-x-auto pb-2 no-scrollbar">
          {['#5A5A40', '#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#000000', '#FFFFFF'].map(c => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={cn(
                "flex-shrink-0 w-8 h-8 rounded-full border-2 transition-transform",
                color === c ? "border-stone-400 scale-110" : "border-transparent"
              )}
              style={{ backgroundColor: c }}
            />
          ))}
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className={cn(
              "flex-shrink-0 w-8 h-8 rounded-full border-2 border-stone-300 dark:border-stone-600 flex items-center justify-center bg-gradient-to-tr from-red-500 via-green-500 to-blue-500",
              showColorPicker && "scale-110"
            )}
          >
            <Palette size={16} className="text-white" />
          </button>
        </div>
        
        <AnimatePresence>
          {showColorPicker && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden w-full flex flex-col items-center gap-3"
            >
              <HexColorPicker color={color} onChange={setColor} className="!w-full !max-w-[200px]" />
              <div className="font-mono text-sm text-stone-500">{color.toUpperCase()}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
