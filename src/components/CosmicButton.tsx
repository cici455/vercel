import React from "react";

interface CosmicButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const CosmicButton: React.FC<CosmicButtonProps> = ({ children, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative group overflow-hidden rounded-full 
        px-12 py-4 
        transition-all duration-300 ease-out 
        
        /* --- 核心样式：黑洞玻璃感 --- */ 
        bg-white/5                  /* 极低透明度的白，形成玻璃基底 */ 
        backdrop-blur-md            /* 关键：磨砂模糊，让背后的粒子变成雾气 */ 
        border border-white/20      /* 微弱的边框 */ 
        
        /* --- 发光特效 --- */ 
        shadow-[0_0_20px_rgba(255,255,255,0.1)]  /* 初始微弱外发光 */ 
        
        /* --- 悬停状态 (Hover) --- */ 
        hover:bg-white/10           /* 悬停时变亮 */ 
        hover:border-white/50       /* 边框变亮 */ 
        hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] /* 爆发式外发光 */ 
        hover:scale-105             /* 轻微放大 */ 
        
        ${className}
      `}
    >
      {/* 内部高光层（模仿顶部反光） */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50 pointer-events-none" />

      {/* 文字层 */}
      <span className="relative z-10 text-white font-medium tracking-widest uppercase text-sm md:text-base text-shadow-glow">
        {children}
      </span>
    </button>
  );
};

export default CosmicButton;
