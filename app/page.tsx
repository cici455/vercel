'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ==========================================
// 1. 视觉组件：星空背景 & 粒子系统
// ==========================================
const ConstellationBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const updateSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    updateSize();

    const PARTICLE_COUNT = 600; // 粒子数量
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      tx: Math.random() * width,
      ty: Math.random() * height,
      vx: 0, vy: 0,
      size: Math.random() * 1.5,
      color: Math.random() > 0.85 ? { r: 251, g: 191, b: 36 } : { r: 200, g: 220, b: 255 },
    }));

    let animationId: number;
    let mouse = { x: -9999, y: -9999 };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach((p) => {
        // 缓动动画
        p.x += (p.tx - p.x) * 0.01;
        p.y += (p.ty - p.y) * 0.01;

        // 鼠标排斥效果
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const force = (200 - dist) / 200;
          p.x -= (dx / dist) * force * 5;
          p.y -= (dy / dist) * force * 5;
        }

        // 随机游走
        if (Math.random() > 0.99) {
          p.tx = Math.random() * width;
          p.ty = Math.random() * height;
        }

        // 绘制
        const alpha = 0.3 + Math.random() * 0.4;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},${alpha})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('resize', updateSize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
};

// ==========================================
// 2. UI 组件：输入框封装
// ==========================================
const GlassInput = ({ label, name, type = "text", placeholder, required = false }: any) => (
  <div className="group">
    <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1 group-focus-within:text-teal-400 transition-colors">
      {label}
    </label>
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      required={required}
      className="w-full bg-black/40 border border-white/15 text-white rounded p-3 text-sm mt-1 transition-all focus:border-white/40 focus:bg-black/60 outline-none placeholder-gray-600"
    />
  </div>
);

// ==========================================
// 3. 页面部分：Landing / Input / Loading / Dashboard
// ==========================================

// --- Landing Page ---
const LandingPage = ({ onStart }: { onStart: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
    transition={{ duration: 0.8 }}
    className="flex flex-col items-center justify-center text-center z-10 px-6"
  >
    <h1 className="font-bold relative z-10 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50 drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] mb-6" style={{ fontSize: '10vw', lineHeight: 1, fontFamily: 'sans-serif' }}>
      LUMINA
    </h1>
    <div className="relative z-10 flex flex-col items-center gap-3 mb-10">
      <div className="h-[1px] w-12 bg-white/30"></div>
      <p className="text-gray-300 text-sm tracking-[0.2em] uppercase font-light">The Celestial Simulator</p>
      <div className="h-[1px] w-12 bg-white/30"></div>
    </div>
    <motion.button
      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onStart}
      className="bg-white/5 border border-white/10 px-16 py-6 rounded-full text-sm font-bold tracking-[0.2em] uppercase text-white shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:bg-white/10 hover:border-white/40 transition-all"
    >
      Initialize
    </motion.button>
  </motion.div>
);

// --- Input Page (Form) ---
const InputPage = ({ onSubmit }: { onSubmit: (e: React.FormEvent<HTMLFormElement>) => void }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -50, filter: "blur(10px)" }}
    className="w-full max-w-md z-10 relative"
  >
    <div className="text-center mb-10">
      <h2 className="text-2xl font-bold tracking-[0.2em] text-white/90">CALIBRATION</h2>
      <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest">Enter Coordinates</p>
    </div>
    
    <form onSubmit={onSubmit} className="bg-[#0a0a0f]/60 backdrop-blur-2xl p-8 rounded-2xl border border-white/10 shadow-[0_4px_60px_rgba(0,0,0,0.6)] space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <GlassInput label="First Name" name="firstName" placeholder="Jane" required />
        <GlassInput label="Last Name" name="lastName" placeholder="Doe" required />
      </div>
      <GlassInput label="Date of Birth" name="date" placeholder="MM/DD/YYYY" required />
      <div className="grid grid-cols-2 gap-4">
        <GlassInput label="Time" name="time" type="time" required />
        <GlassInput label="Place of Birth" name="city" placeholder="New York" required />
      </div>
      
      <button type="submit" className="w-full py-4 mt-4 bg-white/5 border border-white/10 rounded-xl text-xs uppercase tracking-[0.2em] font-bold text-white hover:bg-white/10 hover:border-white/30 transition-all shadow-lg">
        Begin Simulation
      </button>
    </form>
  </motion.div>
);

