import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
}

export function GlassPanel({ children, className }: GlassPanelProps) {
  return (
    <div className={cn("glass-panel rounded-2xl p-6", className)}>
      {children}
    </div>
  );
}

export function GlassButton({ 
  children, 
  className, 
  onClick,
  disabled 
}: { 
  children: ReactNode; 
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button 
      className={cn(
        "glass-btn px-6 py-2 rounded-full text-sm font-medium tracking-wider uppercase",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function GlassInput({
  value,
  onChange,
  placeholder,
  className,
  type = "text"
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={cn("input-glass w-full px-4 py-3 rounded-lg bg-black/20", className)}
    />
  );
}
