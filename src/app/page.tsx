"use client";

import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Points, PointMaterial } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import DashboardView from "@/components/DashboardView";
import ConstellationBackground from "@/components/canvas/ConstellationBackground"; // Import new background

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
      searchTimeout.current = setTimeout(async () => {
        try {
          const res = await fetch(`/api/cities?q=${encodeURIComponent(value)}`);
          if (!res.ok) throw new Error('Failed to fetch cities');
          const data = await res.json();
          setCitySuggestions(data);
          setShowSuggestions(true);
        } catch (err) {
          console.error(err);
          setCitySuggestions([]); // Clear on error
        }
      }, 300);
    } else {
      setCitySuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectCity = (city: any) => {
    // Store lat/lng from the selected city object
    setFormData({
      ...formData, 
      city: `${city.name}, ${city.country}`,
      lat: city.lat || 0,
      lng: city.lng || 0
    });
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    // Simulate API call or call the real API
    try {
      const res = await fetch('/api/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      console.log(data);
      setStatus("success");
      // Short delay before showing dashboard to allow "success" state to trigger animations if needed
      // But for now, we can switch immediately or let the parent handle it.
      // Actually, we should let the user see "Fate Aligned" for a moment, then transition?
      // Or just replace the form content directly.
      // Let's modify the parent to handle the view switching based on status.
      
      // For this implementation, we'll keep the "Fate Aligned" message for 2 seconds, then switch.
      setTimeout(() => setShowDashboard(true), 2000);
      
    } catch (err) {
      console.error(err);
      setStatus("idle");
    }
  };

  if (showDashboard) {
    return (
      <div className="relative w-full h-screen bg-black overflow-hidden">
        {/* Background Layer - Independent of 3D Scene */}
        <ConstellationBackground />
        
        {/* Foreground Content - Allow Scrolling */}
        <div className="relative z-10 w-full h-full overflow-y-auto pointer-events-auto">
           <DashboardView userData={formData} onEnterCouncil={() => console.log("Enter Council")} />
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="relative z-20 text-center text-white p-8 border border-white/20 rounded-2xl backdrop-blur-md bg-black/40 max-w-md mx-4"
      >
        <h2 className="text-2xl font-serif mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
          Fate Aligned
        </h2>
        <p className="text-gray-300 tracking-widest text-sm leading-relaxed">
          Your request has been received by the cosmos.
          <br/>
          Initializing Astral Audit...
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 1, delay: 0.5 }}
      className={`relative z-20 w-full ${showDashboard ? 'max-w-4xl' : 'max-w-lg'} px-8`}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-8 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <h2 className="text-xl text-center text-white/80 font-serif tracking-[0.2em] mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
          Identify Yourself
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest text-gray-500">First Name</label>
            <input 
              required
              type="text" 
              className="bg-transparent border-b border-white/20 text-white p-2 text-sm focus:outline-none focus:border-white/60 transition-colors"
              value={formData.firstName}
              onChange={e => setFormData({...formData, firstName: e.target.value})}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest text-gray-500">Last Name</label>
            <input 
              required
              type="text" 
              className="bg-transparent border-b border-white/20 text-white p-2 text-sm focus:outline-none focus:border-white/60 transition-colors"
              value={formData.lastName}
              onChange={e => setFormData({...formData, lastName: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest text-gray-500">Birth Date</label>
            <input 
              required
              type="text"
              placeholder="MM/DD/YYYY"
              maxLength={10}
              className="bg-transparent border-b border-white/20 text-white p-2 text-sm focus:outline-none focus:border-white/60 transition-colors placeholder:text-white/20"
              value={formData.date}
              onChange={(e) => {
                let v = e.target.value.replace(/\D/g, '');
                if (v.length > 8) v = v.slice(0, 8);
                if (v.length >= 5) {
                  v = `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
                } else if (v.length >= 3) {
                  v = `${v.slice(0, 2)}/${v.slice(2)}`;
                }
                setFormData({...formData, date: v});
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest text-gray-500">Birth Time</label>
            <input 
              required
              type="time" 
              className="bg-transparent border-b border-white/20 text-white p-2 text-sm focus:outline-none focus:border-white/60 transition-colors"
              value={formData.time}
              onChange={e => setFormData({...formData, time: e.target.value})}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 relative">
          <label className="text-[10px] uppercase tracking-widest text-gray-500">Birth City</label>
          <input 
            required
            type="text" 
            className="bg-transparent border-b border-white/20 text-white p-2 text-sm focus:outline-none focus:border-white/60 transition-colors"
            value={formData.city}
            onChange={handleCityChange}
            onFocus={() => formData.city.length >= 1 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            autoComplete="off"
          />
          {showSuggestions && citySuggestions.length > 0 && (
            <ul className="absolute top-full left-0 w-full max-h-40 overflow-y-auto bg-black border border-white/20 rounded-b-lg backdrop-blur-md z-50 custom-scrollbar">
              {citySuggestions.map((city, i) => (
                <li 
                  key={i}
                  className="px-4 py-2 text-sm text-gray-300 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                  onClick={() => selectCity(city)}
                >
                  <span className="text-white font-medium">{city.name}</span>
                  <span className="text-xs text-gray-500 ml-2">{city.country}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button 
          type="submit"
          disabled={status === "loading"}
          className="mt-6 py-3 border border-white/20 rounded-full text-xs text-white tracking-[0.3em] uppercase hover:bg-white/10 transition-all disabled:opacity-50"
        >
          {status === "loading" ? "Transmitting..." : "Submit to the Void"}
        </button>
      </form>
    </motion.div>
  );
}

// --- 1. The Hollow Cylinder Star Tunnel ---
function StarTunnel() {
  const count = 500; // Reduced for performance
  const ref = useRef<THREE.Points>(null); // Changed mesh -> ref to match Drei usage
  const planetZ = -12;
  const planetRadius = 2.2;
  const speed = 0.2; // Define speed here
  
  // Use a soft circle texture instead of square points
  const starTexture = useMemo(() => {
    // Check if we're on the client side
    if (typeof window === 'undefined' || typeof document === 'undefined') return null;
    
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      
      // Draw a soft glow circle
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
      
      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    } catch (e) {
      console.error("Failed to create star texture", e);
      return null;
    }
  }, []);

  // Initial positions: Sharp Hollow Cylinder reaching near the planet rim
  const positions = useMemo(() => { // Renamed particles -> positions to match Drei prop
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Bias the distribution towards a hollow cylinder whose inner wall
      // is slightly larger than the planet radius (so stars "touch" the rim visually)
      const angle = Math.random() * Math.PI * 2;
      // 65% in the inner wall close to the rim, 35% in the outer fade
      const innerMin = planetRadius + 0.25;   // just outside the planet
      const innerMax = planetRadius + 1.8;
      const outerMin = innerMax;
      const outerMax = 12.0;
      const r = Math.random() > 0.35
        ? innerMin + Math.random() * (innerMax - innerMin)
        : outerMin + Math.random() * (outerMax - outerMin);

      const x = r * Math.cos(angle);
      const y = r * Math.sin(angle);
      const z = (Math.random() - 0.5) * 80; // Long tunnel depth
      
      temp[i * 3] = x;
      temp[i * 3 + 1] = y;
      temp[i * 3 + 2] = z;
    }
    return temp;
  }, [count]);

  // Per-vertex colors not needed for Points/PointMaterial in this way usually, 
  // but if we want per-star color, we pass it to geometry, not implemented in simple PointMaterial.
  // We'll skip complex per-vertex color updates for now to save perf.
  const texture = starTexture;

  useFrame((state, delta) => {
    if (!ref.current) return;
    
    // Rotate tunnel slowly
    ref.current.rotation.z += delta * 0.05;

    // Get positions array
    const positions = ref.current.geometry.attributes.position.array as Float32Array;
    
    // Update each star
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Move star towards center (z-axis)
      positions[i3 + 2] -= speed * (1 + Math.random()); // Move along Z

      // Reset if too far
      if (positions[i3 + 2] < -20) {
        positions[i3 + 2] = 10 + Math.random() * 5;
        // Reset x/y to random cylinder rim
        const r = 3.5 + Math.random() * 8; 
        const theta = Math.random() * Math.PI * 2;
        positions[i3] = Math.cos(theta) * r;
        positions[i3 + 1] = Math.sin(theta) * r;
      }
    }
    
    ref.current.geometry.attributes.position.needsUpdate = true;
    
    // HACK: Invalidate loop to force re-render when animating
    // Since we set frameloop="demand", we must manually request frames
    state.invalidate();
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        map={texture}
        alphaMap={texture}
      />
    </Points>
  );
}

// --- 2. The Obsidian Sphere & Atmosphere ---
function ObsidianPlanet() {
  return (
    <group position={[0, 0, -12]}>
      {/* 
        1. Core Sphere (Obsidian)
        High polish, black, reflective.
      */}
      <Sphere args={[2.2, 32, 32]}>
        <meshPhysicalMaterial 
          color="#000000"
          roughness={0.0}
          metalness={0.3}
          clearcoat={1.0} // Glass-like coating
          clearcoatRoughness={0.1}
          ior={1.4}
        />
      </Sphere>

      {/* 
        2. Volumetric Glow (Atmosphere)
        A slightly larger sphere with a custom Fresnel-like gradient using opacity.
        We simulate this with a simple transparent material and a back-light.
      */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2.25, 32, 32]} />
        <meshBasicMaterial 
          color="#444444" 
          transparent 
          opacity={0.15} 
          side={THREE.BackSide} // Render inside to create depth
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 
        3. Rim Light Ring (The "Event Horizon" Edge) 
        Facing camera, creates the sharp white outline.
      */}
      <mesh position={[0, 0, -0.05]} rotation={[0, 0, 0]}>
         <ringGeometry args={[2.2, 2.25, 128]} />
         <meshBasicMaterial color="#ffffff" transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>

      {/* 
        4. Outer Halo (Soft diffuse glow)
      */}
      <mesh position={[0, 0, -0.1]}>
         <ringGeometry args={[2.2, 2.8, 128]} />
         <meshBasicMaterial color="#ffffff" transparent opacity={0.05} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Lights */}
      <pointLight position={[5, 5, 5]} intensity={2} color="#ffffff" distance={20} />
      <pointLight position={[-5, -5, 5]} intensity={1} color="#aaccff" distance={20} />
      {/* Strong backlight for rim */}
      <pointLight position={[0, 0, -5]} intensity={10} color="white" distance={10} />
    </group>
  );
}

export default function LandingPage() {
  const [entered, setEntered] = useState(false);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col justify-center items-center py-12">
      {/* Dynamic flowing white background animation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Deep black background */}
        <div className="absolute inset-0 bg-black"></div>
        
        {/* Animated white flowing orbs using framer-motion */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/25 rounded-full blur-3xl"
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
          className="absolute top-3/4 right-1/3 w-[500px] h-[500px] bg-white/18 rounded-full blur-3xl"
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
          className="absolute top-1/2 left-1/3 w-80 h-80 bg-white/22 rounded-full blur-3xl"
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
          className="absolute top-1/3 right-1/4 w-64 h-64 bg-white/15 rounded-full blur-3xl"
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
              >
                LUMINA
              </h1>
              <p className="mt-4 text-sm text-white/50 tracking-[0.75em] uppercase">
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
                ENTER THE VOID
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
