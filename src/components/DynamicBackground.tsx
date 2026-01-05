import React from 'react';

export function DynamicBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-transparent">
      {/* 底层渐变 */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080413] via-[#05010a] to-black opacity-60" />

      {/* 霓虹光团 1 */}
      <div className="absolute -left-1/3 -top-1/4 w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-[#22d3ee] via-[#6366f1] to-transparent opacity-55 blur-2xl animate-orbit-slow" />

      {/* 霓虹光团 2 */}
      <div className="absolute right-[-20%] top-1/4 w-[50vw] h-[50vw] rounded-full bg-gradient-to-tl from-[#a855f7] via-[#ec4899] to-transparent opacity-55 blur-2xl animate-orbit-medium" />

      {/* 霓虹光团 3 */}
      <div className="absolute left-1/4 bottom-[-20%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-tr from-[#22c55e] via-[#22d3ee] to-transparent opacity-45 blur-2xl animate-orbit-fast" />

      {/* 少量闪烁星点 */}
      <div className="absolute inset-0 opacity-40 mix-blend-screen">
        <span className="absolute top-[10%] left-[20%] w-1 h-1 rounded-full bg-white/70 animate-twinkle" />
        <span className="absolute top-[30%] left-[70%] w-1 h-1 rounded-full bg-cyan-200 animate-twinkle-delayed" />
        <span className="absolute top-[60%] left-[40%] w-1 h-1 rounded-full bg-violet-200 animate-twinkle" />
        <span className="absolute top-[80%] left-[80%] w-1 h-1 rounded-full bg-fuchsia-200 animate-twinkle-delayed" />
      </div>
    </div>
  );
}