// --- Loading Page ---
const LoadingPage = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center z-10">
    <div className="w-24 h-24 border-t-2 border-white rounded-full animate-spin mx-auto mb-8 opacity-80"></div>
    <div className="text-sm tracking-[0.3em] animate-pulse text-white">ALIGNING STARS...</div>
  </motion.div>
);

// --- Dashboard Page (Results) ---
const DashboardPage = ({ data }: { data: any }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-4xl z-10">
    <div className="bg-[#0a0a0f]/60 backdrop-blur-xl p-12 rounded-3xl border border-white/20 text-center shadow-2xl">
      <h2 className="text-4xl font-bold mb-4 text-white drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">
        Welcome, {data?.firstName || "Traveler"}
      </h2>
      
      <div className="my-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 这里展示后端返回的数据 */}
        <div className="p-6 bg-white/5 rounded-xl border border-white/5">
          <p className="text-xs uppercase text-gray-500 mb-2">Sun Sign</p>
          <p className="text-xl text-amber-300 font-bold">{data?.sunSign || "Calculated"}</p>
        </div>
        <div className="p-6 bg-white/5 rounded-xl border border-white/5">
          <p className="text-xs uppercase text-gray-500 mb-2">Moon Sign</p>
          <p className="text-xl text-gray-300 font-bold">{data?.moonSign || "Unknown"}</p>
        </div>
        <div className="p-6 bg-white/5 rounded-xl border border-white/5">
          <p className="text-xs uppercase text-gray-500 mb-2">Life Path</p>
          <p className="text-xl text-teal-300 font-bold">{data?.lifePath || "Unknown"}</p>
        </div>
      </div>

      <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mx-auto">
        {data?.message || "The stars have aligned to reveal your path."}
      </p>
      
      <button onClick={() => window.location.reload()} className="mt-10 px-8 py-3 rounded-full border border-white/20 text-xs uppercase hover:bg-white/10 transition-colors">
        Restart Session
      </button>
    </div>
  </motion.div>
);

// ==========================================
// 4. 主入口逻辑
// ==========================================
export default function Home() {
  const [step, setStep] = useState(0); // 0:Intro, 1:Input, 2:Loading, 3:Dashboard
  const [resultData, setResultData] = useState<any>(null); // 存储后端返回的数据

  // 处理表单提交
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep(2); // 进入加载状态

    // 1. 获取用户输入的数据
    const formData = new FormData(e.currentTarget);
    const userData = Object.fromEntries(formData.entries());

    console.log("Collecting User Data:", userData);

    try {
      // ============================================================
      // 【后端连接区域】
      // 如果你已经写好了 /api/calculate，请取消下面注释并删除模拟代码
      // ============================================================
      
      /* 
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      setResultData({ ...userData, ...data });
      */

      // --- 模拟后端返回 (如果你还没写后端，用这段代码测试) ---
      await new Promise(resolve => setTimeout(resolve, 3000)); // 假装加载3秒
      setResultData({
        firstName: userData.firstName,
        sunSign: "Leo",          // 模拟数据
        moonSign: "Scorpio",     // 模拟数据
        lifePath: "Number 7",    // 模拟数据
        message: "Your chart indicates a powerful transformation period ahead."
      });
      // -----------------------------------------------------

      setStep(3); // 进入结果页

    } catch (error) {
      console.error("Error:", error);
      alert("Connection to the stars failed. Please try again.");
      setStep(1);
    }
  };

  return (
    <main className="relative w-full h-screen flex items-center justify-center bg-black overflow-hidden font-sans text-white selection:bg-teal-500/30">
      {/* 噪音背景层 */}
      <div className="fixed top-0 left-0 w-full h-full opacity-[0.07] pointer-events-none z-50" 
           style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`}}>
      </div>
      
      {/* 晕影层 */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-40"
           style={{background: 'radial-gradient(circle at center, transparent 30%, #000000 120%)'}}>
      </div>

      <ConstellationBackground />

      <AnimatePresence mode="wait">
        {step === 0 && <LandingPage key="landing" onStart={() => setStep(1)} />}
        {step === 1 && <InputPage key="input" onSubmit={handleFormSubmit} />}
        {step === 2 && <LoadingPage key="loading" />}
        {step === 3 && <DashboardPage key="dashboard" data={resultData} />}
      </AnimatePresence>
    </main>
  );
}
