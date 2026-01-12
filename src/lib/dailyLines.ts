import { OMENS, type AgentRole, type CycleType } from "@/lib/corpus/omens";
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
  cycle?: CycleType;
}) {
  const cycle = params.cycle ?? "today";
  const dayKey = params.dayKey ?? dayKeyUTC();
  const seed = `${dayKey}|${params.astroProfile}|${params.userSeed ?? ""}|${params.agent}|${cycle}`;

  const omenList = OMENS[params.agent]?.[cycle] ?? [];
  const omen = omenList.length ? pickLine(omenList, seed) : "";

  const transitList = TRANSITS[cycle] ?? [];
  const transit = transitList.length ? pickLine(transitList, seed) : "";

  return {
    dayKey,
    omen,
    transit,
  };
}
