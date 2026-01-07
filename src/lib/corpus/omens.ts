export const OMENS = {
  strategist: [
    "The stars ask for your presence.",
    "A clean system survives chaos.",
  ],
  oracle: [
    "The water remembers what you deny.",
    "Your shadow is asking to be seen.",
  ],
  alchemist: [
    "Turn fear into fuel.",
    "Small moves rewrite fate.",
  ],
} as const;

export type AgentRole = keyof typeof OMENS;
