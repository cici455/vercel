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

    // Initialize 20 particles
    const initParticles = () => {
      const particleArray: Particle[] = [];
      for (let i = 0; i < 20; i++) {
        particleArray.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5), // Random speed -0.5 to 0.5
          vy: (Math.random() - 0.5),
          radius: Math.random() * 200 + 100 // Radius 100-300px
        });
      }
      particles.current = particleArray;
    };
    initParticles();

    // Mouse move event listener
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation function
    const animate = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Step 1: Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Step 2: Update particles
      particles.current.forEach(particle => {
        // Base movement
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Boundary check - reverse velocity if out of bounds
        if (particle.x - particle.radius < 0 || particle.x + particle.radius > canvas.width) {
          particle.vx = -particle.vx;
        }
        if (particle.y - particle.radius < 0 || particle.y + particle.radius > canvas.height) {
          particle.vy = -particle.vy;
        }

        // Mouse repulsion logic
        const dx = mouse.current.x - particle.x;
        const dy = mouse.current.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const interactionRadius = 300;
        const force = 3;

        if (dist < interactionRadius) {
          const angle = Math.atan2(dy, dx);
          particle.x += Math.cos(angle) * force;
          particle.y += Math.sin(angle) * force;
        }

        // Step 3: Draw particle with blur effect
        ctx.save();
        ctx.filter = 'blur(60px)';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Step 4: Loop animation
      animationFrameId.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
};

export default Background;