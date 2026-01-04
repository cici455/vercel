"use client";

import React, { useEffect, useRef } from "react";

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("❌ Canvas 元素未找到！");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("❌ 无法获取 2D 上下文！");
      return;
    }

    // 1. 强制设置画布大小 (并在控制台打印)
    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      console.log(`✅ 画布大小已设置: ${canvas.width}x${canvas.height}`);
      
      // 2. 立即填充一个纯红色背景 (不使用 requestAnimationFrame)
      ctx.fillStyle = "red";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 3. 画一个巨大的蓝色 X，确保能看出位置
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.stroke();
    };

    setSize();
    window.addEventListener("resize", setSize);

    return () => window.removeEventListener("resize", setSize);
  }, []);

  // 4. 使用内联样式强制覆盖所有 CSS 类
  return (
    <canvas
      ref={canvasRef}
      id="debug-canvas"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999, // 甚至比 Header 还高，遮住一切
        background: "rgba(0, 255, 0, 0.2)", // 如果 JS 挂了，CSS 背景应该是绿色的
        pointerEvents: "none",
      }}
    />
  );
}
