// src/utils/planetArchetypes.ts

import type { Element } from './archetypeMatrix';

// 如果你已有 PlanetKey 类型，可以从 astrologySystem 里 import；
// 这里先给出一个兼容的定义：
export type PlanetKey =
  | 'mercury'
  | 'venus'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'
  | 'pluto';

export interface PlanetCopy {
  baseTitle: string;      // 不看星座时的基础称号
  baseLine: string;       // 行星本体的功能描述
  titlesByElement?: Partial<Record<Element, string>>; // 按元素微调称号（可选）
}

export const PLANET_ARCHETYPES: Record<PlanetKey, PlanetCopy> = {
  mercury: {
    baseTitle: 'THE MASTER PLAN',
    baseLine:  'The way your mind lays track far beyond the present moment.',
    titlesByElement: {
      fire:  'THE SPARK SCRIPT',
      earth: 'THE MASTER PLAN',
      air:   'THE SIGNAL WEAVER',
      water: 'THE EMPATHIC ECHO',
    },
  },
  venus: {
    baseTitle: 'THE STONE ROSE',
    baseLine:  'The way you decide what is worth loving, and worth keeping.',
    titlesByElement: {
      fire:  'THE WILD FLAME',
      earth: 'THE STONE ROSE',
      air:   'THE SILK THREAD',
      water: 'THE TIDAL HEART',
    },
  },
  mars: {
    baseTitle: 'THE TIDAL SPEAR',
    baseLine:  'The way you say yes, no, and never again.',
    titlesByElement: {
      fire:  'THE FIRST STRIKE',
      earth: 'THE TIDAL SPEAR',
      air:   'THE CUTTING WORD',
      water: 'THE HIDDEN BLADE',
    },
  },
  jupiter: {
    baseTitle: 'THE DIVINE ORDER',
    baseLine:  'Where life keeps opening doors for you when you trust the pattern.',
    titlesByElement: {
      fire:  'THE SOLAR EXPANSION',
      earth: 'THE GOLDEN HARVEST',
      air:   'THE GREAT PROVIDER',
      water: 'THE OCEAN CURRENT',
    },
  },
  saturn: {
    baseTitle: 'THE ANCIENT WALL',
    baseLine:  'The lesson you cannot skip and the boundary that keeps chaos out.',
    titlesByElement: {
      fire:  'THE IRON VOW',
      earth: 'THE ANCIENT WALL',
      air:   'THE QUIET JUDGE',
      water: 'THE DEEP RESERVOIR',
    },
  },
  uranus: {
    baseTitle: 'THE WANDERER',
    baseLine:  'The part of you that refuses to be normal.',
    titlesByElement: {
      fire:  'THE RADICAL SPARK',
      earth: 'THE STRANGE AXIS',
      air:   'THE WANDERER',
      water: 'THE STORM VISITOR',
    },
  },
  neptune: {
    baseTitle: 'THE DREAM VEIL',
    baseLine:  'Where you blur the line between dream and real.',
    titlesByElement: {
      fire:  'THE SACRED FOG',
      earth: 'THE STONE MIRAGE',
      air:   'THE SIGNAL MIST',
      water: 'THE DREAM VEIL',
    },
  },
  pluto: {
    baseTitle: 'THE UNDERWORLD KEY',
    baseLine:  'What must die so a truer version of you can be reborn.',
    titlesByElement: {
      fire:  'THE VOLCANIC HEART',
      earth: 'THE BEDROCK SHIFT',
      air:   'THE SILENT ERASURE',
      water: 'THE ABYSSAL PULL',
    },
  },
};