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
                0.8 0   0   0  -0.18
                0   0.8 0   0  -0.18
                0   0   0.8 0  -0.18
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
 
         {/* 星群：基础星空 + 几颗“主角星” */} 
        <g filter="url(#star-blur)"> 
          {/* 静态小星点（背景噪声层） */} 
          <circle cx="200" cy="200" r="1.2" fill="url(#star-glow)" opacity="0.5" /> 
          <circle cx="420" cy="260" r="1.0" fill="url(#star-glow)" opacity="0.4" /> 
          <circle cx="760" cy="180" r="0.9" fill="url(#star-glow)" opacity="0.4" /> 
          <circle cx="1180" cy="220" r="1.1" fill="url(#star-glow)" opacity="0.45" /> 
          <circle cx="1540" cy="260" r="0.9" fill="url(#star-glow)" opacity="0.4" /> 
          <circle cx="560" cy="540" r="1.0" fill="url(#star-glow)" opacity="0.4" /> 
          <circle cx="980" cy="620" r="1.2" fill="url(#star-glow)" opacity="0.45" /> 
          <circle cx="1380" cy="540" r="1.0" fill="url(#star-glow)" opacity="0.4" /> 

          {/* 主角星 1：画面正上方的“超新星”——快速脉冲，亮度极高 */} 
          <g> 
            <circle cx="960" cy="260" r="2.4" fill="url(#star-glow)" opacity="0.9"> 
              <animate 
                attributeName="r" 
                dur="2.4s" 
                values="1.5;4.5;2.2;5.5;1.5" 
                repeatCount="indefinite" 
              /> 
              <animate 
                attributeName="opacity" 
                dur="2.4s" 
                values="0.2;1;0.5;1;0.2" 
                repeatCount="indefinite" 
              /> 
            </circle> 
            {/* 外圈光环，让闪光更有冲击力 */} 
            <circle cx="960" cy="260" r="6" fill="url(#star-glow)" opacity="0.4"> 
              <animate 
                attributeName="r" 
                dur="2.4s" 
                values="4;10;6;12;4" 
                repeatCount="indefinite" 
              /> 
              <animate 
                attributeName="opacity" 
                dur="2.4s" 
                values="0;0.6;0.2;0.7;0" 
                repeatCount="indefinite" 
              /> 
            </circle> 
          </g> 

          {/* 主角星 2：左下的旋转十字光芒 */} 
          <g transform="translate(740 420)"> 
            {/* 核心星点 */} 
            <circle r="1.8" fill="url(#star-glow)" opacity="0.9"> 
              <animate 
                attributeName="r" 
                dur="3.5s" 
                values="1.2;2.5;1.5;3;1.2" 
                repeatCount="indefinite" 
              /> 
            </circle> 
            {/* 横向光芒 */} 
            <line 
              x1="-10" 
              y1="0" 
              x2="10" 
              y2="0" 
              stroke="white" 
              strokeWidth="0.35" 
              strokeLinecap="round" 
              opacity="0.8" 
            > 
              <animateTransform 
                attributeName="transform" 
                attributeType="XML" 
                type="rotate" 
                from="0 0 0" 
                to="360 0 0" 
                dur="8s" 
                repeatCount="indefinite" 
              /> 
              <animate 
                attributeName="opacity" 
                dur="4s" 
                values="0.1;0.8;0.3;1;0.1" 
                repeatCount="indefinite" 
              /> 
            </line> 
            {/* 纵向光芒 */} 
            <line 
              x1="0" 
              y1="-10" 
              x2="0" 
              y2="10" 
              stroke="white" 
              strokeWidth="0.35" 
              strokeLinecap="round" 
              opacity="0.8" 
            > 
              <animateTransform 
                attributeName="transform" 
                attributeType="XML" 
                type="rotate" 
                from="45 0 0" 
                to="405 0 0" 
                dur="8s" 
                repeatCount="indefinite" 
              /> 
              <animate 
                attributeName="opacity" 
                dur="4s" 
                values="0.1;0.8;0.3;1;0.1" 
                repeatCount="indefinite" 
              /> 
            </line> 
          </g> 

          {/* 主角星 3：右侧较大的缓慢呼吸星团 */} 
          <g> 
            <circle cx="1260" cy="460" r="2.6" fill="url(#star-glow)" opacity="0.85"> 
              <animate 
                attributeName="r" 
                dur="5.2s" 
                values="1.8;3.8;2.2;4.5;1.8" 
                repeatCount="indefinite" 
              /> 
              <animate 
                attributeName="opacity" 
                dur="5.2s" 
                values="0.2;0.9;0.4;1;0.2" 
                repeatCount="indefinite" 
              /> 
            </circle> 
          </g> 

          {/* 流星：偶尔从右上斜划到左下 */} 
          <g> 
            <circle 
              cx="1900" 
              cy="80" 
              r="1.4" 
              fill="url(#star-glow)" 
              opacity="0" 
            > 
              <animate 
                attributeName="cx" 
                dur="3.2s" 
                values="1900;1100;300;-100" 
                repeatCount="indefinite" 
              /> 
              <animate 
                attributeName="cy" 
                dur="3.2s" 
                values="80;260;640;900" 
                repeatCount="indefinite" 
              /> 
              <animate 
                attributeName="opacity" 
                dur="3.2s" 
                values="0;1;1;0" 
                repeatCount="indefinite" 
              /> 
            </circle> 
          </g> 
        </g> 
       </svg> 
     </div> 
   ); 
 }
