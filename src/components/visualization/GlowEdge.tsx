import { BaseEdge, getBezierPath, type EdgeProps } from "reactflow";

export default function GlowEdge(props: EdgeProps) {
  const [path] = getBezierPath(props);
  const gid = `g-${props.id}`;
  const fid = `f-${props.id}`;

  return (
    <>
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(214,178,94,0.08)" />
            <stop offset="50%" stopColor="rgba(214,178,94,0.38)" />
            <stop offset="100%" stopColor="rgba(214,178,94,0.10)" />
          </linearGradient>
          <filter id={fid} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.4" />
          </filter>
        </defs>
      </svg>

      {/* glow layer */}
      <BaseEdge
        path={path}
        style={{
          stroke: `url(#${gid})`,
          strokeWidth: 4,
          filter: `url(#${fid})`,
          opacity: 0.85,
        }}
      />

      {/* crisp layer */}
      <BaseEdge
        path={path}
        style={{
          stroke: "rgba(255,255,255,0.20)",
          strokeWidth: 1.3,
          opacity: 0.9,
        }}
      />
    </>
  );
}
