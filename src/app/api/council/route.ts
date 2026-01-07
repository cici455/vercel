import { NextResponse } from 'next/server';
import { HttpsProxyAgent } from 'https-proxy-agent';

export async function POST(req: Request) {
  try {
    console.log(`[API] Request received. Method: POST, URL: ${req.url}`);
    
    // 解析请求体
    let body;
    try {
      body = await req.json();
      console.log(`[API] Request body parsed successfully: ${JSON.stringify(body, null, 2)}`);
    } catch (jsonParseError) {
      console.error(`[API Council Error] Failed to parse request body: ${(jsonParseError as Error).message}`);
      console.error(`[API Council Error] Error stack:`, (jsonParseError as Error).stack);
      return NextResponse.json(
        { error: "Invalid JSON format in request body" },
        { status: 400 }
      );
    }
    
    console.log(`[API] Extracting request parameters...`);
    
    const { message = 'test', astroData, mode = 'council', activeAgent = 'strategist', history = [] } = body;
    const apiKey = process.env.GEMINI_API_KEY;

    // 检查 API 密钥是否存在
    if (!apiKey) {
      console.error("[API Council Error] Missing GEMINI_API_KEY environment variable");
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
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
    
    // --- 配置代理和Gemini API URL ---
    // 从环境变量读取配置
    const geminiApiBaseUrl = process.env.GEMINI_API_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta';
    const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || '';
    
    console.log(`[API] Using Gemini API base URL: ${geminiApiBaseUrl}`);
    if (proxyUrl) {
      console.log(`[API] Using proxy: ${proxyUrl}`);
    }
    
    // 构建完整的API URL
    const url = `${geminiApiBaseUrl}/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    

    
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
            systemPrompt = [
        coreProtocol,
        "",
        agentDef,
        "",
        "**TASK:**",
        taskInstruction,
        "",
        "**INPUT DATA:**",
        "**CONTEXT HISTORY (most recent last):**",
        historyText,
        "",
        `User: "${message.replace(/"/g, '\\"')}"`,
        `Astro Profile: ${astroProfile}`,
        "",
        "**OUTPUT FORMAT (JSON ONLY):**",
        "{",
        `  \"turnLabel\": \"Brief, punchy title like a mission briefing\",`,
        `  \"responses\": {`,
        // 只返回当前activeAgent的回复，其他agent返回null
        `    \"strategist\": ${activeAgent === 'strategist' ? '{\\\"analysis\\\": \\"Briefly state the logical conflict based on Sun sign characteristics.\\\", \\"advice\\\": \\"The specific strategic advice using corporate/military metaphors.\\\"}' : "null"},`,
        `    \"oracle\": ${activeAgent === 'oracle' ? '{\\\"analysis\\\": \\"Briefly state the emotional conflict based on Moon sign characteristics.\\\", \\"advice\\\": \\"The specific intuitive advice using poetic/mystical metaphors.\\\"}' : "null"},`,
        `    \"alchemist\": ${activeAgent === 'alchemist' ? '{\\\"analysis\\\": \\"Briefly state the synthesis of strategic and emotional perspectives.\\\", \\"advice\\\": \\"The specific micro-action using gaming/tech metaphors.\\\"}' : "null"},`,
        `  }`,
        `}`
      ].join('\n');
    } else {
      // council模式：让模型为所有三个agent生成独特的回复，模拟内心辩论
      systemPrompt = [
        coreProtocol,
        "",
        strategistDef,
        "",
        oracleDef,
        "",
        alchemistDef,
        "",
        "**TASK:**",
        "Simulate a debate within the user's psyche.",
        "1. **Strategist:** Scold the user for being emotional/irrational. Propose a safe path.",
        "2. **Oracle:** Interrupt the Strategist. Reveal the hidden emotional need or trauma behind the user's query.",
        "3. **Alchemist:** Acknowledge both sides. Propose a 'Third Way' - a creative action plan that satisfies the Sun's need for safety AND the Moon's need for expression.",
        "",
        "**INPUT DATA:**",
        "**CONTEXT HISTORY (most recent last):**",
        historyText,
        "",
        `User: "${message.replace(/"/g, '\\"')}"`,
        `Astro Profile: ${astroProfile}`,
        "",
        "**OUTPUT FORMAT (JSON ONLY):**",
        "{",
        `  \"turnLabel\": \"A mystical yet cybernetic title for this session\",`,
        `  \"responses\": {`,
        `    \"strategist\": \"Focus on logic/risk. Start with 'Look at the data...' or 'Strategically speaking...'\",`,
        `    \"oracle\": \"Focus on feelings/shadow. Start with 'Ignore him...' or 'I feel a disturbance...'\",`,
        `    \"alchemist\": \"Focus on synthesis/action. Start with 'Enough noise...' or 'Here is the hack...'\"`,
        `  }`,
        `}`
      ].join('\n');
    }
    
    console.log(`[API] System Prompt: ${systemPrompt}`);
    
    // 构建prompt对象，不需要提前序列化
    const prompt = {
      contents: [{
        parts: [{ 
          text: systemPrompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000, // 增加maxOutputTokens，确保完整响应
        responseMimeType: "application/json"
      }
    };

    console.log(`[API] Calling Gemini API at: ${url}`);
    console.log(`[API] Prompt: ${JSON.stringify(prompt, null, 2)}`);
    
    // 根据环境变量配置构建fetch选项
    const fetchOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prompt) // 只在fetch调用中序列化一次
    };
    
    // 如果配置了代理，添加代理选项
    if (proxyUrl) {
      // 使用类型断言，因为agent是Node.js特定的扩展属性
      (fetchOptions as any).agent = new HttpsProxyAgent(proxyUrl);
    }
    
    const response = await fetch(url, fetchOptions);
    
    console.log(`[API] Gemini API response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API Council Error] Gemini API request failed: ${response.status} ${response.statusText}`);
      console.error(`[API Council Error Details] ${errorText}`);
      return NextResponse.json(
        { 
          error: "Gemini API request failed", 
          details: `${response.status} ${response.statusText}`,
          errorText: errorText
        },
        { status: response.status }
      );
    }
    
    let data;
    try {
      data = await response.json();
      console.log(`[API] Gemini API response data: ${JSON.stringify(data, null, 2)}`);
    } catch (jsonError) {
      console.error(`[API Council Error] Failed to parse Gemini API response as JSON: ${(jsonError as Error).message}`);
      // 尝试作为文本读取并记录
      const textResponse = await response.text();
      console.error(`[API Council Error] Gemini API raw response: ${textResponse}`);
      return NextResponse.json(
        { 
          error: "Failed to parse Gemini API response", 
          details: (jsonError as Error).message
        },
        { status: 500 }
      );
    }
    
    // 提取原始文本响应
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!rawText) {
      console.error(`[API Council Error] No text response found in API result`);
      return NextResponse.json(
        { error: "Gemini API returned empty response" },
        { status: 500 }
      );
    }
    
    console.log(`[API] Raw response text: ${rawText}`);
    
    // 清理响应文本
    const cleanText = rawText
      .replace(/^```(json)?\n|```$/g, '')  // 移除 ```json 和 ```
      .trim();
    
    console.log(`[API] Cleaned response text: ${cleanText}`);
    
    // 解析 JSON 响应 - 添加更健壮的错误处理
    let parsedResult;
    try {
      parsedResult = JSON.parse(cleanText);
      console.log(`[API] Response parsed successfully. Returning result.`);
      
      // 确保返回格式符合预期，特别是在solo模式下
      const formattedResult = {
        turnLabel: parsedResult.turnLabel || "Title",
        responses: {
          // solo模式下，非activeAgent返回null
          strategist: mode === 'solo' && activeAgent !== 'strategist' ? null : parsedResult.responses?.strategist,
          oracle: mode === 'solo' && activeAgent !== 'oracle' ? null : parsedResult.responses?.oracle,
          alchemist: mode === 'solo' && activeAgent !== 'alchemist' ? null : parsedResult.responses?.alchemist
        }
      };
      
      return NextResponse.json(formattedResult);
    } catch (parseError) {
      console.error(`[API Council Error] Failed to parse cleaned response as JSON: ${(parseError as Error).message}`);
      console.error(`[API Council Error] Cleaned text: ${cleanText}`);
      
      // 作为备选方案，返回一个符合格式的默认响应
      return NextResponse.json({
        turnLabel: "Title",
        responses: {
          strategist: mode === 'solo' && activeAgent !== 'strategist' ? null : (activeAgent === 'strategist' ? {"analysis": "Default analysis", "advice": "Default strategic advice"} : "Your strategic advice here"),
          oracle: mode === 'solo' && activeAgent !== 'oracle' ? null : (activeAgent === 'oracle' ? {"analysis": "Default emotional insight", "advice": "Default oracle advice"} : "Your oracle insight here"),
          alchemist: mode === 'solo' && activeAgent !== 'alchemist' ? null : (activeAgent === 'alchemist' ? {"analysis": "Default synthesis", "advice": "Default alchemical action"} : "Your alchemical transformation here")
        }
      });
    }

  } catch (error: any) {
    console.error(`[API Council Error] ${error.message}`);
    console.error(`[API Council Error Stack]`, error.stack);
    
    // 返回详细的错误信息
    return NextResponse.json(
      { 
        error: "Failed to process request", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}