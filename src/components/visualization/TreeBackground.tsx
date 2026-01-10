"use client";

export default function TreeBackground() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 400 800"
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        zIndex: 0,
        pointerEvents: "none",
        filter: "blur(0.5px)",
      }}
    >
      {/* 主干 */}
      <path
        d="M200 800 Q210 600 200 400 Q190 200 200 0"
        stroke="url(#mainGlow)" strokeWidth="16" fill="none"
        opacity="0.7"
      />
      {/* 主干发光 */}
      <path
        d="M200 800 Q210 600 200 400 Q190 200 200 0"
        stroke="url(#mainGlow)" strokeWidth="40" fill="none"
        opacity="0.18"
        filter="url(#blur1)"
      />
      {/* 分支（可加更多） */}
      <path
        d="M200 400 Q250 300 300 200"
        stroke="url(#branchGlow)" strokeWidth="8" fill="none"
        opacity="0.5"
      />
      <path
        d="M200 400 Q150 300 100 200"
        stroke="url(#branchGlow)" strokeWidth="8" fill="none"
        opacity="0.5"
      />
      <defs>
        <linearGradient id="mainGlow" x1="0" y1="800" x2="0" y2="0">
          <stop offset="0%" stopColor="#D6B25E" />
          <stop offset="100%" stopColor="#fff" />
        </linearGradient>
        <linearGradient id="branchGlow" x1="200" y1="400" x2="300" y2="200">
          <stop offset="0%" stopColor="#D6B25E" />
          <stop offset="100%" stopColor="#fff" />
        </linearGradient>
        <filter id="blur1">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>
    </svg>
  );
}
