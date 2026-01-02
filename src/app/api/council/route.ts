import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini with the correct API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyA5Hn4QMVGSWBBtaqOEUWD9Qtkv1q2rOhU");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, astroData, mode = 'council', activeAgent = 'strategist', history = [] } = body;

    // Simple test response to verify API is working
    const testResponse = {
      turnLabel: "Test Response",
      responses: {
        strategist: mode === 'council' || activeAgent === 'strategist' ? "This is a test response from the Strategist." : null,
        oracle: mode === 'council' || activeAgent === 'oracle' ? "This is a test response from the Oracle." : null,
        alchemist: mode === 'council' || activeAgent === 'alchemist' ? "This is a test response from the Alchemist." : null
      }
    };

    return Response.json(testResponse);

  } catch (error) {
    console.error("API Error:", error);
    return Response.json({ error: "Failed to consult the stars." }, { status: 500 });
  }
}