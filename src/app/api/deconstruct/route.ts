import { NextResponse } from 'next/server';
import { generateTextPrimaryFallback } from '@/lib/llm/router';

export async function POST(req: Request) {
  try {
    console.log(`[API] Deconstruct request received. Method: POST, URL: ${req.url}`);
    
    // 解析请求体
    let body: any;
    try {
      body = await req.json();
      console.log(`[API] Request body parsed successfully: ${JSON.stringify(body, null, 2)}`);
    } catch {
      const raw = await req.text().catch(() => "");
      console.error(`[API Deconstruct Error] Invalid JSON format. Raw body: ${raw.slice(0, 500)}`);
      return NextResponse.json(
        { error: "Invalid JSON format in request body", details: raw.slice(0, 500) },
        { status: 400 }
      );
    }
    
    // 验证必要参数
    const { agent, decreeType, text, reaction, userNote, context } = body ?? {};
    
    if (!agent || !decreeType || !text) {
      console.error(`[API Deconstruct Error] Missing required parameters: agent=${agent}, decreeType=${decreeType}, text=${text}`);
      return NextResponse.json({ error: 'Missing required parameters: agent, decreeType, text' }, { status: 400 });
    }
    
    // 构建系统提示
    const systemPrompt = [
      "### SYSTEM ROLE: Inner Psychologist",
      "You are a compassionate but direct inner psychologist. Your job is to help the user deconstruct harsh or challenging inner voices.",
      "Your goal is to turn judgment into insight, and fear into agency.",
      
      "### MANDATORY OUTPUT STRUCTURE (JSON ONLY):",
      "{",
      `  "trigger": "...", // What about this decree triggers the user?`,
      `  "two_paths": { "if_true": "...", "if_false": "..." }, // Both possibilities, not just one.`,
      `  "skill": "...", // What emotional/mental skill would help here?`,
      `  "micro_experiment": "...", // A small, safe 48-hour experiment to test the decree.`,
      `  "clarifier": "..." // A question to help the user explore further.`,
      "}",
      
      "### RULES:",
      "- Must provide BOTH if_true AND if_false paths (avoid forcing one perspective).",
      "- Tone: Clear, human, professional, non-judgmental.",
      "- micro_experiment MUST be time-bound (48 hours) and executable.",
      "- clarifier MUST be a推进问题 that helps the user dig deeper.",
      "- Do NOT use jargon. Speak in plain language.",
      "- Focus on internal experience, not external events.",
      "- Respect the user's reaction, but don't validate it uncritically.",
      "- Help the user build agency, not dependency.",
    ].join('\n');
    
    // 构建用户提示
    const userPrompt = [
      "**DECONSTRUCT TARGET:**",
      `Agent: ${agent}`,
      `Decree Type: ${decreeType}`,
      `Text: "${text}"`,
      `Reaction: ${reaction || "none"}`,
      `User Note: ${userNote || "none"}`,
      "",
      "**CONTEXT:**",
      `User Message: ${context?.message || "none"}`,
      `Astro Profile: ${context?.astroProfile || "none"}`,
      `Omen: ${context?.omen || "none"}`,
      `Transit: ${context?.transit || "none"}`,
      "",
      "**TASK:**",
      "Deconstruct this decree into actionable insight. Follow the JSON output format exactly.",
    ].join('\n');
    
    console.log(`[API] Calling LLM for deconstruction...`);
    
    // 调用LLM
    let rawText: string;
    try {
      rawText = await generateTextPrimaryFallback(systemPrompt, userPrompt, 400);
      console.log(`[API] LLM call successful.`);
    } catch (llmError: any) {
      console.error(`[API Deconstruct Error] LLM call failed: ${llmError.message}`);
      return NextResponse.json({
        error: "LLM deconstruction failed",
        details: llmError.message
      }, { status: 500 });
    }
    
    console.log(`[API] Raw response text: ${rawText}`);
    
    // 清理响应文本
    const cleanText = rawText
      .replace(/^```(json)?\n|```$/g, '')  // 移除 ```json 和 ```
      .trim();
    
    console.log(`[API] Cleaned response text: ${cleanText}`);
    
    // 解析JSON
    let parsedResult;
    try {
      parsedResult = JSON.parse(cleanText);
      console.log(`[API] Response parsed successfully. Returning result.`);
      
      // 验证必要字段
      if (!parsedResult.trigger || !parsedResult.two_paths || !parsedResult.skill || !parsedResult.micro_experiment || !parsedResult.clarifier) {
        throw new Error("Missing required fields in deconstruction result");
      }
      
      return NextResponse.json(parsedResult);
    } catch (parseError) {
      console.error(`[API Deconstruct Error] Failed to parse cleaned response as JSON: ${(parseError as Error).message}`);
      console.error(`[API Deconstruct Error] Cleaned text: ${cleanText}`);
      
      // 返回兜底响应
      return NextResponse.json({
        trigger: "The decree touches on a sensitive area.",
        two_paths: {
          if_true: "If this decree holds truth, it's pointing to an area needing attention.",
          if_false: "If this decree doesn't resonate, it may be projecting someone else's voice."
        },
        skill: "Emotional discernment - separating helpful feedback from unhelpful judgment.",
        micro_experiment: "For 48 hours, note when similar thoughts arise and what triggers them.",
        clarifier: "What would this decree need to say differently to feel helpful rather than harsh?"
      });
    }
    
  } catch (error: any) {
    console.error(`[API Deconstruct Error] ${error.message}`);
    console.error(`[API Deconstruct Error Stack]`, error.stack);
    
    return NextResponse.json({
      error: "Internal server error",
      details: error.message
    }, { status: 500 });
  }
}
