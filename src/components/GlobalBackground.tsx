'use client';

import React from 'react';

export function GlobalBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-black">
      {/* 层 1：整体深灰到黑的基底 */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#050505] to-black" />

      {/* 层 2：巨大黑洞 / 行星弧线，只露上半圈 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-[160vh] h-[160vh] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 52%, rgba(0,0,0,1) 100%)',
            transform: 'translateY(44vh)', // 只露上半圈
          }}
        />
      </div>

      {/* 层 3：斜向银河，大面积柔和亮带 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-[220vw] h-[80vh]"
          style={{
            background:
              'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.04) 35%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0.04) 65%, rgba(255,255,255,0) 100%)',
            transform: 'rotate(-20deg) translateY(-10vh)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      {/* 层 4：更细更亮的银河核心 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-[200vw] h-[30vh]"
          style={{
            background:
              'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.06) 45%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0.06) 55%, rgba(255,255,255,0) 100%)',
            transform: 'rotate(-20deg) translateY(-6vh)',
            filter: 'blur(26px)',
          }}
        />
      </div>

      {/* 层 5：中央聚光，托起中间内容（卡牌 / 标题） */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-[420px] h-[420px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.0) 55%)',
            transform: 'translateY(40px)',
            filter: 'blur(22px)',
          }}
        />
      </div>

      {/* 层 6：少量静态星点，增加层次 */}
      <div className="absolute inset-0 mix-blend-screen opacity-50">
        <span className="absolute top-[12%] left-[22%] w-[2px] h-[2px] rounded-full bg-white/80" />
        <span className="absolute top-[18%] left-[68%] w-[2px] h-[2px] rounded-full bg-white/70" />
        <span className="absolute top-[32%] left-[48%] w-[2px] h-[2px] rounded-full bg-white/75" />
        <span className="absolute top-[44%] left-[78%] w-[1.5px] h-[1.5px] rounded-full bg-white/60" />
        <span className="absolute top-[56%] left-[18%] w-[1.5px] h-[1.5px] rounded-full bg-white/60" />
      </div>
    </div>
  );
}