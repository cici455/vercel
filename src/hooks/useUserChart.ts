import { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import { calculateNatalChart } from '../utils/astrologyCalculator';
import { calculatePlanetPositions, detectAspects, PlanetPosition, AspectSignal } from '../utils/astrologySystem';
import { generateDailyOmen, OmenOutput } from '../utils/narrativeGenerator';
import { ZODIAC_CONTENT } from '../data/luminaContent';

// City to timezone mapping
const CITY_TIMEZONES: Record<string, string> = {
  'New York, US': 'America/New_York',
  'London, GB': 'Europe/London',
  'Shanghai, CN': 'Asia/Shanghai',
  'Tokyo, JP': 'Asia/Tokyo',
  'Sydney, AU': 'Australia/Sydney',
  'Paris, FR': 'Europe/Paris',
  'Beijing, CN': 'Asia/Shanghai',
  'Moscow, RU': 'Europe/Moscow',
  'Cairo, EG': 'Africa/Cairo',
  'Rio de Janeiro, BR': 'America/Sao_Paulo',
  'Mumbai, IN': 'Asia/Kolkata',
  'Bangkok, TH': 'Asia/Bangkok',
  'Mexico City, MX': 'America/Mexico_City',
  'Los Angeles, US': 'America/Los_Angeles',
  'Chicago, US': 'America/Chicago',
};

// Parse birth date and time to UTC
const parseBirthDateTimeToUtc = (
  dateStr: string,   // 'YYYY-MM-DD' (from <input type="date">)
  timeStr: string,   // 'HH:MM'
  cityName: string   // e.g. 'London, GB'
): Date | null => {
  const zone = CITY_TIMEZONES[cityName];
  if (!zone) return null;

  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = timeStr.split(':').map(Number);
  if (
    !year || !month || !day ||
    Number.isNaN(hour) || Number.isNaN(minute)
  ) {
    return null;
  }

  const local = DateTime.fromObject(
    { year, month, day, hour, minute },
    { zone }
  );
  if (!local.isValid) return null;

  const utc = local.toUTC();
  return utc.toJSDate();
};

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
      // 1. Parse Date & Time to UTC
      const birthDateUtc = parseBirthDateTimeToUtc(
        userData.date,
        userData.time,
        userData.city
      );
      
      if (!birthDateUtc) {
        throw new Error("Invalid birth date/time/city combination");
      }

      // 2. Calculate Natal Chart using the new calculator
      const natalChart = calculateNatalChart(birthDateUtc, userData.lat, userData.lng);

      // 3. Calculate Positions for existing system (backward compatibility)
      // Natal
      const natalPositions = calculatePlanetPositions(birthDateUtc, userData.lat, userData.lng);
      
      // Transit (Now)
      const now = new Date();
      const transitPositions = calculatePlanetPositions(now);

      // 3. Detect Aspects (Signals)
      const signals = detectAspects(natalPositions, transitPositions);

      // 4. Generate Narrative (Omen)
      // Use User Name or ID as hash seed if available, otherwise date
      const userId = `${userData.city}-${birthDateUtc.toISOString()}`; 
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

      // Use the new natal chart for more accurate signs
      const sunSign = natalChart.signs.sun || getSign("Sun");
      const moonSign = natalChart.signs.moon || getSign("Moon");
      const risingSign = natalChart.signs.asc || getSign("Sun"); // Use calculated ascendant, fallback to sun
      
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
