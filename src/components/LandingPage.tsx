import React from 'react';
import { 
  BookOpen, 
  Zap, 
  Mic, 
  Camera, 
  Video, 
  ArrowRight, 
  CheckCircle2,
  Globe,
  WifiOff,
  Users,
  Sparkles,
  Database,
  Smartphone,
  Languages,
  History
} from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onStart: () => void;
  selectedLanguage: { name: string; code: string };
  onLanguageChange: (lang: { name: string; code: string }) => void;
  languages: { name: string; code: string }[];
}

export default function LandingPage({ onStart, selectedLanguage, onLanguageChange, languages }: LandingPageProps) {
  const [showMenu, setShowMenu] = React.useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] dark:bg-stone-950 overflow-x-hidden transition-colors duration-300 font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#FDFCF8]/80 dark:bg-stone-950/80 backdrop-blur-md border-b border-stone-100 dark:border-stone-900">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#5A5A40] rounded-xl flex items-center justify-center text-white shadow-lg shadow-stone-900/10">
              <BookOpen size={22} />
            </div>
            <span className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100 italic">Rural AI Tutor</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-full text-sm font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 transition-all"
              >
                <Globe size={16} />
                {selectedLanguage.name}
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl shadow-xl z-50 overflow-hidden">
                  <div className="py-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          onLanguageChange(lang);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400 flex items-center justify-between"
                      >
                        {lang.name}
                        {selectedLanguage.code === lang.code && <CheckCircle2 size={14} className="text-emerald-500" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={onStart}
              className="px-6 py-2 bg-[#5A5A40] text-white font-bold rounded-full hover:bg-[#4A4A30] transition-all shadow-md text-sm"
            >
              Launch Tutor
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-24 md:pt-32 md:pb-40 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8"
          >
            <motion.div 
              variants={itemVariants} 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-full text-xs font-bold uppercase tracking-widest border border-amber-100 dark:border-amber-900/30"
            >
              <Sparkles size={14} />
              Empowering 100M+ Rural Students
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-serif font-bold text-stone-900 dark:text-stone-100 leading-[0.9] tracking-tighter italic">
              Bridging the <br />
              <span className="text-[#5A5A40] not-italic">Digital Divide.</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-xl text-stone-600 dark:text-stone-400 max-w-lg leading-relaxed font-sans">
              The first AI educational companion optimized for low-bandwidth environments. Real-time tutoring, offline support, and visual learning for every village in India.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                whileTap={{ scale: 0.95 }}
                onClick={onStart}
                className="px-10 py-5 bg-[#5A5A40] text-white font-bold rounded-2xl hover:bg-[#4A4A30] transition-all shadow-xl shadow-stone-900/20 flex items-center justify-center gap-3 group"
              >
                Start Your First Lesson
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-4 px-6 py-4 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800"
              >
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-8 h-8 rounded-full border-2 border-white dark:border-stone-900 object-cover" alt="User" referrerPolicy="no-referrer" />
                  ))}
                </div>
                <p className="text-xs font-bold text-stone-500 dark:text-stone-400">Join 5,000+ early learners</p>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            whileHover={{ y: -10 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-[#5A5A40]/5 rounded-[3rem] -rotate-2 blur-2xl" />
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative aspect-[4/5] bg-white dark:bg-stone-900 rounded-[3rem] shadow-2xl overflow-hidden border border-stone-100 dark:border-stone-800"
            >
              <img 
                src="https://picsum.photos/seed/rural-learning/1200/1500" 
                className="w-full h-full object-cover"
                alt="Rural Student Learning"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10 right-10 space-y-4">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20"
                >
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                    <WifiOff size={20} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Offline Ready</p>
                    <p className="text-white/60 text-xs">Learn without internet</p>
                  </div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20"
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                    <Languages size={20} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Multi-lingual</p>
                    <p className="text-white/60 text-xs">Hindi, Tamil, Marathi & more</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* The Problem & Solution */}
      <section className="bg-stone-100 dark:bg-stone-900/50 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-6">
              <h2 className="text-4xl font-serif font-bold text-stone-900 dark:text-stone-100 italic">The Rural Challenge</h2>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                Traditional AI models require high-speed internet and expensive hardware. Rural students often face 2G speeds and intermittent connectivity, making modern learning tools inaccessible.
              </p>
              <div className="h-1 w-20 bg-[#5A5A40]" />
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-white dark:bg-stone-900 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-800 space-y-4">
                <div className="w-12 h-12 bg-stone-50 dark:bg-stone-800 rounded-xl flex items-center justify-center text-[#5A5A40]">
                  <Zap size={24} />
                </div>
                <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">Context Pruning</h3>
                <p className="text-sm text-stone-500 dark:text-stone-400">Our proprietary algorithm reduces data usage by 85% by stripping non-essential context before processing, ensuring lightning-fast responses on 2G networks.</p>
              </div>
              <div className="p-8 bg-white dark:bg-stone-900 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-800 space-y-4">
                <div className="w-12 h-12 bg-stone-50 dark:bg-stone-800 rounded-xl flex items-center justify-center text-[#5A5A40]">
                  <Database size={24} />
                </div>
                <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">Edge Persistence</h3>
                <p className="text-sm text-stone-500 dark:text-stone-400">We store core educational modules locally on the device. When the signal drops, the learning doesn't stop. Access lessons, diagrams, and history anytime.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Showcase */}
      <section className="py-32 px-6 max-w-7xl mx-auto space-y-24">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-serif font-bold text-stone-900 dark:text-stone-100 italic">Designed for Real Life</h2>
          <p className="text-stone-500 dark:text-stone-400 max-w-2xl mx-auto">
            We've built tools that work with the way rural students actually learn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <Mic className="text-blue-500" />,
              title: "Voice First",
              desc: "Speak naturally in your local dialect. Our AI understands and responds vocally."
            },
            {
              icon: <Camera className="text-orange-500" />,
              title: "Visual OCR",
              desc: "Point your camera at any textbook page. Get instant explanations and summaries."
            },
            {
              icon: <Video className="text-brand-primary" />,
              title: "AI Animations",
              desc: "Complex science concepts are turned into 30-second videos automatically."
            },
            {
              icon: <History className="text-emerald-500" />,
              title: "Smart History",
              desc: "Every lesson is saved locally. Review your progress even when you're in the fields."
            }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className="p-8 bg-white dark:bg-stone-900 rounded-[2.5rem] border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="w-14 h-14 bg-stone-50 dark:bg-stone-800 rounded-2xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-3">{feature.title}</h3>
              <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works - Step by Step */}
      <section className="bg-[#5A5A40] text-white py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <h2 className="text-5xl font-serif font-bold italic">Simple. Fast. Effective.</h2>
            <div className="space-y-8">
              {[
                { step: "01", title: "Choose Your Language", desc: "Select from 10+ Indian regional languages for a personalized experience." },
                { step: "02", title: "Ask Your Question", desc: "Type, speak, or snap a photo of your study material." },
                { step: "03", title: "Get Instant Insight", desc: "Receive simplified explanations, diagrams, and educational videos." },
                { step: "04", title: "Learn Anywhere", desc: "Save lessons to your device and review them even without internet." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-6">
                  <span className="text-3xl font-serif font-bold opacity-30 italic">{item.step}</span>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="text-white/70 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-white/10 rounded-full absolute inset-0 blur-3xl animate-pulse" />
            <div className="relative bg-white dark:bg-stone-900 p-4 rounded-[3rem] shadow-2xl">
              <img 
                src="https://picsum.photos/seed/app-demo/800/800" 
                className="w-full h-full rounded-[2.5rem] object-cover"
                alt="App Interface Demo"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { value: "85%", label: "Data Reduction", icon: <Database /> },
            { value: "10+", label: "Regional Languages", icon: <Languages /> },
            { value: "24/7", label: "Offline Access", icon: <Smartphone /> },
            { value: "1.2s", label: "Avg. Response", icon: <Zap /> }
          ].map((stat, idx) => (
            <div key={idx} className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 text-[#5A5A40] flex items-center justify-center bg-stone-50 dark:bg-stone-900 rounded-full">
                {stat.icon}
              </div>
              <p className="text-4xl md:text-5xl font-serif font-bold text-stone-900 dark:text-stone-100 italic">{stat.value}</p>
              <p className="text-xs text-stone-400 font-bold uppercase tracking-[0.2em]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 pb-32">
        <div className="max-w-6xl mx-auto bg-stone-950 rounded-[4rem] p-12 md:p-24 text-center space-y-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#5A5A40]/30 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full" />
          
          <div className="space-y-4 relative z-10">
            <h2 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight italic">
              Empower Your <br />
              Future Today.
            </h2>
            <p className="text-stone-400 text-lg max-w-xl mx-auto font-sans">
              No internet? No problem. High-speed AI tutoring is now available for everyone, everywhere.
            </p>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="relative z-10 px-12 py-6 bg-white text-stone-950 font-bold rounded-2xl hover:bg-stone-100 transition-all shadow-2xl inline-flex items-center gap-3 text-lg group"
          >
            Launch Rural AI Tutor
            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
          
          <div className="pt-8 flex flex-wrap justify-center gap-8 opacity-40 grayscale relative z-10">
            <span className="text-white font-serif italic text-xl">Digital India</span>
            <span className="text-white font-serif italic text-xl">EduTech Rural</span>
            <span className="text-white font-serif italic text-xl">Village Connect</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-stone-100 dark:border-stone-900 bg-white dark:bg-stone-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#5A5A40] rounded-lg flex items-center justify-center text-white">
                <BookOpen size={18} />
              </div>
              <span className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100 italic">Rural AI Tutor</span>
            </div>
            <p className="text-stone-500 dark:text-stone-400 text-sm max-w-sm leading-relaxed">
              A social impact project dedicated to providing high-quality educational resources to students in remote and low-bandwidth areas of India.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm uppercase tracking-widest">Platform</h4>
            <ul className="space-y-2 text-sm text-stone-500 dark:text-stone-400">
              <li><button onClick={onStart} className="hover:text-[#5A5A40] transition-colors">Start Learning</button></li>
              <li><a href="#" className="hover:text-[#5A5A40] transition-colors">Offline Mode</a></li>
              <li><a href="#" className="hover:text-[#5A5A40] transition-colors">Context Pruning</a></li>
              <li><a href="#" className="hover:text-[#5A5A40] transition-colors">Language Support</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm uppercase tracking-widest">Connect</h4>
            <ul className="space-y-2 text-sm text-stone-500 dark:text-stone-400">
              <li><a href="#" className="hover:text-[#5A5A40] transition-colors">About Project</a></li>
              <li><a href="#" className="hover:text-[#5A5A40] transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-[#5A5A40] transition-colors">Support Rural Edu</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-stone-50 dark:border-stone-900 flex flex-col md:row justify-between items-center gap-4">
          <p className="text-stone-400 text-xs">© 2026 Rural AI Tutor. Empowering the next generation of thinkers.</p>
          <div className="flex gap-6 text-xs text-stone-400">
            <a href="#" className="hover:text-stone-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-stone-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
