import { NextResponse } from "next/server";
import { getDailyLines } from "@/lib/dailyLines";
import { type AgentRole } from "@/lib/corpus/omens";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const astroProfile = body?.astroProfile ?? "Sun=Unknown, Moon=Unknown, Rising=Unknown";
  const userSeed = body?.userSeed ?? "";
  const dayKey = body?.dayKey;

  const strategist = getDailyLines({ agent: "strategist" as AgentRole, astroProfile, userSeed, dayKey });
  const oracle = getDailyLines({ agent: "oracle" as AgentRole, astroProfile, userSeed, dayKey });
  const alchemist = getDailyLines({ agent: "alchemist" as AgentRole, astroProfile, userSeed, dayKey });

  return NextResponse.json({
    dayKey: strategist.dayKey,
    lines: {
      strategist: { omen: strategist.omen, transit: strategist.transit },
      oracle: { omen: oracle.omen, transit: oracle.transit },
      alchemist: { omen: alchemist.omen, transit: alchemist.transit },
    },
  });
}
