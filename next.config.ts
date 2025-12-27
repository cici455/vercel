import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 加上这一行关键配置
  output: "export",
  
  // 如果你原本有 images: { unoptimized: true } 之类的配置，请保留
  // 如果你的图片显示不出来，可能还需要加上 images: { unoptimized: true }
};

export default nextConfig;
