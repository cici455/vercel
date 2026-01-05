'use client'; 
 
 import React from 'react'; 
 import { motion } from 'framer-motion'; 
 
 // 全局黑白液态背景：三层“墨团”，通过 border-radius + scale 缓慢变形 
 export function DynamicBackground() { 
   return ( 
     <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black"> 
       {/* 底层：深灰渐变，保证整体仍偏暗 */} 
       <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-neutral-800" /> 
 
       {/* 亮墨团 A：接近白，位于左上 */} 
       <motion.div 
         className="absolute -left-[25%] -top-[30%] w-[80vw] h-[80vw] mix-blend-screen bg-white/85 blur-[120px]" 
         initial={{ scale: 1.1 }} 
         animate={{ 
           scale: [1.1, 1.25, 1.15, 1.1], 
           borderRadius: [ 
             '40% 60% 55% 45% / 55% 45% 55% 45%', 
             '65% 35% 50% 50% / 40% 60% 50% 60%', 
             '50% 50% 40% 60% / 60% 40% 65% 35%', 
             '40% 60% 55% 45% / 55% 45% 55% 45%', 
           ], 
         }} 
         transition={{ 
           duration: 26, 
           repeat: Infinity, 
           ease: 'easeInOut', 
         }} 
       /> 
 
       {/* 中灰墨团 B：位于右上偏中 */} 
       <motion.div 
         className="absolute right-[-30%] top-[0%] w-[75vw] h-[75vw] mix-blend-screen bg-neutral-400/90 blur-[120px]" 
         initial={{ scale: 1.05 }} 
         animate={{ 
           scale: [1.05, 1.2, 1.1, 1.05], 
           borderRadius: [ 
             '55% 45% 50% 50% / 40% 60% 50% 60%', 
             '45% 55% 60% 40% / 65% 35% 55% 45%', 
             '60% 40% 45% 55% / 50% 50% 40% 60%', 
             '55% 45% 50% 50% / 40% 60% 50% 60%', 
           ], 
         }} 
         transition={{ 
           duration: 32, 
           repeat: Infinity, 
           ease: 'easeInOut', 
         }} 
       /> 
 
       {/* 深墨团 C：接近黑，位于中下，提供厚重阴影 */} 
       <motion.div 
         className="absolute left-[10%] bottom-[-35%] w-[95vw] h-[95vw] mix-blend-multiply bg-black/95 blur-[140px]" 
         initial={{ scale: 1.05 }} 
         animate={{ 
           scale: [1.05, 1.25, 1.15, 1.05], 
           borderRadius: [ 
             '50% 50% 60% 40% / 60% 40% 60% 40%', 
             '70% 30% 55% 45% / 45% 55% 35% 65%', 
             '45% 55% 40% 60% / 65% 35% 55% 45%', 
             '50% 50% 60% 40% / 60% 40% 60% 40%', 
           ], 
         }} 
         transition={{ 
           duration: 38, 
           repeat: Infinity, 
           ease: 'easeInOut', 
         }} 
       /> 
     </div> 
   ); 
 }
