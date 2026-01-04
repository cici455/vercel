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
import CosmicButton from '@/components/CosmicButton';

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
    accent: 'teal'
  },
  {
    id: 'health',
    title: 'Health',
    subtitle: 'Physical Wellness',
    icon: <Activity size={24} />,
    accent: 'teal'
  },
  {
    id: 'knowledge',
    title: 'Knowledge',
    subtitle: 'Learning & Wisdom',
    icon: <BookOpen size={24} />,
    accent: 'teal'
  },
  {
    id: 'social',
    title: 'Social',
    subtitle: 'Network & Connections',
    icon: <UsersRound size={24} />,
    accent: 'teal'
  },
  {
    id: 'travel',
    title: 'Travel',
    subtitle: 'Movement & Changes',
    icon: <Compass size={24} />,
    accent: 'teal'
  },
  {
    id: 'world',
    title: 'World',
    subtitle: 'Global Affairs',
    icon: <Globe size={24} />,
    accent: 'teal'
  },
  {
    id: 'spirit',
    title: 'Spirit',
    subtitle: 'Inner Growth',
    icon: <Sparkles size={24} />,
    accent: 'teal'
  },
  {
    id: 'career2',
    title: 'Career',
    subtitle: 'Public Image',
    icon: <GraduationCap size={24} />,
    accent: 'teal'
  }
];

// Carousel state
const VISIBLE_DOMAINS = 3;
const TOTAL_DOMAINS = DOMAINS.length;

export default function RitualPage() {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(Math.floor(TOTAL_DOMAINS / 2));
  const [intention, setIntention] = useState('');
  
  const handlePrevDomain = () => {
    setSelectedIndex((prev) => (prev - 1 + TOTAL_DOMAINS) % TOTAL_DOMAINS);
  };
  
  const handleNextDomain = () => {
    setSelectedIndex((prev) => (prev + 1) % TOTAL_DOMAINS);
  };
  
  const handleDomainClick = (index: number) => {
    setSelectedIndex(index);
  };
  
  const handleBeginSession = () => {
    console.log('Beginning ritual with:', {
      domain: DOMAINS[selectedIndex],
      intention: intention || 'No intention set'
    });
    // router.push('/reading');
  };
  
  // Get visible domains for carousel
  const getVisibleDomains = () => {
    const visible = [];
    for (let i = -1; i <= 1; i++) {
      const index = (selectedIndex + i + TOTAL_DOMAINS) % TOTAL_DOMAINS;
      const slot = i === 0 ? 'active' : i < 0 ? 'prev' : 'next';
      visible.push({ slot, item: DOMAINS[index], index });
    }
    return visible;
  };
  
  const selectedDomain = DOMAINS[selectedIndex];
  const visible = getVisibleDomains();
  
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%270 0 400 400%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noiseFilter%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noiseFilter)%27 opacity=%270.03%27/%3E%3C/svg%3E')] opacity-50" />
      
      <main className="relative z-10 w-full h-full flex flex-col">
        {/* Top navigation */}
        <div className="flex items-center justify-between w-full px-8 pt-8">
          <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm uppercase tracking-widest">Back</span>
          </Link>
          
          <div className="text-center">
            <div className="text-xs uppercase tracking-[0.3em] text-white/40 mb-1">The Ritual</div>
            <div className="text-lg font-serif text-white">{selectedDomain.title}</div>
          </div>
          
          <div className="w-24" /> {/* Spacer for centering */}
        </div>
        
        {/* Central Carousel */}
        <div className="flex-1 flex items-center justify-center w-full">
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
                    className={`relative w-[280px] h-[340px] rounded-lg transition-all duration-400 ease-out cursor-pointer overflow-hidden shadow-lg
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
                    
                    {/* Card content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 gap-6">
                      {/* Domain icon */}
                      <div className={`text-white transition-all duration-400 ${slot === "active" ? 'text-4xl opacity-100' : 'text-3xl opacity-80'}`}>
                        {item.icon}
                      </div>
                      
                      {/* Domain title */}
                      <div className="text-center">
                        <h3 className={`font-serif mb-2 transition-all duration-400 ${slot === "active" ? 'text-3xl text-white opacity-100' : 'text-2xl text-white/90'}`} style={{ letterSpacing: '-0.02em' }}>
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
          
          {/* Domain navigation buttons */}
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
        </div>
        
        {/* Custom intention input */}
        <div className="relative z-20 mt-28 w-full max-w-lg mx-auto">
          <div className="relative flex items-center w-full">
            <input
              type="text"
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder="What do you want to ask? e.g., How can I improve my career luck?"
              maxLength={200}
              className="w-full h-14 bg-white/05 border border-white/20 rounded-lg px-6 py-3 text-white placeholder-gray-400 focus:outline-none focus:bg-white/10 focus:border-white/40 focus:ring-1 focus:ring-white/30 transition-all shadow-sm"
            />
            
            {/* Character count */}
            <div className="absolute right-6 text-xs text-white/60 font-mono">
              {intention.length}/200
            </div>
          </div>
        </div>
        
        {/* Bottom Selector Bar */}
        <div className="relative z-20 mt-16 w-full max-w-md mx-auto mb-12">
          <div className="flex flex-col gap-6">
            {/* Input and domain info */}
            <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-full border border-white/30 p-3">
              {/* Current domain icon */}
              <div className="p-4 rounded-full bg-white/20 border border-white/30">
                <div className="text-white text-lg">
                  {selectedDomain.icon}
                </div>
              </div>
              
              {/* Current domain name */}
              <div className="text-center flex-1 mx-4">
                <div className="text-base text-white font-medium">{selectedDomain.title}</div>
              </div>
            </div>
            
            {/* Confirm button */}
            <CosmicButton onClick={handleBeginSession}>
              BEGIN RITUAL
            </CosmicButton>
          </div>
        </div>
      </main>
    </div>
  );
}
