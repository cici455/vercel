import { PlanetName, AspectType } from '../utils/astrologySystem';

export interface NarrativeTemplate {
  id: string;
  transitPlanet?: PlanetName | "Any";
  natalPlanet?: PlanetName | "Any";
  aspect?: AspectType | "Any";
  theme?: string;
  omen: string;
  meaning: string;
  practice: string;
}

export const NARRATIVE_TEMPLATES: NarrativeTemplate[] = [
  // --- SATURN (Discipline/Karma) ---
  {
    id: "saturn_sun_hard",
    transitPlanet: "Saturn",
    natalPlanet: "Sun",
    aspect: "conjunction", // or square/opp
    theme: "discipline",
    omen: "The mountain demands a slow climb.",
    meaning: "Your vitality is being tested by restriction; this is a time for serious work, not applause.",
    practice: "Commit to the hardest task on your list first."
  },
  {
    id: "saturn_general",
    transitPlanet: "Saturn",
    theme: "discipline",
    omen: "What is built slowly stands forever.",
    meaning: "Saturn's influence requires patience and structural integrity in your actions today.",
    practice: "Review your long-term responsibilities."
  },
  
  // --- JUPITER (Growth/Luck) ---
  {
    id: "jupiter_sun_soft",
    transitPlanet: "Jupiter",
    natalPlanet: "Sun",
    aspect: "trine",
    theme: "growth",
    omen: "The crown is heavy with gold.",
    meaning: "Confidence and vitality are high; the universe is saying 'yes' to your identity.",
    practice: "Launch a new idea or ask for a favor."
  },
  {
    id: "jupiter_general",
    transitPlanet: "Jupiter",
    theme: "growth",
    omen: "The horizon expands before you.",
    meaning: "A window of opportunity opens when you embrace optimism and higher learning.",
    practice: "Say yes to an invitation."
  },

  // --- VENUS (Love/Value) ---
  {
    id: "venus_hard",
    transitPlanet: "Venus",
    theme: "love",
    omen: "The rose has thorns to protect its bloom.",
    meaning: "Relationship tension highlights what you truly value versus what you settle for.",
    practice: "Set a boundary with love."
  },
  {
    id: "venus_soft",
    transitPlanet: "Venus",
    theme: "love",
    omen: "Honey flows from the rock.",
    meaning: "Connection comes easily today; beauty and harmony are your natural allies.",
    practice: "Reach out to someone you miss."
  },

  // --- MARS (Action/Conflict) ---
  {
    id: "mars_action",
    transitPlanet: "Mars",
    theme: "desire",
    omen: "Iron sharpens iron.",
    meaning: "Friction is energy waiting to be directed; do not fear the conflict.",
    practice: "Move your body vigorously."
  },
  {
    id: "mars_energy",
    transitPlanet: "Mars",
    theme: "work",
    omen: "The spear flies true.",
    meaning: "Decisive action cuts through confusion; hesitation is your only enemy.",
    practice: "Make a decision you have been delaying."
  },

  // --- PLUTO (Transformation) ---
  {
    id: "pluto_deep",
    transitPlanet: "Pluto",
    theme: "transformation",
    omen: "The seed must break to bloom.",
    meaning: "Deep psychological change is occurring; let the old form die.",
    practice: "Release a habit that drains you."
  },

  // --- NEPTUNE (Dreams) ---
  {
    id: "neptune_fog",
    transitPlanet: "Neptune",
    theme: "dream",
    omen: "The mist reveals more than the light.",
    meaning: "Intuition is stronger than logic today; trust the unseen signals.",
    practice: "Record your dreams or meditate."
  },

  // --- MERCURY (Communication) ---
  {
    id: "mercury_fast",
    transitPlanet: "Mercury",
    theme: "voice",
    omen: "The messenger arrives on winged feet.",
    meaning: "Information moves quickly; clarity comes from quick, adaptable thinking.",
    practice: "Send that email or make that call."
  },
  
  // --- FALLBACKS ---
  {
    id: "fallback_1",
    theme: "general",
    omen: "The stars ask for your presence.",
    meaning: "The cosmic weather is subtle; your power lies in simple awareness.",
    practice: "Breathe deeply and center yourself."
  },
  {
    id: "fallback_2",
    theme: "general",
    omen: "Silence is the loudest answer.",
    meaning: "When direction is unclear, stillness provides the compass.",
    practice: "Wait for clarity before acting."
  }
];
