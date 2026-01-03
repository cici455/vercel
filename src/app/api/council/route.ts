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

    // 构建对话历史上下文 - 注意：历史记录只用于参考，不在最终prompt中使用，因为Gemini API会处理
    const safeHistory = Array.isArray(history) ? history : [];
    
    // --- 调用 Gemini API ---
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    // 构建系统提示词，使用最安全的方式避免JSON转义问题
    const systemPrompt = [
      "Act as LUMINA (Psychic Council).",
      `Mode: ${mode}. Agent: ${activeAgent}.`,
      `User: "${message.replace(/"/g, '\\"')}"`, // 显式转义双引号
      `Astro: Sun=${astroData?.sunSign || 'Unknown'}, Moon=${astroData?.moonSign || 'Unknown'}, Rising=${astroData?.risingSign || 'Unknown'}.`,
      "",
      "OUTPUT FORMAT: STRICT JSON ONLY. No explanations or additional text.",
      "{",
      `  \"turnLabel\": \"Title\",`,
      `  \"responses\": {`,
      `    "strategist": ${mode === 'solo' && activeAgent !== 'strategist' ? "null" : '"Your strategic advice here"'},`,
      `    "oracle": ${mode === 'solo' && activeAgent !== 'oracle' ? "null" : '"Your oracle insight here"'},`,
      `    "alchemist": ${mode === 'solo' && activeAgent !== 'alchemist' ? "null" : '"Your alchemical transformation here"'}` + ",",
      `  }`,
      `}`
    ].join('\n');
    
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
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prompt) // 只在fetch调用中序列化一次
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
      return NextResponse.json(parsedResult);
    } catch (parseError) {
      console.error(`[API Council Error] Failed to parse cleaned response as JSON: ${(parseError as Error).message}`);
      console.error(`[API Council Error] Cleaned text: ${cleanText}`);
      
      // 作为备选方案，返回一个符合格式的默认响应
      return NextResponse.json({
        turnLabel: "Title",
        responses: {
          strategist: mode === 'solo' && activeAgent !== 'strategist' ? null : "Your strategic advice here",
          oracle: mode === 'solo' && activeAgent !== 'oracle' ? null : "Your oracle insight here",
          alchemist: mode === 'solo' && activeAgent !== 'alchemist' ? null : "Your alchemical transformation here"
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