'use client';

import { useRef, useEffect } from 'react';

// Particles with 3D coordinates
// x, y: range roughly -width to width (to cover field when z changes)
// z: range 1 to fov (depth)
interface Particle {
  x: number;
  y: number;
  z: number;
  color: string;
  baseX: number; // Store original spawn relative position
  baseY: number;
}

export default function ConstellationBackground() {
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

    // --- Quantum Field Config ---
    const starCount = 400; // Reduced count for cleaner lines
    const fov = 300; // Field of view for 3D projection
    const baseSpeed = 2;
    
    const particles: Particle[] = [];

    // Initialize
    for (let i = 0; i < starCount; i++) {
      // 80% Cool White, 20% Emerald/Cyan
      const isEmerald = Math.random() > 0.8;
      const color = isEmerald 
        ? 'rgba(16, 185, 129, 0.6)' // Emerald
        : 'rgba(255, 255, 255, 0.4)'; // Cool White

      particles.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * fov,
        baseX: (Math.random() - 0.5) * width * 2,
        baseY: (Math.random() - 0.5) * height * 2,
        color
      });
    }

    let animationId: number;

    const draw = () => {
      // 1. Trails (Quantum Flow)
      // Do not clearRect. Use semi-transparent fill for trails.
      ctx.fillStyle = 'rgba(10, 10, 15, 0.2)'; // Dark background with slight transparency for fade
      ctx.fillRect(0, 0, width, height);
      
      const cx = width / 2;
      const cy = height / 2;

      // Update and Draw Particles
      // We need to map particles to 2D screen space first to draw lines
      const screenPoints: { x: number, y: number, p: Particle, scale: number }[] = [];

      particles.forEach(p => {
        // Move particle towards viewer (decrease Z)
        p.z -= baseSpeed;

        // Respawn if too close or out of bounds
        if (p.z <= 1) {
          p.z = fov;
          p.x = (Math.random() - 0.5) * width * 2;
          p.y = (Math.random() - 0.5) * height * 2;
        }

        // 3D Perspective Projection
        const scale = fov / p.z;
        const x2d = p.x * scale + cx;
        const y2d = p.y * scale + cy;

        // Only store/draw if within screen bounds (with some padding)
        if (x2d >= -50 && x2d <= width + 50 && y2d >= -50 && y2d <= height + 50) {
            screenPoints.push({ x: x2d, y: y2d, p, scale });
        }
      });

      // Draw Constellation Lines (Quantum Entanglement)
      ctx.lineWidth = 0.5;
      for (let i = 0; i < screenPoints.length; i++) {
        const p1 = screenPoints[i];
        
        // Find neighbors
        // Optimization: Don't check all against all. Just check next few? 
        // Or check only if close enough.
        // For 400 particles, O(N^2) is ~160,000 checks, might be heavy for 60fps.
        // Let's check a random subset or limit distance early.
        
        for (let j = i + 1; j < screenPoints.length; j++) {
            const p2 = screenPoints[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distSq = dx * dx + dy * dy;

            // Connection threshold: 100px
            if (distSq < 10000) {
                const dist = Math.sqrt(distSq);
                const opacity = 1 - dist / 100;
                
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.15})`; // Faint glowing lines
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
      }

      // Draw Particles (Stars)
      screenPoints.forEach(sp => {
        const { x, y, p, scale } = sp;
        
        ctx.fillStyle = p.color;
        
        // Size scales with proximity
        const size = Math.max(0.5, scale * 1.5);
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow for closer particles
        if (scale > 2) {
             ctx.shadowBlur = 10;
             ctx.shadowColor = p.color;
        } else {
             ctx.shadowBlur = 0;
        }
      });
      
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 bg-[#0A0A0F]" />;
}
