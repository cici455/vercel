'use client';
import React from 'react';

export function GlobalBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-black">
      {/* 深灰基底 */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#050505] to-black" />

      {/* 底部巨大黑洞/行星弧线，只露上半圈 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-[160vh] h-[160vh] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 52%, rgba(0,0,0,1) 100%)',
            transform: 'translateY(44vh)',
          }}
        />
      </div>

      {/* 斜向银河：细长亮带 */}
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

      {/* 银河核心更细一层 */}
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

      {/* 中央聚光：托起中间内容 */}
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

      {/* 少量静态星点 */}
      <div className="absolute inset-0 mix-blend-screen opacity-50">
        <span className="absolute top-[12%] left-[22%] w-[2px] h-[2px] rounded-full bg-white/80" />
        <span className="absolute top-[18%] left-[68%] w-[2px] h-[2px] rounded-full bg-white/70" />
        <span className="absolute top-[32%] left-[48%] w-[2px] h-[2px] rounded-full bg-white/75" />
        <span className="absolute top-[44%] left-[78%] w-[1.5px] h-[1.5px] rounded-full bg-white/60" />
        <span className="absolute top-[56%] left-[18%] w-[1.5px] h-[1.5px] rounded-full bg-white/60" />
      </div>

      {/* 颗粒噪声，增加质感 */}
      <div className="absolute inset-0 bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.10'/%3E%3C/svg%3E\")] opacity-25 mix-blend-soft-light" />
    </div>
  );
}