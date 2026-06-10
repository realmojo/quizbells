import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // htmlLimitedBots: /.*/,

  // 렌더링 차단 제거: CSS를 외부 <link> 대신 HTML <head>에 <style>로 인라인.
  // 초기 렌더를 막던 CSS 네트워크 요청이 사라져 FCP/LCP가 개선된다.
  experimental: {
    inlineCss: true,
  },

  // Cloudflare Pages 호환성 설정
  // Cloudflare Pages는 Next.js를 자동으로 감지하고 최적화합니다
  images: {
    unoptimized: false, // Cloudflare Pages는 이미지 최적화를 지원
  },
  // Cloudflare Pages를 위한 추가 설정
  // API Routes가 있으므로 output: 'export'는 사용하지 않습니다
  // Cloudflare Pages가 자동으로 Edge Functions로 변환합니다

  // 프로덕션 빌드에서 console.* 제거 (디버깅용 error/warn은 유지)
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  // bfcache 호환 + 검색엔진 친화적 헤더
  // - private 제거: 공유 캐시(CDN/검색엔진) 저장을 막아 크롤 버짓에 악영향
  // - no-store가 아니므로 bfcache는 정상 동작
  async headers() {
    return [
      {
        // _next/static 을 제외한 모든 경로(HTML/데이터): 항상 재검증.
        // 검색엔진 신선도를 유지하면서 bfcache도 정상 동작.
        source: "/((?!_next/static/).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, no-cache, max-age=0, must-revalidate",
          },
        ],
      },
      {
        // 빌드 자산(JS/CSS 청크)은 파일명에 콘텐츠 해시가 포함되어 영구 캐시가
        // 안전하다. 전역 no-cache가 이 immutable 캐시를 덮어 매 방문마다 청크를
        // 재검증하던 문제를 방지한다.
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
