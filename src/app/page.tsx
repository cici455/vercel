'use client';

import { useLuminaStore } from '@/store/luminaStore';
import StarField from '@/components/canvas/StarField';
import { IntroView } from '@/components/council/IntroView';
import { ObservatoryView } from '@/components/council/ObservatoryView';
import { CalibrationView } from '@/components/council/CalibrationView';
import { SoloView } from '@/components/council/SoloView';
import { DebateView } from '@/components/council/DebateView';
import { ArchiveView } from '@/components/archive/ArchiveView';
import AmbientSound from '@/components/ui/AmbientSound';
import { AnimatePresence, motion } from 'framer-motion';

export default function Home() {
  const { phase } = useLuminaStore();

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden p-4">
      {/* Background Layer */}
      <StarField />
      <AmbientSound />
      
      {/* Content Layer */}
      <div className="z-10 w-full max-w-5xl">
        {/* Header - Only show if NOT in intro phase */}
        {phase !== 'intro' && phase !== 'observatory' && phase !== 'archive' && (
          <motion.header 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-8 left-0 w-full text-center pointer-events-none"
          >
            <h1 className="text-4xl font-light tracking-[0.5em] text-white/20 uppercase font-[family-name:var(--font-cinzel)]">Lumina</h1>
          </motion.header>
        )}

        <AnimatePresence mode="wait">
          {phase === 'intro' && (
             <motion.div
               key="intro"
               className="w-full"
             >
               <IntroView />
             </motion.div>
          )}

          {phase === 'calibration' && (
            <motion.div
              key="calibration"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <CalibrationView />
            </motion.div>
          )}

          {phase === 'observatory' && (
            <motion.div
              key="observatory"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <ObservatoryView />
            </motion.div>
          )}

          {phase === 'solo' && (
            <motion.div
              key="solo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <SoloView />
            </motion.div>
          )}

          {phase === 'debate' && (
            <motion.div
              key="debate"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <DebateView />
            </motion.div>
          )}

          {phase === 'archive' && (
            <motion.div
              key="archive"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full"
            >
              <ArchiveView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Footer / Status */}
      {phase !== 'observatory' && phase !== 'archive' && (
        <footer className="absolute bottom-8 text-center text-[10px] text-white/20 tracking-[0.3em] uppercase">
          Archetypal Life Simulator v0.1
        </footer>
      )}
    </main>
  );
}
