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

  // bfcache 호환 + 검색엔진 친화적 헤더
  // - private 제거: 공유 캐시(CDN/검색엔진) 저장을 막아 크롤 버짓에 악영향
  // - no-store가 아니므로 bfcache는 정상 동작
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, no-cache, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
