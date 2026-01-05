import React from 'react'; 
 
 // 全局黑白液态背景：SVG 噪声 + 动态滤镜，不规则连续变形 
 export function DynamicBackground() { 
   return ( 
     <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black"> 
       {/* SVG 全屏噪声，交给浏览器动画，不再依赖 JS 或 framer-motion */} 
       <svg 
         className="w-full h-full" 
         viewBox="0 0 1920 1080" 
         preserveAspectRatio="xMidYMid slice" 
       > 
         <defs> 
           <filter id="liquid-noise"> 
             {/* fractalNoise 会生成连续的云状噪声 */} 
             <feTurbulence 
               type="fractalNoise" 
               baseFrequency="0.9" 
               numOctaves="3" 
               seed="7" 
               stitchTiles="noStitch" 
             > 
               {/* 通过改变 baseFrequency 让噪声缓慢“流动变形” */} 
               <animate 
                 attributeName="baseFrequency" 
                 dur="18s" 
                 values="0.6;0.9;0.4;0.75;0.6" 
                 repeatCount="indefinite" 
               /> 
             </feTurbulence> 
 
             {/* 大模糊，让噪声边界完全糊掉，变成液态灰度块 */} 
             <feGaussianBlur stdDeviation="60" /> 
 
             {/* 可选：提升对比度，让黑白层次更明显（仍是灰度） */} 
             <feColorMatrix 
               type="matrix" 
               values=" 
                 1.2 0   0   0  -0.1 
                 1.2 0   0   0  -0.1 
                 1.2 0   0   0  -0.1 
                 0   0   0   1   0 
               " 
             /> 
           </filter> 
         </defs> 
 
         {/* 用噪声滤镜填满整个视口 */} 
         <rect 
           width="100%" 
           height="100%" 
           filter="url(#liquid-noise)" 
         /> 
       </svg> 
 
       {/* 轻微的边缘加深，让中间更聚焦一些，可以按需调淡或删除 */} 
       <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-transparent to-black/80" /> 
     </div> 
   ); 
 }
