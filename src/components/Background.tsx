'use client';

import React, { useRef, useEffect, useState } from 'react';

interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  color: string;
}

const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const orbsRef = useRef<Orb[]>([]);
  const animationRef = useRef<number | undefined>(undefined);

  // Initialize glowing orbs
  const initOrbs = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const orbs: Orb[] = [];
    const orbCount = 8; // 6-10 glowing orbs

    for (let i = 0; i < orbCount; i++) {
      orbs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2, // Slow movement
        vy: (Math.random() - 0.5) * 0.2,
        radius: Math.random() * 250 + 150, // 150-400px radius
        opacity: Math.random() * 0.05 + 0.05, // 0.05-0.1 opacity
        color: `rgba(255, 255, 255, ${Math.random() * 0.05 + 0.05})` // Very light color
      });
    }

    orbsRef.current = orbs;
  };

  // Handle mouse movement for repulsion effect
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  // Handle resize
  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initOrbs();
  };

  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw and update orbs
    orbsRef.current.forEach((orb) => {
      // Calculate distance from mouse for repulsion
      const dx = mouseRef.current.x - orb.x;
      const dy = mouseRef.current.y - orb.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxRepulsionDistance = 300;

      // Repulsion effect
      if (distance < maxRepulsionDistance) {
        const force = (maxRepulsionDistance - distance) / maxRepulsionDistance;
        const angle = Math.atan2(dy, dx);
        orb.vx -= Math.cos(angle) * force * 0.8;
        orb.vy -= Math.sin(angle) * force * 0.8;
      }

      // Update position
      orb.x += orb.vx;
      orb.y += orb.vy;

      // Apply friction to slow down over time
      orb.vx *= 0.96;
      orb.vy *= 0.96;

      // Wrap around edges
      if (orb.x < -orb.radius * 2) orb.x = canvas.width + orb.radius * 2;
      if (orb.x > canvas.width + orb.radius * 2) orb.x = -orb.radius * 2;
      if (orb.y < -orb.radius * 2) orb.y = canvas.height + orb.radius * 2;
      if (orb.y > canvas.height + orb.radius * 2) orb.y = -orb.radius * 2;

      // Draw glowing orb with strong blur effect
      ctx.save();
      ctx.globalCompositeOperation = 'screen'; // Additive blending for glow effect
      
      // Create gradient for soft edge
      const gradient = ctx.createRadialGradient(
        orb.x, orb.y, orb.radius * 0.2,
        orb.x, orb.y, orb.radius
      );
      gradient.addColorStop(0, orb.color);
      gradient.addColorStop(0.5, orb.color.replace(/[\d.]+\)$/, `${orb.opacity * 0.5})`));
      gradient.addColorStop(1, orb.color.replace(/[\d.]+\)$/, '0)'));
      
      // Draw the orb
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      ctx.restore();
    });

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize orbs
    initOrbs();
    setIsLoaded(true);

    // Start animation
    animate();

    // Event listeners
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 1s ease-in-out'
      }}
    />
  );
};

export default Background;