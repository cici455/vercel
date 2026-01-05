import React from 'react';

export function DynamicBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black">
      {/* 底层轻微黑灰渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950 to-neutral-900" />

      {/* 亮雾团 1：接近纯白，负责高光 */}
      <div className="absolute -left-1/3 -top-1/4 w-[75vw] h-[75vw] rounded-full bg-white opacity-90 blur-3xl mix-blend-screen animate-blob-slow" />

      {/* 中灰雾团 2 */}
      <div className="absolute right-[-20%] top-1/3 w-[65vw] h-[65vw] rounded-full bg-neutral-400 opacity-80 blur-3xl mix-blend-screen animate-blob-medium" />

      {/* 浅灰雾团 3 */}
      <div className="absolute left-[10%] bottom-[-25%] w-[70vw] h-[70vw] rounded-full bg-neutral-200 opacity-80 blur-3xl mix-blend-screen animate-blob-fast" />

      {/* 深阴影雾团：接近纯黑，增加厚重感 */}
      <div className="absolute inset-0 mix-blend-multiply opacity-85">
        <div className="absolute left-[5%] top-[35%] w-[45vw] h-[45vw] rounded-full bg-black opacity-85 blur-3xl animate-blob-deep" />
        <div className="absolute right-[0%] bottom-[5%] w-[35vw] h-[35vw] rounded-full bg-black opacity-90 blur-3xl animate-blob-deep-alt" />
      </div>
    </div>
  );
}
