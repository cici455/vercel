import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Coins, 
  Star, 
  Zap, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight,
  Send
} from 'lucide-react';

// --- Types ---
export interface DashboardViewProps {
  userData: any;
  onEnterCouncil: () => void;
  onBack: () => void;
}

type TarotTheme = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
};

// --- Mock Data ---
const TAROT_THEMES: TarotTheme[] = [
  { 
    id: 'love', 
    title: 'LOVE & RELATIONSHIPS', 
    subtitle: 'VENUS ALIGNMENT',
    icon: <Heart size={48} strokeWidth={1} />, 
    color: 'border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.3)]' 
  },
  { 
    id: 'career', 
    title: 'CAREER & WEALTH', 
    subtitle: 'SATURN RETURN',
    icon: <Coins size={48} strokeWidth={1} />, 
    color: 'border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.3)]' 
  },
  { 
    id: 'destiny', 
    title: 'DESTINY & PATH', 
    subtitle: 'SOLAR GUIDANCE',
    icon: <Star size={48} strokeWidth={1} />, 
    color: 'border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.3)]' 
  },
  { 
    id: 'chaos', 
    title: 'CHAOS & CHANGE', 
    subtitle: 'URANUS STORM',
    icon: <Zap size={48} strokeWidth={1} />, 
    color: 'border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.3)]' 
  },
];

// --- Components ---

// 1. The Cosmic Stage (Background)
const CosmicStage = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Deep Space Background */}
      <div className="absolute inset-0 bg-[#050505]">
        {/* Star Dust */}
        <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
        {/* Distant Stars */}
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              opacity: Math.random() * 0.5 + 0.1,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>

      {/* Giant Purple Planet */}
      <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[150vw] h-[150vw] rounded-full opacity-80 mix-blend-screen">
        <motion.div 
          className="w-full h-full rounded-full bg-gradient-to-b from-purple-900/40 via-purple-950/20 to-black"
          animate={{ rotate: 360 }}
          transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
        >
          {/* Planet Texture Details */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.2),transparent_70%)]"></div>
          <div className="absolute inset-0 rounded-full border-t border-purple-500/10"></div>
        </motion.div>
      </div>

      {/* The Rift (Gate) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[30vh] flex justify-center items-end">
        <div className="relative w-2 h-40 bg-white/80 blur-md shadow-[0_0_50px_20px_rgba(168,85,247,0.5)] animate-pulse"></div>
        <div className="absolute bottom-0 w-60 h-20 bg-purple-500/20 blur-[60px]"></div>
      </div>
    </div>
  );
};

// 2. Holographic Card
const HolographicCard = ({ theme, isActive, index, offset }: { theme: TarotTheme; isActive: boolean; index: number; offset: number }) => {
  return (
    <motion.div
      layout
      className={`absolute w-[260px] h-[340px] rounded-[24px] overflow-hidden cursor-pointer transition-all duration-500
        ${isActive 
          ? `z-20 scale-102 opacity-100 bg-gradient-to-b from-[#151515] via-[#050505] to-black border border-white/14 shadow-[0_28px_70px_rgba(0,0,0,0.95)]` 
          : `z-10 scale-94 opacity-40 border border-white/10 bg-black/60 blur-[2px] grayscale-[0.5]`
        }
      `}
      initial={false}
      animate={{
        x: offset * 320, // Distance between cards
        z: Math.abs(offset) * -100, // Depth effect
        rotateY: offset * -15, // Rotation effect
        rotateX: isActive ? 6 : 0,
        scale: isActive ? 1.02 : 0.94,
        opacity: isActive ? 1 : 0.6 - Math.abs(offset) * 0.2,
      }}
      transition={{ type: 'spring', stiffness: 80, damping: 20 }}
      style={{
        transformStyle: 'preserve-3d',
        transformOrigin: 'center bottom',
      }}
    >
      <div className="absolute inset-[10px] rounded-[18px] border border-white/10" />
      
      {/* Card Content */}
      <div className="relative h-full flex flex-col items-center justify-between p-6">
        {/* 顶栏（塔罗感） */}
        <div className="relative z-10 flex items-center justify-between px-6 pt-4 text-[10px] tracking-[0.25em] text-white/45 uppercase w-full">
          <span>NO. 0{index + 1}</span>
          <span>ARCANA</span>
        </div>

        {/* 中部用占星星盘 + 行星符号 */}
        <div className="relative z-10 mt-2 flex flex-col items-center justify-center h-[210px]">
          <div className="relative w-[160px] h-[160px]">
            <div className="absolute inset-0 rounded-full border border-white/16" />
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-[3px] h-[3px] rounded-full bg-white/65"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `rotate(${i * 30}deg) translate(0, -76px)`,
                }}
              />
            ))}
            <div className="absolute inset-[30px] rounded-full border border-white/10 border-dashed" />
            <div className="absolute inset-[58px] rounded-full border border-white/18" />
            <svg viewBox="0 0 100 100" className="absolute inset-[34px] w-[92px] h-[92px] text-white/16">
              <polygon points="50,8 12,84 88,84" fill="none" stroke="currentColor" strokeWidth="0.6" />
              <polygon points="50,92 12,16 88,16" fill="none" stroke="currentColor" strokeWidth="0.6" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-white/6 border border-white/18 flex items-center justify-center">
                {/* 不同卡牌替换这里的符号：♀, ♄, ♅, ☉ 等 */}
                <span className="text-white/70 text-lg">
                  {theme.id === 'love' ? '♀' : 
                   theme.id === 'career' ? '♄' : 
                   theme.id === 'destiny' ? '☉' : '♅'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 底部：领域标题 */}
        <div className="relative z-10 mt-2 px-6 text-center">
          <div className="text-[13px] tracking-[0.32em] text-white/40 mb-1 uppercase">
            DOMAIN
          </div>
          <div 
            className="text-xl text-white font-serif" 
            style={{ letterSpacing: '0.06em' }}
          >
            {theme.title}
          </div>
          <div className="text-[10px] tracking-[0.32em] text-white/45 uppercase mt-1">
            {theme.subtitle}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Component ---
