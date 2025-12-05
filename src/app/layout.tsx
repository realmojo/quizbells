import type { Metadata } from "next";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/layouts/Header";
import RegisterServiceWorker from "@/app/register-service-worker";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import NaverAnalyticsTracker from "@/components/NaverAnalyticsTracker";
import "./globals.css";

import SendAuthToSW from "@/components/SendAuthToSW";
// import InstallPromptBanner from "@/components/InstallPromptBanner";
import ForegroundNotification from "@/components/ForegroundNotification";
import AlarmSetting from "@/components/AlarmSetting";
import { ReactNode } from "react";
import { GoogleAdSense } from "@/components/AdsenseInit";
// import ClientOnly from "@/components/ClientOnly";

export const metadata: Metadata = {
  title: "퀴즈벨 - 매일 쏟아지는 퀴즈 정답 알림 서비스 | QUIZBELLS",
  description:
    "퀴즈벨(QUIZBELLS)은 캐시워크, 신한쏠퀴즈, 토스행운퀴즈, 캐시닥, 오케이케시백 등 인기 앱의 퀴즈 정답을 가장 빠르게 알려주는 알림 기반 퀴즈 서비스입니다. 앱테크의 핵심, 퀴즈벨로 포인트 적립하세요!",
  keywords: [
    "퀴즈벨",
    "QUIZBELLS",
    "퀴즈 정답",
    "앱테크",
    "쏠퀴즈",
    "캐시워크",
    "토스퀴즈",
    "포인트앱",
    "퀴즈 알림",
    "퀴즈 이벤트",
    "출석퀴즈",
    "캐시닥",
    "오케이캐시백",
    "신한쏠퀴즈",
  ],
  authors: [
    {
      name: "QUIZBELLS",
      url: "https://quizbells.com",
    },
  ],
  creator: "QUIZBELLS",
  publisher: "QUIZBELLS",
  applicationName: "QUIZBELLS",
  generator: "Next.js",
  category: "quiz, apptech, reward, entertainment",
  // themeColor: "#1D4ED8",
  // viewport: "width=device-width, initial-scale=1.0, maximum-scale=5.0",
  robots: "index, follow",
  openGraph: {
    title: "퀴즈벨 - 오늘의 퀴즈 정답 모음 알림 | QUIZBELLS",
    description:
      "퀴즈벨(QUIZBELLS)은 캐시워크, 신한쏠퀴즈, 토스행운퀴즈, 캐시닥, 오케이케시백 등 인기 앱의 퀴즈 정답을 가장 빠르게 알려주는 알림 기반 퀴즈 서비스입니다. 앱테크의 핵심, 퀴즈벨로 포인트 적립하세요!",
    url: "https://quizbells.com",
    siteName: "퀴즈벨",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "https://quizbells.com/icons/og-image.png", // Open Graph 용 대표 이미지 (추천: 1200x630)
        width: 1200,
        height: 630,
        alt: "퀴즈벨 - 앱테크 퀴즈 정답 알림 서비스",
      },
      {
        url: "https://quizbells.com/icons/android-icon-192x192.png",
        width: 192,
        height: 192,
        alt: "퀴즈벨 아이콘",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "퀴즈벨 - 퀴즈 정답 알림 서비스 | 앱테크로 포인트 적립하세요!",
    description:
      "신한쏠퀴즈, 캐시워크, 토스행운퀴즈, 캐시닥, 오케이캐시백퀴즈벨(QUIZBELLS)은 캐시워크, 신한쏠퀴즈, 토스행운퀴즈, 캐시닥, 오케이케시백 등 인기 앱의 퀴즈 정답을 가장 빠르게 알려주는 알림 기반 퀴즈 서비스입니다. 앱테크의 핵심, 퀴즈벨로 포인트 적립하세요!",
    site: "@quizbells_official",
    creator: "@quizbells_official",
    images: ["https://quizbells.com/icons/og-image.png"], // Twitter 카드용 이미지 (1200x630)
  },
};

export default async function RootLayout({
  children,
  // modal,
}: Readonly<{
  children: ReactNode;
  // modal: ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="naver-site-verification"
          content="3f64e7db8e8deef8c04f1aaffd716f53498e30ee"
        />
        <meta
          name="google-site-verification"
          content="ouZeon6aBrcNKweLJU3eD7w5AjuYyq3MQFlk2jYv7d8"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4009JNVXBL"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
        <Script src="//wcs.pstatic.net/wcslog.js" strategy="afterInteractive" />
        <Script
          id="naver-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
             if(!wcs_add) var wcs_add = {};
              wcs_add["wa"] = "136538e329b3cb0";
              if(window.wcs) {
              wcs_do();
            }
            `,
          }}
        />

        <GoogleAdSense />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/android-icon-48x48.png" />
      </head>
      <body>
        {/* <ClientOnly /> */}
        <NaverAnalyticsTracker />
        <GoogleAnalytics />
        <ForegroundNotification />
        <main className="min-h-[80vh] w-full">
          <Header />
          {children}
          {/* {modal} */}
        </main>
        <Toaster
          position="bottom-center"
          toastOptions={{
            className: "mb-12", // 하단에서 살짝 위
            style: {
              backgroundColor: "#e6ffed", // 연한 초록 배경
              color: "#065f46", // 진한 초록 텍스트
              border: "1px solid rgb(141, 229, 197)", // 테두리 색상
              fontWeight: "600",
            },
          }}
        />
        <RegisterServiceWorker />
        <SendAuthToSW />
        {/* <InstallPromptBanner /> */}
        <AlarmSetting />
        {/* <ClientOnly /> */}
      </body>
    </html>
  );
}
