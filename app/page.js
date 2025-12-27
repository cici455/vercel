'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  // 粒子系统
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    // 创建粒子（数量少，速度慢）
    const createParticles = () => {
      const particleCount = 80; // 少量粒子
      particles = [];
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          baseX: Math.random() * canvas.width,
          baseY: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5, // 0.5 - 2px
          depth: Math.random(), // 0-1，用于景深感
          speed: Math.random() * 0.3 + 0.1, // 非常慢的速度
          angle: Math.random() * Math.PI * 2,
          opacity: Math.random() * 0.4 + 0.2,
        });
      }
    };
    createParticles();

    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        // 鼠标影响：粒子缓慢向鼠标方向漂浮
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - distance / 400); // 影响范围 400px

        // 缓慢移动
        particle.x += (dx * influence * 0.01 * particle.speed);
        particle.y += (dy * influence * 0.01 * particle.speed);

        // 轻微的随机漂移
        particle.angle += (Math.random() - 0.5) * 0.02;
        particle.x += Math.cos(particle.angle) * particle.speed;
        particle.y += Math.sin(particle.angle) * particle.speed;

        // 边界处理
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // 景深感：远处的粒子更小、更模糊、更透明
        const size = particle.size * (0.5 + particle.depth * 0.5); // 近大远小
        const opacity = particle.opacity * (0.3 + particle.depth * 0.7); // 近亮远暗

        // 绘制粒子
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        
        // 模糊效果（通过多层绘制模拟）
        const blur = (1 - particle.depth) * 2; // 远处更模糊
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        
        // 绘制主点
        ctx.fill();
        
        // 绘制光晕（远处粒子）
        if (blur > 0.5) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, size * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', resizeCanvas);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // 计算背景光斑的视差位置
  const parallaxX = mousePos.x * 0.02;
  const parallaxY = mousePos.y * 0.02;

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {/* Canvas 粒子系统 */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />

      {/* SVG 噪点层 */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          zIndex: 2,
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 中心辐射的深渊微光（带视差效果） */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          zIndex: 3,
          background: `radial-gradient(circle at ${50 + parallaxX}% ${50 + parallaxY}%, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 30%, transparent 70%)`,
          animation: 'breath 8s ease-in-out infinite',
        }}
      />

      {/* 主内容区域 */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        {/* 标题 LUMINA - Ghost Blur 效果 */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 2.5, ease: 'easeOut' }}
          className="relative mb-6"
        >
          {/* 模糊背景层 */}
          <span
            className="absolute inset-0 text-white blur-[20px] opacity-30"
            style={{ fontFamily: 'var(--font-cinzel), serif' }}
          >
            LUMINA
          </span>
          {/* 清晰前景层 */}
          <span
            className="relative text-white text-8xl md:text-9xl font-semibold tracking-wider"
            style={{ fontFamily: 'var(--font-cinzel), serif' }}
          >
            LUMINA
          </span>
        </motion.h1>

        {/* Slogan */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 2.5, delay: 0.3, ease: 'easeOut' }}
          className="text-gray-400 text-xs md:text-sm font-light uppercase tracking-[0.5em] mb-16"
          style={{ fontFamily: 'var(--font-inter), sans-serif' }}
        >
          CELESTIAL BREATH
        </motion.p>

        {/* 星际开关按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 2.5, delay: 0.6, ease: 'easeOut' }}
          className="group relative"
        >
          <button className="relative px-12 py-4 border border-white/20 rounded-none transition-all duration-500 hover:border-white/60 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            {/* 按钮文字 */}
            <span
              className="relative z-10 text-white text-sm uppercase tracking-[0.3em] font-light"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              ENTER
            </span>

            {/* 环绕光点 */}
            <span 
              className="absolute w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 orbit-light"
            ></span>
          </button>
        </motion.div>
      </div>

      {/* 呼吸动画样式 */}
      <style jsx global>{`
        @keyframes breath {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes orbit {
          0% {
            top: -0.25rem;
            left: 0;
          }
          25% {
            top: -0.25rem;
            left: calc(100% - 0.5rem);
          }
          50% {
            top: calc(100% - 0.5rem);
            left: calc(100% - 0.5rem);
          }
          75% {
            top: calc(100% - 0.5rem);
            left: -0.25rem;
          }
          100% {
            top: -0.25rem;
            left: 0;
          }
        }

        .orbit-light {
          animation: orbit 3s linear infinite;
          animation-play-state: paused;
        }

        .group:hover .orbit-light {
          animation-play-state: running;
        }
      `}</style>
    </main>
  );
}