const DashboardView: React.FC<DashboardViewProps> = ({ userData, onEnterCouncil, onBack }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [customInput, setCustomInput] = useState("");
  
  // Navigation handlers
  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + TAROT_THEMES.length) % TAROT_THEMES.length);
  };
  
  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % TAROT_THEMES.length);
  };

  const activeTheme = TAROT_THEMES[activeIndex];

  return (
    <div className="fixed inset-0 w-full h-full bg-[#050505] overflow-hidden flex flex-col items-center">
      {/* 1. Background Environment */}
      <CosmicStage />

      {/* Top Navigation */}
      <div className="absolute top-0 left-0 w-full p-8 z-50 flex justify-between items-start">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <div className="p-2 rounded-full border border-white/10 group-hover:border-white/30 transition-all">
            <ArrowLeft size={16} />
          </div>
          <span className="text-xs font-cinzel tracking-widest uppercase">Return</span>
        </button>
      </div>

      {/* 2. Tarot Wheel Container */}
      <div className="relative flex-1 w-full flex items-center justify-center perspective-[1000px]">
        {/* Navigation Buttons */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-20 z-40 pointer-events-none">
          <button 
            onClick={handlePrev}
            className="pointer-events-auto p-4 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white/50 hover:text-white hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all group"
          >
            <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={handleNext}
            className="pointer-events-auto p-4 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white/50 hover:text-white hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all group"
          >
            <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 3D Cards */}
        <div className="relative w-full h-[500px] flex justify-center items-center perspective-[1200px]">
          <AnimatePresence mode='popLayout'>
            {TAROT_THEMES.map((theme, index) => {
              // Calculate circular offset
              let offset = index - activeIndex;
              // Handle wrap-around for smooth infinite loop visual (simplified for 4 items)
              if (offset > 1) offset -= TAROT_THEMES.length;
              if (offset < -1) offset += TAROT_THEMES.length;
              
              // Only render visible cards (active, left, right)
              if (Math.abs(offset) > 1 && TAROT_THEMES.length > 3) return null;

              return (
                <HolographicCard 
                  key={theme.id}
                  theme={theme}
                  index={index}
                  isActive={index === activeIndex}
                  offset={offset}
                />
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* 3. Control Deck (Bottom) */}
      <div className="absolute bottom-10 z-50 w-full max-w-lg px-6 flex flex-col items-center gap-6">
        {/* Floating Input Bar */}
        <div className="w-full relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-full opacity-0 group-hover:opacity-100 transition duration-500 blur-md"></div>
          <div className="relative flex items-center bg-black/60 backdrop-blur-xl border border-white/10 rounded-full p-2 transition-all focus-within:border-white/20 focus-within:bg-black/80">
            <input 
              type="text" 
              placeholder="Ask a specific question..." 
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="flex-1 bg-transparent border-none text-white px-4 py-2 text-sm font-light focus:outline-none placeholder:text-white/30"
            />
          </div>
        </div>

        {/* Enter Council Button (The Rift Trigger) */}
        <button
          onClick={onEnterCouncil}
          className="group relative px-12 py-4 bg-transparent overflow-hidden rounded-full"
        >
          {/* Button Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-cyan-900/50 backdrop-blur-md border border-white/20 group-hover:border-white/50 transition-all rounded-full"></div>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/5 transition-opacity duration-300"></div>
          
          <div className="relative flex items-center gap-3">
            <span className="font-cinzel font-bold text-white tracking-[0.2em] text-sm group-hover:text-cyan-200 transition-colors">
              ENTER COUNCIL
            </span>
            <Send size={14} className="text-white/70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
          </div>
          
          {/* Rift Beam Effect coming from button */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-cyan-400 blur-[4px] group-hover:blur-[8px] transition-all duration-300"></div>
        </button>
      </div>
    </div>
  );
};

export default DashboardView;