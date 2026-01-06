import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sun, Moon, Sparkles, Orbit, Star, MessageCircle, 
  Heart, Swords, Shield, X 
} from 'lucide-react';
import { useUserChart } from '../hooks/useUserChart';
import { OmenOutput } from '../utils/narrativeGenerator';
import type { PlanetKey } from '../utils/planetArchetypes';

// --- Types ---
type CardConfig = {
  id: string;
  kind: "trinity" | "planet";
  slot?: "sun" | "moon" | "rising";     // 仅在 kind 为 "trinity" 时使用
  planet?: PlanetKey;                   // 仅在 kind 为 "planet" 时使用
  sign: string;
  degree?: number;
};

export type CardItem = {
  id: string;
  kind: "trinity" | "planet";
  slot?: "sun"|"moon"|"rising";
  planet?: "mercury"|"venus"|"mars"|"jupiter"|"saturn"|"uranus"|"neptune"|"pluto";
  sign: string;
  degree?: number;
  title: string;
  inscription: string;
  description?: string; // 新增：一行文案说明
  notes: {
    meaning: string;
    practice: string;
  };
  today?: {
    status?: "BLESSED"|"PRESSURE"|"ACTIVE";
    why?: string;
    guidance?: string;
  };
};
export interface AstrologyViewProps {
  userData: any;
  onEnterRitual: () => void;
  onBack: () => void;
}

// --- Helpers ---

const formatDegree = (deg: number | undefined | null) => {
  if (deg === undefined || deg === null || Number.isNaN(deg)) return '—';
  const norm = ((deg % 360) + 360) % 360;
  return `${norm.toFixed(1)}°`;
};

// --- Components ---

const TrinityCard = ({ item }: { item: CardItem }) => {
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
      className="bg-black/35 border border-white/10 backdrop-blur-md rounded-lg p-6 shadow-lg hover:border-white/30 transition-all"
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 text-[#E7D7B6] opacity-80">{getIcon()}</div>
        <h3 className="font-cinzel text-xl mb-1 text-white/90">{item.title}</h3>
        <p className="text-xs text-white/60 tracking-[0.2em] uppercase mb-3">{item.slot?.toUpperCase()}</p>
        <p className="font-cormorant text-white/75 text-sm">{item.inscription}</p>
      </div>
    </motion.div>
  );
};

const OracleLine = ({ omen }: { omen: OmenOutput }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.6, duration: 0.8 }}
    className="w-full max-w-2xl relative z-10 mb-12"
  >
    <div className="text-center">
      <span className="font-cinzel text-[9px] text-white/60 tracking-[0.2em] uppercase">TODAY'S OMEN</span>
    </div>
    <blockquote className="relative mt-4 px-8 text-center font-cormorant text-lg text-white/90 italic">
      "{omen.omen}"
    </blockquote>
  </motion.div>
);

