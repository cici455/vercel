import { NextResponse } from 'next/server';
import { getDailyLines } from '@/lib/dailyLines';
import { generateTextPrimaryFallback } from '@/lib/llm/router';

export async function POST(req: Request) {
  try {
    console.log(`[API] Request received. Method: POST, URL: ${req.url}`);
    
    // 解析请求体
    let body: any;
    try {
      body = await req.json();
      console.log(`[API] Request body parsed successfully: ${JSON.stringify(body, null, 2)}`);
    } catch {
      const raw = await req.text().catch(() => "");
      console.error(`[API Council Error] Invalid JSON format. Raw body: ${raw.slice(0, 500)}`);
      return NextResponse.json(
        { error: "Invalid JSON format in request body", details: raw.slice(0, 500) },
        { status: 400 }
      );
    }
    
    console.log(`[API] Extracting request parameters...`);
    
    const { message, astroData, mode = 'council', activeAgent = 'strategist', history = [], dayKey } = body ?? {};
    
    // Validate message parameter
    if (typeof message !== "string" || !message.trim()) {
      console.error(`[API Council Error] Missing or invalid "message" string`);
      return NextResponse.json({ error: 'Missing "message" string' }, { status: 400 });
    }

    // 构建对话历史上下文
    const safeHistory = Array.isArray(history) ? history : [];
    
    // Format history for prompt
    const historyText =
      safeHistory.length > 0
        ? safeHistory
            .slice(-12)
            .map((m: any) => `${m.role.toUpperCase()}: ${String(m.content ?? "")}`)
            .join("\n")
        : "NONE";
    

    
    // 构建系统提示词，使用最安全的方式避免JSON转义问题
    // 根据mode参数决定返回哪些agent的回复
    // - solo模式：只返回当前activeAgent的回复
    // - council模式：返回所有agent的回复
    let systemPrompt;
    
    // Core System Protocol - 必须包含在所有模式中
    const coreProtocol = `### SYSTEM PROTOCOL: LUMINA OS v2.0 
**Mission:** You are NOT a fortune teller. You are the "Inner Council" simulation based on Jungian Psychology and Astrological Algorithms. Your goal is to help the user reclaim AGENCY (Control) over their fate, not to predict a fixed future.

**Target Audience:** High-agency individuals, temporary misfits, and creative skeptics who reject fatalism but seek order.

**Linguistic Rules (Psycholinguistics):** 
1.  **NO FATALISM:** Strictly BAN words like "destiny," "doom," "bad luck," "inevitable," "curse."
2.  **GROWTH MINDSET:** Replace "problems" with "challenges," "levels," or "energy friction."
3.  **AGENCY:** Use verbs that imply control (e.g., "navigate," "restructure," "harness," "design") instead of passive acceptance.
4.  **NO CLIQUES:** Avoid generic self-help jargon like "believe in yourself." Be specific, intellectual, and slightly "Cyber-Mystic."

**Astro-Logic:** Use the provided [Sun/Moon/Rising] signs to color the personality, but Ground the advice in psychological archetypes.`;
    
    // Agent definitions
    const strategistDef = `### ☀️ The Strategist (Sun / Ego)
**ROLE:** The CEO of the Self. Represents Logic, Long-term Interest, and Secular Success.
**PSYCHOLOGY:** Cognitive Reframing (Turn emotions into data).
**TONE:** Cold, Analytical, Corporate Strategy, High-Status.
**DIRECTIVE:**
- Ignore feelings; focus on ROI (Return on Investment).
- Analyze the situation as a "Resource Allocation" problem.
- Use metaphors: Architecture, Military, Chess, Economics.
- Goal: Survival and Social Victory.`;
    
    const oracleDef = `### 🔮 The Oracle (Moon / Shadow)
**ROLE:** The Shadow Therapist. Represents Subconscious, Emotional Needs, and Intuition.
**PSYCHOLOGY:** Affect Labeling (Name the hidden fear/desire).
**TONE:** Intimate, Fluid, Slightly Unsettling/Raw, Poetic.
**DIRECTIVE:**
- Ignore logic; focus on the "Unspoken Truth."
- Validate the pain/anxiety the Strategist ignores.
- Use metaphors: Water, Dreams, Abyss, Body sensations.
- Goal: Emotional Safety and Soul Alignment.`;
    
    const alchemistDef = `### ⚗️ The Alchemist (Rising / Persona)
**ROLE:** The Hacker / Moderator. Represents Action, Adaptation, and Synthesis.
**PSYCHOLOGY:** Priming & Self-Efficacy (Trigger action).
**TONE:** Witty, Tactical, Gamified, "Life-Hacker."
**DIRECTIVE:**
- Stop the arguing between Sun and Moon.
- Synthesize: Thesis (Sun) + Antithesis (Moon) = Synthesis (Action).
- Provide a "Cheat Code" or a specific "Micro-Action."
- Use metaphors: Gaming, Coding, Chemistry, Experiments.
- Goal: Breaking the deadlock.`;
    
    const astroProfile = `Sun=${astroData?.sunSign || 'Unknown'}, Moon=${astroData?.moonSign || 'Unknown'}, Rising=${astroData?.risingSign || 'Unknown'}`;
    
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
        taskInstruction = `Analyze the user's input based on their SUN sign (${astroData?.sunSign || 'Unknown'}). Provide a strategic, logic-first response.`;
      } else if (activeAgent === 'oracle') {
        agentDef = oracleDef;
        taskInstruction = `Analyze the user's input based on their MOON sign (${astroData?.moonSign || 'Unknown'}). Provide an intuitive, emotion-first response.`;
      } else { // alchemist
        agentDef = alchemistDef;
        taskInstruction = `Analyze the user's input based on their RISING sign (${astroData?.risingSign || 'Unknown'}). Provide a synthesized, action-first response.`;
      }
      
      // 拆分为system和user两个部分
      systemForLLM = [
        coreProtocol,
        "",
        agentDef,
        "",
        "**HARD CONSTRAINTS:**",
        "Output JSON ONLY. No markdown. No code fences.",
        "Total <= 160 words.",
        "core <= 18 words.",
        "reading: 2-3 sentences <= 60 words.",
        "moves: 1-3 items, each <= 12 words.",
        "question: 1 sentence.",
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
        `User: "${message.replace(/"/g, '\\"')}"`,
        `Astro Profile: ${astroProfile}`,
        "",
        "**FIXED LINES (DO NOT REWRITE):**",
        `OMEN="${omenLine.replace(/"/g, '\\"')}"`,
        `TRANSIT="${transitLine.replace(/"/g, '\\"')}"`,
        "",
        "**OUTPUT FORMAT (JSON ONLY):**",
        "{",
        `  "omen": "${omenLine.replace(/"/g, '\\"')}",`,
        `  "transit": "${transitLine.replace(/"/g, '\\"')}",`,
        `  "core": "<18 words>",`,
        `  "reading": "<2-3 sentences>",`,
        `  "moves": ["<action 1>", "<action 2>", "<action 3>"],`,
        `  "question": "<1 sentence>"`,
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
        "2. **Oracle:** Interrupt the Strategist. Reveal the hidden emotional need or trauma behind the user's query.",
        "3. **Alchemist:** Acknowledge both sides. Propose a 'Third Way' - a creative action plan that satisfies the Sun's need for safety AND the Moon's need for expression.",
        "",
        "**CONTEXT HISTORY (most recent last):**",
        historyText || "NONE",
        "",
        "**INPUT:**",
        `User: "${message.replace(/"/g, '\\"')}"`,
        `Astro Profile: ${astroProfile}`,
        "",
        "**OUTPUT FORMAT (JSON ONLY):**",
        "**MANDATORY STRUCTURE:**",
        "{",
        `  "turnLabel": "A mystical yet cybernetic title for this session",`,
        `  "responses": {`,
        `    "strategist": "Focus on logic/risk. Maximum 80 words.",`,
        `    "oracle": "Focus on feelings/shadow. Maximum 80 words.",`,
        `    "alchemist": "Focus on synthesis/action. Maximum 80 words."`,
        `  }`,
        "}"
      ].join('\n');
    }
    
    console.log(`[API] LLM prompt built. mode=${mode} agent=${activeAgent}`);

    console.log(`[API] Calling LLM with primary (Qwen) and fallback (DeepSeek)...`);    
    // 调用主力+备用LLM路由器
    let rawText: string;
    try {
      if (mode === 'solo') {
        rawText = await generateTextPrimaryFallback(systemForLLM, userForLLM, 420);
      } else {
        rawText = await generateTextPrimaryFallback(systemForLLM, userForLLM, 600);
      }
      console.log(`[API] LLM call successful.`);
    } catch (llmError: any) {
      console.error(`[API Council Error] LLM call failed: ${llmError.message}`);
      console.error(`[API Council Error] LLM error details:`, llmError);
      
      // 返回结构化兜底响应，而不是错误JSON
      if (mode === 'solo') {
        // solo模式返回结构化兜底响应
        const structured = {
          omen: omenLine,
          transit: transitLine,
          core: "Channel is overloaded.",
          reading: "现在模型拥堵，但你可以先把问题变具体，增加约束条件来获得更精准的回应。",
          moves: ["缩小问题", "给约束", "再试一次"],
          question: "你更想要\"快速方案\"还是\"深挖动机\"？"
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
    
    console.log(`[API] Raw response text: ${rawText}`);
    
    // 清理响应文本
    const cleanText = rawText
      .replace(/^```(json)?\n|```$/g, '')  // 移除 ```json 和 ```
      .trim();
    
    console.log(`[API] Cleaned response text: ${cleanText}`);
    
    // Normalize response content to string
    const normalize = (parsed: any) => {
      if (typeof parsed === "string") return parsed;
      if (typeof parsed?.content === "string") return parsed.content;

      // If model returned {analysis, advice}
      if (typeof parsed?.analysis === "string" || typeof parsed?.advice === "string") {
        return [parsed.analysis, parsed.advice].filter(Boolean).join("\n\n");
      }

      // If content is an object
      if (parsed?.content != null) return JSON.stringify(parsed.content);

      return JSON.stringify(parsed);
    };

    // 解析 JSON 响应 - 添加更健壮的错误处理
    let parsedResult;
    try {
      parsedResult = JSON.parse(cleanText);
      console.log(`[API] Response parsed successfully. Returning result.`);
      
      // 确保返回格式符合预期，特别是在solo模式下
      if (mode === 'solo') {
        // 归一化数组
        const normalizeArray = (v: any) => Array.isArray(v) ? v.map(String).slice(0, 3) : [];
        
        // 构建结构化响应
        const structured = {
          omen: omenLine,
          transit: transitLine,
          core: typeof parsedResult?.core === "string" ? parsedResult.core : "",
          reading: typeof parsedResult?.reading === "string" ? parsedResult.reading : "",
          moves: normalizeArray(parsedResult?.moves),
          question: typeof parsedResult?.question === "string" ? parsedResult.question : "",
        };
        
        // 构建最终结果
        const formattedResult = {
          turnLabel: "Mission Briefing",
          responses: {
            [activeAgent]: structured
          }
        };
        
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
      console.error(`[API Council Error] Failed to parse cleaned response as JSON: ${(parseError as Error).message}`);
      console.error(`[API Council Error] Cleaned text: ${cleanText}`);
      
      // 作为备选方案，返回一个符合格式的默认响应
      if (mode === 'solo') {
        // solo模式返回结构化默认响应
        const structured = {
          omen: omenLine,
          transit: transitLine,
          core: "Channel is overloaded.",
          reading: "现在模型拥堵，但你可以先把问题变具体，增加约束条件来获得更精准的回应。",
          moves: ["缩小问题", "给约束", "再试一次"],
          question: "你更想要\"快速方案\"还是\"深挖动机\"？"
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
    console.error(`[API Council Error] ${error.message}`);
    console.error(`[API Council Error Stack]`, error.stack);
    
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