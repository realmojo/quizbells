import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  htmlLimitedBots: /.*/,
  // Cloudflare Pages 호환성 설정
  output: "standalone", // Cloudflare Pages에서 권장하는 출력 모드
  // 이미지 최적화 설정 (Cloudflare Pages에서도 작동)
  images: {
    unoptimized: false, // Cloudflare Pages는 이미지 최적화를 지원
  },
};

export default nextConfig;
