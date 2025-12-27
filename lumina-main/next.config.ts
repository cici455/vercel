import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages 使用 @cloudflare/next-on-pages 时不需要静态导出
  // output: "export" 会阻止 API 路由工作，所以移除它

  // 图片优化配置（Cloudflare Pages 支持）
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
