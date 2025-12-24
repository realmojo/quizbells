import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // htmlLimitedBots: /.*/,
  // Cloudflare Pages 호환성 설정
  // Cloudflare Pages는 Next.js를 자동으로 감지하고 최적화합니다
  images: {
    unoptimized: false, // Cloudflare Pages는 이미지 최적화를 지원
  },
  // Cloudflare Pages를 위한 추가 설정
  // API Routes가 있으므로 output: 'export'는 사용하지 않습니다
  // Cloudflare Pages가 자동으로 Edge Functions로 변환합니다
};

export default nextConfig;
