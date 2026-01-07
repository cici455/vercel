import { NextResponse } from "next/server";
import { getDailyLines } from "@/lib/dailyLines";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const astroProfile = body?.astroProfile ?? "Sun=Unknown, Moon=Unknown, Rising=Unknown";
    const userSeed = body?.userSeed ?? ""; // 可为空
    const dayKey = body?.dayKey;           // 可不传

    const strategist = getDailyLines({ agent: "strategist", astroProfile, userSeed, dayKey });
    const oracle = getDailyLines({ agent: "oracle", astroProfile, userSeed, dayKey });
    const alchemist = getDailyLines({ agent: "alchemist", astroProfile, userSeed, dayKey });

    return NextResponse.json({
      dayKey: strategist.dayKey,
      lines: {
        strategist: { omen: strategist.omen, transit: strategist.transit },
        oracle: { omen: oracle.omen, transit: oracle.transit },
        alchemist: { omen: alchemist.omen, transit: alchemist.transit },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate daily lines" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  // For testing purposes, return daily lines with default values
  const astroProfile = "Sun=Leo, Moon=Virgo, Rising=Libra";
  
  const strategist = getDailyLines({ agent: "strategist", astroProfile });
  const oracle = getDailyLines({ agent: "oracle", astroProfile });
  const alchemist = getDailyLines({ agent: "alchemist", astroProfile });

  return NextResponse.json({
    dayKey: strategist.dayKey,
    lines: {
      strategist: { omen: strategist.omen, transit: strategist.transit },
      oracle: { omen: oracle.omen, transit: oracle.transit },
      alchemist: { omen: alchemist.omen, transit: alchemist.transit },
    },
  });
}
