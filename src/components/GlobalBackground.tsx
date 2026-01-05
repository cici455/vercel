'use client';

import React from 'react';

export function GlobalBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-black">
      {/* 层 1：整体暗到黑的渐变基底 */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#050505] to-black" />

      {/* 层 2：中心“事件视界”光晕（椭圆形） */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="w-[520px] h-[260px] rounded-full" 
          style={{ 
            background: 
              'radial-gradient(circle, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.0) 65%)', 
            filter: 'blur(30px)', 
          }} 
        />
      </div>

      {/* 层 3：竖直的“裂缝之门”——中间那条关键的形状 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="w-[3px] h-[70vh]" 
          style={{ 
            background: 
              'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.8), rgba(255,255,255,0))', 
            filter: 'blur(6px)', 
          }} 
        />
      </div>

      {/* 层 4：在门周围再叠一层更细的高光，让“门”有金属感 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="w-[18px] h-[72vh] rounded-full" 
          style={{ 
            background: 
              'radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.0) 60%)', 
            filter: 'blur(24px)', 
          }} 
        />
      </div>

      {/* 层 5：整体暗角——四周拉黑，中间更聚焦 */}
      <div 
        className="absolute inset-0" 
        style={{ 
          background: 
            'radial-gradient(circle at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.9) 100%)', 
        }} 
      />

      {/* 层 6：少量星点（点状而不是 ikon），保持克制 */}
      <div className="absolute inset-0 mix-blend-screen opacity-55">
        <span className="absolute top-[14%] left-[24%] w-[2px] h-[2px] rounded-full bg-white/80" />
        <span className="absolute top-[18%] left-[70%] w-[2px] h-[2px] rounded-full bg-white/70" />
        <span className="absolute top-[28%] left-[47%] w-[2px] h-[2px] rounded-full bg-white/75" />
        <span className="absolute top-[52%] left-[17%] w-[1.5px] h-[1.5px] rounded-full bg-white/60" />
        <span className="absolute top-[48%] left-[79%] w-[1.5px] h-[1.5px] rounded-full bg-white/60" />
      </div>
    </div>
  );
}