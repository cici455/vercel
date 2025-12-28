'use client';

import { useLuminaStore } from '@/store/luminaStore';
import { motion } from 'framer-motion';
import { Sparkles, Activity, Globe, Archive } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';

export function ObservatoryView() {
  const { userData, setPhase } = useLuminaStore();

  const handleSummon = () => {
    setPhase('debate');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full h-screen flex flex-col items-center justify-center"
    >
      {/* Archives Button (Top Right) */}
      <div className="absolute top-8 right-8 z-50">
        <button 
          onClick={() => setPhase('archive')}
          className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-starlight/30 transition-all"
        >
          <Archive className="w-4 h-4 text-white/50 group-hover:text-starlight transition-colors" />
          <span className="text-[10px] uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">Star Map</span>
        </button>
      </div>

      {/* Daily Transit / Energy Weather */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-full max-w-4xl flex justify-between px-8 pointer-events-none">
        <GlassPanel className="pointer-events-auto flex items-center gap-4 px-6 py-3">
          <Activity className="w-5 h-5 text-starlight" />
          <div className="text-left">
             <p className="text-[10px] uppercase tracking-widest text-white/40">Cosmic Weather</p>
             <p className="font-cinzel text-sm text-white/90">Mercury Retrograde</p>
          </div>
        </GlassPanel>

        <GlassPanel className="pointer-events-auto flex items-center gap-4 px-6 py-3">
          <Globe className="w-5 h-5 text-nebula-400" />
           <div className="text-left">
             <p className="text-[10px] uppercase tracking-widest text-white/40">Global Energy</p>
             <p className="font-cinzel text-sm text-white/90">Volatile</p>
          </div>
        </GlassPanel>
      </div>

      {/* Main Summon Button */}
      <div className="relative group cursor-pointer" onClick={handleSummon}>
        {/* Rotating Rings */}
        <div className="absolute inset-[-50%] border border-white/5 rounded-full animate-[spin_30s_linear_infinite]" />
        <div className="absolute inset-[-30%] border border-starlight/10 rounded-full animate-[spin_20s_linear_infinite_reverse]" />
        
        {/* Button Core */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-64 h-64 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)] group-hover:border-starlight/50 group-hover:shadow-[0_0_100px_rgba(212,175,55,0.2)] transition-all duration-500"
        >
          <div className="absolute inset-2 rounded-full border border-white/5" />
          
          <div className="flex flex-col items-center gap-2">
            <Sparkles className="w-12 h-12 text-starlight/80 group-hover:text-starlight group-hover:animate-pulse transition-colors" />
            <span className="font-cinzel text-2xl tracking-[0.2em] text-white/80 group-hover:text-white transition-colors">
              SUMMON
            </span>
            <span className="text-[10px] uppercase tracking-widest text-white/30 group-hover:text-starlight/50 transition-colors">
              The Council
            </span>
          </div>
        </motion.div>
      </div>

      {/* Greeting */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
        className="absolute bottom-24 text-center"
      >
        <p className="text-white/40 font-cinzel tracking-widest text-sm">
          WELCOME TO THE OBSERVATORY, {userData.name || 'TRAVELER'}
        </p>
      </motion.div>

    </motion.div>
  );
}
