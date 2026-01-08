import type { NodeProps } from "reactflow";
import { Target, MoonStar, FlaskConical, Users } from "lucide-react";

type Data = { role: "strategist" | "oracle" | "alchemist" | "council" };

export default function FateNode({ data, selected }: NodeProps<Data>) {
  const Icon =
    data.role === "strategist" ? Target :
    data.role === "oracle" ? MoonStar :
    data.role === "alchemist" ? FlaskConical :
    Users;

  const glow =
    data.role === "strategist" ? "border-amber-400/35 text-amber-300 shadow-[0_0_18px_rgba(245,158,11,0.22)]" :
    data.role === "oracle" ? "border-blue-300/35 text-blue-200 shadow-[0_0_18px_rgba(59,130,246,0.18)]" :
    data.role === "alchemist" ? "border-fuchsia-300/35 text-fuchsia-200 shadow-[0_0_18px_rgba(236,72,153,0.18)]" :
    "border-white/18 text-white/80 shadow-[0_0_18px_rgba(255,255,255,0.10)]";

  return (
    <div
      className={[
        "rounded-2xl bg-black/55 backdrop-blur-md border px-5 py-4",
        glow,
        selected ? "ring-2 ring-white/25" : "",
      ].join(" ")}
    >
      <Icon size={18} />
    </div>
  );
}
