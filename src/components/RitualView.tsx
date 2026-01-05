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
  // 根据主题设置行星和元素信息
  const getCardInfo = (id: string) => {
    switch (id) {
      case 'love':
        return { symbol: '♀', planet: 'VENUS', element: 'WATER' };
      case 'career':
        return { symbol: '♄', planet: 'SATURN', element: 'EARTH' };
      case 'destiny':
        return { symbol: '☉', planet: 'SUN', element: 'FIRE' };
      case 'chaos':
        return { symbol: '♅', planet: 'URANUS', element: 'AIR' };
      default:
        return { symbol: '☉', planet: 'SUN', element: 'FIRE' };
    }
  };

  const cardInfo = getCardInfo(theme.id);

  return (
    <motion.div
      layout
      className={`
        relative w-[260px] h-[340px]
        rounded-[24px] overflow-hidden
        bg-gradient-to-b from-[#151515] via-[#050505] to-black
        border border-white/14
        shadow-[0_28px_70px_rgba(0,0,0,0.95)]
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
      {/* 内边框，模拟塔罗牌的镶边 */}
      <div className="absolute inset-[10px] rounded-[18px] border border-white/10" />
      
      {/* 底缘高光，增加“厚度” */}
      <div className="pointer-events-none absolute bottom-[14px] inset-x-10 h-[2px] bg-gradient-to-r from-white/0 via-white/45 to-white/0 opacity-60" />
      
      {/* Card Content */}
      <div className="relative h-full flex flex-col items-center justify-between p-6">
        {/* 顶栏：神秘学排版 */}
        <div className="relative z-10 flex items-center justify-between px-6 pt-4 text-[10px] tracking-[0.25em] text-white/45 uppercase">
          <span>NO. 0{index + 1}</span>
          <span>ARCANA</span>
        </div>

        {/* 中部：占星星盘 + 行星符文 */}
        <div className="relative z-10 mt-2 flex flex-col items-center justify-center h-[210px]">
          <div className="relative w-[160px] h-[160px]">
            {/* 外环 */}
            <div className="absolute inset-0 rounded-full border border-white/16" />
            {/* 十二宫刻度 */}
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
            {/* 中环虚线 */}
            <div className="absolute inset-[30px] rounded-full border border-white/10 border-dashed" />
            {/* 内环 */}
            <div className="absolute inset-[58px] rounded-full border border-white/18" />
            {/* 六芒星几何阵 */}
            <svg viewBox="0 0 100 100" className="absolute inset-[34px] w-[92px] h-[92px] text-white/16">
              <polygon points="50,8 12,84 88,84" fill="none" stroke="currentColor" strokeWidth="0.6" />
              <polygon points="50,92 12,16 88,16" fill="none" stroke="currentColor" strokeWidth="0.6" />
            </svg>
            {/* 中央行星符号 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-white/6 border border-white/18 flex items-center justify-center">
                <span className="text-[20px] text-white/90">
                  {cardInfo.symbol}
                </span>
              </div>
            </div>
          </div>
          {/* 行星 / 元素信息 */}
          <div className="mt-5 text-[10px] tracking-[0.32em] uppercase text-white/55">
            {cardInfo.planet} · {cardInfo.element}
          </div>
        </div>

        {/* 底部文案：黑白 serif + 大字距 */}
        <div className="relative z-10 mt-4 px-6 text-center">
          <div className="text-[11px] tracking-[0.32em] text-white/42 mb-1 uppercase">
            {theme.title}
          </div>
          <div className="text-[10px] tracking-[0.38em] text-white/32 uppercase">
            {theme.subtitle}
          </div>
        </div>
      </div>
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
      {/* 背景层：星空 + 紫色星球 (Temporarily disabled for global dynamic background) */}
      {/* <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050509] via-[#02010a] to-black" />

        <div className="absolute left-1/2 bottom-[-28vh] -translate-x-1/2 w-[120vh] h-[120vh]">
          <Image 
            src="/planet.png" 
            alt="Ritual Planet" 
            fill 
            className="object-contain animate-[spin_120s_linear_infinite]" 
            priority 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>
      </div> */}

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
