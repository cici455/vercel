import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. 必须开启静态导出
  output: "export",

  // 2. 必须关闭图片优化 (否则静态部署会报错或白屏)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
