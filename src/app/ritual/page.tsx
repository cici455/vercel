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
      {/* Background layers - LUMINA Event Horizon style */}
      <div className="absolute inset-0 z-0">
        {/* Deep black background */}
        <div className="absolute inset-0 bg-black"></div>
        
        {/* Subtle starfield */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(255,255,255,0.9) 1px, transparent 1px),
              radial-gradient(circle at 80% 70%, rgba(255,255,255,0.7) 1px, transparent 1px),
              radial-gradient(circle at 40% 60%, rgba(255,255,255,0.8) 1px, transparent 1px),
              radial-gradient(circle at 60% 20%, rgba(255,255,255,0.6) 1px, transparent 1px),
              radial-gradient(circle at 90% 40%, rgba(255,255,255,1) 1px, transparent 1px),
              radial-gradient(circle at 10% 80%, rgba(255,255,255,0.7) 1px, transparent 1px)
            `,
            backgroundSize: '200px 200px, 300px 300px, 250px 250px, 180px 180px, 220px 220px, 280px 280px'
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
        
        <div className="w-48"></div>
        
        <div className="w-8"></div>
      </header>
      
      <main className="relative z-10 container mx-auto px-4 py-12 min-h-[calc(100vh-80px)] flex flex-col items-center justify-center">
        {/* Main title - LUMINA Event Horizon */}
        <div className="text-center mb-24">
          <h1 className="text-7xl md:text-9xl font-serif text-white tracking-tighter mb-4">
            LUMINA
          </h1>
          <p className="text-sm text-white/50 tracking-[0.75em] uppercase">THE EVENT HORIZON</p>
        </div>
        
        {/* Enter the Void button */}
        <motion.button
          onClick={() => handleBeginSession()}
          className="bg-transparent border-2 border-white/30 text-white/90 px-10 py-4 rounded-full text-sm font-bold tracking-widest uppercase transition-all hover:border-white/70 hover:text-white"
          whileHover={{ 
            scale: 1.05,
            boxShadow: '0 0 30px rgba(255,255,255,0.2)'
          }}
          whileTap={{ scale: 0.98 }}
        >
          ENTER THE VOID
        </motion.button>
      </main>
    </div>
  );
}