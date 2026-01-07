import { OMENS } from "@/lib/corpus/omens";
import { TRANSITS } from "@/lib/corpus/transits";
import { pickLine } from "@/lib/corpus/pick";

export type AgentRole = "strategist" | "oracle" | "alchemist";

export function getDayKeyUTC(d = new Date()) {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
}

export function getDailyLines(params: {
  agent: AgentRole;
  astroProfile: string;      // 例如 "Sun=Leo, Moon=Virgo, Rising=Libra"
  userSeed?: string;         // 可选：用户 id/hash，想更“私人”就传
  dayKey?: string;           // 可选：强制同一天（用于跨页面一致）
}) {
  const dayKey = params.dayKey ?? getDayKeyUTC();
  const seed = `${dayKey}|${params.astroProfile}|${params.userSeed ?? ""}|${params.agent}`;

  const omen = pickLine(OMENS[params.agent], seed);
  const transit = pickLine(TRANSITS, seed);

  return { dayKey, omen, transit };
}
