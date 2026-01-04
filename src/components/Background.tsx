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
    const orbCount = 12; // 10-15 glowing orbs for more dynamic effect

    for (let i = 0; i < orbCount; i++) {
      orbs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8, // Faster base speed for noticeable flow
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 200 + 100, // 100-300px radius for more orbs
        opacity: Math.random() * 0.08 + 0.08, // 0.08-0.16 opacity for better visibility
        color: `rgba(255, 255, 255, ${Math.random() * 0.08 + 0.08})` // Slightly brighter color
      });
    }

    orbsRef.current = orbs;
  };

  // Handle mouse movement for repulsion effect
  const handleMouseMove = (e: MouseEvent) => {
    // Get mouse position relative to window
    mouseRef.current = {
      x: e.clientX,
      y: e.clientY
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

      // Repulsion effect - strong push when mouse is close
      if (distance < maxRepulsionDistance && distance > 0) {
        // Calculate repulsion force
        const force = (maxRepulsionDistance - distance) / maxRepulsionDistance * 2;
        
        // Calculate angle away from mouse
        const angle = Math.atan2(dy, dx);
        
        // Apply repulsion force to velocity
        orb.vx -= Math.cos(angle) * force;
        orb.vy -= Math.sin(angle) * force;
      }

      // Update position with base velocity
      orb.x += orb.vx;
      orb.y += orb.vy;

      // Apply friction to slow down over time, but keep momentum
      orb.vx *= 0.96;
      orb.vy *= 0.96;

      // Boundary check - wrap around edges smoothly
      if (orb.x < -orb.radius) orb.x = canvas.width + orb.radius;
      if (orb.x > canvas.width + orb.radius) orb.x = -orb.radius;
      if (orb.y < -orb.radius) orb.y = canvas.height + orb.radius;
      if (orb.y > canvas.height + orb.radius) orb.y = -orb.radius;

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

    // Recursively call animate with requestAnimationFrame
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

    // Start animation loop
    animate();

    // Add event listeners to window for mouse movement and resize
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Cleanup event listeners and animation
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
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