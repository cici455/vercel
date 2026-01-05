'use client';

import React from 'react';
import { motion } from 'framer-motion';

// 全局黑白液态背景（会缓慢流动）
export function DynamicBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#050505]">
      {/* 底层深灰渐变，保证整体偏暗 */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-neutral-800" />

      {/* 上层：一整块超大的灰度液态纹理，用 framer-motion 做缓慢漂移 */}
      <motion.div
        className="absolute -inset-[30%]"
        style={{
          // 多层黑白 radial-gradient 叠加成水墨质感
          backgroundImage: `
            radial-gradient(circle at 15% 20%, rgba(255,255,255,0.9),  rgba(255,255,255,0) 55%),
            radial-gradient(circle at 80% 0%,  rgba(220,220,220,0.85), rgba(255,255,255,0) 55%),
            radial-gradient(circle at 0% 80%,  rgba(190,190,190,0.8),  rgba(255,255,255,0) 55%),
            radial-gradient(circle at 100% 85%, rgba(140,140,140,0.75), rgba(255,255,255,0) 55%),
            radial-gradient(circle at 45% 55%, rgba(0,0,0,1),         rgba(0,0,0,0)        62%)
          `,
          backgroundSize: '220% 220%',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(48px)',
        }}
        animate={{
          // 整块纹理缓慢漂移 + 轻微缩放，形成明显但柔和的流动感
          x: [-80, 70, -50, 0],
          y: [40, -60, 30, 0],
          scale: [1.1, 1.25, 1.05, 1.1],
        }}
        transition={{
          duration: 40,      // 40 秒一轮，非常缓慢
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