const PlanetRow = ({ item }: { item: CardItem }) => {
  const getPlanetIcon = () => {
    switch (item.planet) {
      case 'mercury': return <MessageCircle size={18} strokeWidth={1.5} />;
      case 'venus': return <Heart size={18} strokeWidth={1.5} />;
      case 'mars': return <Swords size={18} strokeWidth={1.5} />;
      case 'jupiter': return <Orbit size={18} strokeWidth={1.5} />;
      case 'saturn': return <Shield size={18} strokeWidth={1.5} />;
      case 'uranus': return <Sparkles size={18} strokeWidth={1.5} />;
      case 'neptune': return <Orbit size={18} strokeWidth={1.5} />;
      case 'pluto': return <Star size={18} strokeWidth={1.5} />;
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
      className="bg-black/35 border border-white/10 backdrop-blur-md rounded-lg p-4 hover:border-white/30 transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 text-white/75">{getPlanetIcon()}</div>
          <div>
            <div className="font-cinzel text-sm text-white/90">{item.planet?.toUpperCase()}</div>
            <div className="text-[10px] text-white/60">{formatDegree(item.degree)} {item.sign}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {item.today?.status && (
            <div className={`flex items-center gap-1.5 text-xs ${getStatusColor()}`}>
              <span className="font-medium">{item.today.status}</span>
            </div>
          )}
          <div className="text-right">
            <div className="font-cinzel text-sm text-white/90">{item.title}</div>
          </div>
        </div>
      </div>
      {item.description && (
        <p className="mt-2 text-xs text-white/75">
          {item.description}
        </p>
      )}
    </motion.div>
  );
};

// --- Main Component ---
const AstrologyView: React.FC<AstrologyViewProps> = ({ userData, onEnterRitual, onBack }) => {
  const { chartData, narrativeProfile, tensionLabel, tensionLine, planetCopy, natalDisplayPositions, loading, error } = useUserChart(userData);

  const trinityCards = useMemo(() => {
    if (!chartData) return [];
    return chartData.trinity.map((card) => {
      let slot: "sun" | "moon" | "rising" = "sun";
      switch (card.type) {
        case "Sun": slot = "sun"; break;
        case "Moon": slot = "moon"; break;
        case "Rising": slot = "rising"; break;
      }
      
      // Use narrative profile titles if available
      let displayTitle = card.title;
      if (narrativeProfile) {
        switch (slot) {
          case "sun":
            displayTitle = narrativeProfile.primaryArchetype;
            break;
          case "moon":
            displayTitle = narrativeProfile.innerArchetype;
            break;
          case "rising":
            displayTitle = narrativeProfile.outerArchetype;
            break;
        }
      }
      
      return {
        id: `trinity-${slot}`,
        kind: "trinity" as const,
        slot: slot,
        sign: card.sign,
        title: displayTitle,
        inscription: card.desc,
        notes: card.notes || { meaning: "", practice: "" }
      };
    });
  }, [chartData, narrativeProfile]);
  const planetCards = useMemo(() => {
    if (!chartData?.planets) return [];
    return chartData.planets.map((planet, index) => {
      const planetKey = planet.name.toLowerCase();
      const copy = planetCopy?.[planetKey as keyof typeof planetCopy];
      const displayPos = natalDisplayPositions?.[planetKey as keyof typeof natalDisplayPositions];
      return {
        id: `planet-${index}`,
        kind: "planet" as const,
        planet: planetKey as any,
        sign: displayPos?.sign || planet.sign,
        degree: displayPos?.degree || 0,
        title: copy?.title || planet.behavior,
        description: copy?.line, // 新增：来自 PLANET_ARCHETYPES.baseLine
        line: copy?.line,
        inscription: planet.behavior,
        notes: { meaning: "", practice: "" },
        today: planet.transit ? {
          status: planet.transit.type,
          why: planet.transit.label,
          guidance: ""
        } : { status: undefined, why: "", guidance: "" }
      };
    });
  }, [chartData?.planets, planetCopy, natalDisplayPositions]);
  return (
    <div className="relative w-full min-h-screen bg-transparent text-white flex flex-col items-center p-4 pb-48">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 text-center mb-8 mt-12"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
           <div className="h-px w-8 bg-gradient-to-r from-transparent to-white/50"></div>
           <h1 className="font-cinzel text-lg text-white/90 tracking-[0.4em] uppercase drop-shadow-lg">Celestial Chart</h1>
           <div className="h-px w-8 bg-gradient-to-l from-transparent to-white/50"></div>
        </div>
        <p className="font-cormorant text-white/75 italic">Looking up from {userData?.city || "Unknown Origin"}</p>
      </motion.header>

      {error ? (
        <div className="text-red-400 font-cinzel text-center relative z-10">
            <p>STAR SYSTEM ERROR</p>
            <p className="text-xs mt-2 opacity-70">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 border border-white/20 hover:bg-white/10 text-xs uppercase">Reset</button>
        </div>
      ) : loading || !chartData ? (
        <div className="text-white/50 font-cinzel animate-pulse relative z-10">Calculating Star Chart...</div>      ) : (
        <>
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 relative z-10">
            {trinityCards.map((card) => (
              <TrinityCard key={card.id} item={card} />
            ))}
          </div>
          {/* 元素张力标签 & 解释 */}
          <div className="mt-6 text-xs tracking-[0.3em] text-white/60 uppercase text-center">
            {tensionLabel || 'ELEMENTAL TENSION'}
          </div>
          {tensionLine && (
            <p className="mt-2 text-[11px] text-white/75 text-center max-w-xl mx-auto">
              {tensionLine}
            </p>
          )}
          <OracleLine omen={chartData.omen} />

          <div className="w-full max-w-2xl space-y-2 relative z-10">
            <div className="text-center mb-6">
              <span className="font-cinzel text-[9px] text-white/60 tracking-[0.2em] uppercase">Planetary Alignments</span>
            </div>
            {planetCards.map((card) => (
              <PlanetRow key={card.id} item={card} />
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-12 relative z-50 flex gap-6"
          >
            <button
              onClick={onBack}
              className="bg-black/50 border border-white/30 text-white py-5 px-12 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-black/80 transition-all"
            >
              BACK TO HOME
            </button>
            <button
              onClick={onEnterRitual}
              className="bg-white text-black py-5 px-12 rounded-full text-sm font-bold tracking-widest uppercase hover:scale-105 transition-all"
            >
              ENTER THE RITUAL
            </button>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default AstrologyView;
