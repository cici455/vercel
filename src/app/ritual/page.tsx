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
    <div className="min-h-screen w-full bg-black text-white font-serif relative pt-20">
      {/* Hide scrollbar */}
      <style jsx global>{`
        ::-webkit-scrollbar {
          display: none;
        }
        * {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      {/* Dynamic flowing background animation */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Deep black background */}
        <div className="absolute inset-0 bg-black pointer-events-none"></div>
        
        {/* Animated white flowing orbs using framer-motion */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/25 rounded-full blur-3xl pointer-events-none"
          animate={{
            x: [0, 80, 20, -60, 0],
            y: [0, -30, 40, -10, 0],
            scale: [1, 1.1, 0.98, 1.05, 1]
          }}
          transition={{
            duration: 20,
            ease: "easeInOut",
            repeat: Infinity
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/3 w-[500px] h-[500px] bg-white/18 rounded-full blur-3xl pointer-events-none"
          animate={{
            x: [0, -100, -40, 80, 0],
            y: [0, 50, -20, 30, 0],
            scale: [1, 1.08, 0.95, 1.02, 1]
          }}
          transition={{
            duration: 30,
            ease: "easeInOut",
            repeat: Infinity,
            delay: 2
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-80 h-80 bg-white/22 rounded-full blur-3xl pointer-events-none"
          animate={{
            x: [0, 100, 30, -80, 0],
            y: [0, -40, 25, -20, 0],
            scale: [1, 1.15, 0.92, 1.08, 1]
          }}
          transition={{
            duration: 25,
            ease: "easeInOut",
            repeat: Infinity,
            delay: 4
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-64 h-64 bg-white/15 rounded-full blur-3xl pointer-events-none"
          animate={{
            x: [0, -60, 50, -30, 0],
            y: [0, 40, -30, 10, 0],
            scale: [1, 1.05, 0.97, 1.1, 1]
          }}
          transition={{
            duration: 18,
            ease: "easeInOut",
            repeat: Infinity,
            delay: 1
          }}
        />
      </div>
      
      {/* Main content - relative positioning to take up space */}
      <div className="relative z-10">
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
        
        <main className="relative z-10 container mx-auto px-4 py-12 pb-40">
          {/* Top title - Smaller size */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif mb-4 text-white tracking-tight">
              <span className="text-4xl md:text-6xl italic font-light" style={{ 
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
          <div className="relative flex flex-col items-center pb-12">
          {/* 3-card carousel container */}
          <div className="relative w-full max-w-4xl flex justify-center items-center">
            {/* Background circle outline */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-96 h-96 border border-[rgba(231,215,182,0.15)] rounded-full"></div>
              {/* Rotating ring animation */}
              <motion.div 
                className="absolute w-96 h-96 border-2 border-[rgba(231,215,182,0.1)] rounded-full"
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 20, 
                  ease: "linear", 
                  repeat: Infinity 
                }}
              />
              {/* Inner rotating ring */}
              <motion.div 
                className="absolute w-80 h-80 border border-[rgba(231,215,182,0.05)] rounded-full"
                animate={{ rotate: -360 }}
                transition={{ 
                  duration: 25, 
                  ease: "linear", 
                  repeat: Infinity 
                }}
              />
            </div>
            
            {/* Carousel cards */}
            <AnimatePresence mode="popLayout">
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
                  transition={{ 
                    duration: 0.6, 
                    ease: "easeOut",
                    type: "spring",
                    damping: 15,
                    stiffness: 100
                  }}
                  whileHover={slot !== "active" ? { scale: 0.95, opacity: 0.7 } : { scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDomainClick(index)}
                  style={{
                    zIndex: slot === "active" ? 3 : slot === "prev" ? 2 : 1,
                  }}
                >
                  {/* Modern card container with 3D effect */}
                  <motion.div
                    className={`relative w-[240px] sm:w-[280px] h-[300px] sm:h-[340px] rounded-lg transition-all duration-400 ease-out cursor-pointer overflow-hidden shadow-lg
                      ${slot === "active" ? 
                        'bg-black/80 backdrop-blur-sm border border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.8)]' : 
                        'bg-black/60 backdrop-blur-sm border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.6)]'}
                    `}
                    animate={{
                      rotateY: slot === "active" ? 0 : slot === "prev" ? 10 : -10,
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
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
                      {/* Domain icon with pulse animation */}
                      <motion.div 
                        className={`text-white transition-all duration-400 ${slot === "active" ? 'text-4xl opacity-100' : 'text-3xl opacity-80'}`}
                        animate={{
                          scale: slot === "active" ? [1, 1.1, 1] : 1
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      >
                        {item.icon}
                      </motion.div>
                      
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
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Wheel navigation controls */}
          <div className="relative w-full max-w-5xl flex justify-between mt-12">
            <motion.button
              onClick={handlePrevDomain}
              className="relative bg-black/40 backdrop-blur-md rounded-full border border-white/30 p-3 text-white/90 transition-all overflow-hidden group"
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
            
            {/* Wheel spinner indicator */}
            <div className="flex items-center justify-center">
              <motion.div 
                className="w-12 h-12 rounded-full border-2 border-white/20 border-t-white flex items-center justify-center"
                animate={{
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 1,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              >
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </motion.div>
            </div>
            
            <motion.button
              onClick={handleNextDomain}
              className="relative bg-black/40 backdrop-blur-md rounded-full border border-white/30 p-3 text-white/90 transition-all overflow-hidden group"
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
          
          {/* Custom intention input */}
          <div className="relative z-20 mt-28 w-full max-w-lg">
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
          <div className="relative z-20 mt-16 w-full max-w-md mb-12">
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
              <motion.button
                onClick={handleBeginSession}
                className="w-full bg-white text-black py-5 rounded-full text-sm font-bold tracking-widest uppercase transition-all"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 8px 30px rgba(255,255,255,0.4)'
                }}
                whileTap={{ scale: 0.97 }}
              >
                BEGIN RITUAL
              </motion.button>
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}