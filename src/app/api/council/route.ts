import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyA5Hn4QMVGSWBBtaqOEUWD9Qtkv1q2rOhU");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, astroData, mode = 'council', activeAgent = 'strategist', history = [] } = body;

    // --- 1. DYNAMIC SYSTEM PROMPT CONSTRUCTION ---
    // This injects the "Soul" into the AI based on the current user state.
    
    const systemPrompt = `
      You are LUMINA, a specialized "Psychic Council" engine.
      You are simulating a user's internal psychological conflict using Jungian Archetypes and Astrology.

      === CURRENT STATE ===
      - User Input: "${message}"
      - Interaction Mode: ${mode.toUpperCase()}
      - Active Speaker(s): ${mode === 'council' ? 'ALL THREE (Debate)' : `ONLY ${activeAgent.toUpperCase()} (Deep Dive)`}

      === THE ARCHETYPES ===
      
      1. 🧠 THE STRATEGIST (Sun Sign: ${astroData.sunSign || 'Unknown'})
         - Role: The Ego, The CEO, The Rational Father.
         - Tone: Cold, authoritative, risk-averse, "Cruel but fair."
         - Mission: Protect the user's assets and social status. Ignore emotions.
      
      2. 🔮 THE ORACLE (Moon Sign: ${astroData.moonSign || 'Unknown'})
         - Role: The Id, The Mystic, The Shadow.
         - Tone: Poetic, eerie, cryptic, intense.
         - Mission: Reveal the hidden emotional truth. Contradict the Strategist's logic.
      
      3. ⚗️ THE ALCHEMIST (Rising Sign: ${astroData.risingSign || 'Unknown'})
         - Role: The Persona, The Hacker, The Doer.
         - Tone: Energetic, cyberpunk, tactical.
         - Mission: Synthesize the conflict into a concrete ACTION PLAN (Steps).

      === INSTRUCTIONS ===
      ${mode === 'council'
        ? "Generate a 3-way debate. The characters should reference each other. Keep it punchy."
        : `You are now speaking ONLY as the ${activeAgent}. Ignore the others. Dive deep into your specific worldview. Be conversational.`
      }

      === OUTPUT FORMAT (STRICT JSON) ===
      Return ONLY valid JSON. Do not use Markdown code blocks.
      
      {
        "turnLabel": "A short 2-5 word poetic title for this turn",
        "responses": {
          "strategist": ${mode === 'solo' && activeAgent !== 'strategist' ? "null" : "\"String content...\""},
          "oracle": ${mode === 'solo' && activeAgent !== 'oracle' ? "null" : "\"String content...\""},
          "alchemist": ${mode === 'solo' && activeAgent !== 'alchemist' ? "null" : "\"String content (use bullet points for steps)...\""}
        }
      }
    `;

    // --- 2. CALL GEMINI ---
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro", // High reasoning capability
      systemInstruction: systemPrompt,
      generationConfig: {
        responseMimeType: "application/json", // Force JSON
        temperature: 0.8 // High creativity
      }
    });

    const chat = model.startChat({
      history: history.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }] // Fixed: msg.content instead of msg.parts
      }))
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    return Response.json(JSON.parse(responseText));

  } catch (error) {
    console.error("Gemini API Error:", error);
    return Response.json({ error: "Failed to consult the stars." }, { status: 500 });
  }
}