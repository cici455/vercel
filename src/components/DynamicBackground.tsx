import React from 'react'; 
 
 // 全局黑白银河背景：中间一条斜向银河 + 液态噪声 + 星点 
 export function DynamicBackground() { 
   return ( 
     <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black"> 
       <svg 
         className="w-full h-full" 
         viewBox="0 0 1920 1080" 
         preserveAspectRatio="xMidYMid slice" 
       > 
         <defs> 
           {/* 液态噪声，用来扭曲银河形状 */}
           <filter id="galaxy-noise">
             <feTurbulence
               type="fractalNoise"
               baseFrequency="0.8"
               numOctaves="3"
               seed="8"
               stitchTiles="noStitch"
             >
               {/* 噪声缓慢流动，形成液态变形 */}
               <animate
                 attributeName="baseFrequency"
                 dur="22s"
                 values="0.6;0.9;0.5;0.8;0.6"
                 repeatCount="indefinite"
               />
             </feTurbulence>
             <feGaussianBlur stdDeviation="30" />
             {/* 明显压黑，亮区变窄 */}
             <feColorMatrix
               type="matrix"
               values="
                 0.6 0   0   0  -0.28
                 0   0.6 0   0  -0.28
                 0   0   0.6 0  -0.28
                 0   0   0   1   0
               "
             />
           </filter>

           {/* 斜向银河：更细、更亮，中间像一条刀光 */}
           <linearGradient id="galaxy-band" x1="0%" y1="100%" x2="100%" y2="0%">
             {/* 两端很长一段直接纯黑 */}
             <stop offset="0%" stopColor="#000000" />
             <stop offset="18%" stopColor="#000000" />

             {/* 接近银心前的深灰过渡区 */}
             <stop offset="40%" stopColor="#050505" />
             <stop offset="46%" stopColor="#0c0c0c" />

             {/* 非常细的一条银河核心（亮，但不刺眼） */}
             <stop offset="49%" stopColor="#b8b8b8" />
             <stop offset="50%" stopColor="#f5f5f5" />
             <stop offset="51%" stopColor="#b8b8b8" />

             {/* 迅速回落到深灰，再回到黑 */}
             <stop offset="54%" stopColor="#0c0c0c" />
             <stop offset="60%" stopColor="#050505" />
             <stop offset="82%" stopColor="#000000" />
             <stop offset="100%" stopColor="#000000" />
           </linearGradient>

           {/* 加强暗角，确保画布边缘完全黑 */}
           <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
             <stop offset="60%" stopColor="#00000000" />
             <stop offset="100%" stopColor="#000000ff" />
           </radialGradient> 
 
           {/* 星星的发光渐变 */} 
           <radialGradient id="star-glow" cx="50%" cy="50%" r="50%"> 
             <stop offset="0%" stopColor="#ffffff" stopOpacity="1" /> 
             <stop offset="40%" stopColor="#ffffff" stopOpacity="0.7" /> 
             <stop offset="100%" stopColor="#ffffff" stopOpacity="0" /> 
           </radialGradient> 
 
           {/* 星星的轻微模糊 */} 
           <filter id="star-blur"> 
             <feGaussianBlur stdDeviation="1.2" /> 
           </filter> 
         </defs> 
 
         {/* 背景基底：深灰到黑 */} 
         <rect width="100%" height="100%" fill="#050505" /> 
 
         {/* 银河主体：用线性渐变着色，再用噪声滤镜扭曲成液态形状 */} 
         <rect 
           width="120%" 
           height="140%" 
           x="-10%" 
           y="-20%" 
           fill="url(#galaxy-band)" 
           filter="url(#galaxy-noise)" 
           opacity="0.9" 
         /> 
 
         {/* 暗角效果：确保画布边缘完全黑，加强银河突出度 */}
         <rect
           width="100%"
           height="100%"
           fill="url(#vignette)"
           opacity="0.8"
         /> 
 
         {/* 星群：分布在银河附近，大小与亮度有变化 */} 
         <g filter="url(#star-blur)"> 
           {/* 静态星点（基础星空） */} 
           <circle cx="200" cy="200" r="2.2" fill="url(#star-glow)" opacity="0.9" /> 
           <circle cx="450" cy="320" r="1.6" fill="url(#star-glow)" opacity="0.7" /> 
           <circle cx="800" cy="180" r="1.8" fill="url(#star-glow)" opacity="0.8" /> 
           <circle cx="1200" cy="260" r="2.0" fill="url(#star-glow)" opacity="0.85" /> 
           <circle cx="1550" cy="220" r="1.4" fill="url(#star-glow)" opacity="0.7" /> 
           <circle cx="600" cy="520" r="1.8" fill="url(#star-glow)" opacity="0.75" /> 
           <circle cx="1000" cy="600" r="2.4" fill="url(#star-glow)" opacity="0.9" /> 
           <circle cx="1350" cy="520" r="1.5" fill="url(#star-glow)" opacity="0.7" /> 
 
           {/* 动态“震撼”星团：大小和亮度缓慢变化，形状感觉更有生命力 */} 
           <g> 
             <circle cx="960" cy="320" r="3.5" fill="url(#star-glow)" opacity="0.95"> 
               <animate 
                 attributeName="r" 
                 dur="4.5s" 
                 values="2.5;4.5;3;5.2;2.8" 
                 repeatCount="indefinite" 
               /> 
               <animate 
                 attributeName="opacity" 
                 dur="4.5s" 
                 values="0.4;1;0.6;1;0.4" 
                 repeatCount="indefinite" 
               /> 
             </circle> 
           </g> 
 
           <g> 
             <circle cx="720" cy="420" r="3.0" fill="url(#star-glow)" opacity="0.85"> 
               <animate 
                 attributeName="r" 
                 dur="6s" 
                 values="1.5;3.8;2.2;4.2;1.5" 
                 repeatCount="indefinite" 
               /> 
               <animate 
                 attributeName="opacity" 
                 dur="6s" 
                 values="0.3;0.9;0.5;1;0.3" 
                 repeatCount="indefinite" 
               /> 
             </circle> 
           </g> 
 
           <g> 
             <circle cx="1220" cy="460" r="3.2" fill="url(#star-glow)" opacity="0.9"> 
               <animate 
                 attributeName="r" 
                 dur="5.2s" 
                 values="2;4;2.5;5;2" 
                 repeatCount="indefinite" 
               /> 
               <animate 
                 attributeName="opacity" 
                 dur="5.2s" 
                 values="0.4;1;0.6;1;0.4" 
                 repeatCount="indefinite" 
               /> 
             </circle> 
           </g> 
         </g> 
       </svg> 
     </div> 
   ); 
 }
