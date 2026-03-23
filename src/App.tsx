import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Mic, 
  Camera, 
  Send, 
  Loader2, 
  Image as ImageIcon, 
  Video, 
  X, 
  BookOpen,
  Zap,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  User,
  Sparkles,
  FileText,
  Copy,
  Check,
  Palette,
  Download,
  Volume2,
  Pause,
  Play,
  Gauge,
  Square,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  Focus,
  Menu,
  PanelLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { GeminiService, Message } from './services/geminiService';
import { cn } from './lib/utils';
import LandingPage from './components/LandingPage';
import OfflineLibrary from './components/OfflineLibrary';
import DrawingCanvas from './components/DrawingCanvas';
import Sidebar from './components/Sidebar';
import { Wifi, WifiOff, Trash2, Pencil } from 'lucide-react';

const LANGUAGES = [
  { name: 'English', code: 'en-IN' },
  { name: 'Hindi', code: 'hi-IN' },
  { name: 'Marathi', code: 'mr-IN' },
  { name: 'Tamil', code: 'ta-IN' },
  { name: 'Telugu', code: 'te-IN' },
  { name: 'Bengali', code: 'bn-IN' },
  { name: 'Kannada', code: 'kn-IN' },
  { name: 'Gujarati', code: 'gu-IN' },
];

