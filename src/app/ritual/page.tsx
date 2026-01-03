'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight,
  Landmark, Briefcase, Heart, Home, Activity, BookOpen,
  UsersRound, Compass, Globe, Sparkles, GraduationCap
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Type definitions
type AccentColor = "gold" | "teal";

interface Domain {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  accent: AccentColor;
}

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

// Main Ritual Chamber component - 3-card Carousel
export default function RitualChamberPage() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [intention, setIntention] = useState('');

  const selectedDomain = DOMAINS[activeIndex];

  // Calculate visible cards: prev, active, next
  const prevIndex = (activeIndex - 1 + DOMAINS.length) % DOMAINS.length;
  const nextIndex = (activeIndex + 1) % DOMAINS.length;

  const visible = [
    { slot: "prev", item: DOMAINS[prevIndex], index: prevIndex },
    { slot: "active", item: DOMAINS[activeIndex], index: activeIndex },
    { slot: "next", item: DOMAINS[nextIndex], index: nextIndex },
  ];

  // Handle next domain
  const handleNextDomain = () => {
    setActiveIndex(nextIndex);
  };

  // Handle previous domain
  const handlePrevDomain = () => {
    setActiveIndex(prevIndex);
  };

  // Handle domain click
  const handleDomainClick = (index: number) => {
    setActiveIndex(index);
  };

  // Handle begin session
  const handleBeginSession = () => {
    const payload = {
      domainId: selectedDomain.id,
      domainTitle: selectedDomain.title,
      customIntentText: intention.trim()
    };

    console.log('Session payload:', payload);
    // Navigate to council page with payload
    const encodedPayload = encodeURIComponent(JSON.stringify(payload));
    router.push(`/council?payload=${encodedPayload}`);
  };

  return (
    <div className="min-h-screen bg-black text-white font-serif relative overflow-hidden">
      {/* Background layers - Frame Awards style */}
      <div className="absolute inset-0 z-0">
        {/* Deep black background */}
        <div className="absolute inset-0 bg-black"></div>
        
        {/* Enhanced spotlight effect */}
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-[rgba(255,255,255,0.2)] to-transparent opacity-70 blur-3xl"></div>
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-[400px] h-[400px] bg-white opacity-15 blur-3xl rounded-full"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        
        {/* Subtle particles */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(255,255,255,0.9) 1px, transparent 1px),
              radial-gradient(circle at 80% 70%, rgba(255,255,255,0.7) 1px, transparent 1px),
              radial-gradient(circle at 40% 60%, rgba(255,255,255,0.8) 1px, transparent 1px)
            `,
            backgroundSize: '200px 200px, 300px 300px, 250px 250px'
          }}
        ></div>
      </div>
      
      <header className="relative z-10 flex justify-between items-center p-6">
        <Link 
          href="/" 
          className="text-xs text-white/60 hover:text-white transition-colors flex items-center gap-1"
        >
          <ArrowLeft size={14} />
          <span>Back to Chart</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <div className="h-px w-12 bg-white/15"></div>
          <h1 className="text-sm font-serif text-white/70 tracking-widest">RITUAL CHAMBER</h1>
          <div className="h-px w-12 bg-white/15"></div>
        </div>
        
        <div className="w-8"></div>
      </header>
      
      <main className="relative z-10 container mx-auto px-4 py-12 min-h-[calc(100vh-80px)]">
        {/* Top title - Frame Awards style */}
        <div className="text-center mb-24">
          <h2 className="text-6xl md:text-8xl font-serif mb-6 text-white tracking-tight">
            <span className="text-7xl md:text-9xl italic font-light" style={{ 
              fontFamily: 'serif', 
              fontStyle: 'italic',
              fontWeight: '300',
              letterSpacing: '0.05em'
            }}>Select</span>
            <br />
            <span className="font-bold" style={{ 
              letterSpacing: '-0.02em',
              fontWeight: '700'
            }}>EXPLORATION DOMAIN</span>
          </h2>
          <p className="text-xs text-white/50 tracking-[0.5em] uppercase">THE INFINITE ASTRAL SELECTION WHEEL</p>
        </div>
        
        {/* Main content area with carousel layout */}
        <div className="relative flex flex-col items-center justify-center min-h-[500px]">
          {/* 3-card carousel container */}
          <div className="relative w-full max-w-4xl flex justify-center items-center">
            {/* Background circle outline */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-96 h-96 border border-[rgba(231,215,182,0.15)] rounded-full"></div>
            </div>
            
            {/* Carousel cards - Frame Awards modern style */}
            <AnimatePresence mode="wait">
              {visible.map(({ slot, item, index }) => (
                <motion.div
                  key={`${slot}-${item.id}`}
                  className="absolute"
                  layout
                  initial={slot === "prev" ? { x: -300, opacity: 0, scale: 0.88 } : slot === "next" ? { x: 300, opacity: 0, scale: 0.88 } : { opacity: 0, scale: 0.98 }}
                  animate={{
                    x: slot === "prev" ? -300 : slot === "next" ? 300 : 0,
                    y: slot === "active" ? -10 : 0,
                    opacity: slot === "active" ? 1 : 0.5,
                    scale: slot === "active" ? 1 : 0.92,
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  whileHover={slot !== "active" ? { scale: 0.95, opacity: 0.7 } : { scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDomainClick(index)}
                  style={{
                    zIndex: slot === "active" ? 3 : slot === "prev" ? 2 : 1,
                  }}
                >
                  {/* Modern card container */}
                  <div
                    className={`relative w-[320px] h-[400px] rounded-lg transition-all duration-400 ease-out cursor-pointer overflow-hidden shadow-lg
                      ${slot === "active" ? 
                        'bg-black/80 backdrop-blur-sm border border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.8)]' : 
                        'bg-black/60 backdrop-blur-sm border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.6)]'}
                    `}
                  >
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-30"></div>
                    
                    {/* Gradient mask for side cards */}
                    {slot === "prev" && (
                      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent pointer-events-none"></div>
                    )}
                    {slot === "next" && (
                      <div className="absolute inset-0 bg-gradient-to-l from-black/50 to-transparent pointer-events-none"></div>
                    )}
                    
                    {/* Card content - Minimalist Frame Awards style */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 gap-8">
                      {/* Domain icon */}
                      <div className={`text-white transition-all duration-400 ${slot === "active" ? 'text-5xl opacity-100' : 'text-4xl opacity-80'}`}>
                        {item.icon}
                      </div>
                      
                      {/* Domain title */}
                      <div className="text-center">
                        <h3 className={`font-serif mb-3 transition-all duration-400 ${slot === "active" ? 'text-4xl text-white opacity-100' : 'text-3xl text-white/90'}`} style={{ letterSpacing: '-0.02em' }}>
                          {item.title}
                        </h3>
                        <p className={`tracking-[0.3em] uppercase transition-all duration-400 ${slot === "active" ? 'text-xs text-white/70' : 'text-[10px] text-white/50'}`}>
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Domain navigation buttons - Frame Awards style */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl flex justify-between pointer-events-none">
            <motion.button
              onClick={handlePrevDomain}
              className="relative bg-black/40 backdrop-blur-md rounded-full border border-white/30 p-3 text-white/90 transition-all pointer-events-auto overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Previous domain"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              <div className="absolute inset-0 border border-white/0 group-hover:border-white/40 rounded-full transition-all duration-300"></div>
              {/* Icon */}
              <ArrowLeft size={20} className="relative z-10" />
            </motion.button>
            
            <motion.button
              onClick={handleNextDomain}
              className="relative bg-black/40 backdrop-blur-md rounded-full border border-white/30 p-3 text-white/90 transition-all pointer-events-auto overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Next domain"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              <div className="absolute inset-0 border border-white/0 group-hover:border-white/40 rounded-full transition-all duration-300"></div>
              {/* Icon */}
              <ArrowRight size={20} className="relative z-10" />
            </motion.button>
          </div>
          
          {/* Custom intention input - Frame Awards style */}
          <div className="relative z-10 mt-16 w-full max-w-md">
            {/* Input container */}
            <div className="relative">
              <input
                type="text"
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder="What do you want to ask? e.g., How can I improve my career luck?"
                maxLength={200}
                className="w-full h-14 bg-white/5 backdrop-blur-sm border border-white/15 rounded-lg px-6 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
              />
              
              {/* Character count */}
              <div className="absolute top-3 right-3 text-[10px] text-white/30 font-mono">
                {intention.length}/200
              </div>
            </div>
          </div>
          
          {/* Bottom Selector Bar - Frame Awards minimalist style */}
          <div className="relative z-10 mt-16 w-full max-w-md">
            <div className="flex flex-col gap-6">
              {/* Input and domain info */}
              <div className="flex items-center justify-between bg-white/5 backdrop-blur-sm rounded-full border border-white/15 p-2">
                {/* Current domain icon */}
                <div className="p-3 rounded-full bg-white/10 border border-white/20">
                  <div className="text-white">
                    {selectedDomain.icon}
                  </div>
                </div>
                
                {/* Current domain name */}
                <div className="text-center flex-1 mx-4">
                  <div className="text-sm text-white font-medium">{selectedDomain.title}</div>
                </div>
              </div>
              
              {/* Confirm button - Frame Awards style */}
              <motion.button
                onClick={handleBeginSession}
                className="w-full bg-white text-black py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: '0 5px 20px rgba(255,255,255,0.3)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                BEGIN RITUAL
              </motion.button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}