import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight
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
};

// --- Mock Data ---
const TAROT_THEMES: TarotTheme[] = [
  { 
    id: 'love', 
    title: 'LOVE & RELATIONSHIPS', 
    subtitle: 'VENUS ALIGNMENT'
  },
  { 
    id: 'career', 
    title: 'CAREER & WEALTH', 
    subtitle: 'SATURN RETURN'
  },
  { 
    id: 'destiny', 
    title: 'DESTINY & PATH', 
    subtitle: 'SOLAR GUIDANCE'
  },
  { 
    id: 'chaos', 
    title: 'CHAOS & CHANGE', 
    subtitle: 'URANUS STORM'
  },
];

// --- Components ---

// Holographic Card
const HolographicCard = ({ theme, isActive, index, offset }: { theme: TarotTheme; isActive: boolean; index: number; offset: number }) => {
  return (
    <motion.div
      layout
      className={`absolute rounded-[20px] overflow-hidden cursor-pointer
        ${isActive 
          ? 'z-20 border border-cyan-300/70 shadow-[0_0_25px_rgba(56,189,248,0.55)] bg-gradient-to-b from-[#120821] via-[#05040A] to-[#010104]' 
          : 'z-10 border border-white/20 bg-black/40'
        }
      `}
      initial={false}
      animate={{
        x: offset * 220, // Reduced spacing
        rotateY: isActive ? 3 : (offset > 0 ? 18 : -18),
        rotateX: isActive ? -2 : 0,
        scale: isActive ? 1 : 0.85,
        opacity: isActive ? 1 : 0.4,
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{
        width: '260px',
        height: '420px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Card Content */}
      <div className="relative h-full flex flex-col items-center justify-between p-6">
        {/* Header */}
        <div className="w-full flex justify-between items-center opacity-70">
          <div className="text-[10px] font-sans tracking-widest text-white/60">NO. 0{index + 1}</div>
          <div className="text-[10px] font-sans tracking-widest text-white/60">ARCANA</div>
        </div>

        {/* Center Energy Rune */}
        <div className="relative flex-1 flex items-center justify-center w-full">
           <div className="w-32 h-32 rounded-full border border-white/10 flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-spin-slow"></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_cyan]"></div>
           </div>
        </div>

        {/* Footer Text */}
        <div className="text-center space-y-2">
          <h3 className="font-serif text-xl text-[#F5ECFF] tracking-widest font-normal uppercase">
            {theme.title}
          </h3>
          <p className="text-[9px] text-white/40 font-sans tracking-[0.2em] uppercase">
            {theme.subtitle}
          </p>
        </div>
      </div>
      
      {/* Scanline/Grid Effect - Subtle */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_3px] opacity-20 pointer-events-none"></div>
    </motion.div>
  );
};

// --- Main Component ---
const RitualView: React.FC<RitualViewProps> = ({ onOpenGate, onBack }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [customInput, setCustomInput] = useState("");
  
  // Navigation handlers
  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + TAROT_THEMES.length) % TAROT_THEMES.length);
  };
  
  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % TAROT_THEMES.length);
  };

  // Get visible indices (Active, Left, Right)
  // For this simplified version, we just render all, but manipulate their positions via offset
  
  return (
    <main className="relative min-h-screen overflow-x-hidden flex flex-col items-center">
      {/* 背景层：星空 + 紫色星球 */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        {/* 深色星空底色 */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050509] via-[#02010a] to-black" />

        {/* 紫色星球：露出大约上半部分 */}
        <div className="absolute left-1/2 bottom-[-28vh] -translate-x-1/2 w-[120vh] h-[120vh]">
          <Image 
            src="/planet.png" 
            alt="Ritual Planet" 
            fill 
            className="object-contain animate-[spin_120s_linear_infinite]" 
            priority 
          />
          {/* 遮罩：让下半球渐隐到黑色 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>
      </div>

      {/* Top Navigation */}
      <div className="absolute top-0 left-0 w-full p-8 z-50 flex justify-between items-start">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <div className="p-2 rounded-full border border-white/10 group-hover:border-white/30 transition-all">
            <ArrowLeft size={16} />
          </div>
          <span className="text-xs font-serif tracking-widest uppercase">Return</span>
        </button>
      </div>

      {/* Tarot Wheel Container */}
      <div className="flex-1 w-full flex flex-col items-center justify-center perspective-[1000px] z-10 relative mt-10">
        
        {/* Navigation Buttons (Floating) */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-32 z-40 pointer-events-none">
          <button 
            onClick={handlePrev}
            className="pointer-events-auto p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={handleNext}
            className="pointer-events-auto p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white transition-all"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* 3D Cards */}
        <div className="relative w-full h-[500px] flex justify-center items-center">
          <AnimatePresence mode='popLayout'>
            {TAROT_THEMES.map((theme, index) => {
              // Calculate circular offset
              let offset = index - activeIndex;
              // Handle wrap-around
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

      {/* Bottom Controls */}
      <div className="w-full max-w-lg px-6 flex flex-col items-center gap-6 pb-20 z-50">
        {/* Input Bar */}
        <input 
          type="text" 
          placeholder="Ask a specific question..." 
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          className="w-[420px] h-11 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-sm px-4 text-white/80 focus:outline-none focus:border-white/30 text-center placeholder:text-white/30"
        />

        {/* Open The Gate Button */}
        <button
          onClick={onOpenGate}
          className="inline-flex items-center justify-center px-8 py-2 rounded-full border border-white/40 bg-white/5 hover:bg-white/10 text-[11px] tracking-[0.35em] uppercase text-white transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
        >
          OPEN THE GATE
        </button>
      </div>
    </main>
  );
};

export default RitualView;
