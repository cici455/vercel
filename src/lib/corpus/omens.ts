export const OMENS = {
  strategist: {
    today: [
      "The stars ask for your presence.",
      "A clean system survives chaos.",
      "Your discipline is your greatest asset today.",
      "Structure is your ally in uncertain times."
    ],
    week: [
      "This week, structure is your ally.",
      "Long-term vision brings order.",
      "Discipline shapes the week ahead.",
      "Your plans need clarity and execution."
    ],
    month: [
      "This month, clarity is your compass.",
      "Build on solid ground.",
      "Your strategy determines your success.",
      "Order emerges from consistent action."
    ],
    year: [
      "This year, your discipline shapes destiny.",
      "Patience is your greatest asset.",
      "Your long-term vision will guide you.",
      "Structure and planning create lasting results."
    ]
  },
  oracle: {
    today: [
      "The water remembers what you deny.",
      "Your shadow is asking to be seen.",
      "Listen to what your feelings are telling you.",
      "Your intuition knows the way forward."
    ],
    week: [
      "This week, your feelings are a map.",
      "Let intuition guide your choices.",
      "Your emotions reveal hidden truths.",
      "Trust the whispers of your soul."
    ],
    month: [
      "This month, old wounds seek healing.",
      "Embrace your emotional truth.",
      "Your shadow holds important messages.",
      "Feelings are your compass this month."
    ],
    year: [
      "This year, your soul seeks integration.",
      "Let go of what no longer serves.",
      "Your emotional journey deepens.",
      "Intuition becomes your strongest guide."
    ]
  },
  alchemist: {
    today: [
      "Turn fear into fuel.",
      "Small moves rewrite fate.",
      "Transform obstacles into opportunities.",
      "Your actions today create tomorrow."
    ],
    week: [
      "This week, experiment boldly.",
      "Transformation is a process.",
      "Adaptability is your superpower.",
      "Change is the only constant."
    ],
    month: [
      "This month, adapt and evolve.",
      "Innovation brings new paths.",
      "Your creativity transforms challenges.",
      "Embrace the unknown with courage."
    ],
    year: [
      "This year, your actions create new worlds.",
      "Embrace the unknown.",
      "Transformation is inevitable.",
      "Your boldness shapes the future."
    ]
  }
} as const;

export type AgentRole = keyof typeof OMENS;
export type CycleType = "today" | "week" | "month" | "year";
