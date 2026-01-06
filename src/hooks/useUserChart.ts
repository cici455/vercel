import { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import { calculateNatalChart, NatalChart } from '../utils/astrologyCalculator';
import { PLANET_ARCHETYPES, PlanetKey } from '../utils/planetArchetypes';
import { ELEMENT_BY_SIGN, Element } from '../utils/archetypeMatrix';
import { calculatePlanetPositions, detectAspects, PlanetPosition, AspectSignal } from '../utils/astrologySystem';
import { generateDailyOmen, OmenOutput } from '../utils/narrativeGenerator';
import { ZODIAC_CONTENT } from '../data/luminaContent';
import { buildTensionPattern } from '../utils/archetypeMatrix';

// Parse birth date and time to UTC
const parseBirthDateTimeToUtc = (
  dateStr: string,   // 'YYYY-MM-DD' (from <input type="date">)
  timeStr: string,   // 'HH:MM'
  timezone: string   // e.g. 'Europe/London'
): Date | null => {
  const zone = timezone || 'UTC';

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
  timezone: string; // Timezone from Open-Meteo API
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

type NarrativeProfile = {
  primaryArchetype: string; // 例如 'THE VANGUARD'
  innerArchetype: string;   // 'THE ORACLE'
  outerArchetype: string;   // 'THE MASK' / 'THE CROWN' 等
  tensionPattern: string;   // 一句短标签，比如 'FIRE-WATER CONFLICT'
};

const buildNarrativeProfile = (natalChart: any): NarrativeProfile => {
  const sun  = natalChart.signs.sun;
  const moon = natalChart.signs.moon;
  const asc  = natalChart.signs.asc;

  // 简化：先用太阳星座决定 primary archetype
  const primary = ZODIAC_CONTENT[sun]?.sun?.title || 'THE UNKNOWN';
  const inner   = ZODIAC_CONTENT[moon]?.moon?.title || 'THE HIDDEN SELF';
  const outer   = ZODIAC_CONTENT[asc]?.rising?.title || primary;

  // 粗略 tension：按元素(火土风水)组合生成标签
  const elementOf = (sign: string): 'fire' | 'earth' | 'air' | 'water' => {
    const s = sign.toLowerCase();
    if (['aries','leo','sagittarius'].includes(s)) return 'fire';
    if (['taurus','virgo','capricorn'].includes(s)) return 'earth';
    if (['gemini','libra','aquarius'].includes(s)) return 'air';
    return 'water';
  };
  const eSun  = elementOf(sun);
  const eMoon = elementOf(moon);

  let tension = '';
  if (eSun !== eMoon) tension = `${eSun.toUpperCase()}-${eMoon.toUpperCase()} DUALITY`;
  else tension = `${eSun.toUpperCase()} CONTINUITY`;

  return {
    primaryArchetype: primary,
    innerArchetype: inner,
    outerArchetype: outer,
    tensionPattern: tension,
  };
};

type PlanetCopyForUI = Record<PlanetKey, { title: string; line: string }>;

type DisplayPlanetPosition = {
  degree: number;   // 星座内度数 0-30
  sign: string;     // 星座字符串（aries/taurus...）
};

type DisplayPositions = Record<PlanetKey, DisplayPlanetPosition>;

const buildDisplayPositionsFromChart = (natalChart: NatalChart): DisplayPositions => {
  const result: Partial<DisplayPositions> = {};

  const planetKeys: PlanetKey[] = [
    'mercury',
    'venus',
    'mars',
    'jupiter',
    'saturn',
    'uranus',
    'neptune',
    'pluto',
  ];

  planetKeys.forEach((key) => {
    const lon = natalChart.longitudes[key];
    const sign = natalChart.signs[key];
    if (lon === undefined || !sign) return;

    const norm = ((lon % 360) + 360) % 360;
    const degreeInSign = norm % 30; // 每宫 0-30 度

    result[key] = {
      degree: degreeInSign,
      sign,
    };
  });

  return result as DisplayPositions;
};

const buildPlanetCopy = (natalChart: NatalChart): PlanetCopyForUI => {
  const result: Partial<PlanetCopyForUI> = {};

  const planetKeys: PlanetKey[] = [
    'mercury',
    'venus',
    'mars',
    'jupiter',
    'saturn',
    'uranus',
    'neptune',
    'pluto',
  ];

  planetKeys.forEach((key) => {
    const sign = natalChart.signs[key];       // 例如 'capricorn'
    if (!sign) return;

    const element: Element | undefined = ELEMENT_BY_SIGN[sign.toLowerCase()];
    const base = PLANET_ARCHETYPES[key];
    if (!base) return;

    const titleFromElement =
      (element && base.titlesByElement?.[element]) || base.baseTitle;

    result[key] = {
      title: titleFromElement,
      line: base.baseLine,
    };
  });

  // 类型断言：我们确保上面填满所有 key
  return result as PlanetCopyForUI;
};

export const useUserChart = (userData: UserChartInput | null) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [narrativeProfile, setNarrativeProfile] = useState<NarrativeProfile | null>(null);
  const [tensionLabel, setTensionLabel] = useState<string>('');
  const [tensionLine, setTensionLine] = useState<string>('');
  const [planetCopy, setPlanetCopy] = useState<Record<string, { title: string; line: string }>>({});
  const [natalDisplayPositions, setNatalDisplayPositions] = useState<Record<string, { degree: number; sign: string }>>({});
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
        userData.timezone
      );
      
      if (!birthDateUtc) {
        throw new Error("Invalid birth date/time/city combination");
      }

      // 2. Calculate Natal Chart using the new calculator
      const natalChart = calculateNatalChart(birthDateUtc, userData.lat, userData.lng);
      
      // 3. Calculate tension pattern using archetype matrix
      const { label, line } = buildTensionPattern(
        natalChart.signs.sun,
        natalChart.signs.moon
      );
      setTensionLabel(label);
      setTensionLine(line);
      
      // 4. Build planet copy for UI
      const planetCopy = buildPlanetCopy(natalChart);
      setPlanetCopy(planetCopy);
      
      // 5. Build display positions from chart
      const natalDisplayPositions = buildDisplayPositionsFromChart(natalChart);
      setNatalDisplayPositions(natalDisplayPositions);
      
      // 6. Build narrative profile
      const profile = buildNarrativeProfile(natalChart);
      setNarrativeProfile(profile);

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
      const planetKeys = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'] as const;
      
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

  return { chartData, narrativeProfile, loading, error, tensionLabel, tensionLine, planetCopy, natalDisplayPositions };
};
