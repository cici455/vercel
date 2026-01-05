import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Zap,
  Heart,
  Moon,
  Star,
  Sun
} from 'lucide-react';

// --- Types ---
export interface RitualViewProps {
  onOpenGate: () => void;
  onBack: () => void;
}

type TarotTheme = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  index: string;
};

// --- Mock Data ---
const TAROT_THEMES: TarotTheme[] = [
  { 
    id: 'love', 
    title: 'LOVE & RELATIONSHIPS', 
    subtitle: 'VENUS ALIGNMENT',
    icon: <Heart strokeWidth={1} className="w-12 h-12 text-pink-200" />,
    index: '01'
  },
  { 
    id: 'career', 
    title: 'CAREER & WEALTH', 
    subtitle: 'SATURN RETURN',
    icon: <Star strokeWidth={1} className="w-12 h-12 text-cyan-200" />,
    index: '02'
  },
  { 
    id: 'destiny', 
    title: 'DESTINY & PATH', 
    subtitle: 'SOLAR GUIDANCE',
    icon: <Sun strokeWidth={1} className="w-12 h-12 text-yellow-200" />,
    index: '03'
  },
  { 
    id: 'chaos', 
    title: 'CHAOS & CHANGE', 
    subtitle: 'URANUS STORM',
    icon: <Zap strokeWidth={1} className="w-12 h-12 text-purple-200" />,
    index: '04'
  },
];

// --- Components ---

