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
const HolographicCard = ({ theme, slot, index }: { theme: TarotTheme; slot: string; index: number }) => {
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
      className=" 
        relative w-[260px] h-[380px] 
        rounded-[24px] overflow-hidden 
        bg-[#050307] 
        border border-amber-300/60 
        shadow-[0_28px_70px_rgba(0,0,0,0.95)] 
      "
      style={{ transformOrigin: 'center bottom' }}
      animate={{ 
        scale: slot === 'active' ? 1.02 : 0.9, 
        rotateY: slot === 'prev' ? -16 : slot === 'next' ? 16 : 0, 
        translateZ: slot === 'active' ? 60 : -40, 
      }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      {/* 内边框 */}
      <div className="absolute inset-[10px] rounded-[18px] border border-amber-300/40" />

      {/* 四角装饰弧线 */}
      <div className="absolute inset-[14px]">
        {/* 左上 */}
        <div className="absolute left-0 top-0 w-6 h-6 border-l border-t border-amber-300/70 rounded-tl-[18px]" />
        {/* 右上 */}
        <div className="absolute right-0 top-0 w-6 h-6 border-r border-t border-amber-300/70 rounded-tr-[18px]" />
        {/* 左下 */}
        <div className="absolute left-0 bottom-0 w-6 h-6 border-l border-b border-amber-300/70 rounded-bl-[18px]" />
        {/* 右下 */}
        <div className="absolute right-0 bottom-0 w-6 h-6 border-r border-b border-amber-300/70 rounded-br-[18px]" />
      </div>

      {/* 小星星点缀 */}
      <div className="absolute inset-[24px]">
        <span className="absolute left-[12%] top-[18%] w-[3px] h-[3px] bg-amber-200 rounded-full" />
        <span className="absolute right-[16%] top-[26%] w-[2px] h-[2px] bg-amber-200 rounded-full" />
        <span className="absolute left-[18%] bottom-[22%] w-[2px] h-[2px] bg-amber-200 rounded-full" />
        <span className="absolute right-[20%] bottom-[18%] w-[3px] h-[3px] bg-amber-200 rounded-full" />
      </div>

      {/* 顶部小标题：编号 + ARCANA */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-5 text-[10px] tracking-[0.25em] text-amber-200/80 uppercase">
        <span>NO. 0{index + 1}</span>
        <span>ARCANA</span>
      </div>

      {/* 中央主图：月亮 + 光芒（LOVE 卡示例） */}
      <div className="relative z-10 mt-4 flex flex-col items-center justify-center h-[210px]">
        <div className="relative w-[150px] h-[150px]">
          {/* 外层光芒圈 */}
          <div className="absolute inset-0 rounded-full border border-amber-200/40" />
          {/* 光芒射线（简单版：12 条线） */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 w-[1px] h-[14px] bg-amber-200/60 origin-bottom"
              style={{ transform: `rotate(${i * 30}deg) translateY(-64px)` }}
            />
          ))}
          {/* 月亮圆 */}
          <div className="absolute inset-[26px] rounded-full border border-amber-200/80 bg-black" />
          {/* 月亮剪影（左边挖掉一点形成弯月） */}
          <div className="absolute inset-[32px] rounded-full bg-amber-200/90" />
          <div className="absolute inset-[38px] rounded-full bg-black translate-x-[12px]" />
          {/* 中心小星 */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[4px] h-[4px] rounded-full bg-black/80" />
        </div>
      </div>

      {/* 底部主文案 */}
      <div className="relative z-10 mt-6 px-4 text-center">
        <div className="text-[11px] tracking-[0.32em] text-amber-200/80 mb-2 uppercase">
          {theme.title}
        </div>
        <div className="text-[10px] tracking-[0.38em] text-amber-200/70 uppercase">
          {theme.subtitle}
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
        <div className="relative w-full h-[380px] flex items-center justify-center perspective-[1200px]">
          <AnimatePresence mode='popLayout'>
            {TAROT_THEMES.map((theme, index) => {
              // Calculate slot position
              let slot = 'active';
              if (index === (activeIndex - 1 + TAROT_THEMES.length) % TAROT_THEMES.length) {
                slot = 'prev';
              } else if (index === (activeIndex + 1) % TAROT_THEMES.length) {
                slot = 'next';
              }
              
              // Only render visible cards (active, left, right)
              if (slot !== 'active' && slot !== 'prev' && slot !== 'next') return null;

              return (
                <motion.div 
                  key={theme.id} 
                  className="absolute left-1/2 -translate-x-1/2" 
                  animate={{ 
                    x: slot === 'prev' ? -220 : slot === 'next' ? 220 : 0, 
                    zIndex: slot === 'active' ? 20 : 10, 
                  }} 
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <HolographicCard 
                    theme={theme}
                    slot={slot}
                    index={index}
                  />
                </motion.div>
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
