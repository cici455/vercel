export const TRANSITS = {
  today: [
    "Today's currents favor precision over speed.",
    "The air is sharp: say less, decide cleaner.",
    "A slow-burning signal wants commitment.",
    "Small actions today create big changes tomorrow."
  ],
  week: [
    "This week, slow growth beats quick wins.",
    "Patience and planning bring results.",
    "A new cycle begins with careful steps.",
    "Consistency compounds into success."
  ],
  month: [
    "This month, clarity emerges from complexity.",
    "Long-term goals take shape.",
    "Let go of distractions, focus on your core.",
    "Your vision becomes clearer with each step."
  ],
  year: [
    "This year, transformation is inevitable.",
    "Big changes require steady vision.",
    "Your path is shaped by what you commit to.",
    "The seeds you plant now determine your harvest."
  ]
} as const;

export type CycleType = "today" | "week" | "month" | "year";
