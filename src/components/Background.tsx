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
      const particleCount = Math.floor(Math.random() * 11) + 30; // 30-40 particles
      
      for (let i = 0; i < particleCount; i++) {
        particleArray.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.2, // Very slow random speed
          vy: (Math.random() - 0.5) * 0.2,
          radius: Math.random() * 100 + 50 // Radius 50-150px
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
        // Mouse repulsion logic
        const dx = mouse.current.x - particle.x;
        const dy = mouse.current.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const interactionRadius = 300;
        const strength = 0.1;

        if (dist < interactionRadius) {
          const force = (interactionRadius - dist) / interactionRadius;
          // Push particle in the opposite direction
          particle.vx -= (dx / dist) * force * strength;
          particle.vy -= (dy / dist) * force * strength;
        }

        // Apply friction to slow down over time
        particle.vx *= 0.98;
        particle.vy *= 0.98;

        // Base movement
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Boundary check - wrap around edges
        if (particle.x < -particle.radius) particle.x = canvas.width + particle.radius;
        if (particle.x > canvas.width + particle.radius) particle.x = -particle.radius;
        if (particle.y < -particle.radius) particle.y = canvas.height + particle.radius;
        if (particle.y > canvas.height + particle.radius) particle.y = -particle.radius;
      });

      // Step 3: Draw all particles with blur and contrast effects
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'; // Pure white with high opacity (0.9)
      
      particles.current.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      
      ctx.restore();

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
    <div className="fixed top-0 left-0 w-full h-full bg-black z-[-1]">
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          backgroundColor: 'transparent',
          filter: 'blur(40px) contrast(20)'
        }}
      />
    </div>
  );
};

export default Background;