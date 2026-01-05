'use client'; 
 
 import React from 'react'; 
 import { motion } from 'framer-motion'; 
 
 // 全局黑白液态背景（明显可见缓慢流动） 
 export function DynamicBackground() { 
   return ( 
     <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#050505]"> 
       {/* 底层深灰渐变，保证整体偏暗 */} 
       <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-neutral-800" /> 
 
       {/* 上层：一整块超大的灰度液态纹理，用 framer-motion 做漂移 */} 
       <motion.div 
         className="absolute -inset-[30%]" 
         style={{ 
           // 保持你现在这版的黑白渐变质感 
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
         initial={{ x: -200, y: 120, scale: 1.15 }} 
         animate={{ 
           x: [-200, 200, -150, 0], 
           y: [120, -160, 80, -40], 
           scale: [1.15, 1.3, 1.2, 1.15], 
         }} 
         transition={{ 
           duration: 22,      // 22 秒一轮，这个速度肉眼绝对能看见 
           repeat: Infinity, 
           ease: 'easeInOut', 
         }} 
       /> 
     </div> 
   ); 
 }
