import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  console.log("--- API REQUEST RECEIVED ---");
  
    // 1. Parse Body (No error handling - let it crash)
    const body = await req.json();

    const { message, astroData, mode = 'council', activeAgent = 'strategist' } = body;
    const apiKey = process.env.GEMINI_API_KEY;

    console.log(`Mode: ${mode}, Agent: ${activeAgent}, HasKey: ${!!apiKey}`);

    // 2. Check API Key (No error handling - let it crash)
    if (!apiKey) {
      throw new Error("Missing API Key");
    }

    // 3. Construct Prompt
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

    // 4. Prepare Fetch Config
    // Use v1 API and gemini-2.5-flash which is available
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const payload = {
      contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
      generationConfig: {
        temperature: 0.9
      }
    };

    console.log("Sending request to Google...");

    // 5. Execute Fetch without timeout (No error handling - let it crash)
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    console.log("Google Response Status:", response.status);

    // 6. Check Response Status (No error handling - let it crash)
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google API Error Body:", errorText);
      throw new Error(`Gemini API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    
    // 7. Parse content (No error handling - let it crash)
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      throw new Error("No text returned from Gemini candidates");
    }

    // Remove Markdown code blocks if present
    const cleanText = rawText.replace(/^```json\n|```$/g, '').trim();
    
    // 8. Parse JSON Response (No error handling - let it crash)
    const jsonResponse = JSON.parse(cleanText);
    return NextResponse.json(jsonResponse);
}