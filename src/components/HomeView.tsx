'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight,
  Landmark, Briefcase, Heart, Home, Activity,
  UsersRound, Compass, Globe, Sparkles, GraduationCap
} from 'lucide-react';

// Type definitions
type AccentColor = "gold" | "teal";

interface Domain {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  accent: AccentColor;
}

// Mock domain data
const DOMAINS: Domain[] = [
  {
    id: 'wealth',
    title: 'Wealth',
    subtitle: 'Fortune & Assets',
    icon: <Landmark size={24} />,
    accent: 'gold'
  },
  {
    id: 'career',
    title: 'Career',
    subtitle: 'Professional Growth',
    icon: <Briefcase size={24} />,
    accent: 'teal'
  },
  {
    id: 'emotion',
    title: 'Love',
    subtitle: 'Relationships',
    icon: <Heart size={24} />,
    accent: 'teal'
  },
  {
    id: 'family',
    title: 'Family',
    subtitle: 'Domestic Life',
    icon: <Home size={24} />,
    accent: 'gold'
  },
  {
    id: 'health',
    title: 'Health',
    subtitle: 'Wellbeing',
    icon: <Activity size={24} />,
    accent: 'teal'
  },
  {
    id: 'study',
    title: 'Study',
    subtitle: 'Learning & Growth',
    icon: <GraduationCap size={24} />,
    accent: 'gold'
  },
  {
    id: 'cooperation',
    title: 'Cooperation',
    subtitle: 'Teamwork & Partnerships',
    icon: <UsersRound size={24} />,
    accent: 'teal'
  },
  {
    id: 'decision',
    title: 'Decision',
    subtitle: 'Choices & Direction',
    icon: <Compass size={24} />,
    accent: 'gold'
  },
  {
    id: 'travel',
    title: 'Travel',
    subtitle: 'Adventure & Change',
    icon: <Globe size={24} />,
    accent: 'teal'
  },
  {
    id: 'spirituality',
    title: 'Spirituality',
    subtitle: 'Inner Growth',
    icon: <Sparkles size={24} />,
    accent: 'gold'
  }
];

interface HomeViewProps {
  onStart: () => void;
}

export default function HomeView({ onStart }: HomeViewProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const selectedDomain = DOMAINS[activeIndex];

  // Calculate visible cards: prev, active, next
  const prevIndex = (activeIndex - 1 + DOMAINS.length) % DOMAINS.length;
  const nextIndex = (activeIndex + 1) % DOMAINS.length;

  const visible = [
    { slot: "prev", item: DOMAINS[prevIndex], index: prevIndex },
    { slot: "active", item: DOMAINS[activeIndex], index: activeIndex },
    { slot: "next", item: DOMAINS[nextIndex], index: nextIndex },
  ];

  const handleNextDomain = () => setActiveIndex(nextIndex);
  const handlePrevDomain = () => setActiveIndex(prevIndex);
  const handleDomainClick = (index: number) => setActiveIndex(index);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center pt-20 pb-32">
        <div className="text-center mb-12 relative z-10">
          <h1 className="text-5xl md:text-7xl font-serif text-white tracking-tighter mb-4 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            LUMINA
          </h1>
          <p className="text-xs text-white/50 tracking-[0.75em] uppercase">
            SELECT YOUR DOMAIN
          </p>
        </div>
        
        {/* Carousel */}
        <div className="relative w-full max-w-4xl h-[400px] flex justify-center items-center z-10">
            {/* Background Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
              <motion.div 
                className="absolute w-[500px] h-[500px] border border-white/10 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, ease: "linear", repeat: Infinity }}
              />
              <motion.div 
                className="absolute w-[400px] h-[400px] border border-white/5 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 40, ease: "linear", repeat: Infinity }}
              />
            </div>

            <AnimatePresence mode="popLayout">
              {visible.map(({ slot, item, index }) => (
                <motion.div
                  key={`${slot}-${item.id}`}
                  className="absolute"
                  layout
                  initial={slot === "prev" ? { x: -300, opacity: 0, scale: 0.8 } : slot === "next" ? { x: 300, opacity: 0, scale: 0.8 } : { opacity: 0, scale: 0.9 }}
                  animate={{
                    x: slot === "prev" ? -260 : slot === "next" ? 260 : 0,
                    z: slot === "active" ? 100 : 0,
                    opacity: slot === "active" ? 1 : 0.4,
                    scale: slot === "active" ? 1.1 : 0.85,
                    rotateY: slot === "prev" ? 25 : slot === "next" ? -25 : 0,
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  onClick={() => handleDomainClick(index)}
                  style={{ zIndex: slot === "active" ? 10 : 5, transformStyle: 'preserve-3d' }}
                >
                  <div className={`
                    relative w-[240px] h-[340px] rounded-xl overflow-hidden cursor-pointer transition-all
                    ${slot === "active" ? 'border border-white/30 bg-black/60 shadow-[0_0_30px_rgba(255,255,255,0.1)]' : 'border border-white/10 bg-black/40 blur-[1px]'}
                  `}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-6">
                      <div className={`transition-all duration-500 ${slot === "active" ? 'text-white scale-110' : 'text-white/50'}`}>
                        {item.icon}
                      </div>
                      <div className="text-center">
                         <h3 className="font-serif text-2xl text-white mb-2">{item.title}</h3>
                         <p className="text-[10px] uppercase tracking-widest text-white/50">{item.subtitle}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex gap-8 mt-8 z-10">
           <button onClick={handlePrevDomain} className="p-4 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
             <ArrowLeft size={20} className="text-white/70" />
           </button>
           <button onClick={handleNextDomain} className="p-4 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
             <ArrowRight size={20} className="text-white/70" />
           </button>
        </div>

        {/* Start Button */}
        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.05 }}
          className="mt-12 px-12 py-4 bg-white text-black font-bold tracking-[0.2em] uppercase rounded-full hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all z-10"
        >
          BEGIN JOURNEY
        </motion.button>
    </div>
  );
}
