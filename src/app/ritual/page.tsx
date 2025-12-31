'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { 
  ArrowLeft, ArrowRight, 
  Landmark, Briefcase, Heart, Home, Activity, BookOpen, 
  UsersRound, Compass, Globe, Sparkles, GraduationCap 
} from 'lucide-react';
import Link from 'next/link';

// Type definitions
type AccentColor = "gold" | "teal";

interface Domain {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  accent: AccentColor;
}

// Star component for background - Optimized for performance
const BackgroundStar = () => {
  // Use useEffect to ensure random values are only generated on client
  const [starProps, setStarProps] = useState<{
    size: number;
    opacity: number;
    animationDuration: number;
    animationDelay: number;
    left: number;
    top: number;
  } | null>(null);
  
  const [xOffset, setXOffset] = useState<number | null>(null);
  
  useEffect(() => {
    // Generate random values only on client side
    setStarProps({
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.2 + 0.05,
      animationDuration: Math.random() * 60 + 30,
      animationDelay: Math.random() * 15,
      left: Math.random() * 100,
      top: Math.random() * 100
    });
    
    setXOffset(Math.random() * 15 - 7.5);
  }, []);
  
  // Don't render anything during SSR or hydration
  if (starProps === null || xOffset === null) {
    return null;
  }
  
  return (
    <motion.div
      className="absolute bg-white rounded-full"
      style={{
        width: `${starProps.size}px`,
        height: `${starProps.size}px`,
        left: `${starProps.left}%`,
        top: `${starProps.top}%`,
        opacity: starProps.opacity,
        pointerEvents: 'none'
      }}
      animate={{
        y: [0, -30],
        x: [0, xOffset],
        opacity: [starProps.opacity, starProps.opacity * 0.4, starProps.opacity]
      }}
      transition={{
        duration: starProps.animationDuration,
        delay: starProps.animationDelay,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
};

// Mock domain data with English content
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

// Main Ritual Chamber component - Domain Selection Wheel
export default function RitualChamber() {
  const [selectedDomainIndex, setSelectedDomainIndex] = useState(0);
  const [intention, setIntention] = useState('');
  
  const selectedDomain = DOMAINS[selectedDomainIndex];
  
  // Animation for center card float - Optimized
  const floatY = useMotionValue(0);
  const floatX = useMotionValue(0);
  
  useEffect(() => {
    // Float animation
    const floatAnimation = () => {
      floatY.set(0);
      floatX.set(0);
      
      // Small float animation
      setTimeout(() => {
        floatY.set(-10);
        floatX.set(2);
      }, 500);
    };
    
    floatAnimation();
    const interval = setInterval(floatAnimation, 5000);
    return () => clearInterval(interval);
  }, [selectedDomainIndex, floatY, floatX]);
  
  // Handle next domain
  const handleNextDomain = () => {
    setSelectedDomainIndex((prev) => (prev + 1) % DOMAINS.length);
  };
  
  // Handle previous domain
  const handlePrevDomain = () => {
    setSelectedDomainIndex((prev) => (prev - 1 + DOMAINS.length) % DOMAINS.length);
  };
  
  // Handle domain click
  const handleDomainClick = (index: number) => {
    setSelectedDomainIndex(index);
  };
  
  // Handle begin session
  const handleBeginSession = () => {
    const payload = {
      domainId: selectedDomain.id,
      domainTitle: selectedDomain.title,
      customIntentText: intention.trim()
    };
    
    console.log('Session payload:', payload);
    // In a real app, we would navigate to council page
    // router.push({ pathname: '/council', query: { payload: JSON.stringify(payload) } });
  };
  
  // Generate surrounding positions for domain cards
  const getSurroundingPosition = (index: number, total: number) => {
    const positions = [
      { top: '30%', left: '15%', scale: 0.92, opacity: 0.45 },  // Top left
      { top: '25%', left: '75%', scale: 0.92, opacity: 0.45 },  // Top right
      { top: '65%', left: '10%', scale: 0.92, opacity: 0.45 },  // Bottom left
      { top: '65%', left: '85%', scale: 0.92, opacity: 0.45 },  // Bottom right
      { top: '50%', left: '5%', scale: 0.92, opacity: 0.45 },   // Left center
      { top: '50%', left: '85%', scale: 0.92, opacity: 0.45 },  // Right center
      { top: '75%', left: '30%', scale: 0.92, opacity: 0.45 },  // Bottom center left
      { top: '75%', left: '65%', scale: 0.92, opacity: 0.45 }   // Bottom center right
    ];
    
    return positions[index % positions.length];
  };
  
  return (
    <div className="min-h-screen bg-black text-white font-serif relative overflow-hidden">
      {/* Background layers - Optimized performance */}
      <div className="absolute inset-0 z-0">
        {/* Deep blue vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black/90 backdrop-blur-[1px]"></div>
        
        {/* Star field layer 1 - closer */}
        <div className="absolute inset-0">
          {/* Further optimized star count */}
          {[...Array(60)].map((_, i) => <BackgroundStar key={`star-close-${i}`} />)}
        </div>
        
        {/* Star field layer 2 - farther */}
        <div className="absolute inset-0 opacity-50 blur-[1px]">
          {/* Further optimized star count */}
          {[...Array(40)].map((_, i) => <BackgroundStar key={`star-far-${i}`} />)}
        </div>
        
        {/* Mist gradient behind center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full max-w-4xl h-full max-h-[600px] bg-gradient-to-br from-[rgba(231,215,182,0.03)] to-[rgba(120,255,230,0.02)] rounded-full blur-[120px] opacity-70"></div>
        </div>
      </div>
      
      <header className="relative z-10 flex justify-between items-center p-6 border-b border-[rgba(231,215,182,0.06)]">
        <div className="flex items-center gap-2">
          <div className="h-px w-12 bg-[rgba(231,215,182,0.15)]"></div>
          <h1 className="text-sm font-serif text-[#E7D7B6] tracking-widest">RITUAL CHAMBER</h1>
          <div className="h-px w-12 bg-[rgba(231,215,182,0.15)]"></div>
        </div>
        
        <Link 
          href="/" 
          className="text-xs text-white/60 hover:text-[#E7D7B6] transition-colors flex items-center gap-1"
        >
          <ArrowLeft size={14} />
          <span>Back to Chart</span>
        </Link>
      </header>
      
      <main className="relative z-10 container mx-auto px-4 py-8 min-h-[calc(100vh-80px)]">
        {/* Top title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif mb-3 text-white/98">Select Exploration Domain</h2>
          <p className="text-xs text-[#E7D7B6]/70 tracking-[0.25em] uppercase">THE INFINITE ASTRAL SELECTION WHEEL</p>
        </div>
        
        {/* Main content area with wheel layout */}
        <div className="relative flex flex-col items-center justify-center min-h-[500px]">
          {/* Surrounding domain cards */}
          <AnimatePresence>
            {DOMAINS.map((domain, index) => {
              if (index === selectedDomainIndex) return null;
              
              const position = getSurroundingPosition(index, DOMAINS.length);
              const isNearby = Math.abs(index - selectedDomainIndex) === 1 || Math.abs(index - selectedDomainIndex) === DOMAINS.length - 1;
              const opacity = isNearby ? 0.75 : 0.45;
              const scale = isNearby ? 0.95 : 0.92;
              
              return (
                <motion.div
                  key={domain.id}
                  className="absolute"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: opacity,
                    scale: scale,
                    top: position.top,
                    left: position.left
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  whileHover={{ scale: 1.05, opacity: 0.85 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDomainClick(index)}
                >
                  <motion.div
                    className={`relative w-[104px] h-[104px] bg-white/3 border border-white/8 backdrop-blur-md rounded-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:border-white/20 hover:bg-white/4`}
                    layoutId={`domain-${domain.id}`}
                  >
                    <div className="text-[#E7D7B6]">
                      {domain.icon}
                    </div>
                    <div className="text-xs text-white/80 tracking-wider">{domain.title}</div>
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {/* Center focus card */}
          <motion.div
            className="relative z-10"
            animate={{
              y: floatY,
              x: floatX
            }}
            transition={{ duration: 3, ease: "easeInOut" }}
          >
            {/* Faint halo behind card */}
            <motion.div
              className="absolute inset-0 rounded-xl blur-[60px]"
              style={{
                background: 'radial-gradient(circle, rgba(231,215,182,0.14) 0%, transparent 70%)'
              }}
              animate={{
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Main card */}
            <motion.div
              className={`relative w-[320px] h-[400px] bg-gradient-to-b from-white/6 via-white/3 to-transparent backdrop-blur-lg rounded-xl border border-[rgba(231,215,182,0.22)] ring-1 ring-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_90px_rgba(0,0,0,0.65)]`}
              layoutId={`domain-${selectedDomain.id}`}
              initial={{ scale: 0.8, opacity: 0, rotateY: 180 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Corner sheen */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent opacity-0.06 transform rotate-[12deg] translate-x-[50%] -translate-y-[50%]"></div>
              
              {/* Card content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 gap-6">
                {/* Domain icon */}
                <div className="text-[#E7D7B6]">
                  {selectedDomain.icon}
                </div>
                
                {/* Domain title */}
                <div className="text-center">
                  <h3 className="text-3xl font-serif text-white/98 mb-2">{selectedDomain.title}</h3>
                  <p className="text-xs text-[#E7D7B6]/85 tracking-widest uppercase">{selectedDomain.subtitle}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Domain navigation buttons */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl flex justify-between pointer-events-none">
            <motion.button
              onClick={handlePrevDomain}
              className="bg-white/2 backdrop-blur-md rounded-full border border-white/8 p-3 text-white/60 hover:bg-white/3 hover:border-white/15 hover:text-[#E7D7B6] transition-all pointer-events-auto shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={20} />
            </motion.button>
            
            <motion.button
              onClick={handleNextDomain}
              className="bg-white/2 backdrop-blur-md rounded-full border border-white/8 p-3 text-white/60 hover:bg-white/3 hover:border-white/15 hover:text-[#E7D7B6] transition-all pointer-events-auto shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowRight size={20} />
            </motion.button>
          </div>
          
          {/* Custom intention input */}
          <div className="relative z-10 mt-12 w-full max-w-md">
            {/* Thin divider line */}
            <div className="h-px w-full bg-[rgba(231,215,182,0.12)] mb-6"></div>
            
            {/* Input container */}
            <div className="relative">
              <input
                type="text"
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder="What do you want to ask? e.g., How can I improve my career luck?"
                maxLength={200}
                className="w-full h-12 bg-white/4 border border-white/10 backdrop-blur-md rounded-lg px-5 py-2 text-white placeholder-white/35 focus:outline-none focus:border-[rgba(231,215,182,0.22)] focus:ring-1 focus:ring-white/10 transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
              />
              
              {/* Character count */}
              <div className="absolute top-2 right-3 text-[10px] text-white/25 font-mono">
                {intention.length}/200
              </div>
            </div>
          </div>
          
          {/* Bottom Selector Bar */}
          <div className="relative z-10 mt-8 w-full max-w-md">
            <div className="flex items-center justify-between bg-white/2 backdrop-blur-md rounded-full border border-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] p-1">
              {/* Current domain icon */}
              <div className="p-2 rounded-full bg-white/3 border border-[rgba(231,215,182,0.15)]">
                <div className="text-[#E7D7B6]">
                  {selectedDomain.icon}
                </div>
              </div>
              
              {/* Current domain name */}
              <div className="text-center flex-1 mx-4">
                <div className="text-sm text-white/95 font-medium">{selectedDomain.title}</div>
              </div>
              
              {/* Confirm button */}
              <motion.button
                onClick={handleBeginSession}
                className="bg-white/2 backdrop-blur-sm border border-[rgba(120,255,230,0.22)] text-[#78ffe6] px-5 py-2 rounded-full text-xs font-medium tracking-wider flex items-center gap-1.5 hover:bg-white/3 hover:shadow-[0_0_20px_rgba(120,255,230,0.12)] transition-all"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>BEGIN RITUAL</span>
                <ArrowRight size={12} />
              </motion.button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}