export type Domain = "career" | "love" | "money" | "self" | "random";

const STARTERS: Record<Domain, [string, string, string]> = {
  career: [
    "Offer A vs Offer B: what's the hidden cost?",
    "If I choose A, what breaks first in 30/90 days?",
    "What's the smallest test before I commit?"
  ],
  love: [
    "If I stay vs leave, what do I lose first?",
    "What boundary do I need this week?",
    "What am I afraid to ask for directly?"
  ],
  money: [
    "Where is the leak in my finances right now?",
    "What's a low-risk experiment to raise income?",
    "If I invest now, what's the worst-case scenario?"
  ],
  self: [
    "What inner conflict is driving this decision?",
    "What am I avoiding admitting?",
    "What would I do if shame wasn't here?"
  ],
  random: [
    "If I do nothing for 3 months, what happens?",
    "Give me 3 options and the cost of each.",
    "What's the smallest test before I commit?"
  ]
};

function hasOffer(text: string) {
  return /offer|A\s*vs\s*B|A\/B|两份|对比/i.test(text);
}
function hasBusiness(text: string) {
  return /business|startup|创业|开公司|合伙/i.test(text);
}

export function getSuggestions(domain: Domain, lastUserText?: string): [string, string, string] {
  const t = (lastUserText ?? "").trim();
  if (!t) return STARTERS[domain];

  if (hasOffer(t)) {
    return [
      "List A/B on pay, growth, stress, freedom—pick your top 1.",
      "If I choose A, what regret appears first?",
      "What constraint am I ignoring (time/money/energy)?"
    ];
  }

  if (hasBusiness(t)) {
    return [
      "What's the smallest sellable version I can test in 7 days?",
      "If I do this part-time for 30 days, what is success?",
      "What kills this first: time, money, or confidence?"
    ];
  }

  return [
    "If I choose path A, what happens in 30/90 days?",
    "What constraint am I ignoring (time/money/energy)?",
    "What am I secretly trying to avoid feeling?"
  ];
}
