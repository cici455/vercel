'use client';

import { useState, useEffect } from 'react';
import { useLuminaStore } from '@/store/luminaStore';
import { GlassPanel, GlassButton, GlassInput } from '@/components/ui/GlassPanel';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, ArrowUp, Sparkles, Loader2 } from 'lucide-react';

const DateInput = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
  // Simple splitter for demo
  const [y, m, d] = value ? value.split('-') : ['', '', ''];
  
  const update = (type: 'y'|'m'|'d', val: string) => {
    const ny = type === 'y' ? val : y;
    const nm = type === 'm' ? val : m;
    const nd = type === 'd' ? val : d;
    onChange(`${ny}-${nm}-${nd}`);
  };

  // Calculate year range (120 years)
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 120;
  const maxYear = currentYear;

  return (
    <div className="group text-left">
      <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1 group-focus-within:text-teal-400 transition-colors">
        Date of Birth (MM / DD / YYYY)
      </label>
      <div className="flex gap-2 mt-1">
        <input 
          type="number" 
          inputMode="numeric"
          placeholder="MM" 
          min="1" 
          max="12" 
          step="1"
          value={m} 
          onChange={(e) => {
            const v = e.target.value;
            if (v === "") return update('m', "");
            const n = Number(v);
            if (!Number.isInteger(n) || n < 1 || n > 12) return;
            update('m', String(n).padStart(2, "0"));
          }}
          className="input-glass w-16 rounded p-3 text-center text-sm placeholder-gray-600" 
        />
        <span className="text-gray-500 py-3">/</span>
        <input 
          type="number"
          inputMode="numeric"
          placeholder="DD" 
          min="1" 
          max="31"
          step="1"
          value={d} 
          onChange={(e) => {
            const v = e.target.value;
            if (v === "") return update('d', "");
            const n = Number(v);
            if (!Number.isInteger(n) || n < 1 || n > 31) return;
            update('d', String(n).padStart(2, "0"));
          }}
          className="input-glass w-16 rounded p-3 text-center text-sm placeholder-gray-600" 
        />
        <span className="text-gray-500 py-3">/</span>
        <input 
          type="number"
          inputMode="numeric"
          placeholder="YYYY" 
          min={minYear} 
          max={maxYear}
          step="1"
          value={y} 
          onChange={(e) => {
            const v = e.target.value;
            if (v === "") return update('y', "");
            const n = Number(v);
            if (!Number.isInteger(n) || n < minYear || n > maxYear) return;
            update('y', String(n));
          }}
          className="input-glass flex-1 rounded p-3 text-center text-sm placeholder-gray-600" 
        />
      </div>
    </div>
  );
};

export function CalibrationView() {
  const { setUserData, setPhase } = useLuminaStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    birthTime: '',
    birthPlace: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 3000);
  };

  const finishCalibration = () => {
    setUserData({
      name: `${formData.firstName} ${formData.lastName}`,
      birthDate: formData.birthDate,
      birthTime: formData.birthTime,
      birthPlace: formData.birthPlace
    });
    setPhase('observatory');
  };

  return (
    <div className="w-full h-full flex items-center justify-center relative z-10">
      <AnimatePresence mode="wait">
        
        {step === 1 && (
          <motion.div 
            key="input"
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0, y:-50, filter:"blur(10px)"}} 
            transition={{duration: 0.5}} 
            className="w-full max-w-md z-10 relative"
          >
             <div className="absolute -top-32 -left-32 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none"></div>
  
             <div className="text-center mb-10">
                 <h2 className="font-display text-2xl font-bold tracking-[0.2em] text-white/90">CALIBRATION</h2>
                 <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest">Enter Celestial Coordinates</p>
             </div>
              
             <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-2xl space-y-6 backdrop-blur-xl text-left">
                 {/* First / Last Name */}
                 <div className="grid grid-cols-2 gap-4">
                     <div className="group">
                         <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1 group-focus-within:text-teal-400 transition-colors">First Name</label>
                         <input 
                           type="text" required 
                           value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})}
                           className="input-glass w-full rounded p-3 text-sm mt-1" 
                         />
                     </div>
                     <div className="group">
                         <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1 group-focus-within:text-teal-400 transition-colors">Last Name</label>
                         <input 
                           type="text" required 
                           value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})}
                           className="input-glass w-full rounded p-3 text-sm mt-1" 
                         />
                     </div>
                 </div>
                  
                 {/* Custom Date Input */}
                 <DateInput value={formData.birthDate} onChange={val => setFormData({...formData, birthDate: val})} />
  
                 {/* Time & City */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="group">
                         <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1 group-focus-within:text-teal-400 transition-colors">Time of Birth</label>
                         <input 
                           type="time" required 
                           value={formData.birthTime} onChange={e => setFormData({...formData, birthTime: e.target.value})}
                           className="input-glass w-full rounded p-3 text-sm mt-1 text-gray-400" 
                         />
                     </div>
                     <div className="group">
                         <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1 group-focus-within:text-teal-400 transition-colors">Place of Birth</label>
                         <input 
                           type="text" required placeholder="City"
                           value={formData.birthPlace} onChange={e => setFormData({...formData, birthPlace: e.target.value})}
                           className="input-glass w-full rounded p-3 text-sm mt-1 placeholder-gray-600" 
                         />
                     </div>
                 </div>
  
                 <button type="submit" className="glass-btn w-full py-4 mt-6 rounded-xl text-xs uppercase tracking-[0.2em] font-bold text-white shadow-lg">
                     Begin Simulation
                 </button>
             </form>
          </motion.div>
        )}

        {/* LOADING ANIMATION */}
        {step === 2 && loading && (
          <motion.div
            key="loading"
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} 
            className="text-center z-10"
          >
             <div className="w-24 h-24 border-t-2 border-white rounded-full animate-spin mx-auto mb-8 opacity-80"></div>
             <div className="font-display text-sm tracking-[0.3em] animate-pulse">ALIGNING STARS</div>
          </motion.div>
        )}

        {/* STEP 3: RESULT (Keeping existing logic but updating style slightly) */}
        {step === 3 && (
          <motion.div
             initial={{opacity:0}} animate={{opacity:1}} 
             className="w-full max-w-5xl h-screen overflow-hidden z-10 flex items-center justify-center p-6"
          >
             <div className="glass-panel p-12 rounded-3xl text-center border-t border-white/20">
                 <h2 className="font-display text-4xl font-bold mb-4 glow-gold">Sun in Leo</h2>
                 <p className="text-gray-400 mb-8 uppercase tracking-widest text-xs">Analysis Complete</p>
                 <button onClick={finishCalibration} className="glass-btn px-8 py-3 rounded-full text-xs uppercase font-bold tracking-widest">Enter Council</button>
             </div>
         </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
