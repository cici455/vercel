"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import AstrologyView from "@/components/AstrologyView";
import RitualView from "@/components/RitualView";
import StarField from "@/components/canvas/StarField";

// --- Consultation Form (Stage 1) ---
function ConsultationForm({ onComplete }: { onComplete: (data: any) => void }) {
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
  const [errors, setErrors] = useState({
    date: "",
    time: "",
    city: ""
  });
  const [citySuggestions, setCitySuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, city: value, lat: 0, lng: 0 });
    setErrors({ ...errors, city: "" });

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (value.length >= 2) {
      setShowSuggestions(true);

      searchTimeout.current = setTimeout(async () => {
        try {
          const res = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
              value
            )}&count=10&language=en&format=json`
          );
          const data = await res.json();

          const suggestions =
            (data.results || []).map((item: any) => ({
              name: `${item.name}, ${item.country_code}`,
              lat: item.latitude,
              lng: item.longitude,
            })) ?? [];

          setCitySuggestions(suggestions);
        } catch (error) {
          console.error("City lookup failed", error);
          setCitySuggestions([]);
        }
      }, 300);
    } else {
      setShowSuggestions(false);
      setCitySuggestions([]);
    }
  };

  const handleCitySelect = (city: any) => {
    setFormData({...formData, city: city.name, lat: city.lat, lng: city.lng});
    setShowSuggestions(false);
    setErrors({...errors, city: ""});
  };

  // Validate date
  const validateDate = (value: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "Use format YYYY-MM-DD";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Invalid date";
    const today = new Date();
    const min = new Date("1900-01-01");
    if (date < min) return "Too early";
    if (date > today) return "Cannot be in the future";
    // Optional: limit age 13~100 years
    const age = today.getFullYear() - date.getFullYear();
    if (age < 13 || age > 100) return "Age must be between 13 and 100";
    return null;
  };

  // Validate time
  const validateTime = (value: string) => {
    if (!value) return "Time is required";
    // 24-hour format, 00:00 - 23:59
    const match = /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
    return match ? null : "Use 24h format HH:MM";
  };

  // Validate city
  const validateCity = (city: string, lat: number, lng: number) => {
    if (!city) return "City is required";
    if (lat === 0 && lng === 0) return "Please select a city from the suggestions";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const dateError = validateDate(formData.date);
    const timeError = validateTime(formData.time);
    const cityError = validateCity(formData.city, formData.lat, formData.lng);
    
    const newErrors = {
      date: dateError || "",
      time: timeError || "",
      city: cityError || ""
    };
    
    setErrors(newErrors);
    
    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== "");
    if (hasErrors) return;
    
    setStatus("loading");
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStatus("success");
  };

  return (
    <div className="w-full max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="relative z-10">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
                onClick={() => onComplete(formData)}
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
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Name</label>
                  <input 
                    type="text" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                    placeholder="FIRST"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Surname</label>
                  <input 
                    type="text" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                    placeholder="LAST"
                    required
                  />
                </div>
              </div>
              
              <div className="relative">
                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Place of Birth</label>
                <input 
                  type="text" 
                  value={formData.city}
                  onChange={handleCityChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="CITY"
                  required
                />
                {showSuggestions && citySuggestions.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-black/90 backdrop-blur-lg border border-white/10 rounded-lg mt-1 max-h-48 overflow-y-auto z-50">
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
                  </div>
                )}
                {errors.city && (
                  <p className="mt-1 text-xs text-red-400">{errors.city}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Date</label>
                  <input 
                    type="date" 
                    value={formData.date}
                    onChange={(e) => {
                      setFormData({...formData, date: e.target.value});
                      setErrors({...errors, date: ""});
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white/80 focus:outline-none focus:border-white/30 transition-colors [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                    min="1900-01-01"
                    max={new Date().toISOString().slice(0, 10)}
                    required
                  />
                  {errors.date && (
                    <p className="mt-1 text-xs text-red-400">{errors.date}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-2"> 
                    Time 
                  </label> 
                  <input 
                    type="text" 
                    inputMode="numeric" 
                    value={formData.time} 
                    onChange={(e) => { 
                      setFormData({ ...formData, time: e.target.value }); 
                      setErrors({ ...errors, time: "" }); 
                    }} 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white/80 placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors" 
                    placeholder="HH:MM" 
                    maxLength={5} 
                    required 
                  /> 
                  {errors.time && ( 
                    <p className="mt-1 text-xs text-red-400">{errors.time}</p> 
                  )} 
                </div>
              </div>
              
              <button 
                type="submit"
                className="w-full bg-white/10 hover:bg-white/20 text-white py-4 rounded-lg transition-all border border-white/20 mt-4 text-sm uppercase tracking-widest"
              >
                REQUEST COUNSEL
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// --- Main Page (Orchestrator) ---
export default function LandingPage() {
  const router = useRouter();
  // Stages: 0 = Intro, 1 = Form, 2 = Astrology Data, 3 = Ritual Interface
  const [stage, setStage] = useState(0);
  const [userData, setUserData] = useState<any>(null);

  const handleFormComplete = (data: any) => {
    setUserData(data);
    setStage(2); // Go to Astrology Data
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden flex flex-col justify-center items-center py-12 pb-40 bg-transparent">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         {/* <StarField /> */}
      </div>

      <AnimatePresence mode="wait">
        {/* Stage 0: Intro */}
        {stage === 0 && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 1 }}
            className="absolute top-0 w-full h-full flex flex-col justify-center items-center z-10"
          >
            <div className="text-center">
              <h1 
                className="text-7xl md:text-9xl font-serif text-white tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                style={{ mixBlendMode: "difference", zIndex: 10 }}
              >
                LUMINA
              </h1>
              <p className="mt-4 text-sm text-white/50 tracking-[0.75em] uppercase text-halo">
                THE EVENT HORIZON
              </p>
            </div>
            <motion.div 
              className="absolute bottom-16 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
            >
              <motion.button
                onClick={() => setStage(1)}
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,255,255,0.2)" }}
                className="bg-transparent border-2 border-white/30 text-white/90 px-10 py-4 rounded-full text-sm font-bold tracking-widest uppercase transition-all hover:border-white/70 hover:text-white"
              >
                <span className="text-halo">ENTER THE VOID</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* Stage 1: Consultation Form */}
        {stage === 1 && (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10"
          >
            <ConsultationForm onComplete={handleFormComplete} />
          </motion.div>
        )}

        {/* Stage 2: Astrology Data */}
        {stage === 2 && (
          <motion.div
            key="astrology"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <AstrologyView 
              userData={userData} 
              onEnterRitual={() => setStage(3)} 
              onBack={() => setStage(1)} 
            />
          </motion.div>
        )}

        {/* Stage 3: Ritual Interface */}
        {stage === 3 && (
          <motion.div
            key="ritual"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <RitualView 
              onOpenGate={() => router.push('/council')} 
              onBack={() => setStage(2)} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
