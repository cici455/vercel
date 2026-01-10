import type { NodeProps } from "reactflow";
import { Target, MoonStar, FlaskConical, Users } from "lucide-react";

type Data = { role: "strategist" | "oracle" | "alchemist" | "council" };

export default function FateNode({ data, selected }: NodeProps<Data>) {
  const Icon =
    data.role === "strategist" ? Target :
    data.role === "oracle" ? MoonStar :
    data.role === "alchemist" ? FlaskConical :
    Users;

  const gradient =
    data.role === "strategist" ? "from-amber-500/40 to-amber-600/20" :
    data.role === "oracle" ? "from-blue-500/40 to-blue-600/20" :
    data.role === "alchemist" ? "from-fuchsia-500/40 to-fuchsia-600/20" :
    "from-white/30 to-white/10";

  const glow =
    data.role === "strategist" ? "shadow-[0_0_20px_rgba(245,158,11,0.4)]" :
    data.role === "oracle" ? "shadow-[0_0_20px_rgba(59,130,246,0.4)]" :
    data.role === "alchemist" ? "shadow-[0_0_20px_rgba(236,72,153,0.4)]" :
    "shadow-[0_0_20px_rgba(255,255,255,0.3)]";

  return (
    <div
      className={[
        "w-16 h-16 rounded-full bg-gradient-to-br backdrop-blur-md border-2",
        gradient,
        data.role === "strategist" ? "border-amber-400/50" :
        data.role === "oracle" ? "border-blue-300/50" :
        data.role === "alchemist" ? "border-fuchsia-300/50" :
        "border-white/30",
        glow,
        selected ? "ring-2 ring-white/40" : "",
        "flex items-center justify-center",
      ].join(" ")}
    >
      <Icon size={20} className={
        data.role === "strategist" ? "text-amber-300" :
        data.role === "oracle" ? "text-blue-200" :
        data.role === "alchemist" ? "text-fuchsia-200" :
        "text-white/80"
      } />
    </div>
  );
}
