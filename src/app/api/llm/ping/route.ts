import { NextResponse } from "next/server";
import { generateTextPrimaryFallback } from "@/lib/llm/router";

export const runtime = "nodejs";

export async function GET() {
  try {
    const text = await generateTextPrimaryFallback(
      "Reply with exactly: PONG",
      "PONG",
      32
    );
    return NextResponse.json({ ok: true, text });
  } catch (error: any) {
    console.error(`[LLM Ping Error] ${error.message}`);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}