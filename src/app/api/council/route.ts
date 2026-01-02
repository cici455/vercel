import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, astroData, mode = 'council', activeAgent = 'strategist' } = body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) return NextResponse.json({ error: "Missing API Key" }, { status: 500 });

    // --- SYSTEM PROMPT (Keep your logic) ---
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

    // --- THE FIX: USE A MIRROR URL ---
    // Instead of 'generativelanguage.googleapis.com', we use a proxy if provided in env, 
    // or fallback to the official one (which requires VPN).
    
    // TRICK: You can try using a known third-party proxy for testing if you can't configure VPN.
    // For now, let's revert to standard fetch but with BETTER ERROR LOGGING.
    
    const baseUrl = process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com";
    const url = `${baseUrl}/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    console.log(`[API] Connecting to: ${baseUrl}...`);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
        generationConfig: {
          temperature: 0.9
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Gemini API Error]", response.status, errorText);
      // Return the error to frontend instead of crashing
      return NextResponse.json({ error: "Gemini API Refused", details: errorText }, { status: response.status });
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!rawText) throw new Error("Empty response");
    
    // Remove Markdown code blocks if present
    const cleanText = rawText
      .replace(/^```(json)?\n|```$/g, '')  // Remove ```json and ```
      .replace(/^\s+/, '')                 // Remove leading whitespace
      .replace(/\s+$/, '')                 // Remove trailing whitespace
      .trim();
    
    const result = JSON.parse(cleanText);
    return NextResponse.json(result);

  } catch (error: any) {
    console.error("[FATAL NETWORK ERROR]", error);
    // CRITICAL: Return JSON even on crash, so frontend doesn't break
    return NextResponse.json(
      { 
        error: "Network Failure", 
        details: error.message,
        suggestion: "If you are in China, you MUST set a proxy in your terminal or use a mirror URL."
      }, 
      { status: 500 }
    );
  }
}