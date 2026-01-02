import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  console.log("--- API REQUEST RECEIVED ---");
  
  try {
    // 1. Parse Body (Wrap in try-catch to prevent JSON parse errors)
    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.error("JSON Parse Error:", e);
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { message, astroData, mode = 'council', activeAgent = 'strategist' } = body;
    const apiKey = process.env.GEMINI_API_KEY;

    console.log(`Mode: ${mode}, Agent: ${activeAgent}, HasKey: ${!!apiKey}`);

    if (!apiKey) {
      console.error("Error: Missing API Key");
      return NextResponse.json({ error: "Server Configuration Error: Missing API Key" }, { status: 500 });
    }

    // 2. Construct Prompt
    const systemPrompt = `
      You are LUMINA. 
      Mode: ${mode}. Active Agent: ${activeAgent}.
      User Input: "${message}"
      
      ARCHETYPES:
      - Strategist (Sun: ${astroData?.sunSign || 'Unknown'})
      - Oracle (Moon: ${astroData?.moonSign || 'Unknown'})
      - Alchemist (Rising: ${astroData?.risingSign || 'Unknown'})

      OUTPUT FORMAT: STRICT JSON only.
      {
        "turnLabel": "Title",
        "responses": {
          "strategist": ${mode === 'solo' && activeAgent !== 'strategist' ? "null" : "\"text...\""},
          "oracle": ${mode === 'solo' && activeAgent !== 'oracle' ? "null" : "\"text...\""},
          "alchemist": ${mode === 'solo' && activeAgent !== 'alchemist' ? "null" : "\"text...\""}
        }
      }
    `;

    // 3. Prepare Fetch Config
    // Use v1 API and gemini-2.5-flash which is available
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const payload = {
      contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
      generationConfig: {
        temperature: 0.9
      }
    };

    console.log("Sending request to Google...");

    // 4. Execute Fetch with explicit Timeout handling (to avoid hanging)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    console.log("Google Response Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google API Error Body:", errorText);
      throw new Error(`Gemini API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    
    // 5. Parse content safely
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      throw new Error("No text returned from Gemini candidates");
    }

    // Remove Markdown code blocks if present
    const cleanText = rawText.replace(/^```json\n|```$/g, '').trim();
    
    const jsonResponse = JSON.parse(cleanText);
    return NextResponse.json(jsonResponse);

  } catch (error: any) {
    console.error("--- FATAL ERROR IN ROUTE ---");
    console.error(error);
    
    // Return a 500 instead of crashing the process
    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        details: error.message,
        hint: "Check server logs. If in China, ensure you have a proxy." 
      },
      { status: 500 }
    );
  }
}