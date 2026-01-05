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
               0.7 0   0   0  -0.20
               0   0.7 0   0  -0.20
               0   0   0.7 0  -0.20
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
          opacity="0.5"
        /> 
 
         {/* 星群：静态星空 + 长尾流星 + 符文星阵 */} 
       <g filter="url(#star-blur)"> 
         {/* 背景静态小星点（保持环境感） */} 
         <circle cx="200" cy="200" r="1.0" fill="url(#star-glow)" opacity="0.35" /> 
         <circle cx="420" cy="260" r="0.9" fill="url(#star-glow)" opacity="0.3" /> 
         <circle cx="760" cy="180" r="0.9" fill="url(#star-glow)" opacity="0.32" /> 
         <circle cx="1180" cy="220" r="1.0" fill="url(#star-glow)" opacity="0.35" /> 
         <circle cx="1540" cy="260" r="0.8" fill="url(#star-glow)" opacity="0.3" /> 
         <circle cx="560" cy="540" r="0.9" fill="url(#star-glow)" opacity="0.3" /> 
         <circle cx="980" cy="620" r="1.0" fill="url(#star-glow)" opacity="0.35" /> 
         <circle cx="1380" cy="540" r="0.9" fill="url(#star-glow)" opacity="0.3" /> 

         {/* ========= 1. 长尾流星（震撼效果） ========= */} 
         {/* 整个 group 被 translate，从右上斜穿到左下 */} 
         <g opacity="0"> 
           {/* 流星尾巴：一条长线，带强烈渐变光 */} 
           <line 
             x1="0" 
             y1="0" 
             x2="-220" 
             y2="-60" 
             stroke="white" 
             strokeWidth="1.6" 
             strokeLinecap="round" 
             opacity="0.9" 
           > 
             {/* 尾巴在飞行中可轻微变粗变细 */} 
             <animate 
               attributeName="stroke-width" 
               dur="3.2s" 
               values="1.0;2.0;1.2;1.6;1.0" 
               repeatCount="indefinite" 
             /> 
           </line> 
           {/* 流星头部：一个高亮小球 */} 
           <circle cx="0" cy="0" r="2.4" fill="white" opacity="1"> 
             <animate 
               attributeName="r" 
               dur="3.2s" 
               values="1.2;3;2;3.4;1.2" 
               repeatCount="indefinite" 
             /> 
           </circle> 

           {/* 控制整颗流星的飞行轨迹和出现消失 */} 
           <animateTransform 
             attributeName="transform" 
             attributeType="XML" 
             type="translate" 
             from="2200 -200" 
             to="-300 900" 
             dur="3.2s" 
             repeatCount="indefinite" 
           /> 
           <animate 
             attributeName="opacity" 
             dur="3.2s" 
             values="0;1;1;0" 
             repeatCount="indefinite" 
           /> 
         </g> 

         {/* ========= 2. 符文星阵（由一撮星组成的符号） ========= */} 
         {/* 位置大致在 LUMINA 上方，形成一个神秘的“拱形符文” */} 
         <g transform="translate(960 260)"> 
           {/* 环形星阵的 7 颗星，按顺序点亮 / 熄灭 */} 
           {[ 
             { x: -80, y: -20, delay: 0 }, 
             { x: -40, y: -50, delay: 0.4 }, 
             { x: 0, y: -60, delay: 0.8 }, 
             { x: 40, y: -50, delay: 1.2 }, 
             { x: 80, y: -20, delay: 1.6 }, 
             { x: 50, y: 10, delay: 2.0 }, 
             { x: -50, y: 10, delay: 2.4 }, 
           ].map((star, idx) => ( 
             <circle 
               key={idx} 
               cx={star.x} 
               cy={star.y} 
               r="1.6" 
               fill="url(#star-glow)" 
               opacity="0" 
             > 
               <animate 
                 attributeName="opacity" 
                 dur="4s" 
                 begin={`${star.delay}s`} 
                 values="0;1;0.4;0" 
                 repeatCount="indefinite" 
               /> 
               <animate 
                 attributeName="r" 
                 dur="4s" 
                 begin={`${star.delay}s`} 
                 values="1.0;2.2;1.4;1.0" 
                 repeatCount="indefinite" 
               /> 
             </circle> 
           ))} 

           {/* 符文外圈淡淡显示一条圆弧，像隐约的几何印记 */} 
           <path 
             d="M -90 -10 Q 0 -90 90 -10" 
             stroke="white" 
             strokeWidth="0.4" 
             strokeLinecap="round" 
             fill="none" 
             opacity="0" 
             strokeDasharray="160" 
             strokeDashoffset="160" 
           > 
             <animate 
               attributeName="opacity" 
               dur="6s" 
               values="0;0.6;0.2;0" 
               repeatCount="indefinite" 
             /> 
             <animate 
               attributeName="stroke-dashoffset" 
               dur="6s" 
               values="160;0;0;160" 
               repeatCount="indefinite" 
             /> 
           </path> 
         </g> 
       </g> 
       </svg> 
     </div> 
   ); 
 }
