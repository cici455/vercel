import { NextResponse } from 'next/server';
import { getDailyLines } from '@/lib/dailyLines';
import { generateTextPrimaryFallback } from '@/lib/llm/router';

const q = (v: unknown) => JSON.stringify(String(v ?? ""));

type Sign = string;

const SIGN_LENS: Record<string, { drive: string; shadow: string; need: string }> = {
  Leo: { drive: "visibility and authority", shadow: "control and ego wounds", need: "respect and self-direction" },
  Virgo: { drive: "precision and usefulness", shadow: "perfection loop and anxiety", need: "certainty and competence" },
  Libra: { drive: "harmony and fairness", shadow: "indecision and people-pleasing", need: "clean boundaries without guilt" },
  Unknown: { drive: "unknown", shadow: "unknown", need: "clarity first" }
};

const getLensLine = (agent: string, astro: any) => {
  const sun = String(astro?.sunSign ?? "Unknown");
  const moon = String(astro?.moonSign ?? "Unknown");
  const rising = String(astro?.risingSign ?? "Unknown");

  return "Sun=" + sun + ", Moon=" + moon + ", Rising=" + rising;
};

export async function POST(req: Request) {
  try {
    console.log("[API] Request received. Method: POST, URL:", req.url);
    
    // 解析请求体
    let body: any;
    try {
      body = await req.json();
      console.log("[API] Request body parsed successfully:", JSON.stringify(body, null, 2));
    } catch {
      const raw = await req.text().catch(() => "");
      console.error("[API Council Error] Invalid JSON format. Raw body:", raw.slice(0, 500));
      return NextResponse.json(
        { error: "Invalid JSON format in request body", details: raw.slice(0, 500) },
        { status: 400 }
      );
    }
    
    console.log("[API] Extracting request parameters...");
    
    const { message, astroData, mode = 'council', activeAgent = 'strategist', history = [], dayKey } = body ?? {};
    
    // 构建对话历史上下文
    if (typeof message !== "string" || !message.trim()) {
      console.error("[API Council Error] Missing or invalid \"message\" string");
      return NextResponse.json({ error: 'Missing "message" string' }, { status: 400 });
    }
    
    // 构建对话历史上下文
    const safeHistory = Array.isArray(history) ? history : [];
    
    // Format history for prompt
    const historyText =
      safeHistory.length > 0
        ? safeHistory
            .slice(-12)
            .map((m: any) => m.role.toUpperCase() + ": " + String(m.content ?? ""))
            .join("\n")
        : "NONE";
    
    
    // 构建系统提示词，使用最安全的方式避免JSON转义问题
    // 根据mode参数决定返回哪些agent的回复
    // - solo模式：只返回当前activeAgent的回复
    // - council模式：返回所有agent的回复
    let systemPrompt;
    
    // Core System Protocol - 必须包含在所有模式中
    const coreProtocol = "### SYSTEM PROTOCOL: LUMINA OS v2.0 \n**Mission:** You are NOT a fortune teller. You are \"Inner Council\" simulation based on Jungian Psychology and Astrological Algorithms. Your goal is to help to user reclaim AGENCY (Control) over their fate, not to predict a fixed future.\n\n**Target Audience:** High-agency individuals, temporary misfits, and creative skeptics who reject fatalism but seek order.\n\n**Linguistic Rules (Psycholinguistics):** \n1. **NO FATALISM:** Strictly BAN words like \"destiny,\" \"doom,\" \"bad luck,\" \"inevitable,\" \"curse.\"\n2. **GROWTH MINDSET:** Replace \"problems\" with \"challenges,\" \"levels,\" or \"energy friction.\"\n3. **AGENCY:** Use verbs that imply control (e.g., \"navigate,\" \"restructure,\" \"harness,\" \"design\") instead of passive acceptance.\n\n**Astro-Logic:** Use provided [Sun/Moon/Rising] signs to color-code personality, but Ground advice in psychological archetypes.";
    
    // Agent definitions
    const strategistDef = "### ☀️ The Strategist (Sun / Ego)\n**ROLE:** The CEO of Self. Represents Logic, Long-term Interest, and Secular Success.\n**PSYCHOLOGY:** Cognitive Reframing (Turn emotions into data).\n**TONE:** Cold, Analytical, Corporate Strategy, High-Status.\n**DIRECTIVE:**\n- Ignore feelings; focus on ROI (Return on Investment).\n- Analyze situation as a \"Resource Allocation\" problem.\n- Use metaphors: Architecture, Military, Chess, Economics.\n- Goal: Survival and Social Victory.";
    const oracleDef = "### 🔮 The Oracle (Moon / Shadow)\n**ROLE:** The Shadow Therapist. Represents Subconscious, Emotional Needs, and Intuition.\n**PSYCHOLOGY:** Affect Labeling (Name hidden fear/desire).\n**TONE:** Intimate, Fluid, Slightly Unsettling/Raw, Poetic.\n**DIRECTIVE:**\n- Ignore logic; focus on \"Unspoken Truth.\"\n- Validate pain/anxiety that Strategist ignores.\n- Use metaphors: Water, Dreams, Abyss, Body sensations.\n- Goal: Emotional Safety and Soul Alignment.";
    const alchemistDef = "### ⚗️ The Alchemist (Rising / Persona)\n**ROLE:** The Hacker / Moderator. Represents Action, Adaptation, and Synthesis.\n**PSYCHOLOGY:** Priming & Self-Efficacy (Trigger action).\n**TONE:** Witty, Tactical, Gamified, \"Life-Hacker.\"\n**DIRECTIVE:**\n- Stop arguing between Sun and Moon.\n- Synthesize: Thesis (Sun) + Antithesis (Moon) = Synthesis (Action).\n- Provide a \"Cheat Code\" or a specific \"Micro-Action.\"\n- Use metaphors: Gaming, Coding, Chemistry, Experiments.\n- Goal: Breaking deadlock.";
    
    const astroProfile = "Sun=" + String(astroData?.sunSign || "Unknown") + ", Moon=" + String(astroData?.moonSign || "Unknown") + ", Rising=" + String(astroData?.risingSign || "Unknown");
    
    // Get daily lines for consistency
    const { omen: omenLine, transit: transitLine } = getDailyLines({
      agent: activeAgent as any,
      astroProfile,
      userSeed: body?.userSeed ?? "",
      dayKey
    });
    
    // 声明并初始化LLM所需的变量
    let systemForLLM: string;
    let userForLLM: string;
    
    if (mode === 'solo') {
      // solo模式：只让模型扮演当前选中的agent角色，减少token消耗
      let agentDef;
      let taskInstruction;
      
      if (activeAgent === 'strategist') {
        agentDef = strategistDef;
        taskInstruction = "Analyze user's input based on their SUN sign.";
      } else if (activeAgent === 'oracle') {
        agentDef = oracleDef;
        taskInstruction = "Analyze user's input based on their MOON sign.";
      } else { // alchemist
        agentDef = alchemistDef;
        taskInstruction = "Analyze user's input based on their RISING sign.";
      }
      
      const STYLE_RULES = [
        "### ROLE STYLE (MANDATORY)",
        "- Speak as the energy itself. Do NOT say \"I am the Strategist/Oracle/Alchemist\".",
        "- No therapist disclaimers. No hedging: maybe/might/could/depends.",
        "- Plain, decisive language.",
        "- Do NOT output labels like Omen-> Transit-> Conflict-> Assumption-> or PIERCE/COST/DIRECTION."
      ].join("\n");

      const ORDER_RULES = [
        "### ORDER (MANDATORY)",
        "- First: angle (2–3 sentences, focus on new insight, not repeating chart).",
        "- Then: decrees (3 verdict lines)."
      ].join("\n");

      const COUNCIL_FUSION_RULES = [
        "### COUNCIL FUSION (MANDATORY)",
        "- You are fusion of Sun, Moon, and Rising energies.",
        "- In angle, provide a 2–3 sentence explanation that combines the user's natal chart and today's transit (already shown to the user) with their question.",
        "- Focus on why they are stuck, what they want, and what they fear.",
        "- Do NOT repeat or explain the chart or transit; focus on new insight.",
        "- Do NOT output three separate paragraphs. Show how the three energies interact in user's current question.",
        "- Do NOT use astrology jargon without explanation.",
        "- Do NOT output markdown or code block, only pure JSON."
      ].join("\n");

      const DECREE_RULES = [
        "### DECREES (MANDATORY)",
        "- Return exactly 3 decrees, id d1/d2/d3 with type pierce/cost/direction.",
        "- Each decree is a complete plain sentence, <= 14 words.",
        "- direction must be INNER direction (admit/stop/accept), not an action plan."
      ].join("\n");

      const SUGGEST_RULES = [
        "### SUGGESTIONS (MANDATORY)",
        "- Provide exactly 3 suggestions as next user questions.",
        "- Each <= 60 characters.",
        "- Must be specific to user's question and your angle.",
        "- Must NOT repeat user's original question."
      ].join("\n");

      const BRANCH_RULES = [
        "### DESTINY BRANCHES (MANDATORY)",
        "- Provide exactly 2–3 branches as options for the next step.",
        "- Each branch must be a JSON object with:",
        "  - label: short (<= 18 chars), e.g. \"Set a boundary\", \"Have a talk\"",
        "  - description: 1 sentence, explain what this branch means psychologically and what user will actually do/decide",
        "  - variable: key psychological variable/choice this branch represents (e.g. \"self-respect\", \"decisiveness\", \"seeking support\")",
        "- Branches must be mutually exclusive and cover the main dilemmas in user's question and your angle.",
        "- Branches must be specific to user's question and your angle, not generic.",
        "- If user asks about relationships (e.g., \"I want to break up\"), branches must relate to relationship choices.",
        "- If user asks about business/career (e.g., \"I want to begin a business\"), branches must relate to business decisions.",
        "- Do NOT output markdown or code block, only pure JSON.",
        "- Do NOT use placeholders like \"Option A/B/C\" or \"Reflect deeper\", \"Take action\", \"Seek support\" unless clearly justified."
      ].join("\n");

      const BRANCH_NARRATIVE_RULES = [
        "### BRANCH NARRATIVE (MANDATORY)",
        "- If user's input matches one of your previous branches (label or description), treat it as the user's chosen path.",
        "- For each branch, generate a new angle, decrees, question, and 2–3 new branches, all specific to the choice user made.",
        "- The new angle must explain the psychological meaning and likely outcome of this choice, in plain language.",
        "- The new decrees must reflect the new situation after this choice.",
        "- The new question must help the user reflect on the next dilemma.",
        "- The new branches must be specific to the new situation, not repeat previous options.",
        "- Do NOT repeat the previous angle or decrees. Each branch is a new narrative path.",
        "- If user enters a custom input, treat it as a new branch and continue narrative from there."
      ].join("\n");

      const BRANCHES_SPECIFICITY = [
        "### BRANCHES SPECIFICITY (MANDATORY)",
        "- Each branch (A/B/C) must be directly inspired by your current angle, verdicts, and the user's question.",
        "- Branches must be concrete, actionable, and unique to this round of the conversation.",
        "- Do NOT repeat previous branches or use generic options like \"Reflect deeper\", \"Take action\", \"Seek support\" unless they are clearly justified by the current situation.",
        "- Each branch must have a label, a 1-sentence description, and a psychological variable/keyword.",
        "- If the user is following up on a previous branch, generate new branches that are a logical next step from that choice."
      ].join("\n");

      const PATH_DEPENDENCY = [
        "### PATH DEPENDENCY (MANDATORY)",
        "- If user's input matches a previous branch label or description, treat it as user's chosen path.",
        "- Your angle, decrees, question, and new branches must all be specific to user's current path and previous choices.",
        "- Do NOT repeat or revert to main question or previous answers.",
        "- Each new answer must build on user's last choice, showing consequences, new dilemmas, and next steps unique to that path.",
        "- If user enters a custom input, treat it as a new branch and continue narrative from there."
      ].join("\n");

      const CONTEXT_DISPLAY_RULES = [
        "### CONTEXT DISPLAYED TO USER",
        "- The user's natal chart (Sun, Moon, Rising) and today's transit are already shown at the top of the page.",
        "- Do NOT repeat or explain these in your answer.",
        "- Focus your angle on combining these facts with the user's question to give new insight, not to restate the chart."
      ].join("\n");

      systemForLLM = [
        coreProtocol,
        "",
        agentDef,
        "",
        STYLE_RULES,
        "",
        ORDER_RULES,
        "",
        COUNCIL_FUSION_RULES,
        "",
        DECREE_RULES,
        "",
        SUGGEST_RULES,
        "",
        BRANCH_RULES,
        "",
        BRANCH_NARRATIVE_RULES,
        "",
        BRANCHES_SPECIFICITY,
        "",
        PATH_DEPENDENCY,
        "",
        CONTEXT_DISPLAY_RULES,
        "",
        "### JSON FORMAT STRICTNESS",
        "- Do NOT put a comma after the last item in any array or object.",
        "- Make sure all brackets and braces are closed.",
        "- Do NOT output markdown or code block, only pure JSON.",
        "",
        "**HARD CONSTRAINTS:**",
        "Output JSON ONLY. No markdown. No code fences.",
        "Total <= 160 words.",
        "Each decree text <= 14 words (or <= 18 Chinese characters).",
        "angle: 2-3 sentences <= 60 words.",
        "question: 1 sentence <= 18 words.",
        "suggestions: 3 questions, each <= 60 characters.",
        "branches: 2-3 branches, each with label/description/variable.",
        "Never rewrite OMEN or TRANSIT. Copy exactly.",
      ].join('\n');

      let fewShotExample;
      if (activeAgent === 'strategist') {
        fewShotExample = [
          "### EXAMPLE (DO NOT COPY, FOLLOW STRUCTURE)",
          "",
          "User: \"I want to break up.\"",
          "",
          "NATAL LENS (facts): Sun=Leo, Moon=Virgo, Rising=Libra",
          "",
          "OMEN: \"The water remembers what you deny.\"",
          "TRANSIT: \"A slow-burning signal wants commitment.\"",
          "",
          "OUTPUT FORMAT (JSON ONLY):",
          "{",
          `  "angle": "Your pride is wounded because you feel undervalued, not unloved. You're protecting your need for respect by considering ending things. The real question is whether staying for control is worth sacrificing your dignity."`,
          "  \"decrees\": [",
          "    {\"id\":\"d1\",\"type\":\"pierce\",\"text\":\"You want to be seen, not just needed.\"},",
          "    {\"id\":\"d2\",\"type\":\"cost\",\"text\":\"Staying for pride will erode your self-respect.\"},",
          "    {\"id\":\"d3\",\"type\":\"direction\",\"text\":\"Admit you deserve more than this.\"}",
          "  ],",
          "  \"question\": \"What respect do you actually need?\"",
          "  \"suggestions\": [\"What do I need to feel seen?\", \"What am I afraid to lose?\", \"What boundary would restore my dignity?\"]",
          "}"
        ].join("\n");
      } else if (activeAgent === 'oracle') {
        fewShotExample = [
          "### EXAMPLE (DO NOT COPY, FOLLOW STRUCTURE)",
          "",
          "User: \"I want to break up.\"",
          "",
          "NATAL LENS (facts): Sun=Leo, Moon=Virgo, Rising=Libra",
          "",
          "OMEN: \"The water remembers what you deny.\"",
          "TRANSIT: \"A slow-burning signal wants commitment.\"",
          "",
          "OUTPUT FORMAT (JSON ONLY):",
          "{",
          `  "angle": "Your anxiety is about imperfection, not the relationship itself. You're trying to fix details to avoid facing the messy truth that you're not getting what you need. The real fear is that if you leave, you won't find something better."`,
          "  \"decrees\": [",
          "    {\"id\":\"d1\",\"type\":\"pierce\",\"text\":\"You want to end pain, not love.\"},",
          "    {\"id\":\"d2\",\"type\":\"cost\",\"text\":\"Delaying will turn anxiety into resentment.\"},",
          "    {\"id\":\"d3\",\"type\":\"direction\",\"text\":\"Admit your need, even if it's not perfect.\"}",
          "  ],",
          "  \"question\": \"What truth are you most afraid to say out loud?\"",
          "  \"suggestions\": [\"What do I need most in a relationship?\", \"What am I afraid will happen if I leave?\", \"What boundary would change everything?\"]",
          "}"
        ].join("\n");
      } else {
        fewShotExample = [
          "### EXAMPLE (DO NOT COPY, FOLLOW STRUCTURE)",
          "",
          "User: \"I want to break up.\"",
          "",
          "NATAL LENS (facts): Sun=Leo, Moon=Virgo, Rising=Libra",
          "",
          "OMEN: \"The water remembers what you deny.\"",
          "TRANSIT: \"A slow-burning signal wants commitment.\"",
          "",
          "OUTPUT FORMAT (JSON ONLY):",
          "{",
          `  "angle": "You're stuck between wanting harmony and needing to be the one who makes the hard choice. Your fear of being the disruptor is keeping you in a situation that's already unbalanced. The real move is to accept that breaking the peace is sometimes the only way to find real balance."`,
          "  \"decrees\": [",
          "    {\"id\":\"d1\",\"type\":\"pierce\",\"text\":\"You're trying to be fair to everyone except yourself.\"},",
          "    {\"id\":\"d2\",\"type\":\"cost\",\"text\":\"Fake harmony will drain your energy completely.\"},",
          "    {\"id\":\"d3\",\"type\":\"direction\",\"text\":\"Stop pleasing and start choosing.\"}",
          "  ],",
          "  \"question\": \"What balance are you afraid to disrupt?\"",
          "  \"suggestions\": [\"What do I actually want?\", \"What am I avoiding?\", \"What choice would feel like me?\"]",
          "}"
        ].join("\n");
      }

      userForLLM = [
        "### EXAMPLE 1: RELATIONSHIP QUESTION (DO NOT COPY, FOLLOW STRUCTURE)",
        "",
        "User: \"I want to break up.\"",
        "",
        "NATAL LENS (facts): Sun=Leo, Moon=Virgo, Rising=Libra",
        "",
        "OMEN: \"The water remembers what you deny.\"",
        "TRANSIT: \"A slow-burning signal wants commitment.\"",
        "",
        "OUTPUT FORMAT (JSON ONLY):",
        "{",
        `  "angle": "You're pulled between pride (wanting respect), anxiety (needing certainty), and fear of conflict (wanting harmony). The real challenge is honoring your need for respect without sacrificing your values for false peace."`,
        "  \"decrees\": [",
        "    {\"id\":\"d1\",\"type\":\"pierce\",\"text\":\"You want to be seen, not just needed.\"},",
        "    {\"id\":\"d2\",\"type\":\"cost\",\"text\":\"Staying for pride will erode your self-respect.\"},",
        "    {\"id\":\"d3\",\"type\":\"direction\",\"text\":\"Admit you deserve more than this.\"}",
        "  ],",
        "  \"question\": \"What respect do you actually need?\"",
        "  \"suggestions\": [\"What do I need to feel seen?\", \"What am I afraid to lose?\", \"What boundary would restore my dignity?\"]",
        "  \"branches\": [",
        "    { \"label\": \"Set a boundary\", \"description\": \"Tell your partner what you will and won't accept.\", \"variable\": \"self-respect\" },",
        "    { \"label\": \"Have the talk\", \"description\": \"Say what you need directly without blaming.\", \"variable\": \"communication\" },",
        "    { \"label\": \"Take space\", \"description\": \"Step back for a week to see if you miss them.\", \"variable\": \"clarity\" }",
        "  ]",
        "}",

        "### EXAMPLE 2: BUSINESS QUESTION (DO NOT COPY, FOLLOW STRUCTURE)",
        "",
        "User: \"I want to begin a business.\"",
        "",
        "NATAL LENS (facts): Sun=Leo, Moon=Virgo, Rising=Libra",
        "",
        "OMEN: \"The water remembers what you deny.\"",
        "TRANSIT: \"A slow-burning signal wants commitment.\"",
        "",
        "OUTPUT FORMAT (JSON ONLY):",
        "{",
        `  "angle": "You're torn between ambition (wanting success), perfectionism (needing everything right), and desire for approval (wanting others to value your work). The real challenge is designing a business plan that satisfies your pride, calms your worries, and still feels authentic."`,
        "  \"decrees\": [",
        "    {\"id\":\"d1\",\"type\":\"pierce\",\"text\":\"You want to be recognized, not just busy.\"},",
        "    {\"id\":\"d2\",\"type\":\"cost\",\"text\":\"If you rush, you will lose your sense of control and confidence.\"},",
        "    {\"id\":\"d3\",\"type\":\"direction\",\"text\":\"Be honest about what success really means to you.\"}",
        "  ],",
        "  \"question\": \"What would make you feel proud and secure if you started this business?\"",
        "  \"suggestions\": [\"What does success mean to me?\", \"What am I afraid of losing?\", \"What would make this feel right?\"]",
        "  \"branches\": [",
        "    { \"label\": \"Define your vision\", \"description\": \"Write down what \\\"success\\\" means to you—money, respect, freedom, or something else.\", \"variable\": \"clarity\" },",
        "    { \"label\": \"Talk to customers\", \"description\": \"Interview 5 people who might buy your product.\", \"variable\": \"validation\" },",
        "    { \"label\": \"Build a prototype\", \"description\": \"Create a simple version to test your idea.\", \"variable\": \"action\" }",
        "  ]",
        "}",

        "### EXAMPLE 3: DECISION QUESTION (DO NOT COPY, FOLLOW STRUCTURE)",
        "",
        "User: \"I have two offers.\"",
        "",
        "NATAL LENS (facts): Sun=Leo, Moon=Virgo, Rising=Libra",
        "",
        "OMEN: \"The water remembers what you deny.\"",
        "TRANSIT: \"A slow-burning signal wants commitment.\"",
        "",
        "OUTPUT FORMAT (JSON ONLY):",
        "{",
        `  "angle": "You're caught between ambition (wanting the most prestigious offer), analysis (wanting the most practical option), and desire for fairness (wanting to choose what feels right). The real challenge is evaluating both offers based on what truly matters to you, not what others think."`,
        "  \"decrees\": [",
        "    {\"id\":\"d1\",\"type\":\"pierce\",\"text\":\"Rushing into a choice without clarity will cost you more than you think.\"},",
        "    {\"id\":\"d2\",\"type\":\"cost\",\"text\":\"Take time to understand what each offer truly means to you.\"},",
        "    {\"id\":\"d3\",\"type\":\"direction\",\"text\":\"Be honest about what success really means to you.\"}",
        "  ],",
        "  \"question\": \"What would make you feel most confident about your decision?\"",
        "  \"suggestions\": [\"What do I value most?\", \"What am I afraid of missing?\", \"What would make me proud?\"]",
        "  \"branches\": [",
        "    { \"label\": \"List your values\", \"description\": \"Rank what matters most—money, growth, or stability.\", \"variable\": \"clarity\" },",
        "    { \"label\": \"Ask for details\", \"description\": \"Request specific info about growth potential and culture.\", \"variable\": \"information\" },",
        "    { \"label\": \"Negotiate both\", \"description\": \"See if you can improve the terms of your preferred offer.\", \"variable\": \"leverage\" }",
        "  ]",
        "}",

        "**TASK:**",
        taskInstruction,
        "",
        "- If user input matches a previous branch label or description, or is a custom choice, continue narrative for that path. Do not repeat previous answers.",
        "",
        "**CONTEXT HISTORY (most recent last):**",
        historyText || "NONE",
        "",
        "**INPUT:**",
        "User: " + q(message),
        "NATAL LENS (facts): " + getLensLine(activeAgent, astroData),
        "OMEN: " + q(omenLine),
        "TRANSIT: " + q(transitLine),
        "",
        "**OUTPUT FORMAT (JSON ONLY):**",
        "**MANDATORY STRUCTURE:**",
        "{",
        '  "omen": ...,',
        '  "transit": ...,',
        "  \"angle\": \"A 2–3 sentence explanation that combines the user's natal chart and today's transit (already shown to the user) with their question, focusing on why they are stuck, what they want, and what they fear. Do NOT repeat or explain the chart or transit; focus on new insight.\",",
        '  "decrees": [',
        '    {"id":"d1","type":"pierce","text":"..."},',
        '    {"id":"d2","type":"cost","text":"..."},',
        '    {"id":"d3","type":"direction","text":"..."}',
        "  ],',
        '  "question": "...",',
        '  "suggestions": ["...", "...", "..."],',
        '  "branches": [',
        "    { \"label\": \"Set a boundary\", \"description\": \"Tell your partner what you will and won't accept.\", \"variable\": \"self-respect\" },",
        '    { "label": "Have the talk", "description": "Say what you need directly without blaming.", "variable": "communication" },',
        '    { "label": "Take space", "description": "Step back for a week to see if you miss them.", "variable": "clarity" }',
        '  ]',
        "}"
      ].join("\n");
    } else {
      // council模式：让模型为所有三个agent生成独特的回复，模拟内心辩论
      systemForLLM = [
        coreProtocol,
        "",
        strategistDef,
        "",
        oracleDef,
        "",
        alchemistDef,
        "",
        "**HARD CONSTRAINTS:**",
        "Output JSON ONLY. No markdown. No code fences.",
        "Total <= 250 words.",
        "Each response <= 80 words.",
        "No extra sections.",
        "No preamble.",
        "Keep each response concise and focused.",
      ].join('\n');

      userForLLM = [
        "**TASK:**",
        "Simulate a debate within the user's psyche.",
        "1. **Strategist:** Scold the user for being emotional/irrational. Propose a safe path.",
        "2. **Oracle:** Interrupt the Strategist. Reveal hidden emotional need or trauma behind the user's query.",
        "3. **Alchemist:** Acknowledge both sides. Propose a \"Third Way\" - a creative action plan that satisfies the Sun's need for safety AND the Moon's need for expression.",
        "",
        "**CONTEXT HISTORY (most recent last):**",
        historyText || "NONE",
        "",
        "**INPUT:**",
        "User: " + q(message),
        "Astro Profile: " + String(astroProfile ?? ""),
        "",
        "**OUTPUT FORMAT (JSON ONLY):**",
        "**MANDATORY STRUCTURE:**",
        "{",
        '  "turnLabel": "A mystical yet cybernetic title for this session",',
        '  "responses": {',
        '    "strategist": "Focus on logic/risk. Maximum 80 words.",',
        '    "oracle": "Focus on feelings/shadow. Maximum 80 words.",',
        '    "alchemist": "Focus on synthesis/action. Maximum 80 words."',
        '  }',
        "}"
      ].join("\n");
    }
    
    console.log("[API] LLM prompt built.", { mode, activeAgent });
    console.log("[API] Calling LLM with primary (Qwen) and fallback (DeepSeek)...");
    
    // Helper function to normalize branches to 2-3 items
    // Only use defaults when LLM output is completely empty or invalid
    const normalizeBranches = (branches: any[]) => {
      let normalized = Array.isArray(branches) ? branches.filter(b => b && b.label && b.description && b.variable) : [];

      // Deduplicate by label
      normalized = normalized.filter((b, i, arr) => arr.findIndex(x => x.label === b.label) === i);

      // Only use defaults if we have NO valid branches at all
      // If we have 1-3 valid branches, use them as-is (even if fewer than 2)
      if (normalized.length === 0) {
        // Default branches to fill up to 2-3 (only when LLM output is completely empty)
        // These are generic fallbacks that should rarely be used
        const defaultBranches = [
          { label: "Clarify your goal", description: "Write down what you want to achieve and why it matters.", variable: "clarity" },
          { label: "Take one step", description: "Choose one small action you can take today.", variable: "action" },
          { label: "Reflect deeper", description: "Ask yourself what you're really afraid of.", variable: "awareness" }
        ];

        // Fill up to minimum 2 branches
        while (normalized.length < 2) {
          normalized.push(defaultBranches[normalized.length]);
        }
      }

      // Limit to maximum 3 branches
      if (normalized.length > 3) {
        normalized = normalized.slice(0, 3);
      }

      return normalized;
    };

    // 调用主力+备用LLM路由器
    let rawText = "";
    try {
      if (mode === 'solo') {
        rawText = await generateTextPrimaryFallback(systemForLLM, userForLLM, 520);
      } else {
        rawText = await generateTextPrimaryFallback(systemForLLM, userForLLM, 650);
      }
      console.log("[API] LLM call successful.");
    } catch (llmError: any) {
      console.error("[API Council Error] LLM call failed:", llmError.message);
      console.error("[API Council Error] LLM error details:", llmError);
      
      // 返回结构化兜底响应，而不是错误JSON
      if (mode === 'solo') {
        // solo模式返回结构化兜底响应
        let parsedResult: any = null;
        
        try {
          parsedResult = JSON.parse(rawText);
        } catch {
          parsedResult = null;
        }
        
        const structured = { 
          angle: typeof parsedResult?.angle === "string" ? parsedResult.angle : "", 
          decrees: Array.isArray(parsedResult?.decrees) ? parsedResult.decrees : [], 
          question: typeof parsedResult?.question === "string" ? parsedResult.question : "", 
          suggestions: Array.isArray(parsedResult?.suggestions) ? parsedResult.suggestions.map(String).slice(0, 3) : [],
          branches: normalizeBranches(Array.isArray(parsedResult?.branches) ? parsedResult.branches : [])
        }; 
        
        if (!structured.angle.trim()) structured.angle = "You are stuck because you are protecting safety over truth."; 
        if (structured.decrees.length !== 3) { 
          structured.decrees = [ 
            { id: "d1", type: "pierce", text: "You are avoiding real truth." }, 
            { id: "d2", type: "cost", text: "Delay increases emotional cost." }, 
            { id: "d3", type: "direction", text: "Admit what you want without bargaining." } 
          ]; 
        } 
        if (structured.suggestions.length !== 3) { 
          structured.suggestions = [ 
            "What do I actually want?", 
            "What fear is controlling me?", 
            "What would a clean next question be?" 
          ]; 
        } 
        structured.branches = normalizeBranches(structured.branches);
        
        return NextResponse.json({ turnLabel: "Mission Briefing", responses: { [activeAgent]: structured } });
      } else {
        // council模式返回结构化兜底响应
        return NextResponse.json({
          turnLabel: "Response",
          responses: {
            strategist: "The stars are aligning, but the message is unclear. Please try again.",
            oracle: "I sense a disturbance in the cosmic flow. Let's try a different approach.",
            alchemist: "The elements need more time to coalesce. Let's refine our query."
          }
        });
      }
    }
    
    console.log("[API] Raw response text:", rawText);
    
    // 清理响应文本
    const cleanText = rawText
      .replace(/^```(json)?\n|```$/g, '')  // 移除 ```json 和 ```
      .trim();
    
    console.log("[API] Cleaned response text:", cleanText);
    
    // Normalize response content to string
    const normalize = (parsed: any) => {
      if (typeof parsed === "string") return parsed;
      if (parsed == null) return "";
      if (typeof parsed === "number" || typeof parsed === "boolean") return String(parsed);

      // Common case: { content: "..." }
      if (typeof (parsed as any).content === "string") return (parsed as any).content;
      
      // Common case: { analysis: "...", advice: "..." }
      const maybe = parsed as any;
      if (typeof maybe.analysis === "string" || typeof maybe.advice === "string") {
        return [maybe.analysis, maybe.advice].filter(Boolean).join("\n\n");
      }

      // Fallback
      try { return JSON.stringify(parsed); } catch { return String(parsed); }
    };
    
    // 解析 JSON 响应 - 添加更健壮的错误处理
    let parsedResult: any = null;

    try {
      parsedResult = JSON.parse(cleanText);
      console.log("[API] Response parsed successfully. Returning result.");
      
      // 确保返回格式符合预期，特别是在solo模式下
      if (mode === 'solo') {
        // 归一化数组
        const normalizeArray = (v: any) => Array.isArray(v) ? v.map(String).slice(0, 3) : [];
        
        // 解析和校验decrees
        const decreesRaw = Array.isArray(parsedResult?.decrees) ? parsedResult.decrees : [];
        const pickDecree = (id: "d1"|"d2"|"d3", type: any, fallback: string) => {
          const found = decreesRaw.find((d: any) => d?.id === id) || {};
          return {
            id,
            type: (type === "pierce" || type === "cost" || type === "direction") ? type : (id==="d1"?"pierce":id==="d2"?"cost":"direction"),
            text: (typeof found.text === "string" && found.text.trim()) ? found.text.trim().slice(0, 40) : fallback
          };
        };
        const decrees = [
          pickDecree("d1", parsedResult?.decrees?.[0]?.type, "你在逃避说清楚。"),
          pickDecree("d2", parsedResult?.decrees?.[1]?.type, "拖延会让代价更大。"),
          pickDecree("d3", parsedResult?.decrees?.[2]?.type, "先设边界，再做决定。"),
        ];
        
        // 构建结构化响应
        const structured = { 
          angle: typeof parsedResult?.angle === "string" ? parsedResult.angle : "", 
          decrees: Array.isArray(parsedResult?.decrees) ? parsedResult.decrees : [], 
          question: typeof parsedResult?.question === "string" ? parsedResult.question : "", 
          suggestions: Array.isArray(parsedResult?.suggestions) ? parsedResult.suggestions.map(String).slice(0, 3) : [],
          branches: normalizeBranches(Array.isArray(parsedResult?.branches) ? parsedResult.branches : [])
        }; 
        
        if (!structured.angle.trim()) structured.angle = "You are stuck because you are protecting safety over truth."; 
        if (structured.decrees.length !== 3) { 
          structured.decrees = [ 
            { id: "d1", type: "pierce", text: "You are avoiding real truth." }, 
            { id: "d2", type: "cost", text: "Delay increases emotional cost." }, 
            { id: "d3", type: "direction", text: "Admit what you want without bargaining." } 
          ]; 
        } 
        if (structured.suggestions.length !== 3) { 
          structured.suggestions = [ 
            "What do I actually want?", 
            "What fear is controlling me?", 
            "What would a clean next question be?" 
          ]; 
        } 
        structured.branches = normalizeBranches(structured.branches);
        
        return NextResponse.json({ turnLabel: "Mission Briefing", responses: { [activeAgent]: structured } });
      } else {
        // council模式保持原有逻辑
        const formattedResult = {
          turnLabel: parsedResult.turnLabel || "Title",
          responses: {
            strategist: normalize(parsedResult.responses?.strategist),
            oracle: normalize(parsedResult.responses?.oracle),
            alchemist: normalize(parsedResult.responses?.alchemist)
          }
        };
        
        return NextResponse.json(formattedResult);
      }
    } catch (parseError) {
      console.error("[API Council Error] Failed to parse cleaned response as JSON:", (parseError as Error).message);
      console.error("[API Council Error] Cleaned text:", cleanText);
      
      // 尝试自动修正 JSON
      let parsedResult: any = null;
      try {
        // 尝试修正最后一个逗号/缺失右括号
        const fixed = cleanText
          .replace(/,\s*}/g, "}") // 去掉对象末尾多余逗号
          .replace(/,\s*]/g, "]") // 去掉数组末尾多余逗号
          .replace(/}\s*$/g, "}") // 确保对象以 } 结尾
          .replace(/]\s*$/g, "]"); // 确保数组以 ] 结尾
        parsedResult = JSON.parse(fixed);
        console.log("[API] Auto-corrected JSON successfully.");
      } catch (e2) {
        console.error("[API Council Error] Auto-correction failed:", (e2 as Error).message);
        parsedResult = null;
      }
      
      // 如果自动修正成功，使用修正后的结果
      if (parsedResult) {
        if (mode === 'solo') {
          const structured = { 
            angle: typeof parsedResult?.angle === "string" ? parsedResult.angle : "", 
            decrees: Array.isArray(parsedResult?.decrees) ? parsedResult.decrees : [], 
            question: typeof parsedResult?.question === "string" ? parsedResult.question : "", 
            suggestions: Array.isArray(parsedResult?.suggestions) ? parsedResult.suggestions.map(String).slice(0, 3) : [],
            branches: Array.isArray(parsedResult?.branches) ? parsedResult.branches.slice(0, 3) : []
          };
          
          if (!structured.angle.trim()) structured.angle = "You are stuck because you are protecting safety over truth."; 
          if (structured.decrees.length !== 3) { 
            structured.decrees = [ 
              { id: "d1", type: "pierce", text: "You are avoiding real truth." }, 
              { id: "d2", type: "cost", text: "Delay increases emotional cost." }, 
              { id: "d3", type: "direction", text: "Admit what you want without bargaining." } 
            ]; 
          } 
          if (structured.suggestions.length !== 3) { 
            structured.suggestions = [ 
              "What do I actually want?", 
              "What fear is controlling me?", 
              "What would a clean next question be?" 
            ]; 
          } 
          structured.branches = normalizeBranches(structured.branches);
          
          return NextResponse.json({ turnLabel: "Mission Briefing", responses: { [activeAgent]: structured } });
        }
      }
    } catch (error: any) {
    console.error("[API Council Error]", error.message);
    console.error("[API Council Error Stack]", error.stack);
    
    // 返回结构化兜底响应，而不是错误JSON
    return NextResponse.json({
      turnLabel: "Response",
      responses: {
        strategist: "The stars are aligning, but the message is unclear. Please try again.",
        oracle: "I sense a disturbance in the cosmic flow. Let's try a different approach.",
        alchemist: "The elements need more time to coalesce. Let's refine our query."
      }
    });
  }
}