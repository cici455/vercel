import * as Astronomy from 'astronomy-engine';

// Helper: Convert longitude (0-360) to Zodiac Sign string
const getZodiacSign = (longitude: number): string => {
  const signs = [
    "aries", "taurus", "gemini", "cancer", "leo", "virgo",
    "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"
  ];
  // 0 is Aries, 30 is Taurus, etc.
  const index = Math.floor((longitude % 360) / 30);
  return signs[index];
};

// Helper: Convert degrees to sign-specific degree (0-29)
// Not strictly needed for the simplified output but useful for debugging
const _getDegreeInSign = (longitude: number): number => {
  return longitude % 30;
};

// Main Calculator
export const calculateNatalChart = (date: Date, lat: number, lng: number) => {
  // Convert JS Date to Astronomy Engine Time
  // Astronomy.MakeTime accepts a Date object directly
  const astroTime = Astronomy.MakeTime(date);

  // 1. Calculate Planets
  // We use "Body.Sun", "Body.Moon", etc.
  // Equator coordinates are returned, we need Ecliptic Longitude.
  // Astronomy.Ecliptic(vector) converts J2000 vector to ecliptic lat/lon.
  
  const getPlanetLong = (body: Astronomy.Body): number => {
    // GeoVector calculates the position relative to Earth
    const vec = Astronomy.GeoVector(body, astroTime, true);
    // Convert to Ecliptic coordinates
    const ecliptic = Astronomy.Ecliptic(vec);
    return ecliptic.elon;
  };

  const sunLong = getPlanetLong(Astronomy.Body.Sun);
  const moonLong = getPlanetLong(Astronomy.Body.Moon);
  const mercuryLong = getPlanetLong(Astronomy.Body.Mercury);
  const venusLong = getPlanetLong(Astronomy.Body.Venus);
  const marsLong = getPlanetLong(Astronomy.Body.Mars);
  const jupiterLong = getPlanetLong(Astronomy.Body.Jupiter);
  const saturnLong = getPlanetLong(Astronomy.Body.Saturn);

  // 2. Calculate Ascendant (Rising Sign)
  // This is slightly complex. Astronomy engine provides `SiderealTime`.
  // Ascendant = atan2(cos(RAMC), -sin(RAMC) * cos(eps) - tan(lat) * sin(eps))
  // Where RAMC = Local Sidereal Time
  
  // However, `astronomy-engine` doesn't have a direct "Ascendant" helper.
  // We can calculate it using the standard formula.
  
  // Step A: Calculate Greenwich Apparent Sidereal Time (GAST) in hours
  const gast = Astronomy.SiderealTime(astroTime);
  
  // Step B: Convert to Local Sidereal Time (LST) in hours
  // Longitude is in degrees. +East, -West. 15 degrees = 1 hour.
  // LST = GAST + Longitude / 15
  let lst = gast + (lng / 15.0);
  // Normalize to 0-24
  lst = lst % 24;
  if (lst < 0) lst += 24;
  
  // Step C: Convert LST to RAMC (Right Ascension of the Medium Coeli) in degrees
  const ramc = lst * 15;
  
  // Step D: Calculate Obliquity of the Ecliptic (epsilon)
  // Standard J2000 value is approx 23.439 degrees, but let's use the engine if possible.
  // Or just use the standard constant for "instant" calculation.
  const eps = 23.4392911; // Obliquity of the ecliptic
  
  // Step E: The Math
  // Formula for Ascendant (ASC):
  // tan(ASC) = cos(RAMC) / ( -sin(RAMC) * cos(eps) - tan(lat) * sin(eps) )
  
  const rad = (deg: number) => deg * (Math.PI / 180);
  const deg = (rad: number) => rad * (180 / Math.PI);
  
  const ramcRad = rad(ramc);
  const epsRad = rad(eps);
  const latRad = rad(lat);
  
  const numerator = Math.cos(ramcRad);
  const denominator = -Math.sin(ramcRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad);
  
  let ascRad = Math.atan2(numerator, denominator);
  let ascDeg = deg(ascRad);
  
  // Normalize to 0-360
  if (ascDeg < 0) ascDeg += 360;
  
  return {
    sun: getZodiacSign(sunLong),
    moon: getZodiacSign(moonLong),
    rising: getZodiacSign(ascDeg),
    mercury: getZodiacSign(mercuryLong),
    venus: getZodiacSign(venusLong),
    mars: getZodiacSign(marsLong),
    jupiter: getZodiacSign(jupiterLong),
    saturn: getZodiacSign(saturnLong)
  };
};