// 1. The Cyber-Tarot Card
const CyberCard = ({ theme, position }: { theme: TarotTheme; position: 'center' | 'left' | 'right' | 'hidden' }) => {
  const isCenter = position === 'center';
  
  // Animation variants
  const variants = {
    center: {
      x: 0,
      scale: 1,
      opacity: 1,
      rotateY: 3, // Slight 3D tilt
      rotateX: -2,
      zIndex: 20,
      filter: 'blur(0px)',
    },
    left: {
      x: -220,
      scale: 0.85,
      opacity: 0.4,
      rotateY: -18,
      rotateX: 0,
      zIndex: 10,
      filter: 'blur(0px)', // No blur as requested
    },
    right: {
      x: 220,
      scale: 0.85,
      opacity: 0.4,
      rotateY: 18,
      rotateX: 0,
      zIndex: 10,
      filter: 'blur(0px)', // No blur as requested
    },
    hidden: {
      x: 0,
      scale: 0.5,
      opacity: 0,
      zIndex: 0,
    }
  };

  return (
    <motion.div
      initial={false}
      animate={position}
      variants={variants}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`absolute w-[260px] h-[420px] rounded-[20px] overflow-hidden backdrop-blur-md
        ${isCenter 
          ? 'border border-cyan-300/70 shadow-[0_0_25px_rgba(56,189,248,0.55)]' 
          : 'border border-white/20 shadow-none'
        }
      `}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Card Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#120821] via-[#05040A] to-[#010104]"></div>
      
      {/* Geometric Overlay (Faint) */}
      <div className="absolute inset-0 opacity-[0.12] pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 260 420">
           <circle cx="130" cy="210" r="100" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
           <line x1="130" y1="0" x2="130" y2="420" stroke="white" strokeWidth="0.5" />
           <line x1="0" y1="210" x2="260" y2="210" stroke="white" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Content Container */}
      <div className="relative h-full flex flex-col items-center p-6 z-10">
        {/* Top: Number & Label */}
        <div className="w-full flex justify-between items-center mb-8">
          <span className="text-[10px] font-sans text-white/40 tracking-widest">NO. {theme.index}</span>
          <span className="text-[10px] font-sans text-white/40 tracking-widest">ARCANA</span>
        </div>

        {/* Middle: Energy Rune / Symbol */}
        <div className="flex-1 flex items-center justify-center relative">
          {/* Outer Ring */}
          <div className="absolute w-32 h-32 rounded-full border border-white/10 flex items-center justify-center">
            {/* Inner Ring with Dots */}
            <div className="w-24 h-24 rounded-full border border-white/20 flex items-center justify-center relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-1 h-1 bg-white rounded-full shadow-[0_0_5px_white]"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-1 h-1 bg-white rounded-full shadow-[0_0_5px_white]"></div>
              <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1 w-1 h-1 bg-white rounded-full shadow-[0_0_5px_white]"></div>
              <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1 w-1 h-1 bg-white rounded-full shadow-[0_0_5px_white]"></div>
            </div>
          </div>
          
          {/* Main Icon */}
          <div className={`relative z-10 transition-all duration-500 ${isCenter ? 'opacity-100 scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'opacity-50 scale-100'}`}>
            {theme.icon}
          </div>
        </div>

        {/* Bottom: Typography */}
        <div className="w-full text-center mt-auto pb-4">
          <h3 className="font-cinzel text-xl text-[#F5ECFF] tracking-wider mb-2 leading-tight">
            {theme.title}
          </h3>
          <p className="font-cinzel text-[9px] text-white/40 tracking-[0.2em] uppercase">
            {theme.subtitle}
          </p>
        </div>
      </div>
      
      {/* Scanline / Noise Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
    </motion.div>
  );
};

// --- Main Component ---
const RitualView: React.FC<RitualViewProps> = ({ onOpenGate, onBack }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [question, setQuestion] = useState("");

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % TAROT_THEMES.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + TAROT_THEMES.length) % TAROT_THEMES.length);
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden w-full flex flex-col items-center">
      {/* Background: Starfield + Purple Planet */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-black">
        {/* Deep Starfield Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050509] via-[#02010a] to-black" />

        {/* Stars (Static for performance, or subtle pulse) */}
        <div className="absolute inset-0 opacity-40 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

        {/* The Purple Planet */}
        <div className="absolute left-1/2 bottom-[-28vh] -translate-x-1/2 w-[120vh] h-[120vh]">
          <div className="relative w-full h-full animate-[spin_120s_linear_infinite]">
             <Image 
              src="/planet.png" 
              alt="Ritual Planet" 
              fill 
              className="object-contain" 
              priority 
            />
          </div>
          {/* Gradient Mask to fade bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>
      </div>

      {/* Header: Return Button */}
      <div className="absolute top-0 left-0 w-full p-8 z-50">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
        >
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all">
             <ChevronLeft size={14} />
          </div>
          <span className="text-[10px] font-cinzel tracking-[0.2em] uppercase">Return</span>
        </button>
      </div>

      {/* Main Content Area: Tarot Circle */}
      <div className="flex-1 w-full flex flex-col items-center justify-center perspective-[1000px] relative z-10 pt-10">
        
        {/* Card Carousel Container */}
        <div className="relative w-full max-w-4xl h-[450px] flex items-center justify-center">
          
          {/* Navigation Arrows */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-8 md:px-32 pointer-events-none z-30">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              onClick={handlePrev}
              className="pointer-events-auto w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <ChevronLeft size={20} />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              onClick={handleNext}
              className="pointer-events-auto w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>

          {/* Cards */}
          <div className="relative w-full h-full flex justify-center items-center">
            {TAROT_THEMES.map((theme, index) => {
              // Determine position
              let position: 'center' | 'left' | 'right' | 'hidden' = 'hidden';
              const len = TAROT_THEMES.length;
              
              // Logic for circular array of 3 visible items
              // Center
              if (index === activeIndex) {
                position = 'center';
              } 
              // Left (handle wrap)
              else if (index === (activeIndex - 1 + len) % len) {
                position = 'left';
              }
              // Right (handle wrap)
              else if (index === (activeIndex + 1) % len) {
                position = 'right';
              }

              return (
                <CyberCard 
                  key={theme.id}
                  theme={theme}
                  position={position}
                />
              );
            })}
          </div>
        </div>

        {/* Input & Action Deck */}
        <div className="mt-8 flex flex-col items-center gap-6 z-30 w-full px-4">
          
          {/* Floating Input */}
          <div className="w-full max-w-[420px] h-11 bg-white/5 backdrop-blur-md border border-white/10 rounded-full flex items-center px-4 transition-all focus-within:bg-white/10 focus-within:border-white/20">
             <input 
               type="text"
               value={question}
               onChange={(e) => setQuestion(e.target.value)}
               placeholder="Focus your intent..."
               className="w-full bg-transparent border-none outline-none text-sm text-white/80 placeholder:text-white/30 font-light"
             />
          </div>

          {/* Open The Gate Button */}
          <button
            onClick={onOpenGate}
            className="inline-flex items-center justify-center px-8 py-2 rounded-full border border-white/40 bg-white/5 hover:bg-white/10 text-[11px] tracking-[0.35em] uppercase text-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.25)]"
          >
            <span className="drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">Open The Gate</span>
          </button>

        </div>
      </div>
    </main>
  );
};

export default RitualView;
