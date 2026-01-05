'use client'; 
 
 import React from 'react'; 
 import { motion } from 'framer-motion'; 
 
 // 全局黑白液态背景（黑白对比明显 + 一定有流动感） 
 export function DynamicBackground() { 
   return ( 
     <> 
       {/* 这一块是原来的背景，不要动，先保留 */} 
       <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black"> 
         {/* 底层：深灰渐变，保证整体偏暗，不会变成一整块白 */} 
         <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-neutral-800" /> 
 
         {/* 亮雾团 A：偏白 */} 
         <motion.div 
           className="absolute -left-[25%] -top-[25%] w-[85vw] h-[85vw] rounded-full bg-white/85 blur-[110px] mix-blend-screen" 
           initial={{ x: -120, y: -60 }} 
           animate={{ 
             x: [-120, 180, -80], 
             y: [-60, 120, -40], 
           }} 
           transition={{ 
             duration: 22,          // 先设快一点，方便你看出来在动 
             repeat: Infinity, 
             ease: 'easeInOut', 
           }} 
         /> 
 
         {/* 中灰雾团 B */} 
         <motion.div 
           className="absolute right-[-30%] top-[5%] w-[80vw] h-[80vw] rounded-full bg-neutral-400/90 blur-[110px] mix-blend-screen" 
           initial={{ x: 160, y: 40 }} 
           animate={{ 
             x: [160, -100, 80], 
             y: [40, -80, 20], 
           }} 
           transition={{ 
             duration: 26, 
             repeat: Infinity, 
             ease: 'easeInOut', 
           }} 
         /> 
 
         {/* 深阴影 C：加厚黑色，防止画面太白 */} 
         <motion.div 
           className="absolute left-[5%] bottom-[-30%] w-[95vw] h-[95vw] rounded-full bg-black/95 blur-[130px] mix-blend-multiply" 
           initial={{ x: 0, y: 60 }} 
           animate={{ 
             x: [0, -80, 50], 
             y: [60, -50, 30], 
           }} 
           transition={{ 
             duration: 30, 
             repeat: Infinity, 
             ease: 'easeInOut', 
           }} 
         /> 
       </div> 
 
       {/* ====== 测试用：一个疯狂乱飞的红色块 ====== */} 
       <motion.div 
         className="fixed top-10 left-10 w-16 h-16 bg-red-500 z-[9999]" 
         animate={{ 
           x: [0, 300, 0, -200, 0], 
           y: [0, 150, -150, 0, 0], 
           rotate: [0, 360, 720, 1080, 1440], 
         }} 
         transition={{ 
           duration: 6, 
           repeat: Infinity, 
           ease: 'linear', 
         }} 
       /> 
     </> 
   ); 
 }
