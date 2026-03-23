import React from 'react';
import { 
  X, 
  Plus, 
  MessageSquare, 
  Settings, 
  BookOpen, 
  Moon, 
  Sun, 
  Languages, 
  Expand, 
  Shrink,
  Trash2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Library
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onClearHistory: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  isWideMode: boolean;
  onWideModeToggle: () => void;
  selectedLanguage: { name: string; code: string };
  onLanguageClick: () => void;
  onLibraryClick: () => void;
  onLandingClick: () => void;
  messagesCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onNewChat,
  onClearHistory,
  theme,
  onThemeToggle,
  isWideMode,
  onWideModeToggle,
  selectedLanguage,
  onLanguageClick,
  onLibraryClick,
  onLandingClick,
  messagesCount
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Content */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isOpen ? 280 : 0,
          x: isOpen ? 0 : -280,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={cn(
          "fixed lg:relative top-0 left-0 h-full z-50 flex flex-col border-r overflow-hidden",
          theme === 'dark' ? "bg-stone-950 border-stone-800" : "bg-stone-50 border-stone-200"
        )}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white">
              <BookOpen size={18} />
            </div>
            <span className="font-display font-bold text-sm">Rural AI Tutor</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="p-4 space-y-2">
          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-brand-primary/20"
          >
            <Plus size={18} />
            New Chat
          </button>
        </div>

        {/* Navigation / History */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          <div className="px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-stone-400">
            Recent Activity
          </div>
          
          {messagesCount > 0 ? (
            <button
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors text-left",
                theme === 'dark' ? "bg-stone-900 text-stone-200" : "bg-white text-stone-700 shadow-sm"
              )}
            >
              <MessageSquare size={16} className="text-brand-primary" />
              <span className="truncate flex-1">Current Session</span>
              <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
            </button>
          ) : (
            <div className="px-3 py-8 text-center">
              <p className="text-xs text-stone-400 italic">No recent chats</p>
            </div>
          )}

          <div className="pt-4 px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-stone-400">
            Resources
          </div>
          <button
            onClick={() => {
              onLibraryClick();
              if (window.innerWidth < 1024) onClose();
            }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors text-left hover:bg-stone-200 dark:hover:bg-stone-800",
              theme === 'dark' ? "text-stone-400" : "text-stone-600"
            )}
          >
            <Library size={16} />
            Offline Library
          </button>
        </div>

        {/* Settings / Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 space-y-1">
          <button
            onClick={onLanguageClick}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors hover:bg-stone-200 dark:hover:bg-stone-800",
              theme === 'dark' ? "text-stone-400" : "text-stone-600"
            )}
          >
            <div className="flex items-center gap-3">
              <Languages size={16} />
              <span>Language</span>
            </div>
            <span className="text-[10px] font-bold bg-stone-200 dark:bg-stone-800 px-2 py-0.5 rounded-full">
              {selectedLanguage.name}
            </span>
          </button>

          <button
            onClick={onThemeToggle}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors hover:bg-stone-200 dark:hover:bg-stone-800",
              theme === 'dark' ? "text-stone-400" : "text-stone-600"
            )}
          >
            <div className="flex items-center gap-3">
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
          </button>

          <button
            onClick={onWideModeToggle}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors hover:bg-stone-200 dark:hover:bg-stone-800",
              theme === 'dark' ? "text-stone-400" : "text-stone-600"
            )}
          >
            <div className="flex items-center gap-3">
              {isWideMode ? <Shrink size={16} /> : <Expand size={16} />}
              <span>Wide Mode</span>
            </div>
          </button>

          <div className="pt-2">
            <button
              onClick={onClearHistory}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 size={16} />
              Clear History
            </button>
            <button
              onClick={onLandingClick}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors hover:bg-stone-200 dark:hover:bg-stone-800 mt-1",
                theme === 'dark' ? "text-stone-500" : "text-stone-400"
              )}
            >
              <LogOut size={16} />
              Exit to Landing
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
