import { NextResponse } from 'next/server';
import { HttpsProxyAgent } from 'https-proxy-agent';

// FORCE NODE.JS TO USE PROXY
// Try 7890 (Clash default). If user uses v2ray/others, they might need 10809.
const PROXY_URL = process.env.HTTP_PROXY || "http://127.0.0.1:7890";
const agent = new HttpsProxyAgent(PROXY_URL);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, astroData, mode = 'council', activeAgent = 'strategist' } = body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) throw new Error("Missing API Key");

    console.log(`[API] Connecting to Gemini via Proxy: ${PROXY_URL}...`);

    // 1. Construct Prompt
    const systemPrompt = `
      Act as LUMINA (Psychic Council).
      Mode: ${mode}. Agent: ${activeAgent}.
      User: "${message}"
      Astro: Sun=${astroData?.sunSign}, Moon=${astroData?.moonSign}, Rising=${astroData?.risingSign}.
      
      OUTPUT: JSON ONLY.
      {
        "turnLabel": "Title",
        "responses": {
          "strategist": ${mode === 'solo' && activeAgent !== 'strategist' ? "null" : "\"text...\""},
          "oracle": ${mode === 'solo' && activeAgent !== 'oracle' ? "null" : "\"text...\""},
          "alchemist": ${mode === 'solo' && activeAgent !== 'alchemist' ? "null" : "\"text...\""}
        }
      }
    `;

    // 2. Fetch with Proxy Agent
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
        generationConfig: {
          temperature: 0.9
        }
      }),
      // @ts-ignore - Next.js/Node fetch supports agent, but types might complain
      agent: agent  
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("[Gemini API Error]", response.status, err);
      throw new Error(`Google Error: ${response.statusText} - ${err}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!rawText) throw new Error("Empty response from Gemini");
    
    // Remove Markdown code blocks if present
    const cleanText = rawText
      .replace(/^```(json)?\n|```$/g, '')  // Remove ```json and ```
      .replace(/^\s+/, '')                 // Remove leading whitespace
      .replace(/\s+$/, '')                 // Remove trailing whitespace
      .trim();
    
    const result = JSON.parse(cleanText);
    return NextResponse.json(result);

  } catch (error: any) {
    console.error("[FATAL ERROR]", error);
    return NextResponse.json(
      { error: "Connection Failed", details: error.message, hint: "Make sure your VPN is on port 7890" }, 
      { status: 500 }
    );
  }
}