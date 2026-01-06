// src/utils/planetArchetypes.ts

import type { Element } from './archetypeMatrix';

export type PlanetKey =
  | 'mercury'
  | 'venus'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'
  | 'pluto';

export interface PlanetNotes {
  meaning: string;
  practice: string;
}

export interface PlanetCopy {
  baseTitle: string;                         // 行星基础称号
  baseLine: string;                          // 小卡片第二行说明
  titlesByElement: Partial<Record<Element, string>>; // 按元素微调称号
  notes: PlanetNotes;                        // 更长的解释 + 练习
}

export const PLANET_ARCHETYPES: Record<PlanetKey, PlanetCopy> = {
  // -------------------- MERCURY --------------------
  mercury: {
    baseTitle: 'THE SIGNAL WEAVER',
    baseLine:  'The way your mind threads reality into stories you can act on.',
    titlesByElement: {
      fire:  'THE SPARK SCRIPT',
      earth: 'THE MASTER PLAN',
      air:   'THE SIGNAL WEAVER',
      water: 'THE EMPATHIC ECHO',
    },
    notes: {
      meaning:
        'Mercury shows how you think, learn, and speak. It colours the tone of your inner narrator—whether sharp and strategic, restless and curious, or soft and intuitive. When Mercury is strong, you absorb patterns quickly and can name what others only feel.',
      practice:
        'Today, notice one repeating thought loop. Write it down, and then rewrite it once in a way that gives you more room to move.',
    },
  },

  // -------------------- VENUS --------------------
  venus: {
    baseTitle: 'THE WILD FLAME',
    baseLine:  'The way you decide what deserves your love, time, and devotion.',
    titlesByElement: {
      fire:  'THE WILD FLAME',
      earth: 'THE STONE ROSE',
      air:   'THE SILK THREAD',
      water: 'THE TIDAL HEART',
    },
    notes: {
      meaning:
        'Venus reveals your taste for beauty, pleasure, and connection. It shows what makes you soften, what you find magnetic, and what “worth it” means in your language. When you follow your Venus honestly, relationships and art stop feeling like performance and start feeling like nourishment.',
      practice:
        'Choose one small thing today that feels beautiful or kind to you alone—and say yes to it without asking whether it is productive.',
    },
  },

  // -------------------- MARS --------------------
  mars: {
    baseTitle: 'THE HIDDEN BLADE',
    baseLine:  'The way you say yes, no, and never again when it truly matters.',
    titlesByElement: {
      fire:  'THE FIRST STRIKE',
      earth: 'THE TIDAL SPEAR',
      air:   'THE CUTTING WORD',
      water: 'THE HIDDEN BLADE',
    },
    notes: {
      meaning:
        'Mars describes how you pursue what you want and how you defend yourself when pushed. It is your instinct to move, to fight, to protect. When you ignore your Mars, anger turns inward; when you honour it, courage stops feeling like an accident and starts feeling like a choice.',
      practice:
        'Notice one place where you are silently resentful. Practice saying a simple boundary there: one clear sentence, no apology attached.',
    },
  },

  // -------------------- JUPITER --------------------
  jupiter: {
    baseTitle: 'THE GREAT PROVIDER',
    baseLine:  'Where life keeps opening doors when you lean into trust and growth.',
    titlesByElement: {
      fire:  'THE SOLAR EXPANSION',
      earth: 'THE GOLDEN HARVEST',
      air:   'THE GREAT PROVIDER',
      water: 'THE OCEAN CURRENT',
    },
    notes: {
      meaning:
        'Jupiter marks your native fields of luck, faith, and expansion. It shows where you are naturally generous and where the universe seems to say “more” when you show up. Jupiter is not a lottery ticket; it is a compass pointing toward the kinds of risks that grow your world.',
      practice:
        'Name one area of your life that currently feels supported. Take one extra, humble step in that direction and watch what amplifies.',
    },
  },

  // -------------------- SATURN --------------------
  saturn: {
    baseTitle: 'THE QUIET JUDGE',
    baseLine:  'The lesson you cannot skip and the standard you secretly hold yourself to.',
    titlesByElement: {
      fire:  'THE IRON VOW',
      earth: 'THE ANCIENT WALL',
      air:   'THE QUIET JUDGE',
      water: 'THE DEEP RESERVOIR',
    },
    notes: {
      meaning:
        'Saturn marks the places where reality weighs heavily, but also where mastery is possible. It is the voice that asks, “Will this hold in the long run?” When you work with Saturn instead of fleeing it, what once felt like punishment turns into a backbone.',
      practice:
        'Choose one responsibility you have been avoiding. Do the smallest next step on it for 15 focused minutes, then stop and acknowledge yourself.',
    },
  },

  // -------------------- URANUS --------------------
  uranus: {
    baseTitle: 'THE STORM VISITOR',
    baseLine:  'The part of you that refuses to stay inside the old blueprint.',
    titlesByElement: {
      fire:  'THE RADICAL SPARK',
      earth: 'THE STRANGE AXIS',
      air:   'THE STORM VISITOR',
      water: 'THE FAULTLINE DREAMER',
    },
    notes: {
      meaning:
        'Uranus is your internal lightning: the urge to disrupt stale patterns and to be unmistakably yourself. It brings both sudden freedom and sudden breaks. When you give Uranus a conscious outlet, you can change your life without needing to burn it all down.',
      practice:
        'Identify one small rule you have been following just because “it is always done this way”. Experiment with bending it gently, in a way that feels safe but honest.',
    },
  },

  // -------------------- NEPTUNE --------------------
  neptune: {
    baseTitle: 'THE SIGNAL MIST',
    baseLine:  'Where dream, intuition, and projection blend into one atmosphere.',
    titlesByElement: {
      fire:  'THE SACRED FOG',
      earth: 'THE STONE MIRAGE',
      air:   'THE SIGNAL MIST',
      water: 'THE DREAM VEIL',
    },
    notes: {
      meaning:
        'Neptune softens edges. It is where you idealize, surrender, and sometimes escape. At its highest, it is spiritual sensitivity and artistic vision; at its lowest, it is confusion and self‑erasure. Learning to name what is real and what is wish can turn Neptune from fog into holy water.',
      practice:
        'Notice one place today where you are guessing what others feel instead of asking. Trade one guess for one gentle question.',
    },
  },

  // -------------------- PLUTO --------------------
  pluto: {
    baseTitle: 'THE VOLCANIC HEART',
    baseLine:  'What must die so a truer version of you can finally breathe.',
    titlesByElement: {
      fire:  'THE VOLCANIC HEART',
      earth: 'THE BEDROCK SHIFT',
      air:   'THE SILENT ERASURE',
      water: 'THE UNDERWORLD KEY',
    },
    notes: {
      meaning:
        'Pluto is the engine underneath your visible life. It rules obsessions, power struggles, and the places you rebuild from ruin. It is not gentle, but it is honest: whatever is only half‑alive here will eventually be cleared to make space for something uncompromised.',
      practice:
        'Gently name one attachment that already feels dead but you keep on life support. You do not have to drop it today—just admit its weight, and imagine who you would be without it.',
    },
  },
};
