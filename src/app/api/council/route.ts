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

    // 构建对话历史上下文 - 注意：历史记录只用于参考，不在最终prompt中使用，因为Gemini API会处理
    const safeHistory = Array.isArray(history) ? history : [];
    
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
    
    if (mode === 'solo') {
      // solo模式：只让模型扮演当前选中的agent角色，减少token消耗
      systemPrompt = [
        `Act as ${activeAgent.charAt(0).toUpperCase() + activeAgent.slice(1)} from LUMINA (Psychic Council).`,
        `User: "${message.replace(/"/g, '\\"')}"`, // 显式转义双引号
        `Astro: Sun=${astroData?.sunSign || 'Unknown'}, Moon=${astroData?.moonSign || 'Unknown'}, Rising=${astroData?.risingSign || 'Unknown'}.`,
        "",
        "OUTPUT FORMAT: STRICT JSON ONLY. No explanations or additional text.",
        "{",
        `  \"turnLabel\": \"Title\",`,
        `  \"responses\": {`,
        // 只返回当前activeAgent的回复，其他agent返回null
        `    \"strategist\": ${activeAgent === 'strategist' ? '\"Your strategic advice here\"' : "null"},`,
        `    \"oracle\": ${activeAgent === 'oracle' ? '\"Your oracle insight here\"' : "null"},`,
        `    \"alchemist\": ${activeAgent === 'alchemist' ? '\"Your alchemical transformation here\"' : "null"}` + ",",
        `  }`,
        `}`
      ].join('\n');
    } else {
      // council模式：让模型为所有三个agent生成独特的回复
      systemPrompt = [
        "Act as LUMINA (Psychic Council). Generate unique responses for all three agents.",
        `User: "${message.replace(/"/g, '\\"')}"`, // 显式转义双引号
        `Astro: Sun=${astroData?.sunSign || 'Unknown'}, Moon=${astroData?.moonSign || 'Unknown'}, Rising=${astroData?.risingSign || 'Unknown'}.`,
        "",
        "RESPONSE GUIDELINES:",
        "1. STRATEGIST: Practical, actionable advice based on analysis and planning",
        "2. ORACLE: Intuitive, mystical insights and foresight",
        "3. ALCHEMIST: Transformational perspectives, turning challenges into opportunities",
        "",
        "OUTPUT FORMAT: STRICT JSON ONLY. No explanations or additional text.",
        "{",
        `  \"turnLabel\": \"Title\",`,
        `  \"responses\": {`,
        `    \"strategist\": \"[Strategist's response]\",`,
        `    \"oracle\": \"[Oracle's response]\",`,
        `    \"alchemist\": \"[Alchemist's response]\"` + ",",
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