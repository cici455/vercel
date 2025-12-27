'use client'; // 必须加这行，因为用了 useState 和 useEffect

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- 1. 背景组件 (粒子星空) ---
const ConstellationBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const PARTICLE_COUNT = 800; // 适当减少粒子数以优化性能

    // 粒子定义
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      tx: Math.random() * width,
      ty: Math.random() * height,
      size: Math.random() * 1.5,
      color: Math.random() > 0.85 ? { r: 251, g: 191, b: 36 } : { r: 200, g: 220, b: 255 },
      baseX: Math.random() * width,
      baseY: Math.random() * height,
    }));

    // 简化的星座形状逻辑
    const ZodiacShapes = {
        ARIES: (i: number) => { 
            const points = [[0.2,0.6],[0.35,0.5],[0.5,0.45],[0.65,0.5],[0.75,0.65]];
            const pt = points[i % points.length];
            return { x: pt[0], y: pt[1] };
        },
        // 这里为了代码简洁省略了其他形状，逻辑通用
    };

    let animationFrameId: number;
    let mouse = { x: -9999, y: -9999 };

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        // 缓慢移动
        p.x += (p.tx - p.x) * 0.015;
        p.y += (p.ty - p.y) * 0.015;

        // 鼠标排斥
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const force = (200 - dist) / 200;
          p.x -= (dx / dist) * force * 5;
          p.y -= (dy / dist) * force * 5;
        }

        // 绘制
        const alpha = 0.3 + Math.random() * 0.3;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},${alpha})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 简单模拟 targets 随机游走
      if (Math.random() > 0.98) {
         particles.forEach(p => {
             if(Math.random() > 0.99) {
                 p.tx = Math.random() * width;
                 p.ty = Math.random() * height;
             }
         })
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMouseMove = (e: MouseEvent) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
};

// --- 2. 辅助组件 ---
const DateInput = () => {
  const [value, setValue] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 8) val = val.slice(0, 8);
    
    let formatted = val;
    if (val.length > 4) formatted = `${val.slice(0, 2)}/${val.slice(2, 4)}/${val.slice(4)}`;
    else if (val.length > 2) formatted = `${val.slice(0, 2)}/${val.slice(2)}`;
    
    setValue(formatted);
  };

  return (
    <div className="group">
      <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1 group-focus-within:text-teal-400 transition-colors">
        Date of Birth (MM / DD / YYYY)
      </label>
      <input
        type="text"
        placeholder="MM / DD / YYYY"
        value={value}
        onChange={handleChange}
        className="input-glass w-full rounded p-3 text-sm mt-1 placeholder-gray-600"
      />
    </div>
  );
};

// --- 3. 页面组件 ---

// 首页 Landing
const LandingPage = ({ onStart }: { onStart: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
    transition={{ duration: 0.8 }}
    className="h-screen flex flex-col items-center justify-center text-center z-10 px-6 relative w-full overflow-hidden"
  >
    <h1 className="font-bold absolute select-none text-outline opacity-10 blur-sm scale-110 pointer-events-none" style={{ fontSize: '15vw' }}>LUMINA</h1>
    <h1 className="font-bold relative z-10 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50 drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] mb-6" style={{ fontSize: '8vw', lineHeight: '1' }}>LUMINA</h1>
    
    <div className="relative z-10 flex flex-col items-center gap-3 mb-10">
        <div className="h-[1px] w-12 bg-white/30"></div>
        <p className="text-gray-300 text-sm md:text-base tracking-[0.2em] uppercase font-light">The Life Simulator</p>
        <div className="h-[1px] w-12 bg-white/30"></div>
    </div>

    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onStart}
      className="glass-btn px-16 py-6 rounded-full text-sm font-bold tracking-[0.2em] uppercase text-white shadow-[0_0_30px_rgba(255,255,255,0.05)] border border-white/20"
    >
      Initialize
    </motion.button>
  </motion.div>
);

// 输入页 Input
const InputPage = ({ onSubmit }: { onSubmit: (e: React.FormEvent) => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, y: -50, filter: "blur(10px)" }}
    transition={{ duration: 0.5 }}
    className="w-full max-w-md z-10 relative"
  >
    <div className="absolute -top-32 -left-32 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none"></div>
    <div className="text-center mb-10">
      <h2 className="text-2xl font-bold tracking-[0.2em] text-white/90">CALIBRATION</h2>
      <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest">Enter Celestial Coordinates</p>
    </div>

    <form onSubmit={onSubmit} className="glass-panel p-8 rounded-2xl space-y-6 backdrop-blur-xl">
        <div className="grid grid-cols-2 gap-4">
            <div className="group">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1">First Name</label>
                <input type="text" required className="input-glass w-full rounded p-3 text-sm mt-1" />
            </div>
            <div className="group">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1">Last Name</label>
                <input type="text" required className="input-glass w-full rounded p-3 text-sm mt-1" />
            </div>
        </div>
        <DateInput />
        <div className="group">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1">Place of Birth</label>
            <input type="text" placeholder="City" className="input-glass w-full rounded p-3 text-sm mt-1" />
        </div>
        <button type="submit" className="glass-btn w-full py-4 mt-6 rounded-xl text-xs uppercase tracking-[0.2em] font-bold text-white shadow-lg">
            Begin Simulation
        </button>
    </form>
  </motion.div>
);

// 加载页 Loading
const LoadingPage = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => { setTimeout(onComplete, 3000); }, [onComplete]);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center z-10">
      <div className="w-24 h-24 border-t-2 border-white rounded-full animate-spin mx-auto mb-8 opacity-80"></div>
      <div className="text-sm tracking-[0.3em] animate-pulse">ALIGNING STARS</div>
    </motion.div>
  );
};

// 仪表盘 Dashboard
const DashboardPage = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl h-screen overflow-hidden z-10 flex items-center justify-center p-6">
    <div className="glass-panel p-12 rounded-3xl text-center border-t border-white/20">
      <h2 className="text-4xl font-bold mb-4 glow-gold">Sun in Leo</h2>
      <p className="text-gray-400 mb-8 uppercase tracking-widest text-xs">Analysis Complete</p>
      <button className="glass-btn px-8 py-3 rounded-full text-xs uppercase font-bold tracking-widest">Enter Council</button>
    </div>
  </motion.div>
);

// --- 4. 主入口 ---
export default function Home() {
  const [step, setStep] = useState(0);

  // 这里是连接后端逻辑的地方
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: 这里写你的后端调用逻辑
    // const formData = new FormData(e.target as HTMLFormElement);
    // await fetch('/api/your-backend-endpoint', { method: 'POST', body: ... })
    
    setStep(2); // 进入加载页
  };

  return (
    <main className="relative w-full h-screen flex items-center justify-center bg-black overflow-hidden font-sans text-white">
      {/* 噪音背景层 */}
      <div className="fixed top-0 left-0 w-full h-full opacity-[0.05] pointer-events-none z-50" 
           style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`}}>
      </div>
      
      {/* 暗角层 */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-40"
           style={{background: 'radial-gradient(circle at center, transparent 40%, #000000 120%)'}}>
      </div>

      <ConstellationBackground />

      <AnimatePresence mode="wait">
        {step === 0 && <LandingPage key="landing" onStart={() => setStep(1)} />}
        {step === 1 && <InputPage key="input" onSubmit={handleFormSubmit} />}
        {step === 2 && <LoadingPage key="loading" onComplete={() => setStep(3)} />}
        {step === 3 && <DashboardPage key="dashboard" />}
      </AnimatePresence>
    </main>
  );
}
