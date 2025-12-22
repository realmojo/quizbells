import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  htmlLimitedBots: /.*/,
  // Cloudflare Pages 호환성 설정
  // output: "standalone"은 Cloudflare Pages에서 자동으로 처리되므로 주석 처리
  // Cloudflare Pages는 Next.js를 자동으로 감지하고 최적화합니다
  images: {
    unoptimized: false, // Cloudflare Pages는 이미지 최적화를 지원
  },
};

export default nextConfig;
