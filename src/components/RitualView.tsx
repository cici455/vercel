import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';

import type { PlanetKey } from '../utils/planetArchetypes';

// --- Types ---
export interface RitualViewProps {
  onOpenGate: () => void;
  onBack: () => void;
}

type RitualId =
  | 'love'
  | 'career'
  | 'destiny'
  | 'chaos'
  | 'body'
  | 'mind'
  | 'spirit'
  | 'shadow';

type RitualTheme = {
  id: RitualId;
  no: string;
  title: string;
  subtitle: string;
  tag: string;      // 卡片底部 tagline
  glyph: 'moon' | 'triangle' | 'arrow' | 'lightning' | 'shield' | 'circuit' | 'eye' | 'abyss';
};

const RITUAL_THEMES: RitualTheme[] = [
  {
    id: 'love',
    no: 'NO. 01',
    title: 'LOVE & RELATIONSHIPS',
    subtitle: 'VENUS ALIGNMENT',
    tag: 'Where your heart keeps choosing, even when your mind hesitates.',
    glyph: 'moon',
  },
  {
    id: 'career',
    no: 'NO. 02',
    title: 'CAREER & WEALTH',
    subtitle: 'SATURN RETURN',
    tag: 'The structures you are meant to build, and what they demand in return.',
    glyph: 'triangle',
  },
  {
    id: 'destiny',
    no: 'NO. 03',
    title: 'DESTINY & PATH',
    subtitle: 'NORTH NODE CURRENT',
    tag: 'The direction your life keeps leaning toward, even when you look away.',
    glyph: 'arrow',
  },
  {
    id: 'chaos',
    no: 'NO. 04',
    title: 'CHAOS & CHANGE',
    subtitle: 'URANUS STORM',
    tag: 'What breaks so something truer can finally fit.',
    glyph: 'lightning',
  },
  {
    id: 'body',
    no: 'NO. 05',
    title: 'BODY & HEALTH',
    subtitle: 'EARTH TEMPLE',
    tag: 'The vessel that carries all your other stories.',
    glyph: 'shield',
  },
  {
    id: 'mind',
    no: 'NO. 06',
    title: 'MIND & PATTERNS',
    subtitle: 'MERCURY CIRCUIT',
    tag: 'The loops your thoughts keep running until you rewrite them.',
    glyph: 'circuit',
  },
  {
    id: 'spirit',
    no: 'NO. 07',
    title: 'SPIRIT & MYSTERY',
    subtitle: 'NEPTUNE VEIL',
    tag: 'Where the borders between you and the unseen grow thin.',
    glyph: 'eye',
  },
  {
    id: 'shadow',
    no: 'NO. 08',
    title: 'SHADOW & FEAR',
    subtitle: 'PLUTO UNDERWORLD',
    tag: 'The contracts you made with survival, and the ones you can now rescind.',
    glyph: 'abyss',
  },
];


// --- Components ---

// Card Motif Component
function CardMotif({ id }: { id: string }) { 
  switch (id) { 
    case 'destiny': // 命运&道路 - 用你现在的月亮 
      return ( 
        <div className="relative w-[150px] h-[150px]"> 
          <div className="absolute inset-0 rounded-full border border-amber-200/40" /> 
          {[...Array(12)].map((_, i) => ( 
            <div 
              key={i} 
              className="absolute left-1/2 top-1/2 w-[1px] h-[14px] bg-amber-200/60 origin-bottom" 
              style={{ transform: `rotate(${i * 30}deg) translateY(-64px)` }} 
            /> 
          ))} 
          <div className="absolute inset-[26px] rounded-full border border-amber-200/80 bg-black" /> 
          <div className="absolute inset-[32px] rounded-full bg-amber-200/90" /> 
          <div className="absolute inset-[38px] rounded-full bg-black translate-x-[12px]" /> 
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[4px] h-[4px] rounded-full bg-black/80" /> 
        </div> 
      ); 
    case 'love': // 爱&关系 - 双月+小星 
      return ( 
        <div className="relative w-[150px] h-[150px]"> 
          <div className="absolute inset-0 rounded-full border border-amber-200/35" /> 
          <div className="absolute inset-[30px] rounded-full border border-amber-200/25" /> 
          {/* 大月 */} 
          <div className="absolute inset-[36px] rounded-full bg-amber-200/90" /> 
          <div className="absolute inset-[44px] rounded-full bg-black translate-x-[10px]" /> 
          {/* 小月 */} 
          <div className="absolute left-[30%] top-[38%] w-[26px] h-[26px] rounded-full bg-amber-200/80" /> 
          <div className="absolute left-[33%] top-[41%] w-[22px] h-[22px] rounded-full bg-black" /> 
          {/* 小星 */} 
          <div className="absolute right-[26%] top-[30%] w-[3px] h-[3px] bg-amber-200 rounded-full" /> 
        </div> 
      ); 
    case 'career': // 事业&财富 - 金字塔/硬朗结构 
      return ( 
        <div className="relative w-[150px] h-[150px]"> 
          <div className="absolute inset-0 rounded-full border border-amber-200/30" /> 
          <svg viewBox="0 0 100 100" className="absolute inset-[20px] w-[110px] h-[110px] text-amber-200/70"> 
            <polygon 
              points="50,10 14,86 86,86" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.4" 
            /> 
            <line x1="50" y1="10" x2="50" y2="86" stroke="currentColor" strokeWidth="0.8" /> 
            <circle cx="50" cy="55" r="7" fill="none" stroke="currentColor" strokeWidth="1" /> 
          </svg> 
          {/* 顶点小光 */} 
          <div className="absolute left-1/2 top-[18%] -translate-x-1/2 w-[4px] h-[4px] rounded-full bg-amber-200" /> 
        </div> 
      ); 
    case 'chaos': // 混沌&变革 - 破碎圆+闪电 
      return ( 
        <div className="relative w-[150px] h-[150px]"> 
          <div className="absolute inset-0 rounded-full border border-amber-200/30 border-dashed" /> 
          {/* 破碎圆 */} 
          <div className="absolute inset-[34px] rounded-full border border-amber-200/80 border-dashed border-spacing-[6px]" /> 
          {/* 闪电 */} 
          <svg viewBox="0 0 100 100" className="absolute inset-[30px] w-[90px] h-[90px] text-amber-200/90"> 
            <polyline 
              points="40,18 56,38 46,42 64,64 32,54 42,46 30,32 40,18" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.8" 
            /> 
          </svg> 
        </div> 
      ); 
    default: 
      return null; 
  } 
}

