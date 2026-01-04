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
export interface DashboardViewProps {
  userData: any;
  onEnterCouncil: () => void;
  onBack: () => void;
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
      background-image: 
        radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 40px),
        radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 30px),
        radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 40px),
        radial-gradient(rgba(255,255,255,.4), rgba(255,255,255,.1) 2px, transparent 30px);
      background-size: 550px 550px, 350px 350px, 250px 250px, 150px 150px;
      background-position: 0 0, 40px 60px, 130px 270px, 70px 100px;
      background-repeat: repeat;
      animation: star-rotate linear infinite;
    }
    
    .planet-glow {
      box-shadow: 0 -40px 100px rgba(100, 180, 255, 0.15);
    }
  `}</style>
);

// --- 1. Big Three Card Component ---
const TrinityCard = ({ item, onClick }: { item: CardItem; onClick: (item: CardItem) => void }) => {
  const getIcon = () => {
    switch (item.slot) {
      case 'sun': return <Sun size={32} className="text-[#E7D7B6] opacity-80" strokeWidth={1} />;
      case 'moon': return <Moon size={32} className="text-white opacity-80" strokeWidth={1} />;
      case 'rising': return <Sparkles size={32} className="text-white opacity-80" strokeWidth={1} />;
      default: return <Star size={32} className="text-white opacity-80" strokeWidth={1} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-black/60 backdrop-blur-sm border border-white/15 rounded-lg p-6 shadow-lg hover:shadow-2xl hover:border-white/30 transition-all cursor-pointer"
      onClick={() => onClick(item)}
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 text-[#E7D7B6] opacity-80">
          {getIcon()}
        </div>
        <h3 className="font-cinzel text-xl mb-1 text-white">{item.title}</h3>
        <p className="text-xs text-white/40 tracking-[0.2em] uppercase mb-3">{item.slot?.toUpperCase()}</p>
        <p className="font-cormorant text-white/70 text-sm">{item.inscription}</p>
      </div>
    </motion.div>
  );
};

// --- 2. Oracle Line Component ---
const OracleLine = ({ omen }: { omen: OmenOutput }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      className="w-full max-w-2xl relative z-10 mb-12"
    >
      <div className="text-center">
        <span className="font-cinzel text-[9px] text-white/30 tracking-[0.2em] uppercase">TODAY'S OMEN</span>
      </div>
      <blockquote className="relative mt-4 px-8 text-center font-cormorant text-lg text-white/90 italic">
        "{omen.text}"
      </blockquote>
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

  const getStatusColor = () => {
    switch (item.today?.status) {
      case 'BLESSED': return 'text-yellow-400';
      case 'PRESSURE': return 'text-red-400';
      case 'ACTIVE': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.7, duration: 0.5 }}
      className="bg-black/50 backdrop-blur-sm border border-white/15 rounded-lg p-4 hover:border-white/30 hover:shadow-xl transition-all cursor-pointer"
      onClick={() => onClick(item)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 text-white/70">
            {getPlanetIcon()}
          </div>
          <div>
            <div className="font-cinzel text-sm text-white">{item.planet?.toUpperCase()}</div>
            <div className="text-[10px] text-white/40">{item.degree}° {item.sign}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {item.today?.status && (
            <div className={`flex items-center gap-1.5 text-xs ${getStatusColor()}`}>
              <span className="font-medium">{item.today.status}</span>
            </div>
          )}
          <div className="text-right">
            <div className="font-cinzel text-sm text-white">{item.title}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- 4. Ritual Focus Modal Component ---
const RitualFocusModal = ({ item, onClose, onEnterCouncil, onBack }: { item: CardItem; onClose: () => void; onEnterCouncil: () => void; onBack: () => void }) => {
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-black/90 border border-white/30 rounded-xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <div className="text-[#E7D7B6] opacity-90">
              {getIcon()}
            </div>
            <div>
              <h2 className="font-cinzel text-2xl text-white">{item.title}</h2>
              <p className="text-xs text-white/40 tracking-[0.2em] uppercase">{item.slot?.toUpperCase() || item.planet?.toUpperCase()}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div>
            <h3 className="font-cinzel text-sm text-white/60 mb-2">YOUR INSIGHT</h3>
            <p className="font-cormorant text-white/80">{item.inscription}</p>
          </div>

          <div className="border-t border-white/10 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-cinzel text-sm text-white/60 mb-2">MEANING</h3>
                <p className="font-cormorant text-white/80 text-sm">{item.notes.meaning}</p>
              </div>
              <div>
                <h3 className="font-cinzel text-sm text-white/60 mb-2">PRACTICE</h3>
                <p className="font-cormorant text-white/80 text-sm">{item.notes.practice}</p>
              </div>
            </div>
          </div>

          {item.today && (
            <div className="border-t border-white/10 pt-6">
              <h3 className="font-cinzel text-sm text-white/60 mb-2">TODAY</h3>
              <div className="bg-black/50 border border-white/15 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                  <div className="text-sm font-medium text-yellow-400">{item.today.status}</div>
                </div>
                {item.today.why && <p className="text-white/70 mb-3 text-sm">{item.today.why}</p>}
                {item.today.guidance && <p className="text-white/60 text-sm italic">{item.today.guidance}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
          <button 
            onClick={onEnterCouncil}
            className="bg-white text-black py-3 px-6 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-white/90 transition-colors"
          >
            ENTER COUNCIL
          </button>
          <div className="flex gap-4">
            <button onClick={onBack} className="text-white/60 hover:text-white text-sm font-cinzel">
              BACK TO FORM
            </button>
            <button onClick={onClose} className="text-white/60 hover:text-white text-sm font-cinzel">
              CLOSE
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Main Dashboard Component ---
const DashboardView: React.FC<DashboardViewProps> = ({ userData, onEnterCouncil }) => {
  // --- Data Fetching ---
  const { chartData, loading, error } = useUserChart(userData);
  
  // --- State ---
  const [focusedCard, setFocusedCard] = useState<FocusedCard>(null);

  // --- Generate Cards from Chart Data ---
  const trinityCards = useMemo(() => {
    if (!chartData) return [];
    
    return [
      {
        id: "trinity-sun",
        kind: "trinity" as const,
        slot: "sun" as const,
        sign: chartData.sunSign,
        title: chartData.sunCard.title,
        inscription: chartData.sunCard.subtitle,
        notes: chartData.sunCard.notes
      },
      {
        id: "trinity-moon",
        kind: "trinity" as const,
        slot: "moon" as const,
        sign: chartData.moonSign,
        title: chartData.moonCard.title,
        inscription: chartData.moonCard.subtitle,
        notes: chartData.moonCard.notes
      },
      {
        id: "trinity-rising",
        kind: "trinity" as const,
        slot: "rising" as const,
        sign: chartData.risingSign,
        title: chartData.risingCard.title,
        inscription: chartData.risingCard.subtitle,
        notes: chartData.risingCard.notes
      }
    ];
  }, [chartData]);

  // Generate Planet Cards
  const planetCards = useMemo(() => {
    if (!chartData?.planets) return [];
    
    return chartData.planets.map((planet, index) => ({
      id: `planet-${index}`,
      kind: "planet" as const,
      planet: planet.name.toLowerCase() as any,
      sign: planet.sign,
      degree: Math.round(planet.longitude),
      title: planet.epithet,
      inscription: planet.interpretation,
      notes: {
        meaning: planet.notes.meaning,
        practice: planet.notes.practice
      },
      today: {
        status: planet.today.status,
        why: planet.today.why,
        guidance: planet.today.guidance
      }
    }));
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
    <div className="relative w-full min-h-screen bg-transparent text-white flex flex-col items-center p-4 pb-48">
      <GlobalStyles />
      
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
              onBack={onBack}
            />
          )}
          
          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-12 relative z-10 flex gap-6"
          >
            <button
              onClick={onBack}
              className="bg-black/50 border border-white/30 text-white py-5 px-12 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-black/80 transition-all"
            >
              BACK TO FORM
            </button>
            <button
              onClick={onEnterCouncil}
              className="bg-white text-black py-5 px-12 rounded-full text-sm font-bold tracking-widest uppercase hover:scale-105 transition-all"
            >
              ENTER THE COUNCIL
            </button>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default DashboardView;
