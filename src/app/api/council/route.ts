import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  console.log("--- API REQUEST RECEIVED ---");
  
  try {
    // 1. Parse Body
    const body = await req.json();

    const { message, astroData, mode = 'council', activeAgent = 'strategist' } = body;
    const apiKey = process.env.GEMINI_API_KEY;

    console.log(`Mode: ${mode}, Agent: ${activeAgent}, HasKey: ${!!apiKey}`);

    if (!apiKey) {
      throw new Error("Missing API Key");
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

      OUTPUT FORMAT: STRICT JSON only. NO MARKDOWN. NO CODE BLOCKS.
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
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const payload = {
      contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
      generationConfig: {
        temperature: 0.9
      }
    };

    console.log("Sending request to Google...");

    // 4. Execute Fetch with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    console.log("Google Response Status:", response.status);
    console.log("Google Response Headers:", JSON.stringify(Object.fromEntries(response.headers)));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google API Error Body:", errorText);
      throw new Error(`Gemini API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    // 5. Get raw response text first for debugging
    const rawResponseText = await response.text();
    console.log("Google Raw Response:", rawResponseText);
    
    // Try to parse as JSON directly first
    let data;
    try {
      data = JSON.parse(rawResponseText);
    } catch (e) {
      console.error("Failed to parse Google response as JSON:", e);
      console.error("Raw response:", rawResponseText);
      throw new Error(`Invalid JSON from Google: ${rawResponseText.substring(0, 100)}...`);
    }
    
    // 6. Get the text from candidates
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      console.error("No text found in candidates:", JSON.stringify(data, null, 2));
      throw new Error("No text returned from Gemini candidates");
    }

    console.log("Raw text from Gemini:", rawText);

    // 7. Remove ANY Markdown code blocks (more robust pattern)
    const cleanText = rawText
      .replace(/^```(json)?\n|```$/g, '')  // Remove ```json and ```
      .replace(/^\s+/, '')                 // Remove leading whitespace
      .replace(/\s+$/, '')                 // Remove trailing whitespace
      .trim();
    
    console.log("Cleaned text:", cleanText);
    
    // 8. Parse the cleaned JSON
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(cleanText);
    } catch (e) {
      console.error("Failed to parse cleaned text as JSON:", e);
      console.error("Cleaned text:", cleanText);
      throw new Error(`Invalid JSON after cleaning: ${cleanText.substring(0, 100)}...`);
    }
    
    console.log("Final JSON response:", JSON.stringify(jsonResponse, null, 2));
    return NextResponse.json(jsonResponse);
  
  } catch (error: any) {
    console.error("--- FATAL ERROR IN ROUTE ---");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    // Return a detailed error response
    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        details: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}