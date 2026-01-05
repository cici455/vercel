import React from 'react';

export function DynamicBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black">
      {/* 整个液态灰度背景交给一个自定义 class 处理 */}
      <div className="absolute inset-0 bg-liquid-noise" />
    </div>
  );
}
