'use client';

import React from 'react';

const ZODIAC = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

export function GlobalBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-black">
      {/* 基底：黑到深灰渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#050505] to-black" />

      {/* 巨大黄道圆盘（十二宫 + 十字轴） */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[70vh] h-[70vh]">
          {/* 外环 */}
          <div className="absolute inset-0 rounded-full border border-white/18" />
          {/* 中环 */}
          <div className="absolute inset-[32px] rounded-full border border-white/10" />
          {/* 内环 */}
          <div className="absolute inset-[64px] rounded-full border border-white/14" />

          {/* 十字轴 */}
          <div className="absolute left-1/2 top-[6%] bottom-[6%] w-px -translate-x-1/2 bg-white/12" />
          <div className="absolute top-1/2 left-[6%] right-[6%] h-px -translate-y-1/2 bg-white/12" />

          {/* 十二宫刻度 + 符号 */}
          {ZODIAC.map((glyph, i) => (
            <div
              key={glyph}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `rotate(${i * 30}deg) translate(0, -33vh)`,
              }}
            >
              {/* 刻度点 */}
              <div className="w-[4px] h-[4px] rounded-full bg-white/75" />
              {/* 符号位置再往外一点 */}
              <div
                className="mt-2 text-[14px] text-white/65"
                style={{
                  transform: `translate(-50%, -8px) rotate(${-i * 30}deg)`,
                }}
              >
                {glyph}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 斜向银河：细长亮带从左下到右上 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-[230vw] h-[75vh]"
          style={{
            background:
              'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.03) 35%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.03) 65%, rgba(255,255,255,0) 100%)',
            transform: 'rotate(-22deg) translateY(-12vh)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      {/* 中央聚光：托起中间内容（卡牌 / 标题） */}
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

      {/* 少量星点 */}
      <div className="absolute inset-0 mix-blend-screen opacity-50">
        <span className="absolute top-[10%] left-[20%] w-[2px] h-[2px] rounded-full bg-white/80" />
        <span className="absolute top-[18%] left-[68%] w-[2px] h-[2px] rounded-full bg-white/70" />
        <span className="absolute top-[32%] left-[48%] w-[2px] h-[2px] rounded-full bg-white/75" />
        <span className="absolute top-[44%] left-[78%] w-[1.5px] h-[1.5px] rounded-full bg-white/60" />
        <span className="absolute top-[56%] left-[18%] w-[1.5px] h-[1.5px] rounded-full bg-white/60" />
      </div>
    </div>
  );
}