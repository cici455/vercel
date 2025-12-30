import { AspectSignal } from './astrologySystem';
import { NARRATIVE_TEMPLATES, NarrativeTemplate } from '../data/narrativeTemplates';

export interface OmenOutput {
  headline: string;
  omen: string;
  notes: {
    meaning: string;
    practice: string;
  };
  provenance: {
    signalsUsed: AspectSignal[];
    templateId: string;
  };
}

// Simple hash function for seeding
function cyrb53(str: string, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

export function generateDailyOmen(
  userId: string, // or name+birthdate
  date: Date,
  signals: AspectSignal[],
  history: string[] = [] // List of recently used template IDs
): OmenOutput {
  const dateStr = date.toISOString().split('T')[0];
  const seed = cyrb53(`${userId}-${dateStr}`);
  
  // 1. Filter viable templates based on signals
  // We look at the top 3 signals
  const topSignals = signals.slice(0, 3);
  
  let candidates: { template: NarrativeTemplate; signal: AspectSignal | null }[] = [];

  // Match signals to templates
  for (const signal of topSignals) {
    const matches = NARRATIVE_TEMPLATES.filter(t => {
      const planetMatch = t.transitPlanet === "Any" || t.transitPlanet === signal.transitPlanet;
      const themeMatch = !t.theme || t.theme === signal.theme;
      // Strict aspect matching can be added here if templates support it
      return planetMatch && themeMatch;
    });
    
    matches.forEach(m => candidates.push({ template: m, signal }));
  }

  // Add fallbacks if candidates is low
  const fallbacks = NARRATIVE_TEMPLATES.filter(t => t.theme === "general");
  fallbacks.forEach(f => candidates.push({ template: f, signal: null }));

  // 2. Filter out recent history to avoid repetition
  const freshCandidates = candidates.filter(c => !history.includes(c.template.id));
  
  // If we filtered everything out, use candidates (relaxed constraint), otherwise use fresh
  const finalPool = freshCandidates.length > 0 ? freshCandidates : candidates;

  // 3. Deterministic Selection
  // Use the seed to pick an index
  const index = seed % finalPool.length;
  const selection = finalPool[index];

  return {
    headline: "TODAY'S OMEN",
    omen: selection.template.omen,
    notes: {
      meaning: selection.template.meaning,
      practice: selection.template.practice
    },
    provenance: {
      signalsUsed: selection.signal ? [selection.signal] : [],
      templateId: selection.template.id
    }
  };
}
