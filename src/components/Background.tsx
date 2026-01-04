"use client";

import React, { useEffect, useRef } from "react";

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    // --- 关键参数配置 ---
    // 数量极少，尺寸巨大，才能形成"流体"
    const particleCount = 5;
    const minRadius = 300;
    const maxRadius = 500;
    const speed = 1.5; // 速度稍快一点，让形态变化更明显

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;

      constructor() {
        this.radius = Math.random() * (maxRadius - minRadius) + minRadius;
        // 让粒子初始位置分散在屏幕各个角落
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = (Math.random() - 0.5) * speed;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // 碰到边界反弹
        if (this.x - this.radius < 0 || this.x + this.radius > canvas!.width) this.vx *= -1;
        if (this.y - this.radius < 0 || this.y + this.radius > canvas!.height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        // 纯白色
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    window.addEventListener("resize", init);

    return () => {
      window.removeEventListener("resize", init);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        background: "transparent",
        // 这里的 Blur 和 Contrast 必须配合巨大的粒子半径
        // Blur 60px 把球体模糊成云
        // Contrast 50 把云的边缘切得锐利，形成液态感
        filter: "blur(60px) contrast(50)",
        mixBlendMode: "screen",
      }}
    />
  );
}
