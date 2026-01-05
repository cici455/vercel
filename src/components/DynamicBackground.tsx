'use client';

import React from 'react';
import { motion } from 'framer-motion';

// 全局黑白液态背景（会缓慢流动）
export function DynamicBackground() {
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#050505]"
      initial={{ x: -40, y: 20, scale: 1.05 }}
      animate={{
        x: [-40, 40, -20, 0],
        y: [20, -30, 10, 0],
        scale: [1.05, 1.12, 1.08, 1.05],
      }}
      transition={{
        duration: 40,       // 40s 一轮，很慢但肉眼可见
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {/* 底层深灰渐变，保证整体偏暗 */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-neutral-800" />

      {/* 上层：一整块超大的灰度液态纹理 */}
      <div
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
      />
    </motion.div>
  );
}
