export type Domain = "career" | "love" | "money" | "self" | "random";
export type AgentRole = "strategist" | "oracle" | "alchemist";

export const DOMAIN_STARTERS: Record<Domain, string[]> = {
  career: [
    "Should I switch jobs within 3 months?",
    "If I choose Offer A vs B, what breaks first?",
    "What is the smallest 'test' before committing?",
    "Where am I overestimating risk?",
    "What should I stop doing immediately?",
    "What does success look like in 90 days?"
  ],
  love: [
    "What am I afraid to ask for in this relationship?",
    "If I stay vs leave, what do I lose?",
    "What boundary do I need this week?",
    "What pattern am I repeating?",
    "What would 'secure' look like for me?",
    "What's the next honest conversation?"
  ],
  money: [
    "Where is the hidden leak in my finances?",
    "What is the safest next move for 30 days?",
    "What should I cut to increase freedom?",
    "If I invest now, what's the worst-case?",
    "What's a low-risk experiment to grow income?",
    "What metric should I track weekly?"
  ],
  self: [
    "What inner conflict is actually driving this?",
    "What am I avoiding admitting?",
    "What would I do if shame wasn't in the room?",
    "What is my real desire underneath the plan?",
    "What habit will change my trajectory fastest?",
    "What does my body feel when I imagine option A?"
  ],
  random: [
    "Give me 3 options and the cost of each.",
    "What's the real decision I'm not naming?",
    "If I do nothing for 3 months, what happens?",
    "What is the smallest next step?",
    "What would you advise if we remove ego?",
    "What's the hidden constraint?"
  ],
};

export function followUpPredictions(params: {
  agent: AgentRole;
  lastUserText: string;
  domain: Domain;
}) {
  // 不调用模型：用固定模板生成“预测分叉”类问题
  const base = params.lastUserText.slice(0, 60);
  return [
    `If I choose A, what happens in 30/90 days? (${base})`,
    `If I choose B, what regret appears first? (${base})`,
    `What is the hidden constraint behind this?`,
  ];
}
