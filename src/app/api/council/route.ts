import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, astroData, mode = 'council', activeAgent = 'strategist' } = body;
    const apiKey = process.env.GEMINI_API_KEY;

    // --- MOCK RESPONSES FOR DEVELOPMENT ---
    const mockResponse = {
      turnLabel: "Cosmic Guidance",
      responses: {
        strategist: mode === 'solo' && activeAgent !== 'strategist' ? null : `I am your Strategist. Focus on your path. ${message}`,
        oracle: mode === 'solo' && activeAgent !== 'oracle' ? null : `I am your Oracle. The stars align for you. Trust your intuition.`,
        alchemist: mode === 'solo' && activeAgent !== 'alchemist' ? null : `I am your Alchemist. Transform your dreams into reality.`
      }
    };

    // Check if API key is provided
    if (!apiKey) {
      console.warn("[API Council Warning] Missing API key. Using mock response.");
      return NextResponse.json(mockResponse);
    }

    // --- SYSTEM PROMPT ---
    const systemPrompt = `
      Act as LUMINA (Psychic Council). 
      Mode: ${mode}. Agent: ${activeAgent}.
      User: "${message}"
      Astro: Sun=${astroData?.sunSign}, Moon=${astroData?.moonSign}, Rising=${astroData?.risingSign}.
      
      OUTPUT FORMAT: STRICT JSON ONLY.
      {
        "turnLabel": "Title",
        "responses": {
          "strategist": ${mode === 'solo' && activeAgent !== 'strategist' ? "null" : "\"text...\""},
          "oracle": ${mode === 'solo' && activeAgent !== 'oracle' ? "null" : "\"text...\""},
          "alchemist": ${mode === 'solo' && activeAgent !== 'alchemist' ? "null" : "\"text...\""}
        }
      }
    `;

    // --- GEMINI API CALL --- (使用正确的 API 格式)
    try {
      // 使用正确的 API 端点、模型名称和 API 版本
      const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
      console.log(`[API] Connecting to Gemini API with model: gemini-2.5-flash...`);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey // 使用正确的 API 密钥头部
        },
        body: JSON.stringify({
          // 使用正确的请求体格式
          contents: [{
            parts: [{ text: systemPrompt }]
          }]
        }),
        timeout: 10000 // 10 second timeout
      });

      if (!response.ok) {
        console.error(`[Gemini API Error] ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        console.error(`[Gemini API Error Details] ${errorText}`);
        return NextResponse.json(mockResponse);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!rawText) {
        console.warn("[Gemini API Warning] Empty response. Using mock response.");
        return NextResponse.json(mockResponse);
      }
      
      // 清理响应文本
      let cleanText = rawText
        .replace(/^```(json)?\n|```$/g, '')  // Remove ```json and ```
        .replace(/^\s+/, '')                 // Remove leading whitespace
        .replace(/\s+$/, '')                 // Remove trailing whitespace
        .trim();
      
      // 尝试解析 JSON
      try {
        const result = JSON.parse(cleanText);
        console.log(`[API] Gemini API call successful.`);
        return NextResponse.json(result);
      } catch (jsonParseError) {
        console.error(`[Gemini API JSON Parse Error] ${jsonParseError.message}`);
        console.error(`[Gemini API Raw Response] ${rawText}`);
        
        // 如果 JSON 解析失败，使用模拟数据
        return NextResponse.json(mockResponse);
      }
    } catch (fetchError) {
      console.error(`[Gemini API Fetch Error] ${fetchError.message}`);
      return NextResponse.json(mockResponse);
    }

  } catch (error: any) {
    console.error("[API Council Error]", error);
    
    // Return a safe mock response even if everything fails
    return NextResponse.json({
      turnLabel: "Cosmic Guidance",
      responses: {
        strategist: "The stars are aligned. Focus on your journey.",
        oracle: null,
        alchemist: null
      }
    });
  }
}