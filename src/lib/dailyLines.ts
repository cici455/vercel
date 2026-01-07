import { OMENS, type AgentRole } from "@/lib/corpus/omens";
import { TRANSITS } from "@/lib/corpus/transits";
import { pickLine } from "@/lib/corpus/pick";

export function dayKeyUTC(d = new Date()) {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
}

export function getDailyLines(params: {
  agent: AgentRole;
  astroProfile: string;
  userSeed?: string;
  dayKey?: string;
}) {
  const dayKey = params.dayKey ?? dayKeyUTC();
  const seed = `${dayKey}|${params.astroProfile}|${params.userSeed ?? ""}|${params.agent}`;

  return {
    dayKey,
    omen: pickLine(OMENS[params.agent], seed),
    transit: pickLine(TRANSITS, seed),
  };
}
