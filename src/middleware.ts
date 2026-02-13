import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  // CSP 정책 설정
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval'
      https://www.googletagmanager.com
      https://www.google-analytics.com
      https://www.clarity.ms
      https://pagead2.googlesyndication.com
      https://adservice.google.com
      https://www.google.com
      https://googleads.g.doubleclick.net
      https://partner.googleadservices.com
      https://tpc.googlesyndication.com
      https://cdn.jsdelivr.net
      wcs.naver.net
      //wcs.naver.net;
    style-src 'self' 'unsafe-inline'
      https://fonts.googleapis.com
      https://cdn.jsdelivr.net;
    img-src 'self' data: blob: https: http:;
    font-src 'self' data:
      https://fonts.gstatic.com
      https://cdn.jsdelivr.net;
    connect-src 'self'
      https://www.google-analytics.com
      https://www.googletagmanager.com
      https://stats.g.doubleclick.net
      https://www.clarity.ms
      wcs.naver.net
      https://wcs.naver.com
      https://pagead2.googlesyndication.com
      https://adservice.google.com
      https://googleads.g.doubleclick.net
      https://partner.googleadservices.com
      https://www.google.com
      *.googleapis.com
      *.firebaseio.com
      *.firebase.com
      *.google.com
      fcm.googleapis.com;
    frame-src 'self'
      https://www.google.com
      https://googleads.g.doubleclick.net
      https://tpc.googlesyndication.com
      https://td.doubleclick.net;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeader);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", cspHeader);

  // 추가 보안 헤더
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, icons, etc.)
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json|xml|txt)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