export default function App() {
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem('rural_ai_messages');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse saved messages:", e);
      return [];
    }
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isVideoLoading, setIsVideoLoading] = useState<string | null>(null); // Topic of video loading
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [copyingId, setCopyingId] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState<string | null>(null);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [isAudioPaused, setIsAudioPaused] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState<string | null>(null);
  const [audioSpeed, setAudioSpeed] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showDrawingCanvas, setShowDrawingCanvas] = useState(false);
  const [drawingCanvasKey, setDrawingCanvasKey] = useState(0);
  const [isWideMode, setIsWideMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showCamera, setShowCamera] = useState(false);

  const gemini = new GeminiService();
  const isEducationalChat = messages.some(m => m.isEducational);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    // Save messages to localStorage
    localStorage.setItem('rural_ai_messages', JSON.stringify(messages));
  }, [messages, isLoading]);

  // Offline Detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Speech Recognition Setup
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const checkApiKey = async () => {
      if (typeof window !== 'undefined' && (window as any).aistudio) {
        const selected = await (window as any).aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      }
    };
    checkApiKey().catch(e => console.error("Error checking API key", e));

    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = selectedLanguage.code;

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
      };

      rec.onerror = () => setIsRecording(false);
      rec.onend = () => setIsRecording(false);

      setRecognition(rec);
    }
  }, []);

  useEffect(() => {
    if (recognition) {
      recognition.lang = selectedLanguage.code;
    }
  }, [selectedLanguage, recognition]);

  const toggleRecording = () => {
    if (isRecording) {
      recognition?.stop();
    } else {
      setIsRecording(true);
      recognition?.start();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError("Could not access camera");
      setShowCamera(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input && !capturedImage) return;

    const userText = input;
    const userImage = capturedImage;
    
    // Add user message to UI immediately
    const userMsg: Message = { id: gemini.generateId(), role: 'user', text: userText || "Analyzing image..." };
    setMessages(prev => [...prev, userMsg]);
    
    setInput('');
    setCapturedImage(null);
    setIsLoading(true);
    setError(null);

    try {
      let finalQuery = userText;

      // 1. OCR if image exists
      if (userImage) {
        const base64 = userImage.split(',')[1];
        const ocrText = await gemini.performOCR(base64, 'image/png', selectedLanguage.name);
        finalQuery = ocrText;
      }

      // 2. Context Pruning
      const pruned = await gemini.pruneContext(finalQuery, selectedLanguage.name);
      
      // 3. Get Chat Response
      const modelMsg = await gemini.getChatResponse(messages, pruned, selectedLanguage.name);
      modelMsg.prunedText = pruned;
      
      setMessages(prev => [...prev, modelMsg]);

      // 4. Auto-generate video for educational queries
      const isEducational = pruned.length > 15 || 
                           pruned.toLowerCase().includes("explain") || 
                           pruned.toLowerCase().includes("how") || 
                           pruned.toLowerCase().includes("why");
      
      if (isEducational) {
        handleGenerateVideo(modelMsg.id, pruned).catch(e => console.error("Background video generation failed", e));
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateVideo = async (messageId: string, topic: string) => {
    const win = window as any;
    const ensureKey = async () => {
      if (typeof win !== 'undefined' && win.aistudio) {
        const hasKey = await win.aistudio.hasSelectedApiKey();
        // If the platform says no key is selected, or if the environment doesn't have it yet
        if (!hasKey || !(process.env as any).API_KEY) {
          await win.aistudio.openSelectKey();
          // The platform says: "assume the key selection was successful after triggering openSelectKey() and proceed to the app."
          // So we return true here to allow the caller to proceed.
          return true;
        }
      }
      return true;
    };

    setIsVideoLoading(topic);
    setError(null);
    try {
      await ensureKey();
      const url = await gemini.generateEducationalVideo(topic);
      if (url) {
        setMessages(prev => {
          return prev.map(m => m.id === messageId ? { ...m, videoUrl: url } : m);
        });
      } else {
        setError("Failed to generate video.");
      }
    } catch (err: any) {
      console.error("Video generation error:", err);
      const errorMsg = err?.message || String(err);
      const isPermissionError = 
        errorMsg.includes("PERMISSION_DENIED") || 
        errorMsg.includes("403") || 
        errorMsg.includes("Requested entity was not found") ||
        errorMsg.includes("PAID_KEY_REQUIRED") ||
        errorMsg.toLowerCase().includes("permission");

      if (isPermissionError) {
        setError("Video generation requires a paid Gemini API key from a Google Cloud project with billing enabled. Please select a valid key.");
        if (typeof win !== 'undefined' && win.aistudio) {
          // If it was a permission error, we should definitely prompt for a new key
          await win.aistudio.openSelectKey();
        }
      } else {
        setError(`Video generation failed: ${errorMsg}`);
      }
    } finally {
      setIsVideoLoading(null);
    }
  };

  const handleDownloadImage = (url: string, topic: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `tutor-diagram-${topic.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSummarize = async () => {
    if (messages.length === 0) return;
    setIsLoading(true);
    setError(null);
    try {
      const summary = await gemini.summarizeChat(messages, selectedLanguage.name);
      setMessages(prev => [...prev, {
        id: gemini.generateId(),
        role: 'model',
        text: `### 📝 Lesson Summary\n\n${summary}\n\n*Keep up the great work! What would you like to learn next?*`
      }]);
    } catch (err: any) {
      setError("Failed to generate summary.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyingId(id);
    setTimeout(() => setCopyingId(null), 2000);
  };

  const playBrowserSpeech = (text: string, id: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage.code;
    utterance.rate = audioSpeed;
    utterance.onend = () => {
      setPlayingMessageId(null);
      setIsAudioPaused(false);
    };
    window.speechSynthesis.speak(utterance);
  };

  const handleSpeech = async (text: string, id: string) => {
    if (playingMessageId === id) {
      if (audioRef.current) {
        if (isAudioPaused) {
          audioRef.current.play().catch(console.error);
          setIsAudioPaused(false);
        } else {
          audioRef.current.pause();
          setIsAudioPaused(true);
        }
      } else {
        // Fallback for window.speechSynthesis
        if (isAudioPaused) {
          window.speechSynthesis.resume();
          setIsAudioPaused(false);
        } else {
          window.speechSynthesis.pause();
          setIsAudioPaused(true);
        }
      }
      return;
    }

    stopSpeech();
    setPlayingMessageId(id);
    setIsAudioPaused(false);

    // Remove markdown for cleaner speech
    const cleanText = text.replace(/[#*`_~]/g, '').replace(/\[.*?\]\(.*?\)/g, '');

    if (isOnline) {
      setIsAudioLoading(id);
      try {
        const audioUrl = await gemini.generateSpeech(cleanText);
        if (audioUrl) {
          const audio = new Audio(audioUrl);
          audio.playbackRate = audioSpeed;
          audio.onended = () => {
            setPlayingMessageId(null);
            setIsAudioPaused(false);
            audioRef.current = null;
          };
          audioRef.current = audio;
          audio.play().catch(err => {
            console.error("Audio play failed", err);
            playBrowserSpeech(cleanText, id);
          });
        } else {
          throw new Error("Failed to generate Gemini speech");
        }
      } catch (err) {
        console.error("Gemini TTS failed, falling back to browser TTS", err);
        playBrowserSpeech(cleanText, id);
      } finally {
        setIsAudioLoading(null);
      }
    } else {
      playBrowserSpeech(cleanText, id);
    }
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingMessageId(null);
    setIsAudioPaused(false);
    setIsAudioLoading(null);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = audioSpeed;
    }
  }, [audioSpeed]);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const handleManualImageGen = async (messageId: string, text: string) => {
    setIsImageLoading(messageId);
    try {
      const url = await gemini.generateImage(text, selectedLanguage.name);
      if (url) {
        setMessages(prev => {
          return prev.map(m => m.id === messageId ? { ...m, imageUrl: url } : m);
        });
      }
    } catch (err) {
      setError("Failed to generate image.");
    } finally {
      setIsImageLoading(null);
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
    localStorage.removeItem('rural_ai_messages');
    setShowClearConfirm(false);
  };

  const handleOfflineSelect = (content: string) => {
    setMessages(prev => [...prev, {
      id: gemini.generateId(),
      role: 'model',
      text: `### 📚 Offline Lesson\n\n${content}\n\n*You are currently offline. Connect to the internet to ask more questions.*`,
      isEducational: true
    }]);
  };

  const handleNewChat = () => {
    setMessages([]);
    setDrawingCanvasKey(prev => prev + 1);
    setShowDrawingCanvas(false);
  };

  const handleStart = async () => {
    setView('app');
    if (messages.length === 0) {
      setIsLoading(true);
      try {
        const greetingMsg = await gemini.getGreeting(selectedLanguage.name);
        setMessages([greetingMsg]);
      } catch (err) {
        setMessages([{ 
          id: gemini.generateId(), 
          role: 'model', 
          text: "Namaste! I'm your AI Tutor. What would you like to learn today?",
          isEducational: false
        }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => console.error("Error exiting fullscreen", err));
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (view === 'landing') {
    return (
      <div className={cn(theme === 'dark' && "dark")}>
        <LandingPage 
          onStart={handleStart} 
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          languages={LANGUAGES}
        />
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen flex transition-all duration-300",
      theme === 'dark' ? "bg-stone-950 text-stone-100" : "bg-white text-stone-900"
    )}>
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={handleNewChat}
        onClearHistory={() => setShowClearConfirm(true)}
        theme={theme}
        onThemeToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        isWideMode={isWideMode}
        onWideModeToggle={() => setIsWideMode(!isWideMode)}
        selectedLanguage={selectedLanguage}
        onLanguageClick={() => setShowLanguageMenu(true)}
        onLibraryClick={() => {
          if (messages.length === 0) {
            const lib = document.querySelector('.offline-library-section');
            lib?.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onLandingClick={() => setView('landing')}
        messagesCount={messages.length}
      />

      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300 relative",
        !isWideMode && "max-w-2xl mx-auto shadow-xl",
        isWideMode && "w-full"
      )}>
      {/* Header */}
      <AnimatePresence>
        {!isZenMode && (
          <motion.header 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className={cn(
              "fixed top-0 left-0 right-0 z-30 border-b backdrop-blur-xl transition-all duration-300",
              theme === 'dark' ? "bg-stone-950/80 border-stone-800" : "bg-white/80 border-stone-100"
            )}
          >
            <div className={cn(
              "mx-auto h-16 flex items-center justify-between transition-all duration-300",
              isWideMode ? "px-4 md:px-8" : "max-w-6xl px-4"
            )}>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className={cn(
                    "p-2 rounded-full transition-colors",
                    theme === 'dark' ? "hover:bg-stone-800 text-stone-500" : "hover:bg-stone-100 text-stone-400"
                  )}
                  title="Open Sidebar"
                >
                  <Menu size={20} />
                </button>
                <div className="flex items-center gap-2">
                  <motion.div 
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-primary/20"
                  >
                    <BookOpen size={24} />
                  </motion.div>
                  <div>
                    <h1 className="font-display font-bold text-lg leading-tight">Rural AI Tutor</h1>
                    <p className={cn(
                      "text-[10px] uppercase tracking-wider font-semibold",
                      theme === 'dark' ? "text-stone-500" : "text-stone-400"
                    )}>Optimized for Remote India</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleToggleFullscreen}
                  className={cn(
                    "p-2 rounded-full transition-colors hidden sm:flex",
                    theme === 'dark' ? "hover:bg-stone-800 text-stone-500" : "hover:bg-stone-100 text-stone-400"
                  )}
                  title={isFullscreen ? "Exit Browser Full Screen" : "Enter Browser Full Screen"}
                >
                  {isFullscreen ? <Minimize2 size={20} className="rotate-45" /> : <Maximize2 size={20} className="rotate-45" />}
                </motion.button>


                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsZenMode(true)}
                  className={cn(
                    "p-2 rounded-full transition-colors",
                    theme === 'dark' ? "hover:bg-stone-800 text-stone-500" : "hover:bg-stone-100 text-stone-400"
                  )}
                  title="Enter Focus Mode (Hide Header)"
                >
                  <EyeOff size={20} />
                </motion.button>



                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSummarize}
                  disabled={!isEducationalChat || isLoading}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors font-bold text-xs disabled:opacity-30",
                    theme === 'dark' ? "hover:bg-stone-800 text-stone-300" : "hover:bg-stone-100 text-stone-600"
                  )}
                  title="Summarize Chat"
                >
                  <FileText size={16} />
                  <span className="hidden sm:inline">Summarize</span>
                </motion.button>
                <div className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded border border-emerald-500/20 flex items-center gap-1">
                  <Zap size={10} />
                  PRUNING ACTIVE
                </div>
                
                {/* Offline Status */}
                <div className={cn(
                  "px-2 py-1 text-[10px] font-bold rounded border flex items-center gap-1",
                  isOnline 
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                    : "bg-red-500/10 text-red-500 border-red-500/20"
                )}>
                  {isOnline ? <Wifi size={10} /> : <WifiOff size={10} />}
                  {isOnline ? "ONLINE" : "OFFLINE"}
                </div>


                <div className="h-6 w-px bg-stone-200 dark:bg-stone-800 mx-1" />
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Zen Mode Exit Button */}
      <AnimatePresence>
        {isZenMode && (
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onClick={() => setIsZenMode(false)}
            className={cn(
              "fixed top-4 right-4 z-50 px-4 py-2 rounded-full shadow-lg backdrop-blur-md transition-all flex items-center gap-2 font-bold text-xs border",
              theme === 'dark' ? "bg-stone-900/80 border-stone-800 text-stone-300 hover:text-white" : "bg-white/80 border-stone-200 text-stone-600 hover:text-stone-900"
            )}
          >
            <Eye size={16} />
            Exit Focus Mode
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Area */}
      <main 
        ref={scrollRef}
        className={cn(
          "flex-1 overflow-y-auto space-y-8 pb-40 scroll-smooth transition-all duration-300",
          !isZenMode ? "pt-24" : "pt-8"
        )}
      >
        <div className={cn(
          "mx-auto transition-all duration-300",
          isWideMode ? "max-w-none px-4 md:px-12" : "max-w-2xl px-4"
        )}>
          {messages.length === 0 && !isLoading && (
          <div className="space-y-8 py-12 text-center">
            <div className="space-y-2">
              <h2 className={cn(
                "text-3xl font-display font-bold",
                theme === 'dark' ? "text-stone-100" : "text-stone-800"
              )}>Namaste!</h2>
              <p className="text-stone-500">I'm your AI companion. Ask me anything about your studies or just say hello!</p>
            </div>
            
            {!isOnline && (
              <div className="text-left offline-library-section">
                <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">Offline Library</h3>
                <OfflineLibrary theme={theme} onSelect={handleOfflineSelect} />
              </div>
            )}

            <div className="grid grid-cols-1 gap-3">
              {[
                "Explain photosynthesis with an example",
                "How do I solve x² + 5x + 6 = 0?",
                "Tell me about Newton's Laws",
              ].map((suggestion) => (
                <motion.button
                  key={suggestion}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setInput(suggestion);
                    setTimeout(() => {
                      const form = document.querySelector('form');
                      form?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                    }, 0);
                  }}
                  className={cn(
                    "p-4 text-left border rounded-2xl transition-all text-sm font-medium flex items-center justify-between group",
                    theme === 'dark' 
                      ? "bg-stone-900 hover:bg-stone-800 border-stone-800 text-stone-300" 
                      : "bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700"
                  )}
                >
                  {suggestion}
                  <Send size={14} className="text-stone-300 group-hover:text-brand-primary transition-colors" />
                </motion.button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-6">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-3",
                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                msg.role === 'user' 
                  ? theme === 'dark' ? "bg-stone-800 text-stone-400" : "bg-stone-200 text-stone-600" 
                  : "bg-brand-primary text-white"
              )}>
                {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
              </div>
              
              <div className={cn(
                "max-w-[85%] space-y-3",
                isWideMode && "max-w-[95%]",
                msg.role === 'user' ? "items-end" : "items-start"
              )}>
                <div className="flex items-center gap-2">
                  {/* Pruning Info for Model Messages */}
                  {msg.prunedText && (
                    <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1 opacity-70">
                      <Zap size={10} />
                      Pruned: {msg.prunedText}
                    </div>
                  )}
                  {msg.diagramTopic && !msg.imageUrl && (
                    <div className="text-[10px] text-brand-primary font-bold uppercase tracking-widest flex items-center gap-1 animate-pulse">
                      <Palette size={10} />
                      Visual Aid Offered
                    </div>
                  )}
                </div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className={cn(
                    "rounded-2xl shadow-sm transition-all duration-300",
                    theme === 'dark' ? "p-6" : "p-4",
                    msg.role === 'user' 
                      ? "bg-brand-primary text-white rounded-tr-none" 
                      : theme === 'dark' 
                        ? "bg-stone-900 text-stone-200 border border-stone-800 rounded-tl-none"
                        : "bg-stone-50 text-stone-800 border border-stone-100 rounded-tl-none"
                  )}
                >
                  <div className={cn(
                    "markdown-body", 
                    msg.role === 'user' ? "text-white" : theme === 'dark' ? "text-stone-200" : "text-stone-800"
                  )}>
                    <Markdown>{msg.text}</Markdown>
                  </div>
                </motion.div>

                {msg.diagramTopic && !msg.imageUrl && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "mt-4 p-4 rounded-2xl border flex flex-col gap-3 items-center text-center transition-all",
                      theme === 'dark' ? "bg-stone-800/50 border-stone-700" : "bg-emerald-50 border-emerald-100"
                    )}
                  >
                    <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary">
                      <Palette size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Visual Aid Recommended</h4>
                      <p className="text-xs text-stone-500 mt-1">I can generate a simple diagram to help explain {msg.diagramTopic}.</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleManualImageGen(msg.id, msg.diagramTopic!)}
                      disabled={isImageLoading === msg.id}
                      className="w-full py-2 bg-brand-primary text-white rounded-xl text-xs font-bold shadow-md hover:bg-brand-secondary transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isImageLoading === msg.id ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles size={14} />
                          Generate Diagram
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                )}

                <div className={cn(
                  "flex gap-2",
                  msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}>
                  <button
                    onClick={() => handleCopy(msg.text, msg.id)}
                    className={cn(
                      "p-1.5 rounded-lg transition-colors",
                      theme === 'dark' ? "hover:bg-stone-800 text-stone-500" : "hover:bg-stone-100 text-stone-400"
                    )}
                    title="Copy content"
                  >
                    {copyingId === msg.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>

                  {msg.role === 'model' && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleSpeech(msg.text, msg.id)}
                        disabled={isAudioLoading === msg.id}
                        className={cn(
                          "p-1.5 rounded-lg transition-colors flex items-center gap-1",
                          playingMessageId === msg.id 
                            ? "bg-brand-primary/10 text-brand-primary" 
                            : theme === 'dark' ? "hover:bg-stone-800 text-stone-500" : "hover:bg-stone-100 text-stone-400"
                        )}
                        title={playingMessageId === msg.id ? (isAudioPaused ? "Resume" : "Pause") : "Read Aloud"}
                      >
                        {isAudioLoading === msg.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : playingMessageId === msg.id ? (
                          isAudioPaused ? <Play size={14} /> : <Pause size={14} />
                        ) : (
                          <Volume2 size={14} />
                        )}
                      </button>

                      {playingMessageId === msg.id && (
                        <div className={cn(
                          "flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-bold",
                          theme === 'dark' ? "bg-stone-900 border-stone-800 text-stone-400" : "bg-white border-stone-100 text-stone-500"
                        )}>
                          <Gauge size={10} />
                          <select 
                            value={audioSpeed}
                            onChange={(e) => setAudioSpeed(parseFloat(e.target.value))}
                            className="bg-transparent border-none focus:ring-0 cursor-pointer"
                          >
                            <option value="0.5">0.5x</option>
                            <option value="0.75">0.75x</option>
                            <option value="1">1x</option>
                            <option value="1.25">1.25x</option>
                            <option value="1.5">1.5x</option>
                            <option value="2">2x</option>
                          </select>
                          <button 
                            onClick={stopSpeech}
                            className="ml-1 hover:text-red-500 transition-colors"
                            title="Stop"
                          >
                            <Square size={10} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {msg.role === 'model' && !msg.imageUrl && msg.isEducational && (
                    <button
                      onClick={() => handleManualImageGen(msg.id, msg.diagramTopic || msg.text.substring(0, 50))}
                      disabled={isImageLoading === msg.id}
                      className={cn(
                        "p-1.5 rounded-lg transition-colors disabled:opacity-50",
                        theme === 'dark' ? "hover:bg-stone-800 text-stone-500" : "hover:bg-stone-100 text-stone-400"
                      )}
                      title="Generate Diagram"
                    >
                      {isImageLoading === msg.id ? <Loader2 size={14} className="animate-spin" /> : <Palette size={14} />}
                    </button>
                  )}
                </div>

                {msg.imageUrl && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                      "rounded-2xl overflow-hidden border shadow-md relative group",
                      theme === 'dark' ? "border-stone-800" : "border-stone-100"
                    )}
                  >
                    <img src={msg.imageUrl} alt="Diagram" className="w-full h-auto" referrerPolicy="no-referrer" />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDownloadImage(msg.imageUrl!, msg.diagramTopic || 'diagram')}
                      className={cn(
                        "absolute top-2 right-2 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-lg backdrop-blur-md",
                        theme === 'dark' ? "bg-stone-900/80 text-stone-300 hover:text-white" : "bg-white/80 text-stone-600 hover:text-stone-900"
                      )}
                      title="Download Diagram"
                    >
                      <Download size={18} />
                    </motion.button>
                  </motion.div>
                )}

                {msg.role === 'model' && msg.isEducational && (
                  <div className="flex flex-col gap-2">
                    {!msg.videoUrl ? (
                      <button
                        onClick={() => handleGenerateVideo(msg.id, msg.prunedText || msg.text.substring(0, 30)).catch(err => console.error("Video generation failed", err))}
                        disabled={!!isVideoLoading}
                        className={cn(
                          "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-colors disabled:opacity-50 w-fit",
                          theme === 'dark' ? "bg-stone-800 hover:bg-stone-700 text-stone-300" : "bg-stone-100 hover:bg-stone-200 text-stone-600"
                        )}
                      >
                        {isVideoLoading === (msg.prunedText || msg.text.substring(0, 30)) ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Video size={14} />
                        )}
                        Generate Video
                      </button>
                    ) : (
                      <div className={cn(
                        "rounded-2xl overflow-hidden border shadow-md aspect-video w-full bg-black",
                        theme === 'dark' ? "border-stone-800" : "border-stone-100"
                      )}>
                        <video src={msg.videoUrl} controls className="w-full h-full" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center shrink-0">
                <Loader2 size={16} className="animate-spin" />
              </div>
              <div className={cn(
                "p-4 rounded-2xl rounded-tl-none border",
                theme === 'dark' ? "bg-stone-900 border-stone-800" : "bg-stone-50 border-stone-100"
              )}>
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {isEducationalChat && !isLoading && (
          <div className="flex justify-center pt-4">
            <button
              onClick={handleSummarize}
              className={cn(
                "flex items-center gap-2 px-6 py-3 border rounded-2xl font-bold text-sm shadow-sm transition-all active:scale-95",
                theme === 'dark' 
                  ? "bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800" 
                  : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
              )}
            >
              <FileText size={18} className="text-brand-primary" />
              Summarize this Lesson
            </button>
          </div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={cn(
              "p-4 border rounded-2xl flex flex-col gap-3 overflow-hidden",
              theme === 'dark' ? "bg-red-950/20 border-red-900/50 text-red-400" : "bg-red-50 border-red-100 text-red-700"
            )}
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="shrink-0 mt-0.5" size={18} />
              <p className="text-sm">{error}</p>
            </div>
            {error.includes("API key") && (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => (window as any).aistudio?.openSelectKey()}
                className={cn(
                  "ml-7 px-4 py-2 rounded-xl text-xs font-bold transition-colors w-fit",
                  theme === 'dark' ? "bg-red-900/40 hover:bg-red-900/60" : "bg-red-100 hover:bg-red-200"
                )}
              >
                Select Paid API Key
              </motion.button>
            )}
          </motion.div>
        )}
        </div>
      </main>

      {/* Input Bar */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 z-20 transition-all duration-300 border-t backdrop-blur-xl",
        theme === 'dark' ? "bg-stone-950/80 border-stone-800" : "bg-white/80 border-stone-100"
      )}>
        <div className={cn(
          "mx-auto p-4 transition-all duration-300",
          isWideMode ? "max-w-none px-4 md:px-12" : "max-w-2xl"
        )}>
          <div className="flex flex-col gap-3">
            {capturedImage && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 20 }}
                className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-brand-primary shadow-lg"
              >
                <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                <button 
                  onClick={() => setCapturedImage(null)}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <div className="flex-1 relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isOnline ? "Type your answer or question..." : "Connect to internet to ask questions..."}
                  disabled={!isOnline}
                  className={cn(
                    "w-full pl-4 pr-12 py-4 border-none rounded-2xl focus:ring-2 focus:ring-brand-primary transition-all text-sm font-medium shadow-sm",
                    theme === 'dark' ? "bg-stone-900 text-stone-100 placeholder:text-stone-600" : "bg-stone-100 text-stone-900 placeholder:text-stone-400",
                    !isOnline && "opacity-50 cursor-not-allowed"
                  )}
                />
                <button
                  type="button"
                  onClick={toggleRecording}
                  disabled={!isOnline}
                  className={cn(
                    "absolute right-2 p-2 rounded-xl transition-all",
                    isRecording ? "bg-red-500 text-white animate-pulse" : theme === 'dark' ? "text-stone-600 hover:text-stone-400" : "text-stone-400 hover:text-stone-600",
                    !isOnline && "opacity-30 cursor-not-allowed"
                  )}
                >
                  <Mic size={20} />
                </button>
              </div>
              
              <button
                type="button"
                onClick={() => setShowDrawingCanvas(true)}
                className={cn(
                  "p-4 rounded-2xl transition-colors shadow-sm",
                  theme === 'dark' ? "bg-stone-900 text-stone-500 hover:bg-stone-800" : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                )}
                title="Open Drawing Tool"
              >
                <Pencil size={20} />
              </button>

              <button
                type="button"
                onClick={startCamera}
                disabled={!isOnline}
                className={cn(
                  "p-4 rounded-2xl transition-colors shadow-sm",
                  theme === 'dark' ? "bg-stone-900 text-stone-500 hover:bg-stone-800" : "bg-stone-100 text-stone-500 hover:bg-stone-200",
                  !isOnline && "opacity-30 cursor-not-allowed"
                )}
              >
                <Camera size={20} />
              </button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isLoading || (!input && !capturedImage) || !isOnline}
                className="p-4 bg-brand-primary text-white rounded-2xl shadow-lg shadow-brand-primary/30 hover:bg-brand-secondary transition-all disabled:opacity-50 disabled:shadow-none"
              >
                <Send size={20} />
              </motion.button>
            </form>
          </div>
        </div>
      </div>
      {/* Drawing Canvas */}
      <AnimatePresence>
        {showDrawingCanvas && (
          <motion.div
            key={drawingCanvasKey}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[100]"
          >
            <DrawingCanvas 
              onClose={() => setShowDrawingCanvas(false)} 
              theme={theme} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Camera Overlay */}
      <AnimatePresence>
        {showCamera && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col"
          >
            <div className="p-4 flex justify-between items-center text-white">
              <h3 className="font-display font-bold">Scan Question</h3>
              <button onClick={stopCamera}><X /></button>
            </div>
            
            <div className="flex-1 relative overflow-hidden">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
                <div className="w-full h-full border-2 border-white/50 rounded-lg" />
              </div>
            </div>
            
            <div className="p-8 flex justify-center">
              <button 
                onClick={capturePhoto}
                className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center"
              >
                <div className="w-16 h-16 rounded-full bg-white" />
              </button>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </motion.div>
        )}
      </AnimatePresence>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageUpload} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Modals triggered by Sidebar */}
      <AnimatePresence>
        {showClearConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowClearConfirm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={cn(
                "relative w-full max-w-sm p-6 rounded-3xl shadow-2xl border",
                theme === 'dark' ? "bg-stone-900 border-stone-800" : "bg-white border-stone-100"
              )}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
                  <Trash2 size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Clear Chat History?</h3>
                  <p className="text-sm text-stone-500 mt-1">This will permanently delete all messages in this session. This action cannot be undone.</p>
                </div>
                <div className="flex gap-3 w-full mt-2">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 py-3 rounded-xl bg-stone-100 dark:bg-stone-800 font-bold text-sm hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClearHistory}
                    className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showLanguageMenu && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLanguageMenu(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={cn(
                "relative w-full max-w-sm p-6 rounded-3xl shadow-2xl border",
                theme === 'dark' ? "bg-stone-900 border-stone-800" : "bg-white border-stone-100"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Select Language</h3>
                <button onClick={() => setShowLanguageMenu(false)} className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800">
                  <X size={20} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto pr-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLanguage(lang);
                      setShowLanguageMenu(false);
                    }}
                    className={cn(
                      "px-4 py-3 rounded-xl text-sm font-bold transition-all text-left border",
                      selectedLanguage.code === lang.code 
                        ? "bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20" 
                        : theme === 'dark' ? "bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-700" : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                    )}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
    </div>
  );
}
