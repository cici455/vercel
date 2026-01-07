import { NextResponse } from 'next/server';
import { HttpsProxyAgent } from 'https-proxy-agent';

export async function POST(req: Request) {
  try {
    console.log(`[API Debate] Request received. Method: POST, URL: ${req.url}`);
    
    // 解析请求体
    let body: any;
    try {
      body = await req.json();
      console.log(`[API Debate] Request body parsed successfully: ${JSON.stringify(body, null, 2)}`);
    } catch {
      const raw = await req.text().catch(() => "");
      console.error(`[API Debate Error] Invalid JSON format. Raw body: ${raw.slice(0, 500)}`);
      return NextResponse.json(
        { error: "Invalid JSON format in request body", details: raw.slice(0, 500) },
        { status: 400 }
      );
    }
    
    console.log(`[API Debate] Extracting request parameters...`);
    
    const { seedText, history = [], roundIndex = 0, astroProfile, dayKey } = body ?? {};
    
    // Validate required parameters
    if (typeof seedText !== "string" || !seedText.trim()) {
      console.error(`[API Debate Error] Missing or invalid "seedText" string`);
      return NextResponse.json({ error: 'Missing "seedText" string' }, { status: 400 });
    }
    
    const apiKey = process.env.GEMINI_API_KEY;

    // 检查 API 密钥是否存在
    if (!apiKey) {
      console.error("[API Debate Error] Missing GEMINI_API_KEY environment variable");
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
            .slice(-6)
            .map((m: any) => `${m.role?.toUpperCase() || 'UNKNOWN'}: ${String(m.content ?? "")}`)
            .join("\n")
        : "NONE";
    
    // --- 配置代理和Gemini API URL ---
    // 从环境变量读取配置
    const geminiApiBaseUrl = process.env.GEMINI_API_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta';
    const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || '';
    
    console.log(`[API Debate] Using Gemini API base URL: ${geminiApiBaseUrl}`);
    if (proxyUrl) {
      console.log(`[API Debate] Using proxy: ${proxyUrl}`);
    }
    
    // 构建完整的API URL
    const url = `${geminiApiBaseUrl}/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    // Core System Protocol
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
    
    // Build system prompt
    const systemPrompt = [
      coreProtocol,
      "",
      strategistDef,
      "",
      oracleDef,
      "",
      alchemistDef,
      "",
      "**TASK:**",
      "Simulate a debate between the three council members about the seed message.",
      "Each member must provide a concise response (1-3 sentences) that builds on the previous发言.",
      "The debate should progress logically and provide different perspectives on the issue.",
      "",
      "**INPUT DATA:**",
      "**SEED MESSAGE:**",
      seedText,
      "",
      "**CONTEXT HISTORY:**",
      historyText,
      "",
      "**ASTRO PROFILE:**",
      astroProfile || "Sun=Leo, Moon=Virgo, Rising=Libra",
      "",
      "**OUTPUT FORMAT (JSON ONLY):**",
      "{",
      `  "messages": [`,
      `    {"speaker": "strategist", "text": "..."},`,
      `    {"speaker": "oracle", "text": "..."},`,
      `    {"speaker": "alchemist", "text": "..."}`,
      `  ],`,
      `  "state": {`,
      `    "conflict": "...",`,
      `    "options": ["A", "B"],`,
      `    "nextQuestion": "..."`,
      `  }`,
      `}`,
      "",
      "**HARD CONSTRAINTS:**",
      "Each response must be 1-3 sentences only.",
      "Total output must be under 300 words.",
      "No extra sections.",
      "No preamble.",
      "Keep each response concise and focused.",
      "",
      "**FINAL OUTPUT MUST BE JSON ONLY:**"
    ].join('\n');
    
    console.log(`[API Debate] System Prompt: ${systemPrompt}`);
    
    // 构建prompt对象
    const prompt = {
      contents: [{
        parts: [{ 
          text: systemPrompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 400,
        responseMimeType: "application/json"
      }
    };

    console.log(`[API Debate] Calling Gemini API at: ${url}`);
    
    // 根据环境变量配置构建fetch选项
    const fetchOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prompt)
    };
    
    // 如果配置了代理，添加代理选项
    if (proxyUrl) {
      // 使用类型断言，因为agent是Node.js特定的扩展属性
      (fetchOptions as any).agent = new HttpsProxyAgent(proxyUrl);
    }
    
    const response = await fetch(url, fetchOptions);
    
    console.log(`[API Debate] Gemini API response status: ${response.status}`);
    
    // Read raw response text first
    const rawResponse = await response.text();
    console.log(`[API Debate] Gemini API raw response: ${rawResponse}`);
    
    if (!response.ok) {
      console.error(`[API Debate Error] Gemini API request failed: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { 
          error: "Gemini API request failed", 
          details: `${response.status} ${response.statusText}`,
          errorText: rawResponse.slice(0, 500)
        },
        { status: response.status }
      );
    }
    
    let data: any;
    try {
      data = JSON.parse(rawResponse);
      console.log(`[API Debate] Gemini API response data: ${JSON.stringify(data, null, 2)}`);
    } catch (jsonError) {
      console.error(`[API Debate Error] Failed to parse Gemini API response as JSON: ${(jsonError as Error).message}`);
      return NextResponse.json(
        { 
          error: "Failed to parse Gemini API response", 
          details: (jsonError as Error).message,
          rawResponse: rawResponse.slice(0, 500)
        },
        { status: 500 }
      );
    }
    
    // 提取原始文本响应
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!rawText) {
      console.error(`[API Debate Error] No text response found in API result`);
      // Return a fallback response instead of error
      return NextResponse.json({
        messages: [
          { speaker: "strategist", text: "The data suggests a structured approach is needed." },
          { speaker: "oracle", text: "But the emotional undercurrents are pushing against structure." },
          { speaker: "alchemist", text: "We can blend structure with flexibility to create a new path." }
        ],
        state: {
          conflict: "Structure vs. flexibility",
          options: ["Follow a strict plan", "Embrace spontaneity"],
          nextQuestion: "Which approach resonates more with your current situation?"
        }
      });
    }
    
    console.log(`[API Debate] Raw response text: ${rawText}`);
    
    // 清理响应文本
    const cleanText = rawText
      .replace(/^```(json)?\n|```$/g, '')  // 移除 ```json 和 ```
      .trim();
    
    console.log(`[API Debate] Cleaned response text: ${cleanText}`);
    
    // 解析 JSON 响应
    let parsedResult;
    try {
      parsedResult = JSON.parse(cleanText);
      console.log(`[API Debate] Response parsed successfully. Returning result.`);
      
      // Validate response structure
      if (!Array.isArray(parsedResult.messages) || parsedResult.messages.length !== 3) {
        throw new Error("Invalid messages format");
      }
      
      if (!parsedResult.state || typeof parsedResult.state !== "object") {
        throw new Error("Invalid state format");
      }
      
      return NextResponse.json(parsedResult);
    } catch (parseError) {
      console.error(`[API Debate Error] Failed to parse cleaned response as JSON: ${(parseError as Error).message}`);
      console.error(`[API Debate Error] Cleaned text: ${cleanText}`);
      
      // Return fallback response
      return NextResponse.json({
        messages: [
          { speaker: "strategist", text: "The data suggests a structured approach is needed." },
          { speaker: "oracle", text: "But the emotional undercurrents are pushing against structure." },
          { speaker: "alchemist", text: "We can blend structure with flexibility to create a new path." }
        ],
        state: {
          conflict: "Structure vs. flexibility",
          options: ["Follow a strict plan", "Embrace spontaneity"],
          nextQuestion: "Which approach resonates more with your current situation?"
        }
      });
    }

  } catch (error: any) {
    console.error(`[API Debate Error] ${error.message}`);
    console.error(`[API Debate Error Stack]`, error.stack);
    
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
