'use client';

import { useLuminaStore } from '@/store/luminaStore';
import { GlassButton } from '@/components/ui/GlassPanel';
import { motion } from 'framer-motion';

export function IntroView() {
  const { setPhase } = useLuminaStore();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-12"
    >
      <div className="space-y-4">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-light tracking-[0.2em] text-white text-glow-strong uppercase font-[family-name:var(--font-cinzel)]"
        >
          Lumina
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-sm md:text-base text-white/60 tracking-[0.5em] uppercase"
        >
          Archetypal Life Simulator
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        <GlassButton 
          onClick={() => setPhase('calibration')}
          className="px-12 py-4 text-lg border-white/20 hover:bg-white/10 hover:border-white/40 transition-all duration-500"
        >
          Enter The Void
        </GlassButton>
      </motion.div>
    </motion.div>
  );
}
