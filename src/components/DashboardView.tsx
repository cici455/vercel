import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  Sparkles, 
  Orbit, 
  Circle, 
  Star,
  MessageCircle,
  Heart,
  Swords,
  Shield,
  Zap,
  Waves,
  Skull,
  ArrowUpRight,
  Info,
  X
} from 'lucide-react';
import { useUserChart } from '../hooks/useUserChart';
import { OmenOutput } from '../utils/narrativeGenerator';

// --- Types ---
export type CardItem = {
  id: string;
  kind: "trinity" | "planet";
  slot?: "sun"|"moon"|"rising";
  planet?: "mercury"|"venus"|"mars"|"jupiter"|"saturn";
  sign: string;
  degree?: number;
  title: string;
  inscription: string;
  notes: {
    meaning: string;
    practice: string;
  };
  today?: {
    status?: "BLESSED"|"PRESSURE"|"ACTIVE";
    why?: string;
    guidance?: string;
  };
  tags?: string[];
};

export type FocusedCard = CardItem | null;

// --- Types ---
interface DashboardViewProps {
  userData: any;
  onEnterCouncil: () => void;
}

// --- 0. 全局样式 (字体 & 旋转动画) ---
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Cormorant+Garamond:wght@400;600;700&display=swap');
    
    .font-cinzel { font-family: 'Cinzel', serif; }
    .font-cormorant { font-family: 'Cormorant Garamond', serif; }

    /* 定义星空旋转动画 */
    @keyframes star-rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    /* 星星闪烁 */
    @keyframes twinkle {
      0%, 100% { opacity: 0.3; transform: scale(0.8); }
      50% { opacity: 1; transform: scale(1.2); }
    }

    .star-layer {
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      animation: star-rotate 240s linear infinite; /* 缓慢旋转 */
      background-image: 
        radial-gradient(1px 1px at 10% 10%, white 100%, transparent),
        radial-gradient(1px 1px at 20% 30%, white 100%, transparent),
        radial-gradient(2px 2px at 30% 50%, white 100%, transparent),
        radial-gradient(1px 1px at 40% 70%, white 100%, transparent),
        radial-gradient(2px 2px at 60% 20%, white 100%, transparent),
        radial-gradient(1px 1px at 70% 80%, white 100%, transparent),
        radial-gradient(2px 2px at 80% 40%, white 100%, transparent),
        radial-gradient(1px 1px at 90% 10%, white 100%, transparent);
      background-size: 500px 500px;
      opacity: 0.6;
    }
    
    .planet-glow {
      box-shadow: 0 -40px 100px rgba(100, 180, 255, 0.15);
    }
  `}</style>
);

// --- 1. 背景组件：旋转星空 + 地平线 ---
const SpaceEnvironment = () => {
  return (
    <div className="fixed inset-0 bg-[#020205] overflow-hidden pointer-events-none z-0">
      
      {/* 1.1 旋转的星空层 (多层叠加产生视差) */}
      <div className="star-layer opacity-40" style={{ animationDuration: '300s' }}></div>
      <div className="star-layer opacity-70 scale-110" style={{ animationDuration: '400s' }}></div>
      
      {/* 1.2 极光/星云背景 (增加层次) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[60vh] bg-gradient-to-b from-indigo-900/10 to-transparent blur-3xl" />

      {/* 1.3 巨大的星球地平线 (The Planet Surface) */}
      {/* 这是一个推到屏幕底部的巨大圆形，模拟地平线弧度 */}
      <div className="absolute bottom-[-60vh] left-1/2 -translate-x-1/2 w-[150vw] h-[80vh] bg-[#050510] rounded-[100%] planet-glow border-t border-white/5 overflow-hidden">
         {/* 地表纹理 */}
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
         {/* 大气层发光 */}
         <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-cyan-900/20 to-transparent blur-xl"></div>
         {/* Rim Light */}
         <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E7D7B6]/40 to-transparent blur-[1px] shadow-[0_0_20px_rgba(231,215,182,0.1)]"></div>
      </div>
      
      {/* Bottom Atmosphere Gradient */}
      <div className="fixed bottom-0 inset-x-0 h-64 bg-gradient-to-t from-black via-black/80 to-transparent z-[5]"></div>
    </div>
  );
};

// --- 1.5 Oracle Line (Today's Omen) ---
const OracleLine = ({ omen }: { omen: OmenOutput }) => {
  if (!omen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 1 }}
      className="my-10 text-center relative z-10"
    >
      <span className="block font-cinzel text-[9px] text-[#E7D7B6]/60 tracking-[0.4em] uppercase mb-3">
        {omen.headline}
      </span>
      <p className="font-cormorant text-xl text-white/90 italic tracking-wide drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
        “{omen.omen}”
      </p>
    </motion.div>
  );
};

// --- 2. Trinity Card Component ---
const TrinityCard = ({ item, onClick }: { item: CardItem; onClick: (item: CardItem) => void }) => {
  const getIcon = () => {
    switch (item.slot) {
      case 'sun': return <Sun size={24} className="text-[#E7D7B6] opacity-80" strokeWidth={1} />;
      case 'moon': return <Moon size={24} className="text-white opacity-80" strokeWidth={1} />;
      case 'rising': return <Sparkles size={24} className="text-white opacity-80" strokeWidth={1} />;
      default: return <Sun size={24} className="text-[#E7D7B6] opacity-80" strokeWidth={1} />;
    }
  };

  return (
    <motion.div
      layoutId={item.id}
      onClick={() => onClick(item)}
      className="bg-white/[0.04] backdrop-blur-xl border border-white/10 border-t-white/20 rounded-2xl overflow-hidden shadow-2xl hover:bg-white/[0.06] transition-all duration-500 cursor-pointer hover:shadow-[0_0_30px_rgba(231,215,182,0.05)]"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="p-6 md:p-8 flex flex-col items-center text-center">
        <span className="absolute top-6 left-1/2 -translate-x-1/2 text-[9px] text-white/20 tracking-[0.2em] uppercase font-cinzel">
          {item.slot?.toUpperCase() || "SUN"}
        </span>
        
        {getIcon()}
        
        <span className="font-cinzel text-[10px] font-bold text-[#E7D7B6]/80 uppercase tracking-[0.2em] my-4">
          {item.title}
        </span>
        
        <h2 className="font-cormorant text-3xl md:text-4xl text-white font-medium tracking-wide mb-3">
          {item.sign}
        </h2>
        
        <div className="w-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4"></div>
        
        <div className="px-4 pb-4">
          <span className="font-cormorant text-base text-white/50 italic tracking-wide leading-relaxed block min-h-[3rem]">
            {item.inscription}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// --- 3. Planet Row Component ---
const PlanetRow = ({ item, onClick }: { item: CardItem; onClick: (item: CardItem) => void }) => {
  const getPlanetIcon = () => {
    switch (item.planet) {
      case 'mercury': return <MessageCircle size={18} strokeWidth={1.5} />;
      case 'venus': return <Heart size={18} strokeWidth={1.5} />;
      case 'mars': return <Swords size={18} strokeWidth={1.5} />;
      case 'jupiter': return <Orbit size={18} strokeWidth={1.5} />;
      case 'saturn': return <Shield size={18} strokeWidth={1.5} />;
      default: return <Star size={18} strokeWidth={1.5} />;
    }
  };

  return (
    <motion.div
      layoutId={item.id}
      onClick={() => onClick(item)}
      className="bg-[#0a0a12]/40 backdrop-blur-md border border-white/5 border-t-white/10 rounded-xl overflow-hidden shadow-xl hover:bg-white/[0.03] transition-all duration-500 cursor-pointer hover:shadow-[0_0_20px_rgba(231,215,182,0.05)]"
      whileHover={{ scale: 1.01 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* 左：行星 */}
        <div className="flex items-center gap-5">
          <span className="text-white/30 group-hover:text-white/60 transition-colors duration-300">
            {getPlanetIcon()}
          </span>
          <span className="font-cinzel text-xs font-semibold text-gray-300 tracking-widest uppercase">
            {item.planet?.toUpperCase() || "UNKNOWN"}
          </span>
          
          {/* Status Pill (Transit) */}
          {item.today?.status && (
            <div className="relative group/pill ml-2">
              <span className={`text-[9px] border rounded-full px-2 py-0.5 tracking-wider uppercase opacity-80 cursor-help ${item.today?.status === 'BLESSED' ? 'border-[#E7D7B6]/40 text-[#E7D7B6] bg-[#E7D7B6]/10' :
                item.today?.status === 'PRESSURE' ? 'border-white/30 text-white/70 bg-white/5' :
                'border-white/30 text-white/70 bg-white/5'}`}>
                {item.today.status === 'BLESSED' ? '✨ BLESSED' :
                 item.today.status === 'PRESSURE' ? '⚠ PRESSURE' :
                 '⚡ ACTIVE'}
              </span>
            </div>
          )}
        </div>

        {/* 中：连线 (视觉引导) */}
        <div className="hidden sm:block flex-1 mx-8 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

        {/* 右：星座 */}
        <div className="text-right">
          <div className="font-cormorant text-xl text-white/80 group-hover:text-white transition-colors">
            {item.sign}
          </div>
          <div className="font-cinzel text-[9px] text-white/30 uppercase tracking-[0.1em] mt-0.5">
            {item.title}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- 4. Ritual Focus Modal Component ---
const RitualFocusModal = ({ item, onClose, onEnterCouncil }: { item: CardItem; onClose: () => void; onEnterCouncil: () => void }) => {
  const getIcon = () => {
    if (item.kind === 'trinity') {
      switch (item.slot) {
        case 'sun': return <Sun size={32} className="text-[#E7D7B6] opacity-80" strokeWidth={1} />;
        case 'moon': return <Moon size={32} className="text-white opacity-80" strokeWidth={1} />;
        case 'rising': return <Sparkles size={32} className="text-white opacity-80" strokeWidth={1} />;
        default: return <Sun size={32} className="text-[#E7D7B6] opacity-80" strokeWidth={1} />;
      }
    } else {
      switch (item.planet) {
        case 'mercury': return <MessageCircle size={32} className="text-white opacity-80" strokeWidth={1.5} />;
        case 'venus': return <Heart size={32} className="text-white opacity-80" strokeWidth={1.5} />;
        case 'mars': return <Swords size={32} className="text-white opacity-80" strokeWidth={1.5} />;
        case 'jupiter': return <Orbit size={32} className="text-white opacity-80" strokeWidth={1.5} />;
        case 'saturn': return <Shield size={32} className="text-white opacity-80" strokeWidth={1.5} />;
        default: return <Star size={32} className="text-white opacity-80" strokeWidth={1.5} />;
      }
    }
  };

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black/80"
          onClick={onClose}
        />

        {/* Animated Background Effects */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Soft Circular Halo */}
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full bg-[#E7D7B6]/10 blur-3xl"
            animate={{ 
              rotate: 360,
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
          />

          {/* Sigil Ring */}
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full border-2 border-[#E7D7B6]/20 border-dashed"
            animate={{ 
              rotate: -360
            }}
            transition={{ 
              rotate: { duration: 25, repeat: Infinity, ease: "linear" }
            }}
          />

          {/* Particle Sparkles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#E7D7B6] rounded-full opacity-70"
              initial={{ 
                x: Math.random() * 400 - 200,
                y: Math.random() * 400 - 200,
                scale: 1
              }}
              animate={{ 
                x: Math.random() * 600 - 300,
                y: Math.random() * 600 - 300,
                scale: 0,
                opacity: [0.7, 0, 0]
              }}
              transition={{ 
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        {/* Focused Card */}
        <motion.div
          layoutId={item.id}
          className="relative w-full max-w-2xl bg-[#0a0a12]/80 backdrop-blur-xl border border-white/10 border-t-white/20 rounded-2xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors z-10"
          >
            <X size={16} className="text-white/60 hover:text-white" />
          </button>

          {/* Card Content */}
          <div className="p-8 md:p-12">
            {/* Header Area */}
            <div className="text-center mb-10">
              {getIcon()}
              
              <span className="block font-cinzel text-[9px] text-white/20 tracking-[0.2em] uppercase mt-4 mb-2">
                {item.kind === 'trinity' ? item.slot?.toUpperCase() : item.planet?.toUpperCase()}
              </span>
              
              <h2 className="font-cinzel text-3xl md:text-4xl text-white font-bold tracking-wide mb-3">
                {item.title}
              </h2>
              
              <p className="font-cormorant text-xl text-white/60 italic">
                {item.sign} {item.degree ? `• ${Math.round(item.degree)}°` : ''}
              </p>
            </div>

            {/* Body Area */}
            <div className="space-y-8 mb-10">
              {/* Inscription */}
              <div className="text-center">
                <p className="font-cormorant text-lg text-[#E7D7B6]/80 italic leading-relaxed">
                  "{item.inscription}"
                </p>
              </div>

              {/* Meaning */}
              <div className="space-y-2">
                <h3 className="font-cinzel text-[10px] text-white/30 tracking-[0.2em] uppercase">
                  MEANING
                </h3>
                <p className="font-cormorant text-base text-white/80 leading-relaxed">
                  {item.notes.meaning}
                </p>
              </div>

              {/* In Practice */}
              <div className="space-y-2">
                <h3 className="font-cinzel text-[10px] text-white/30 tracking-[0.2em] uppercase">
                  IN PRACTICE
                </h3>
                <p className="font-cormorant text-base text-white/80 leading-relaxed">
                  {item.notes.practice}
                </p>
              </div>

              {/* Today's Influence */}
              {item.today?.status && (
                <div className="space-y-2 p-4 bg-white/[0.03] rounded-lg border border-white/5">
                  <h3 className="font-cinzel text-[10px] text-white/30 tracking-[0.2em] uppercase">
                    TODAY'S INFLUENCE
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[9px] border rounded-full px-2 py-0.5 tracking-wider uppercase opacity-80 ${item.today.status === 'BLESSED' ? 'border-[#E7D7B6]/40 text-[#E7D7B6] bg-[#E7D7B6]/10' :
                      item.today.status === 'PRESSURE' ? 'border-white/30 text-white/70 bg-white/5' :
                      'border-white/30 text-white/70 bg-white/5'}`}>
                      {item.today.status === 'BLESSED' ? '✨ BLESSED' :
                       item.today.status === 'PRESSURE' ? '⚠ PRESSURE' :
                       '⚡ ACTIVE'}
                    </span>
                  </div>
                  {item.today.guidance && (
                    <p className="font-cormorant text-sm text-white/70 leading-relaxed">
                      {item.today.guidance}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Footer Area */}
            <div className="space-y-6">
              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2">
                  {item.tags.map((tag, i) => (
                    <span key={i} className="text-[9px] border border-white/20 rounded-full px-3 py-1 tracking-wider uppercase text-white/60">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* CTA Button */}
              <div className="flex justify-center">
                <a href="/ritual">
                  <motion.button
                    className="group relative flex flex-col items-center justify-center px-12 py-3 bg-[#0a0a12] border border-white/20 rounded-full transition-all duration-300 overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_80px_rgba(0,0,0,0.6)]"
                    whileHover={{ 
                      scale: 1.02, 
                      borderColor: "rgba(231, 215, 182, 0.4)",
                      boxShadow: "0 0 20px rgba(231, 215, 182, 0.1)"
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E7D7B6]/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                    
                    <span className="font-cinzel text-xs text-[#E7D7B6] font-bold tracking-[0.2em] uppercase z-10 drop-shadow-md">
                      CHOOSE YOUR OMEN
                    </span>
                    <span className="text-[9px] text-white/30 tracking-widest uppercase mt-0.5 font-sans z-10 group-hover:text-white/50 transition-colors">
                      Draw a card to set today’s session
                    </span>
                  </motion.button>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};



// --- 主程序 ---
export default function DashboardView({ userData, onEnterCouncil }: DashboardViewProps) {
  const { chartData, loading, error } = useUserChart(userData);
  const [focusedCard, setFocusedCard] = useState<FocusedCard>(null);

  // Convert chart data to CardItem format
  const trinityCards = useMemo(() => {
    if (!chartData?.trinity) return [];
    
    return chartData.trinity.map((item: any, index: number) => {
      const slot = item.type.toLowerCase() as "sun" | "moon" | "rising";
      return {
        id: `trinity-${slot}`,
        kind: "trinity" as const,
        slot,
        sign: item.sign,
        title: item.title,
        inscription: item.desc,
        notes: item.notes,
        tags: slot === "sun" ? ["Identity", "Growth"] :
              slot === "moon" ? ["Home", "Emotion"] :
              ["Transformation", "New Beginnings"]
      };
    });
  }, [chartData?.trinity]);

  const planetCards = useMemo(() => {
    if (!chartData?.planets) return [];
    
    return chartData.planets.map((item: any, index: number) => {
      const planet = item.name.toLowerCase() as "mercury" | "venus" | "mars" | "jupiter" | "saturn";
      return {
        id: `planet-${planet}`,
        kind: "planet" as const,
        planet,
        sign: item.sign,
        title: item.behavior,
        inscription: `The ${item.behavior} in ${item.sign}`,
        notes: {
          meaning: `Your ${item.name.toLowerCase()} in ${item.sign} influences your communication and thought processes.`,
          practice: `Pay attention to how you express yourself today, especially in ${item.sign.toLowerCase()} related areas.`
        },
        today: item.transit ? {
          status: item.transit.type,
          guidance: item.transit.type === "BLESSED" ? "Energy flows easily here. A door opens." :
                   item.transit.type === "PRESSURE" ? "Growth demands friction. Stand firm." :
                   "Movement creates new paths."
        } : undefined,
        tags: planet === "mercury" ? ["Voice", "Communication"] :
              planet === "venus" ? ["Love", "Beauty"] :
              planet === "mars" ? ["Desire", "Action"] :
              planet === "jupiter" ? ["Growth", "Expansion"] :
              ["Discipline", "Structure"]
      };
    });
  }, [chartData?.planets]);

  // Handle card click
  const handleCardClick = (card: CardItem) => {
    setFocusedCard(card);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setFocusedCard(null);
  };

  return (
    <div className="relative w-full min-h-screen bg-black text-white flex flex-col items-center p-4 pb-48">
      <GlobalStyles />
      
      {/* 1. Space Environment */}
      <SpaceEnvironment />

      {/* 2. Page Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 text-center mb-8 mt-12"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
           <div className="h-px w-8 bg-gradient-to-r from-transparent to-white/50"></div>
           <h1 className="font-cinzel text-lg text-white tracking-[0.4em] uppercase drop-shadow-lg">Celestial Chart</h1>
           <div className="h-px w-8 bg-gradient-to-l from-transparent to-white/50"></div>
        </div>
        <p className="font-cormorant text-gray-400 italic">Looking up from {userData?.city || "Unknown Origin"}</p>
      </motion.header>

      {/* 3. 主要内容区 */}
      {error ? (
        <div className="text-red-400 font-cinzel text-center relative z-10">
            <p>STAR SYSTEM ERROR</p>
            <p className="text-xs mt-2 opacity-70">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 border border-white/20 hover:bg-white/10 text-xs uppercase">Reset</button>
        </div>
      ) : loading || !chartData ? (
        <div className="text-white/50 font-cinzel animate-pulse relative z-10">Calculating Star Chart...</div>
      ) : (
        <>
          {/* Big Three Cards */}
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative z-10">
            {trinityCards.map((card) => (
              <TrinityCard key={card.id} item={card} onClick={handleCardClick} />
            ))}
          </div>

          {/* Oracle Line */}
          <OracleLine omen={chartData.omen} />

          {/* Planet Cards */}
          <div className="w-full max-w-2xl space-y-4 relative z-10">
            <div className="text-center mb-6">
              <span className="font-cinzel text-[9px] text-white/30 tracking-[0.2em] uppercase">Planetary Alignments</span>
            </div>
            
            {planetCards.map((card) => (
              <PlanetRow key={card.id} item={card} onClick={handleCardClick} />
            ))}
          </div>
          
          {/* Focused Card Modal */}
          {focusedCard && (
            <RitualFocusModal 
              item={focusedCard} 
              onClose={handleCloseModal} 
              onEnterCouncil={onEnterCouncil} 
            />
          )}
          
          {/* Part B: Floating Primary CTA */}
          <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
             <a href="/ritual">
               <motion.button
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ 
                   opacity: 1, 
                   y: 0,
                   boxShadow: ["0 0 0px rgba(255,255,255,0)", "0 0 20px rgba(255,255,255,0.05)", "0 0 0px rgba(255,255,255,0)"]
                 }}
                 transition={{ 
                   opacity: { delay: 1, duration: 0.8 },
                   y: { delay: 1, duration: 0.8 },
                   boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                 }}
                 whileHover={{ 
                   scale: 1.02, 
                   borderColor: "rgba(231, 215, 182, 0.4)",
                   boxShadow: "0 0 20px rgba(231, 215, 182, 0.1)" // Champagne glow
                 }}
                 whileTap={{ scale: 0.98 }}
                 className="group relative flex flex-col items-center justify-center px-12 py-3 bg-[#0a0a12] border border-white/20 rounded-full transition-all duration-300 overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_80px_rgba(0,0,0,0.6)]"
               >
                 {/* Shine effect */}
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E7D7B6]/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                 
                 <span className="font-cinzel text-xs text-[#E7D7B6] font-bold tracking-[0.2em] uppercase z-10 drop-shadow-md">
                   CHOOSE YOUR OMEN
                 </span>
                 <span className="text-[9px] text-white/30 tracking-widest uppercase mt-0.5 font-sans z-10 group-hover:text-white/50 transition-colors">
                   Draw a card to set today’s session
                 </span>
               </motion.button>
             </a>
          </div>
        </>
      )}

    </div>
  );
}
