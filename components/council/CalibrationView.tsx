'use client';

import { useState, useEffect } from 'react';
import { useLuminaStore } from '@/store/luminaStore';
import { GlassPanel, GlassButton, GlassInput } from '@/components/ui/GlassPanel';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, ArrowUp, Sparkles, Loader2 } from 'lucide-react';

const Astrolabe = () => (
  <div className="relative w-48 h-48 mx-auto opacity-80">
    <div className="absolute inset-0 border-2 border-starlight/30 rounded-full animate-[spin_10s_linear_infinite]" />
    <div className="absolute inset-4 border border-starlight/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
    <div className="absolute inset-8 border border-starlight/10 rounded-full animate-[spin_20s_linear_infinite]" />
    <div className="absolute inset-0 flex items-center justify-center">
      <Sparkles className="w-8 h-8 text-starlight animate-pulse" />
    </div>
  </div>
);

export function CalibrationView() {
  const { setUserData, setPhase } = useLuminaStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: ''
  });

  const nextStep = () => {
    if (step === 2) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(3);
      }, 3000); // Simulate calculation
    } else {
      setStep(step + 1);
    }
  };

  const finishCalibration = () => {
    setUserData(formData);
    setPhase('observatory');
  };

  return (
    <div className="w-full max-w-2xl mx-auto min-h-[60vh] flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        
        {/* STEP 1: NAME */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            className="text-center w-full"
          >
            <h2 className="text-3xl font-cinzel text-starlight mb-8 animate-pulse-glow">
              Who Seeks The Council?
            </h2>
            <div className="relative group max-w-md mx-auto">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="ENTER YOUR NAME"
                className="w-full bg-transparent text-center text-4xl font-cinzel text-white border-b-2 border-white/20 focus:border-starlight/80 focus:outline-none py-4 placeholder:text-white/10 transition-all"
                autoFocus
              />
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-starlight/50 to-transparent scale-x-0 group-focus-within:scale-x-100 transition-transform duration-700" />
            </div>
            
            {formData.name && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12"
              >
                <GlassButton onClick={nextStep} className="px-12 py-3 text-lg font-cinzel tracking-widest">
                  Begin Ritual
                </GlassButton>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* STEP 2: DATA */}
        {step === 2 && !loading && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md"
          >
            <GlassPanel className="p-8 space-y-8">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-cinzel text-white/90">Temporal Coordinates</h3>
                <p className="text-xs text-white/40 tracking-[0.2em] uppercase">Align your timeline</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-starlight/70 pl-1">Date of Origin</label>
                  <GlassInput 
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                    className="font-inter tracking-wider text-center"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-starlight/70 pl-1">Time</label>
                    <GlassInput 
                      type="time"
                      value={formData.birthTime}
                      onChange={(e) => setFormData({...formData, birthTime: e.target.value})}
                      className="font-inter tracking-wider text-center"
                    />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] uppercase tracking-widest text-starlight/70 pl-1">Place</label>
                    <GlassInput 
                      value={formData.birthPlace}
                      onChange={(e) => setFormData({...formData, birthPlace: e.target.value})}
                      placeholder="City"
                      className="font-inter tracking-wider text-center"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <GlassButton 
                  onClick={nextStep}
                  disabled={!formData.birthDate || !formData.birthTime}
                  className="w-full"
                >
                  Calibrate
                </GlassButton>
              </div>
            </GlassPanel>
          </motion.div>
        )}

        {/* LOADING ANIMATION */}
        {step === 2 && loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-8"
          >
            <Astrolabe />
            <p className="text-starlight/80 font-cinzel tracking-[0.2em] animate-pulse">
              CALCULATING ASTRAL ALIGNMENT...
            </p>
          </motion.div>
        )}

        {/* STEP 3: RESULT */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-lg text-center space-y-12"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-cinzel text-starlight">Alignment Complete</h2>
              <p className="text-white/50 font-inter text-sm">The Council awaits, {formData.name}.</p>
            </div>

            {/* Trinity Display */}
            <div className="grid grid-cols-3 gap-8">
              <div className="flex flex-col items-center gap-3 group">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-starlight/50 transition-colors">
                  <Sun className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-widest text-white/40">Sun</p>
                  <p className="font-cinzel text-lg">Leo</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 group mt-8">
                 <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-starlight/50 transition-colors">
                  <ArrowUp className="w-8 h-8 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-widest text-white/40">Rising</p>
                  <p className="font-cinzel text-lg">Scorpio</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 group">
                 <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-starlight/50 transition-colors">
                  <Moon className="w-8 h-8 text-blue-200 drop-shadow-[0_0_10px_rgba(191,219,254,0.5)]" />
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-widest text-white/40">Moon</p>
                  <p className="font-cinzel text-lg">Pisces</p>
                </div>
              </div>
            </div>

            {/* Soul Oath */}
            <div className="relative py-8 px-12">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-transparent to-starlight/50" />
              <p className="font-cinzel text-xl leading-relaxed italic text-white/80">
                "By the light of the void and the dust of stars, I accept my burden and my glory."
              </p>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-t from-transparent to-starlight/50" />
            </div>

            <GlassButton onClick={finishCalibration} className="px-16 py-4 text-lg font-cinzel border-starlight/30 text-starlight hover:bg-starlight/10">
              Enter The Observatory
            </GlassButton>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