// --- Main Component ---
const RitualView: React.FC<RitualViewProps> = ({ onOpenGate, onBack }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [customInput, setCustomInput] = useState("");
  const total = RITUAL_THEMES.length;
  
  // Navigation handlers
  const handlePrev = () => setActiveIndex(i => (i - 1 + total) % total);
  const handleNext = () => setActiveIndex(i => (i + 1) % total);

  // Get slot position for each card
  const getSlot = (index: number): 'prev' | 'active' | 'next' | 'far' => {
    if (index === activeIndex) return 'active';
    if ((index + 1) % total === activeIndex) return 'prev';
    if ((index - 1 + total) % total === activeIndex) return 'next';
    return 'far';
  };
  
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
        <div 
          className="relative w-full h-[420px] flex items-center justify-center" 
          style={{ perspective: 900 }} 
        >
          <AnimatePresence mode='popLayout'>
            {RITUAL_THEMES.map((theme, index) => {
              // Calculate slot position
              const slot = getSlot(index);
              
              // Only render visible cards (active, left, right)
              if (slot !== 'active' && slot !== 'prev' && slot !== 'next') return null;

              return (
                <motion.div 
                  key={theme.id} 
                  className="absolute left-1/2 -translate-x-1/2" 
                  animate={{ 
                    x: slot === 'prev' ? -280 : slot === 'next' ? 280 : 0,   // 原来 -220/220 改大一点 
                    zIndex: slot === 'active' ? 30 : 10, 
                  }} 
                  transition={{ duration: 0.4, ease: 'easeOut' }} 
                > 
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
                      scale: slot === 'active' ? 1.04 : slot === 'prev' || slot === 'next' ? 0.88 : 0.8, 
                      rotateY: slot === 'prev' ? -18 : slot === 'next' ? 18 : 0, 
                    }} 
                    transition={{ duration: 0.45, ease: 'easeOut' }} 
                  > 
                    {/* 中心卡亮度优势：非 active 加一层暗罩 */} 
                    {slot !== 'active' && ( 
                      <div className="absolute inset-0 bg-black/60 z-20 pointer-events-none" /> 
                    )} 

                    {/* 内边框 */} 
                    <div className="absolute inset-[10px] rounded-[18px] border border-amber-300/40" /> 

                    {/* 四角装饰弧线 */} 
                    <div className="absolute inset-[14px]"> 
                      <div className="absolute left-0 top-0 w-6 h-6 border-l border-t border-amber-300/70 rounded-tl-[18px]" /> 
                      <div className="absolute right-0 top-0 w-6 h-6 border-r border-t border-amber-300/70 rounded-tr-[18px]" /> 
                      <div className="absolute left-0 bottom-0 w-6 h-6 border-l border-b border-amber-300/70 rounded-bl-[18px]" /> 
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
                      <span>{theme.no}</span> 
                      <span>ARCANA</span> 
                    </div> 

                    {/* 中央主图：根据 theme.id 渲染不同图案 */} 
                    <div className="relative z-10 mt-4 flex flex-col items-center justify-center h-[210px]"> 
                      <CardMotif id={theme.id} /> 
                    </div> 

                    {/* 底部主文案 */} 
                    <div className="relative z-10 mt-6 px-4 text-center"> 
                      <div className="text-[11px] tracking-[0.32em] text-amber-200/80 mb-2 uppercase"> 
                        {theme.title} 
                      </div> 
                      <div className="text-[10px] tracking-[0.38em] text-amber-200/70 uppercase mb-3"> 
                        {theme.subtitle} 
                      </div> 
                      <p className="text-[11px] text-amber-100/70 leading-relaxed">
                        {theme.tag}
                      </p>
                    </div> 
                  </motion.div> 
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
