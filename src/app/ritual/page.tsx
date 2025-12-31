'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    // In a real app, we would navigate to council page
    // router.push({ pathname: '/council', query: { payload: JSON.stringify(payload) } });
  };

  return (
    <div className="min-h-screen bg-black text-white font-serif relative overflow-hidden">
      {/* Background layers - Optimized performance */}
      <div className="absolute inset-0 z-0">
        {/* Deep blue vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black/90 backdrop-blur-[1px]"></div>
        
        {/* Simplified star field using CSS radial gradients */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(255,255,255,0.8) 1px, transparent 1px),
              radial-gradient(circle at 80% 70%, rgba(255,255,255,0.6) 1px, transparent 1px),
              radial-gradient(circle at 40% 60%, rgba(255,255,255,0.7) 1px, transparent 1px),
              radial-gradient(circle at 60% 20%, rgba(255,255,255,0.5) 1px, transparent 1px),
              radial-gradient(circle at 90% 40%, rgba(255,255,255,0.9) 1px, transparent 1px),
              radial-gradient(circle at 10% 80%, rgba(255,255,255,0.6) 1px, transparent 1px)
            `,
            backgroundSize: '200px 200px, 300px 300px, 250px 250px, 180px 180px, 220px 220px, 280px 280px'
          }}
        ></div>
        
        {/* Simplified star盘轮廓 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="w-full max-w-4xl h-full max-h-[600px] bg-gradient-to-br from-[rgba(231,215,182,0.03)] to-[rgba(120,255,230,0.02)] rounded-full"></div>
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
        
        {/* Main content area with carousel layout */}
        <div className="relative flex flex-col items-center justify-center min-h-[500px]">
          {/* 3-card carousel container */}
          <div className="relative w-full max-w-4xl flex justify-center items-center">
            {/* Background circle outline */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-96 h-96 border border-[rgba(231,215,182,0.15)] rounded-full"></div>
            </div>
            
            {/* Carousel cards */}
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
                    opacity: slot === "active" ? 1 : 0.6,
                    scale: slot === "active" ? 1 : 0.92,
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  whileHover={slot !== "active" ? { scale: 0.95, opacity: 0.75 } : { scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDomainClick(index)}
                  style={{
                    zIndex: slot === "active" ? 3 : slot === "prev" ? 2 : 1,
                  }}
                >
                  {/* Card container with appropriate styling based on slot */}
                  <div
                    className={`relative w-[320px] h-[400px] rounded-xl transition-all duration-400 ease-out cursor-pointer
                      ${slot === "active" ? 
                        'bg-white/5 backdrop-blur-md border border-[#E7D7B6]/30 shadow-[0_10px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]' : 
                        'bg-white/3 backdrop-blur-sm border border-white/10'}
                    `}
                  >
                    {/* Gradient mask for side cards */}
                    {slot === "prev" && (
                      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent pointer-events-none"></div>
                    )}
                    {slot === "next" && (
                      <div className="absolute inset-0 bg-gradient-to-l from-black/50 to-transparent pointer-events-none"></div>
                    )}
                    
                    {/* Card content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 gap-6">
                      {/* Domain icon */}
                      <div className={`text-[#E7D7B6] transition-all duration-400 ${slot === "active" ? 'text-2xl' : 'text-xl'}`}>
                        {item.icon}
                      </div>
                      
                      {/* Domain title */}
                      <div className="text-center">
                        <h3 className={`font-serif mb-2 transition-all duration-400 ${slot === "active" ? 'text-3xl text-white/98' : 'text-2xl text-white/70'}`}>
                          {item.title}
                        </h3>
                        <p className={`tracking-widest uppercase transition-all duration-400 ${slot === "active" ? 'text-xs text-[#E7D7B6]/85' : 'text-[10px] text-[#E7D7B6]/50'}`}>
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Domain navigation buttons */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl flex justify-between pointer-events-none">
            <motion.button
              onClick={handlePrevDomain}
              className="bg-white/2 backdrop-blur-md rounded-full border border-white/8 p-3 text-white/60 hover:bg-white/3 hover:border-white/15 hover:text-[#E7D7B6] transition-all pointer-events-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Previous domain"
            >
              <ArrowLeft size={20} />
            </motion.button>
            
            <motion.button
              onClick={handleNextDomain}
              className="bg-white/2 backdrop-blur-md rounded-full border border-white/8 p-3 text-white/60 hover:bg-white/3 hover:border-white/15 hover:text-[#E7D7B6] transition-all pointer-events-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Next domain"
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