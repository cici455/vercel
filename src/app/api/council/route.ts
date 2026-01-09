import { NextResponse } from 'next/server';
import { getDailyLines } from '@/lib/dailyLines';
import { generateTextPrimaryFallback } from '@/lib/llm/router';

const q = (v: unknown) => JSON.stringify(String(v ?? ""));

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
    
    // Validate message parameter
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
    const coreProtocol = "### SYSTEM PROTOCOL: LUMINA OS v2.0 \n**Mission:** You are NOT a fortune teller. You are \"Inner Council\" simulation based on Jungian Psychology and Astrological Algorithms. Your goal is to help the user reclaim AGENCY (Control) over their fate, not to predict a fixed future.\n\n**Target Audience:** High-agency individuals, temporary misfits, and creative skeptics who reject fatalism but seek order.\n\n**Linguistic Rules (Psycholinguistics):** \n1. **NO FATALISM:** Strictly BAN words like \"destiny,\" \"doom,\" \"bad luck,\" \"inevitable,\" \"curse.\"\n2. **GROWTH MINDSET:** Replace \"problems\" with \"challenges,\" \"levels,\" or \"energy friction.\"\n3. **AGENCY:** Use verbs that imply control (e.g., \"navigate,\" \"restructure,\" \"harness,\" \"design\") instead of passive acceptance.\n\n**Astro-Logic:** Use the provided [Sun/Moon/Rising] signs to color-code personality, but Ground advice in psychological archetypes.";
    
    // Agent definitions
    const strategistDef = "### ☀️ The Strategist (Sun / Ego)\n**ROLE:** The CEO of the Self. Represents Logic, Long-term Interest, and Secular Success.\n**PSYCHOLOGY:** Cognitive Reframing (Turn emotions into data).\n**TONE:** Cold, Analytical, Corporate Strategy, High-Status.\n**DIRECTIVE:**\n- Ignore feelings; focus on ROI (Return on Investment).\n- Analyze the situation as a \"Resource Allocation\" problem.\n- Use metaphors: Architecture, Military, Chess, Economics.\n- Goal: Survival and Social Victory.";
    const oracleDef = "### 🔮 The Oracle (Moon / Shadow)\n**ROLE:** The Shadow Therapist. Represents Subconscious, Emotional Needs, and Intuition.\n**PSYCHOLOGY:** Affect Labeling (Name hidden fear/desire).\n**TONE:** Intimate, Fluid, Slightly Unsettling/Raw, Poetic.\n**DIRECTIVE:**\n- Ignore logic; focus on the \"Unspoken Truth.\"\n- Validate pain/anxiety that Strategist ignores.\n- Use metaphors: Water, Dreams, Abyss, Body sensations.\n- Goal: Emotional Safety and Soul Alignment.";
    const alchemistDef = "### ⚗️ The Alchemist (Rising / Persona)\n**ROLE:** The Hacker / Moderator. Represents Action, Adaptation, and Synthesis.\n**PSYCHOLOGY:** Priming & Self-Efficacy (Trigger action).\n**TONE:** Witty, Tactical, Gamified, \"Life-Hacker.\"\n**DIRECTIVE:**\n- Stop arguing between Sun and Moon.\n- Synthesize: Thesis (Sun) + Antithesis (Moon) = Synthesis (Action).\n- Provide a \"Cheat Code\" or a specific \"Micro-Action.\"\n- Use metaphors: Gaming, Coding, Chemistry, Experiments.\n- Goal: Breaking the deadlock.";
    
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
        taskInstruction = "Analyze the user's input based on their SUN sign (" + String(astroData?.sunSign || "Unknown") + "). Provide a strategic, logic-first response.";
      } else if (activeAgent === 'oracle') {
        agentDef = oracleDef;
        taskInstruction = "Analyze the user's input based on their MOON sign (" + String(astroData?.moonSign || "Unknown") + "). Provide an intuitive, emotion-first response.";
      } else { // alchemist
        agentDef = alchemistDef;
        taskInstruction = "Analyze the user's input based on their RISING sign (" + String(astroData?.risingSign || "Unknown") + "). Provide a synthesized, action-first response.";
      }
      
      // 拆分为system和user两个部分
      const DECREE_RULES = [
        "### DECREE RULES (MANDATORY)",
        "- Output exactly 3 decrees:",
        '  d1 type="pierce" = blunt truth (stings, not insulting).',
        '  d2 type="cost" = clear consequence / price you pay.',
        '  d3 type="direction" = command (what to do next).',
        "- Each decree must be a complete plain sentence. No metaphors. No slogans.",
        "- No hedging: maybe, might, could, depends.",
        "- Each decree <= 14 words (English) or <= 18 Chinese characters.",
        "- Decrees must be specific to user's message (not generic)."
      ].join("\n");

      const PREDICTION_CLARITY = [
        "### PREDICTION CLARITY (MANDATORY)",
        'If user asks "what happens if I do nothing":',
        "- In angle, include exactly these 3 labeled lines:",
        "  Inner: <what they will feel>",
        "  Behavior: <what they will do/avoid>",
        "  Reality: <what changes in their situation>",
        "- Be decisive about patterns and trade-offs.",
        "- Do NOT claim guaranteed external events (illness/death/legal outcomes)."
      ].join("\n");

      const NO_FOG = [
        "### NO-FOG RULE",
        "- Only omen/transit may sound mystical.",
        "- Everything else must be direct, concrete, and easy to understand."
      ].join("\n");

      const ANTI_GENERIC = [
        "### ANTI-GENERIC RULES (MANDATORY)",
        "- You MUST reference at least 1 user phrase in angle (quote or paraphrase).",
        "- If user input is short, make ONE assumption, label it as Assumption:, then proceed.",
        "- move items must include a time window + deliverable (script/checklist/table).",
        "- why must contain exactly 2 lines:",
        '  "Omen→ In plain terms: ...",',
        '  "Transit→ In plain terms: ...",',
        "- Everything except omen/transit must be plain, professional, and actionable.",
        "- Avoid generic phrases like 'take action', 'stay positive', 'be patient'.",
        "- Use specific, concrete language tailored to the user's situation.",
      ].join("\n");

      // Suggestions generation rules
      const SUGGESTION_RULES = [
        "### SUGGESTION RULES (MANDATORY)",
        "- suggestions MUST be exactly 3 questions the user might ask next.",
        "- Each suggestion must be <= 60 characters (or <= 20 Chinese characters).",
        "- Suggestions must be relevant to the current domain (${body?.domain || 'random'}).",
        "- Suggestions must NOT duplicate existing chips.",
        "- Suggestions must be actionable and specific.",
        '- Format: Return as JSON array: "suggestions": ["question1", "question2", "question3"].',
      ].join("\n");

      systemForLLM = [
        coreProtocol,
        "",
        agentDef,
        "",
        DECREE_RULES,
        "",
        PREDICTION_CLARITY,
        "",
        NO_FOG,
        "",
        ANTI_GENERIC,
        SUGGESTION_RULES,
        "**HARD CONSTRAINTS:**",
        "Output JSON ONLY. No markdown. No code fences.",
        "Total <= 160 words.",
        "Each decree text <= 14 words (or <= 18 Chinese characters).",
        "why: 2 lines, each <= 30 words.",
        "angle: 2-3 sentences <= 60 words.",
        "move: 3 items, each <= 12 words.",
        "script: 1-2 sentences <= 30 words.",
        "question: 1 sentence <= 18 words.",
        "suggestions: 3 questions, each <= 60 characters.",
        "Never rewrite OMEN or TRANSIT. Copy exactly.",
      ].join('\n');

      userForLLM = [
        "**TASK:**",
        taskInstruction,
        "",
        "**CONTEXT HISTORY (most recent last):**",
        historyText || "NONE",
        "",
        "**INPUT:**",
        "User: " + q(message),
        "Astro Profile: " + String(astroProfile ?? ""),
        "",
        "**OUTPUT FORMAT (JSON ONLY):**",
        "{",
        '  "omen": ' + q(omenLine) + ",",
        '  "transit": ' + q(transitLine) + ",",
        '  "decrees": [',
        '    {"id":"d1","type":"pierce","text":"..."},',
        '    {"id":"d2","type":"cost","text":"..."},',
        '    {"id":"d3","type":"direction","text":"..."} ',
        '  ],',
        '  "why": ["Omen→ In plain terms: ...", "Transit→ In plain terms: ..."],',
        '  "formulation": "Conflict→ ...",',
        '  "assumption": "Assumption: ...",',
        '  "angle": "...",',
        '  "move": ["...", "...", "..."],',
        '  "script": "...",',
        '  "question": "...",',
        '  "suggestions": ["...", "...", "..."]',
        "}"
      ].join('\n');
    } else {
      // council模式：让模型为所有三个agent生成独特的回复，模拟内心辩论
      // 拆分为system和user两个部分
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
        "3. **Alchemist:** Acknowledge both sides. Propose a 'Third Way' - a creative action plan that satisfies the Sun's need for safety AND the Moon's need for expression.",
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
    
    // 调用主力+备用LLM路由器
    let rawText: string;
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
        const structured = {
          omen: omenLine,
          transit: transitLine,
          decrees: [
            { id: "d1", type: "pierce", text: "你在逃避说清楚。" },
            { id: "d2", type: "cost", text: "拖延会让代价更大。" },
            { id: "d3", type: "direction", text: "先设边界，再做决定。" }
          ],
          why: [
            "Omen→ In plain terms: show up and face the real constraint.",
            "Transit→ In plain terms: be precise, not fast."
          ],
          formulation: "",
          assumption: "",
          angle: "系统暂时无法处理请求，请稍后再试。",
          move: ["稍后重试", "简化问题", "检查网络连接"],
          script: "请稍后再试，系统正在恢复中。",
          question: "你需要更简单直接的回答吗？"
        };
        
        return NextResponse.json({
          turnLabel: "Mission Briefing",
          responses: {
            [activeAgent]: structured
          }
        });
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
    let parsedResult;
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
        
        // 解析和校验suggestions
        const suggestionsRaw = Array.isArray(parsedResult?.suggestions) ? parsedResult.suggestions : [];
        const suggestions = suggestionsRaw.map(String).slice(0, 3);
        
        // 构建结构化响应
        const structured = {
          omen: omenLine,
          transit: transitLine,
          decrees,
          why: Array.isArray(parsedResult?.why) ? parsedResult.why.map(String).slice(0, 2) : [
            "Omen→ In plain terms: show up and face the real constraint.",
            "Transit→ In plain terms: be precise, not fast."
          ],
          formulation: typeof parsedResult?.formulation === "string" ? parsedResult.formulation : "",
          assumption: typeof parsedResult?.assumption === "string" ? parsedResult.assumption : "",
          angle: typeof parsedResult?.angle === "string" ? parsedResult.angle : "",
          move: Array.isArray(parsedResult?.move) ? parsedResult.move.map(String).slice(0, 3) : [],
          script: typeof parsedResult?.script === "string" ? parsedResult.script : "",
          question: typeof parsedResult?.question === "string" ? parsedResult.question : "",
          suggestions
        };
        
        // 构建最终结果
        const formattedResult = {
          turnLabel: "Mission Briefing",
          responses: {
            [activeAgent]: structured
          }
        };
        
        console.log("[API] structured keys:", Object.keys(structured));
        console.log("[API] decrees:", structured.decrees?.map(d => d.id + ":" + d.type));
        console.log("[API] suggestions:", structured.suggestions);
        
        return NextResponse.json(formattedResult);
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
      
      // 作为备选方案，返回一个符合格式的默认响应
      if (mode === 'solo') {
        // solo模式返回结构化默认响应
        const structured = {
          omen: omenLine,
          transit: transitLine,
          decrees: [
            { id: "d1", type: "pierce", text: "你在逃避说清楚。" },
            { id: "d2", type: "cost", text: "拖延会让代价更大。" },
            { id: "d3", type: "direction", text: "先设边界，再做决定。" }
          ],
          why: [
            "Omen→ In plain terms: show up and face the real constraint.",
            "Transit→ In plain terms: be precise, not fast."
          ],
          formulation: "",
          assumption: "",
          angle: "系统暂时无法处理请求，请稍后再试。",
          move: ["稍后重试", "简化问题", "检查网络连接"],
          script: "请稍后再试，系统正在恢复中。",
          question: "你需要更简单直接的回答吗？",
          suggestions: ["稍后重试", "简化问题", "检查网络连接"]
        };
        
        return NextResponse.json({
          turnLabel: "Mission Briefing",
          responses: {
            [activeAgent]: structured
          }
        });
      } else {
        // council模式返回默认响应
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
