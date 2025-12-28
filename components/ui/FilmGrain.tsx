'use client';

export default function FilmGrain() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 h-full w-full overflow-hidden opacity-[0.03]">
      <div 
        className="absolute inset-[-200%] h-[400%] w-[400%] animate-grain bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" 
        style={{
          filter: 'contrast(150%) brightness(100%)',
        }}
      />
    </div>
  );
}
