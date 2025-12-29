import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Sun, Moon, ArrowUpCircle, 
  Flame, Droplets, Wind, Mountain,
  AlertTriangle, Clock, CloudFog, CloudLightning, Sun as SunIcon,
  Orbit
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- HoloCard Component (The Divine HUD Container) ---
function HoloCard({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={cn(
        "relative bg-[#0A0A0F]/90 backdrop-blur-md overflow-hidden",
        "border-t border-white/20 border-b border-white/5", // Top-Light Style
        // Corner Brackets (L-Shapes)
        "before:absolute before:top-0 before:left-0 before:w-2 before:h-2 before:border-t-2 before:border-l-2 before:border-white/40 before:content-['']",
        "after:absolute after:bottom-0 after:right-0 after:w-2 after:h-2 before:border-b-2 before:border-r-2 before:border-white/40 after:content-['']",
        className
      )}
    >
      {/* Subtle Scanline Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />
      
      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
}

// --- Mock Data Generator ---
const SIGNS = [
  { name: 'Aries', element: 'Fire', trait: 'Bold' },
  { name: 'Taurus', element: 'Earth', trait: 'Stable' },
  { name: 'Gemini', element: 'Air', trait: 'Witty' },
  { name: 'Cancer', element: 'Water', trait: 'Nurturing' },
  { name: 'Leo', element: 'Fire', trait: 'Royal' },
  { name: 'Virgo', element: 'Earth', trait: 'Analytical' },
  { name: 'Libra', element: 'Air', trait: 'Diplomatic' },
  { name: 'Scorpio', element: 'Water', trait: 'Intense' },
  { name: 'Sagittarius', element: 'Fire', trait: 'Adventurous' },
  { name: 'Capricorn', element: 'Earth', trait: 'Strategic' },
  { name: 'Aquarius', element: 'Air', trait: 'Innovative' },
  { name: 'Pisces', element: 'Water', trait: 'Dreamy' },
];

function getRandomSign(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % SIGNS.length;
  return SIGNS[index];
}

function generateElements() {
  const elements = ['Fire', 'Earth', 'Air', 'Water'];
  const missingIdx = Math.floor(Math.random() * 4);
  const values = [0, 0, 0, 0];
  values[missingIdx] = Math.floor(Math.random() * 10) + 5; 
  
  let remaining = 100 - values[missingIdx];
  for (let i = 0; i < 4; i++) {
    if (i === missingIdx) continue;
    if (i === 3 || (missingIdx === 3 && i === 2)) {
      values[i] = remaining; 
    } else {
      const share = Math.floor(Math.random() * (remaining - 20)) + 10;
      values[i] = share;
      remaining -= share;
    }
  }
  
  return {
    Fire: values[0],
    Earth: values[1],
    Air: values[2],
    Water: values[3]
  };
}

export default function DashboardView({ userData, onEnterCouncil }: { userData: any, onEnterCouncil: () => void }) {
  const audit = useMemo(() => {
    const sun = getRandomSign(userData.firstName || 'Sun');
    const moon = getRandomSign(userData.lastName || 'Moon');
    const rising = getRandomSign(userData.city || 'Rising');

    const elements = generateElements();
    const missingElement = Object.entries(elements).find(([_, val]) => val < 15)?.[0];

    const forecasts = [
      { status: 'Stormy', event: 'Mars Square Pluto', advisory: 'Avoid conflicts.' },
      { status: 'Foggy', event: 'Mercury Retrograde', advisory: 'Check contracts twice.' },
      { status: 'Clear', event: 'Sun Trine Jupiter', advisory: 'Launch new projects.' },
    ];
    const forecast = forecasts[Math.floor(Math.random() * forecasts.length)];

    return { sun, moon, rising, elements, missingElement, forecast };
  }, [userData]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative z-30 w-full max-w-6xl px-4 py-8 flex flex-col gap-8 h-full justify-center"
    >
      {/* Header */}
      <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-2">
        <div>
          <h2 className="text-4xl text-white font-serif tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>
            The Astral Audit
          </h2>
          <div className="flex items-center gap-2 mt-2">
             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
             <p className="text-white/40 text-xs uppercase tracking-[0.2em] font-mono">
               Subject: {userData.firstName} {userData.lastName} // ID-Verified
             </p>
          </div>
        </div>
        <div className="text-right hidden md:block">
           <div className="text-xs text-white/30 uppercase tracking-widest mb-1">System Status</div>
           <div className="text-sm text-white/70 font-mono">ONLINE // V.2.0.4</div>
        </div>
      </div>

      {/* Main Grid: Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[450px]">
        
        {/* Left Column (2/3): The Trinity */}
        <div className="lg:col-span-2 grid grid-cols-3 gap-4 h-full">
          {[
            { label: 'Sun', sub: 'The Ego', icon: Sun, data: audit.sun, color: 'text-amber-400' },
            { label: 'Moon', sub: 'The Soul', icon: Moon, data: audit.moon, color: 'text-indigo-400' },
            { label: 'Rising', sub: 'The Mask', icon: ArrowUpCircle, data: audit.rising, color: 'text-emerald-400' },
          ].map((item, i) => (
            <HoloCard key={item.label} delay={0.2 + i * 0.1} className="group hover:border-white/40 transition-colors">
              <div className="flex flex-col h-full items-center justify-between py-8">
                {/* Top Icon */}
                <div className="relative">
                  <div className={cn("transition-all duration-700 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]", item.color)}>
                    <item.icon strokeWidth={1} size={80} />
                  </div>
                </div>
                
                {/* Bottom Text */}
                <div className="text-center w-full border-t border-white/5 pt-6 mt-4 bg-gradient-to-t from-white/5 to-transparent">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">{item.sub}</div>
                  <div className="text-3xl text-white font-serif mb-1" style={{ fontFamily: "'Cinzel', serif" }}>{item.data.name}</div>
                  <div className="text-xs text-white/60 font-mono uppercase tracking-widest text-[10px]">{item.data.trait} Archetype</div>
                </div>
              </div>
            </HoloCard>
          ))}
        </div>

        {/* Right Column (1/3): Stacked Modules */}
        <div className="flex flex-col gap-4 h-full">
          
          {/* Top: Elemental Radar (Dot Matrix) */}
          <HoloCard delay={0.5} className="flex-1 p-6 flex flex-col justify-center">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs text-white/50 uppercase tracking-widest font-mono flex items-center gap-2">
                <Orbit size={12} /> Elements
              </h3>
              {audit.missingElement && (
                <div className="text-[10px] font-bold tracking-wider text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)] animate-pulse flex items-center gap-1">
                  <AlertTriangle size={10} />
                  LOW {audit.missingElement.toUpperCase()}
                </div>
              )}
            </div>

            <div className="space-y-5">
               {[
                  { label: 'Fire', val: audit.elements.Fire, icon: Flame, color: 'text-orange-500' },
                  { label: 'Earth', val: audit.elements.Earth, icon: Mountain, color: 'text-emerald-500' },
                  { label: 'Air', val: audit.elements.Air, icon: Wind, color: 'text-sky-500' },
                  { label: 'Water', val: audit.elements.Water, icon: Droplets, color: 'text-blue-500' },
               ].map((el) => (
                 <div key={el.label} className="flex items-center gap-3">
                   <div className={cn("w-6 flex justify-center", el.color)}><el.icon size={14} /></div>
                   {/* Dot Matrix Bar */}
                   <div className="flex-1 flex gap-1">
                     {Array.from({ length: 10 }).map((_, i) => (
                       <div 
                         key={i} 
                         className={cn(
                           "h-2 w-full rounded-[1px]",
                           i < Math.floor(el.val / 10) 
                             ? cn(el.color.replace('text-', 'bg-'), "shadow-[0_0_4px_currentColor]") 
                             : "bg-white/5"
                         )}
                       />
                     ))}
                   </div>
                   <div className="w-8 text-right text-xs font-mono text-white/80" style={{ fontFamily: 'var(--font-space)' }}>
                     {el.val}%
                   </div>
                 </div>
               ))}
            </div>
          </HoloCard>

          {/* Bottom: Daily Forecast */}
          <HoloCard delay={0.6} className="flex-1 p-6 relative">
            {/* Background Watermark Planet */}
            <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none text-white">
              <Orbit size={160} strokeWidth={0.5} />
            </div>

            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                 <span className="text-[10px] uppercase tracking-widest text-white/50 font-mono">Cosmic Weather</span>
                 <div className="flex items-center gap-2 px-2 py-1 rounded bg-white/5 border border-white/10">
                   <Clock size={10} className="text-white/60" />
                   <span className="text-[10px] font-mono text-white/80">Mars Hour</span>
                 </div>
              </div>
              
              <div className="mt-4">
                <div className={cn(
                  "text-2xl font-serif mb-2",
                  audit.forecast.status === 'Stormy' ? 'text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]' : 
                  audit.forecast.status === 'Foggy' ? 'text-gray-300' : 'text-amber-200'
                )}>
                  {audit.forecast.status.toUpperCase()}
                </div>
                <div className="text-sm text-white font-medium mb-1 tracking-wide">{audit.forecast.event}</div>
                <div className="text-xs text-white/50 font-mono border-l-2 border-white/20 pl-3 py-1">
                  &quot;{audit.forecast.advisory}&quot;
                </div>
              </div>
            </div>
          </HoloCard>
        </div>
      </div>

      {/* Footer Action */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="flex justify-center mt-2"
      >
        <button 
          onClick={onEnterCouncil}
          className="group relative px-10 py-4 bg-white text-black text-xs font-bold uppercase tracking-[0.25em] hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] clip-path-polygon-[10%_0,100%_0,100%_70%,90%_100%,0_100%,0_30%]"
          style={{ clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)" }}
        >
          Enter The Council
        </button>
      </motion.div>
    </motion.div>
  );
}
