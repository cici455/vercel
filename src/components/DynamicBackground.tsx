import React from 'react';

export function DynamicBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black">
      {/* 底层：轻微的黑灰渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950 to-neutral-900" />

      {/* 大块灰度雾团 1（偏白） */}
      <div className="absolute -left-1/3 -top-1/4 w-[70vw] h-[70vw] rounded-full bg-white opacity-10 blur-[100px] mix-blend-screen animate-blob-slow" />

      {/* 灰度雾团 2（中灰） */}
      <div className="absolute right-[-20%] top-1/3 w-[60vw] h-[60vw] rounded-full bg-neutral-400 opacity-15 blur-[80px] mix-blend-screen animate-blob-medium" />

      {/* 灰度雾团 3（偏深） */}
      <div className="absolute left-1/4 bottom-[-25%] w-[65vw] h-[65vw] rounded-full bg-neutral-200 opacity-10 blur-[90px] mix-blend-screen animate-blob-fast" />

      {/* 加几层更深的阴影，让黑白过渡更丰富 */}
      <div className="absolute inset-0 mix-blend-multiply opacity-70">
        <div className="absolute left-[10%] top-[40%] w-[40vw] h-[40vw] rounded-full bg-black opacity-70 blur-3xl animate-blob-deep" />
        <div className="absolute right-[5%] bottom-[10%] w-[30vw] h-[30vw] rounded-full bg-black opacity-80 blur-3xl animate-blob-deep-alt" />
      </div>
    </div>
  );
}
