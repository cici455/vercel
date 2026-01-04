'use client';

import React, { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize 30-40 particles
    const initParticles = () => {
      const particleArray: Particle[] = [];
      const particleCount = Math.floor(Math.random() * 11) + 30;
      
      for (let i = 0; i < particleCount; i++) {
        particleArray.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          radius: Math.random() * 100 + 50
        });
      }
      
      particles.current = particleArray;
    };
    
    initParticles();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      
      particles.current.forEach(particle => {
        // Mouse repulsion logic
        const dx = mouse.current.x - particle.x;
        const dy = mouse.current.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const interactionRadius = 300;
        const strength = 0.1;

        if (dist < interactionRadius) {
          const force = (interactionRadius - dist) / interactionRadius;
          particle.vx -= (dx / dist) * force * strength;
          particle.vy -= (dy / dist) * force * strength;
        }

        particle.vx *= 0.98;
        particle.vy *= 0.98;

        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < -particle.radius) particle.x = canvas.width + particle.radius;
        if (particle.x > canvas.width + particle.radius) particle.x = -particle.radius;
        if (particle.y < -particle.radius) particle.y = canvas.height + particle.radius;
        if (particle.y > canvas.height + particle.radius) particle.y = -particle.radius;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -1,
      pointerEvents: 'none'
    }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 0,
          backgroundColor: 'rgba(255, 0, 0, 0.3)',
          filter: 'none'
        }}
      />
    </div>
  );
};

export default Background;
