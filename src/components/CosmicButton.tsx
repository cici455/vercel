import React from "react";

interface CosmicButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const CosmicButton: React.FC<CosmicButtonProps> = ({ children, onClick, className = "", type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        relative group overflow-hidden rounded-full 
        px-12 py-4 
        transition-all duration-300 ease-out 
        bg-white/5 
        backdrop-blur-md 
        border border-white/20 
        shadow-[0_0_20px_rgba(255,255,255,0.1)] 
        hover:bg-white/10 
        hover:border-white/50 
        hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] 
        hover:scale-105 
        ${className}
      `}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50 pointer-events-none" />
      <span className="relative z-10 text-white font-medium tracking-widest uppercase text-sm md:text-base text-shadow-glow">
        {children}
      </span>
    </button>
  );
};

export default CosmicButton;
