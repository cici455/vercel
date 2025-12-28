'use client';

import { useEffect, useState } from 'react';
import { useLuminaStore } from '@/store/luminaStore';
import { GlassPanel, GlassButton } from '@/components/ui/GlassPanel';
import { motion } from 'framer-motion';

export function SoloView() {
  const { setPhase, userData } = useLuminaStore();
  const [typedText, setTypedText] = useState('');
  const fullText = `Greetings, ${userData?.name || 'Traveler'}. I am The Strategist. I have analyzed your charts. The data suggests a path of high potential, yet you hesitate. We must optimize your trajectory.`;

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [fullText]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-2xl mx-auto space-y-8"
    >
      <GlassPanel className="border-amber-500/30 bg-amber-900/10 min-h-[200px] flex flex-col justify-center items-center text-center p-10">
        <h3 className="text-amber-400 text-sm tracking-[0.2em] mb-4 uppercase">The Strategist (Sun)</h3>
        <p className="text-lg md:text-xl font-light leading-relaxed text-white/90">
          "{typedText}"
        </p>
      </GlassPanel>

      <div className="flex justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
        >
          <GlassButton 
            onClick={() => setPhase('debate')}
            className="border-purple-500/30 hover:bg-purple-500/10 text-purple-200"
          >
            Summon The Council
          </GlassButton>
        </motion.div>
      </div>
    </motion.div>
  );
}
