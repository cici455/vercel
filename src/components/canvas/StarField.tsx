'use client';

import { useRef, useEffect } from 'react';

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    window.addEventListener('resize', resize);
    resize();

    // Star properties
    const stars: { x: number; y: number; z: number; prevZ: number }[] = [];
    const starCount = 800;
    const speed = 0.5; // Base speed factor
    
    // Initialize stars
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: 0,
        prevZ: 0
      });
    }

    let animationId: number;

    const draw = () => {
      // Clear with slight fade for trail? No, user asked for NO trails.
      ctx.fillStyle = '#020205'; // Match background color to clear
      ctx.fillRect(0, 0, width, height);
      
      const cx = width / 2;
      const cy = height / 2;

      ctx.lineWidth = 1;
      
      stars.forEach(star => {
        // Converge Effect:
        // Stars spawn at random positions.
        // They move towards the center (cx, cy).
        // Speed increases slightly as they get closer? Or keep it constant/slow/hypnotic.
        
        // Calculate vector to center
        const dx = cx - star.x;
        const dy = cy - star.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Normalize and move
        if (dist > 1) {
            star.x += (dx / dist) * speed;
            star.y += (dy / dist) * speed;
        } else {
            // Re-spawn at edge if it hits center
            if (Math.random() > 0.5) {
                star.x = Math.random() > 0.5 ? 0 : width;
                star.y = Math.random() * height;
            } else {
                star.x = Math.random() * width;
                star.y = Math.random() > 0.5 ? 0 : height;
            }
        }
      });
      
      // Draw stars as tiny dots
      ctx.fillStyle = '#ffffff';
      stars.forEach(star => {
         const size = Math.random() * 1.5 + 0.5; // 0.5px to 2px
         ctx.globalAlpha = Math.random() * 0.5 + 0.3; // Twinkle
         ctx.beginPath();
         ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
         ctx.fill();
      });
      
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 bg-black" />;
}
