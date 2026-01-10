import type { NodeProps } from "reactflow";
import { Target, MoonStar, FlaskConical, Users } from "lucide-react";

type Data = { role: "strategist" | "oracle" | "alchemist" | "council"; type?: "main" | "branch" | "custom" };

export default function FateNode({ data, selected }: NodeProps<Data>) {
  let glow, icon;
  if (data.type === "main") {
    glow = "border-amber-400/35 text-amber-300 shadow-[0_0_18px_rgba(245,158,11,0.22)]";
    icon = <Target size={18} />;
  } else if (data.type === "branch") {
    glow = "border-blue-400/35 text-blue-200 shadow-[0_0_18px_rgba(59,130,246,0.18)]";
    icon = <MoonStar size={18} />;
  } else if (data.type === "custom") {
    glow = "border-fuchsia-400/35 text-fuchsia-200 shadow-[0_0_18px_rgba(236,72,153,0.18)]";
    icon = <FlaskConical size={18} />;
  } else {
    glow = "border-white/18 text-white/80 shadow-[0_0_18px_rgba(255,255,255,0.10)]";
    icon = <Users size={18} />;
  }

  return (
    <div className="relative flex items-center justify-center">
      {/* Spinning Gear for Selected Node */}
      {selected && (
        <div className="absolute inset-[-6px] rounded-full border border-dashed border-white/30 animate-[spin_10s_linear_infinite]" />
      )}
      {selected && (
         <div className="absolute inset-[-12px] rounded-full border border-dotted border-white/10 animate-[spin_20s_linear_infinite_reverse]" />
      )}

      <div
        className={[
          "rounded-2xl bg-black/55 backdrop-blur-md border px-5 py-4",
          glow,
          selected ? "ring-2 ring-white/25" : "",
        ].join(" ")}
      >
        {icon}
      </div>
    </div>
  );
}
