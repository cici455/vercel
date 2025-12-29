import { useLuminaStore } from '@/store/luminaStore';
import { motion } from 'framer-motion';

export function IntroView() {
  const { setPhase } = useLuminaStore();

  return (
    <motion.div 
      className="h-screen w-full relative overflow-hidden flex flex-col items-center justify-center text-center z-10 px-6 bg-[#020205]"
    >
      {/* 1. The Background Layer (The Deep Void) - Complex Radial Gradients */}
      <div className="absolute inset-0 z-0 bg-[#020205] pointer-events-none" />
      
      {/* 2. Cleaned up Atmosphere - Just deep space */}
      
      {/* 2. The Hero Object: Luminous Planet (Not a Black Hole) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 1.5, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
      >
        {/* The Golden Core */}
        <div 
          className="w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, #FDB931 10%, #F5D76E 40%, #000000 100%)',
            boxShadow: '0 0 100px 20px rgba(253, 185, 49, 0.3)'
          }}
        />
        
        {/* Subtle Rotating Corona Ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-50px] rounded-full border border-white/10 border-dashed opacity-30"
        />
      </motion.div>

      {/* 3. The Typography (Liquid Gold) - Adjusted for Contrast */}
      <div className="relative z-20 flex flex-col items-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 2, ease: "easeOut" }}
          className="font-cinzel font-bold text-transparent text-[12vw] leading-none tracking-[0.1em] relative bg-clip-text bg-gradient-to-b from-white via-[#ffd700] to-[#b8860b] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
        >
          LUMINA
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 2.5 }}
          className="text-[#e0e0e0] text-sm md:text-lg tracking-[0.8em] uppercase font-cinzel font-medium mt-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        >
          The Architecture of Fate
        </motion.p>
      </div>

      {/* 6. The Interaction (The Entry) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3 }}
        className="absolute bottom-20 z-20"
      >
        <motion.button 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }} 
          onClick={() => setPhase('calibration')} 
          className="group relative px-8 py-4 text-xs font-medium tracking-[0.3em] uppercase text-[#F5E6C8] bg-transparent transition-all duration-700"
        >
          <span className="relative z-10">ENTER THE VOID</span>
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-[#F5E6C8]/30 group-hover:w-full transition-all duration-700 ease-out"></span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
