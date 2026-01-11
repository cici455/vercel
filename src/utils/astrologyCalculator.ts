import * as Astronomy from 'astronomy-engine';

type AstroTime = ReturnType<typeof Astronomy.MakeTime>;

// Helper functions
const degToRad = (deg: number) => (deg * Math.PI) / 180;
const radToDeg = (rad: number) => (rad * 180) / Math.PI;
const normalizeAngle = (deg: number) => ((deg % 360) + 360) % 360;

// Zodiac sign calculation
const getZodiacSign = (longitude: number): string => {
  const signs = [
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
  ];
  const norm = normalizeAngle(longitude);
  const index = Math.floor(norm / 30);
  return signs[index];
};

// Types
export type PlanetKey =
  | 'sun'
  | 'moon'
  | 'mercury'
  | 'venus'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'
  | 'pluto';

export interface NatalChart {
  longitudes: Record<PlanetKey | 'asc', number>;
  signs: Record<PlanetKey | 'asc', string>;
}

// Planet bodies mapping
const planetBodies: Record<PlanetKey, Astronomy.Body> = {
  sun: Astronomy.Body.Sun,
  moon: Astronomy.Body.Moon,
  mercury: Astronomy.Body.Mercury,
  venus: Astronomy.Body.Venus,
  mars: Astronomy.Body.Mars,
  jupiter: Astronomy.Body.Jupiter,
  saturn: Astronomy.Body.Saturn,
  uranus: Astronomy.Body.Uranus,
  neptune: Astronomy.Body.Neptune,
  pluto: Astronomy.Body.Pluto,
};

// Get planet longitude
const getPlanetLong = (body: Astronomy.Body, astroTime: AstroTime): number => {
  // GeoVector calculates the position relative to Earth
  const vec = Astronomy.GeoVector(body, astroTime, true);
  // Convert to Ecliptic coordinates
  const ecl = Astronomy.Ecliptic(vec);
  return normalizeAngle(ecl.elon);
};

// Main calculator
export const calculateNatalChart = (dateUtc: Date, lat: number, lng: number): NatalChart => {
  // Convert JS Date to Astronomy Engine Time
  const astroTime = Astronomy.MakeTime(dateUtc);

  const longitudes: Record<PlanetKey | 'asc', number> = {} as any;
  const signs: Record<PlanetKey | 'asc', string> = {} as any;

  // 1. Calculate 10 major planets' longitude
  (Object.entries(planetBodies) as [PlanetKey, Astronomy.Body][]).forEach(
    ([key, body]) => {
      const lon = getPlanetLong(body, astroTime);
      longitudes[key] = lon;
      signs[key] = getZodiacSign(lon);
    }
  );

  // 2. Calculate Ascendant (ASC)
  // 2.1 Greenwich Apparent Sidereal Time (hours)
  const gastHours = Astronomy.SiderealTime(astroTime);
  // 2.2 Local Sidereal Time LST (hours)
  let lstHours = gastHours + lng / 15.0;
  lstHours = ((lstHours % 24) + 24) % 24;
  const ramcDeg = lstHours * 15; // Right Ascension of the Medium Coeli (degrees)

  // 2.3 Ascendant formula (geographic latitude + obliquity of the ecliptic)
  const phi = degToRad(lat);                   // Latitude
  const eps = degToRad(23.4392911);            // Obliquity of the ecliptic (approximate)
  const theta = degToRad(ramcDeg);             // RAMC

  const ascRad = Math.atan2(
    -Math.cos(theta),
    Math.sin(theta) * Math.cos(eps) - Math.tan(phi) * Math.sin(eps)
  );

  const ascDeg = normalizeAngle(radToDeg(ascRad));
  longitudes['asc'] = ascDeg;
  signs['asc'] = getZodiacSign(ascDeg);

  return { longitudes, signs };
};
