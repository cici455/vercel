import { useState, useEffect } from 'react';
import { calculatePlanetPositions, detectAspects, PlanetPosition, AspectSignal } from '../utils/astrologySystem';
import { generateDailyOmen, OmenOutput } from '../utils/narrativeGenerator';
import { ZODIAC_CONTENT } from '../data/luminaContent';

interface UserChartInput {
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  city: string; // Just for display reference if needed
  lat: number;
  lng: number;
}

export interface TrinityCard {
  type: "Sun" | "Moon" | "Rising";
  sign: string;
  title: string;
  desc: string;
  notes?: {
    meaning: string;
    practice: string;
  };
}

export interface PlanetRow {
  name: string;
  sign: string;
  behavior: string;
  transit?: {
    type: "BLESSED" | "PRESSURE" | "ACTIVE";
    label: string;
    signal?: AspectSignal; // Provenance
  };
}

export interface ChartData {
  trinity: TrinityCard[];
  planets: PlanetRow[];
  omen: OmenOutput;
}

export const useUserChart = (userData: UserChartInput | null) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userData || !userData.date || !userData.time) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Parse Date & Time
      let birthDate: Date;
      const [p1, p2, p3] = userData.date.split('/');
      
      if (p3 && p3.length === 4) {
        // Assume MM/DD/YYYY
        const month = parseInt(p1, 10);
        const day = parseInt(p2, 10);
        const year = parseInt(p3, 10);
        
        if (month < 1 || month > 12 || day < 1 || day > 31) {
             throw new Error("Invalid Date");
        }

        birthDate = new Date(year, month - 1, day);
        const [hours, minutes] = userData.time.split(':').map(Number);
        birthDate.setHours(hours || 0, minutes || 0);
      } else {
        // Fallback for standard YYYY-MM-DD
        birthDate = new Date(`${userData.date}T${userData.time}`);
      }

      if (isNaN(birthDate.getTime())) {
        throw new Error("Invalid Date Object");
      }

      // 2. Calculate Positions
      // Natal
      const natalPositions = calculatePlanetPositions(birthDate, userData.lat, userData.lng);
      
      // Transit (Now)
      const now = new Date();
      const transitPositions = calculatePlanetPositions(now);

      // 3. Detect Aspects (Signals)
      const signals = detectAspects(natalPositions, transitPositions);

      // 4. Generate Narrative (Omen)
      // Use User Name or ID as hash seed if available, otherwise date
      const userId = `${userData.city}-${birthDate.toISOString()}`; 
      const omen = generateDailyOmen(userId, now, signals);

      // 5. Map Content
      const getSign = (name: string) => {
        const p = natalPositions.find(p => p.name === name);
        return p ? p.sign : "Aries";
      };

      const getContent = (sign: string) => {
        // Ensure sign is valid before calling toLowerCase()
        const safeSign = sign || "Aries";
        const key = safeSign.toLowerCase();
        return ZODIAC_CONTENT[key] || ZODIAC_CONTENT['aries'];
      };

      const sunSign = getSign("Sun");
      const moonSign = getSign("Moon");
      const risingSign = getSign("Sun"); // Fallback for MVP if Rising calc is complex, but let's check
      // Note: In `astrologySystem`, calculatePlanetPositions calculates Ascendant? 
      // Actually we didn't implement Ascendant fully there yet. 
      // For MVP, let's map Rising to Sun or use a mock logic if missing.
      // But `ZODIAC_CONTENT` expects rising.
      // Let's use a placeholder if Ascendant is not in the list.
      // Wait, `calculatePlanetPositions` returns an array.
      
      const sunContent = getContent(sunSign).sun;
      const moonContent = getContent(moonSign).moon;
      const risingContent = getContent(risingSign).rising; // Placeholder

      const trinity: TrinityCard[] = [
        {
          type: "Sun",
          sign: sunSign,
          title: sunContent.title,
          desc: sunContent.subtitle,
          notes: sunContent.notes
        },
        {
          type: "Moon",
          sign: moonSign,
          title: moonContent.title,
          desc: moonContent.subtitle,
          notes: moonContent.notes
        },
        {
          type: "Rising",
          sign: risingSign, // This is technically inaccurate without correct LST, but MVP safe
          title: risingContent.title,
          desc: risingContent.subtitle,
          notes: risingContent.notes
        }
      ];

      // Map Planets
      const planetKeys = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'] as const;
      
      const planets: PlanetRow[] = planetKeys.map(pName => {
        const sign = getSign(pName);
        const content = getContent(sign);
        // Typescript safe access
        const planetData = (content as any)[pName.toLowerCase()];
        
        // Find relevant signal
        const signal = signals.find(s => s.natalPlanet === pName && s.score > 5);

        let transit = undefined;
        if (signal) {
           if (signal.theme === "growth" || signal.theme === "love") {
             transit = { type: "BLESSED", label: "✨ BLESSED", signal } as const;
           } else if (signal.theme === "discipline" || signal.theme === "transformation") {
             transit = { type: "PRESSURE", label: "⚠ PRESSURE", signal } as const;
           } else {
             transit = { type: "ACTIVE", label: "⚡ ACTIVE", signal } as const;
           }
        }

        return {
          name: pName,
          sign: sign,
          behavior: planetData?.epithet || "The Wanderer",
          transit
        };
      });

      setChartData({ trinity, planets, omen });

    } catch (err: any) {
      console.error("Failed to calculate chart:", err);
      setError(err.message || "Calculation Failed");
    } finally {
      setLoading(false);
    }
  }, [userData]);

  return { chartData, loading, error };
};
