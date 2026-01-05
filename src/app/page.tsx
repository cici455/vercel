"use client";

import React, { useRef, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Points, PointMaterial } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import DashboardView from "@/components/DashboardView";
import ConstellationBackground from "@/components/canvas/ConstellationBackground";

// --- Camera Rig for Transitions ---
function CameraRig({ entered }: { entered: boolean }) {
  useFrame((state) => {
    // Zoom in when entered
    const targetZ = entered ? 3.5 : 15;
    // Smooth lerp
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.03);
    
    // Optional: look at mouse or just stay centered
    // state.camera.lookAt(0, 0, 0);
  });
  return null;
}

// --- Consultation Form ---
function ConsultationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    date: "",
    time: "",
    city: "",
    lat: 0,
    lng: 0
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [showDashboard, setShowDashboard] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Reset coords if user types manually, forcing them to re-select or we need geocoding
    setFormData({...formData, city: value, lat: 0, lng: 0});
    
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    
    if (value.length >= 1) {
      setShowSuggestions(true);
      searchTimeout.current = setTimeout(() => {
        // Simple mock suggestions - in production, use an actual city API
        const mockCities = [
          { name: "New York", lat: 40.7128, lng: -74.0060 },
          { name: "Los Angeles", lat: 34.0522, lng: -118.2437 },
          { name: "London", lat: 51.5074, lng: -0.1278 },
          { name: "Tokyo", lat: 35.6762, lng: 139.6503 },
          { name: "Paris", lat: 48.8566, lng: 2.3522 },
          { name: "Berlin", lat: 52.5200, lng: 13.4050 },
          { name: "Sydney", lat: -33.8688, lng: 151.2093 },
          { name: "Dubai", lat: 25.2048, lng: 55.2708 },
          { name: "Singapore", lat: 1.3521, lng: 103.8198 },
          { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
          { name: "Shanghai", lat: 31.2304, lng: 121.4737 },
          { name: "Beijing", lat: 39.9042, lng: 116.4074 },
          { name: "Moscow", lat: 55.7558, lng: 37.6173 },
          { name: "Rio de Janeiro", lat: -22.9068, lng: -43.1729 },
          { name: "Cape Town", lat: -33.9249, lng: 18.4241 },
        ].filter(city => 
          city.name.toLowerCase().includes(value.toLowerCase())
        );
        
        setCitySuggestions(mockCities);
      }, 300);
    } else {
      setShowSuggestions(false);
      setCitySuggestions([]);
    }
  };

  const handleCitySelect = (city: any) => {
    setFormData({...formData, city: city.name, lat: city.lat, lng: city.lng});
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setStatus("success");
  };

  if (showDashboard) {
    return <DashboardView userData={formData} onEnterCouncil={() => router.push('/council')} onBack={() => setShowDashboard(false)} />;
  }

  return (
    <div className="w-full max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
      >
        {/* Ambient glow effects */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-serif text-white mb-8 text-center tracking-wide"
          >
            ENTER YOUR MARK
          </motion.h2>
          
          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">✦</div>
              <h3 className="text-2xl font-serif text-white mb-4">FATE SEALED</h3>
              <p className="text-white/60 mb-8">The Council will review your consultation.</p>
              <button 
                onClick={() => setShowDashboard(true)}
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full transition-all border border-white/20"
              >
                VIEW YOUR CHART
              </button>
            </motion.div>
          ) : status === "loading" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="inline-block w-16 h-16 border-2 border-white/20 border-t-white/60 rounded-full animate-spin mb-4"></div>
              <p className="text-white/60 animate-pulse">CONSULTING THE COUNCIL...</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Name</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                      placeholder="FIRST"
                      required
                    />
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Surname</label>
                  <input 
                    type="text" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                    placeholder="LAST"
                    required
                  />
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Place of Birth</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formData.city}
                    onChange={handleCityChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                    placeholder="CITY"
                    required
                  />
                  {showSuggestions && citySuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 w-full bg-black/90 backdrop-blur-lg border border-white/10 rounded-lg mt-1 max-h-48 overflow-y-auto z-50"
                    >
                      {citySuggestions.map((city, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleCitySelect(city)}
                          className="w-full text-left px-4 py-3 text-white/80 hover:bg-white/10 transition-colors text-sm"
                        >
                          {city.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="grid grid-cols-2 gap-6"
              >
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Date</label>
                  <input 
                    type="date" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white/80 focus:outline-none focus:border-white/30 transition-colors [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Time</label>
                  <input 
                    type="time" 
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white/80 focus:outline-none focus:border-white/30 transition-colors [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                    required
                  />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <button 
                  type="submit"
                  className="w-full bg-white/10 hover:bg-white/20 text-white py-4 rounded-lg transition-all border border-white/20 mt-4 text-sm uppercase tracking-widest"
                >
                  REQUEST COUNSEL
                </button>
              </motion.div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function LandingPage() {
  const [entered, setEntered] = useState(false);

  return (
    <div className="relative w-full h-screen relative overflow-hidden flex flex-col justify-center items-center py-12 bg-transparent">
      {/* Header & Button - Animate out when entered */}
      <AnimatePresence>
        {!entered && (
          <>
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 1 }}
              className="absolute top-12 z-10 text-center w-full"
            >
              <h1 
                className="text-7xl md:text-9xl font-serif text-white tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                style={{ 
                  mixBlendMode: "difference", // 关键：让文字遇白变黑，遇黑变白
                  zIndex: 10 // 确保在粒子层之上
                }}
              >
                LUMINA
              </h1>
              <p className="mt-4 text-sm text-white/50 tracking-[0.75em] uppercase text-halo">
                THE EVENT HORIZON
              </p>
            </motion.div>

            {/* Footer Button */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 1 }}
              className="absolute bottom-16 z-10"
            >
              <motion.button
                onClick={() => setEntered(true)}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 0 30px rgba(255,255,255,0.2)"
                }}
                className="bg-transparent border-2 border-white/30 text-white/90 px-10 py-4 rounded-full text-sm font-bold tracking-widest uppercase transition-all hover:border-white/70 hover:text-white"
              >
                <span className="text-halo">ENTER THE VOID</span>
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Consultation Form - Animate in when entered */}
      <AnimatePresence>
        {entered && (
          <div className="pointer-events-auto">
            <ConsultationForm />
          </div>
        )}
      </AnimatePresence>

      {/* 3D Scene - Render ON DEMAND and LOW DPR */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Temporarily disabled for stability */}
        {/* <Canvas 
          camera={{ position: [0, 0, 15], fov: 40 }}
          dpr={[0.5, 1]} // LOWER DPR to 0.5 for stability
          frameloop="demand" // ONLY RENDER WHEN NEEDED (saves GPU)
          gl={{ 
            antialias: false,
            alpha: false,
            preserveDrawingBuffer: false, // Disable screenshot for perf
            powerPreference: "low-power" // Prefer stability over perf
          }}
        > 
          <color attach="background" args={["#000000"]} />
          <fog attach="fog" args={["#000000", 15, 50]} />
          
          <ambientLight intensity={0.2} />
          
          <CameraRig entered={entered} />
          <StarTunnel />
          
        </Canvas> */}
      </div>
    </div>
  );
}
