import { NextResponse } from "next/server";
import { getDailyLines } from "@/lib/dailyLines";
import { type AgentRole } from "@/lib/corpus/omens";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const astroProfile = body?.astroProfile ?? "Sun=Unknown, Moon=Unknown, Rising=Unknown";
  const userSeed = body?.userSeed ?? "";
  const dayKey = body?.dayKey;

  const agents = ["strategist", "oracle", "alchemist"] as const;
  const cycles = ["today", "week", "month", "year"] as const;

  const lines: any = {};
  for (const agent of agents) {
    lines[agent] = {};
    for (const cycle of cycles) {
      lines[agent][cycle] = getDailyLines({
        agent,
        astroProfile,
        userSeed,
        dayKey,
        cycle
      });
    }
  }

  return NextResponse.json({
    dayKey,
    lines
  });
}
