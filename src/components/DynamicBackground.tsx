import React from 'react';

export function DynamicBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#050505]">
      {/* 底层：接近图 2 的深灰渐变基底 */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-neutral-800" />

      {/* 上层：几块超模糊的灰度“水墨” */}
      <div className="absolute inset-[-20%] mix-blend-screen opacity-85">
        {/* 亮灰块 1 */}
        <div className="absolute top-[-10%] left-[-15%] w-[80vw] h-[80vw] rounded-full bg-white/80 blur-[90px] animate-ink-a" />
        {/* 中灰块 2 */}
        <div className="absolute top-[30%] left-[5%] w-[70vw] h-[70vw] rounded-full bg-neutral-400/80 blur-[90px] animate-ink-b" />
        {/* 亮灰块 3 */}
        <div className="absolute top-[10%] right-[-20%] w-[85vw] h-[85vw] rounded-full bg-neutral-200/85 blur-[100px] animate-ink-c" />
      </div>

      {/* 深色阴影层：增加黑的厚重感 */}
      <div className="absolute inset-[-20%] mix-blend-multiply opacity-85">
        <div className="absolute top-[40%] left-[40%] w-[80vw] h-[80vw] rounded-full bg-black blur-[100px] animate-ink-d" />
      </div>
    </div>
  );
}
