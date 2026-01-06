// src/utils/archetypeMatrix.ts

export type Element = 'fire' | 'earth' | 'air' | 'water';

// 12 星座 → 元素（热带黄道，标准占星）
export const ELEMENT_BY_SIGN: Record<string, Element> = {
  aries: 'fire',
  leo: 'fire',
  sagittarius: 'fire',

  taurus: 'earth',
  virgo: 'earth',
  capricorn: 'earth',

  gemini: 'air',
  libra: 'air',
  aquarius: 'air',

  cancer: 'water',
  scorpio: 'water',
  pisces: 'water',
};

export type TensionKey =
  | 'fire-fire' | 'fire-earth' | 'fire-air' | 'fire-water'
  | 'earth-fire' | 'earth-earth' | 'earth-air' | 'earth-water'
  | 'air-fire' | 'air-earth' | 'air-air' | 'air-water'
  | 'water-fire' | 'water-earth' | 'water-air' | 'water-water';

export const TENSION_MATRIX: Record<TensionKey, { label: string; line: string }> = {
  // --- 太阳火 ---
  'fire-fire': {
    label: 'PURE FIRE CURRENT',
    line:  'Your will, wants, and instincts all burn in the same direction.',
  },
  'fire-earth': {
    label: 'FIRE–EARTH FORGE',
    line:  'You dream in sparks but commit to building in stone.',
  },
  'fire-air': {
    label: 'STORM OF IDEAS',
    line:  'Your impulses travel at the speed of thought, rarely sitting still.',
  },
  'fire-water': {
    label: 'BOILING TIDE',
    line:  'Feeling and passion melt together; moods ignite like flares.',
  },

  // --- 太阳土 ---
  'earth-fire': {
    label: 'EARTH–FIRE DUALITY',
    line:  'You build for the long term, yet secretly crave controlled disruption.',
  },
  'earth-earth': {
    label: 'GRAVITY WELL',
    line:  'Stability is both your gift and your weight; you anchor more than you move.',
  },
  'earth-air': {
    label: 'STONE & SIGNAL',
    line:  'You plan in structures but overthink every brick you place.',
  },
  'earth-water': {
    label: 'GARDEN OF DEPTH',
    line:  'You grow what you care for in silence, slow but irreversible.',
  },

  // --- 太阳风 ---
  'air-fire': {
    label: 'FLASHPOINT MIND',
    line:  'Ideas catch fire quickly; you speak things into motion.',
  },
  'air-earth': {
    label: 'BLUEPRINT FRICTION',
    line:  'Your mind wants options; your habits cling to what is proven.',
  },
  'air-air': {
    label: 'PERPETUAL CURRENT',
    line:  'You live in the winds between possibilities; stillness feels unnatural.',
  },
  'air-water': {
    label: 'MIND–TIDE DUALITY',
    line:  'You analyze your feelings even as they drown the logic.',
  },

  // --- 太阳水 ---
  'water-fire': {
    label: 'VOLCANIC HEART',
    line:  'Beneath a soft surface, your feelings erupt in decisive bursts.',
  },
  'water-earth': {
    label: 'DEEP RESERVOIR',
    line:  'You store oceans inside stone walls, loyal beyond reason.',
  },
  'water-air': {
    label: 'MIST & MESSAGES',
    line:  'You intuit first and explain later, translating mood into language.',
  },
  'water-water': {
    label: 'OCEANIC FIELD',
    line:  'You feel everything; boundaries are an ongoing spell you must recast.',
  },
};

export const buildTensionPattern = (sunSign: string, moonSign: string) => {
  if (!sunSign || !moonSign) return { label: '', line: '' };
  const se = ELEMENT_BY_SIGN[sunSign.toLowerCase()];
  const me = ELEMENT_BY_SIGN[moonSign.toLowerCase()];
  if (!se || !me) return { label: '', line: '' };
  const key = `${se}-${me}` as TensionKey;
  return TENSION_MATRIX[key] || { label: '', line: '' };
};