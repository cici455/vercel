import { NextResponse } from 'next/server';

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
      return NextResponse.json(
        { error: "Invalid JSON format in request body" },
        { status: 400 }
      );
    }
    
    const { message = 'test', astroData, mode = 'council', activeAgent = 'strategist' } = body;
    const apiKey = process.env.GEMINI_API_KEY;

    // 检查 API 密钥是否存在
    if (!apiKey) {
      console.error("[API Council Error] Missing GEMINI_API_KEY environment variable");
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    // --- 调用 Gemini API ---
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const prompt = {
      contents: [{
        parts: [{ 
          text: `
            Act as LUMINA (Psychic Council). 
            Mode: ${mode}. Agent: ${activeAgent}.
            User: "${message}"
            Astro: Sun=${astroData?.sunSign || 'Unknown'}, Moon=${astroData?.moonSign || 'Unknown'}, Rising=${astroData?.risingSign || 'Unknown'}.
            
            OUTPUT FORMAT: STRICT JSON ONLY. No explanations or additional text.
            {
              "turnLabel": "Title",
              "responses": {
                "strategist": ${mode === 'solo' && activeAgent !== 'strategist' ? "null" : '"text response here"'},
                "oracle": ${mode === 'solo' && activeAgent !== 'oracle' ? "null" : '"text response here"'},
                "alchemist": ${mode === 'solo' && activeAgent !== 'alchemist' ? "null" : '"text response here"'}
              }
            }
          `.trim() 
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
        responseMimeType: "application/json"
      }
    };
    
    console.log(`[API] Calling Gemini API at: ${url}`);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(prompt)
    });
    
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
    
    const data = await response.json();
    console.log(`[API] Gemini API response data: ${JSON.stringify(data, null, 2)}`);
    
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
    
    // 解析 JSON 响应
    const parsedResult = JSON.parse(cleanText);
    
    console.log(`[API] Response parsed successfully. Returning result.`);
    return NextResponse.json(parsedResult);

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