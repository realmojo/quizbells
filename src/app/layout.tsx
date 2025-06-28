import type { Metadata } from "next";
// import { Toaster } from "@/components/ui/sonner";

import Script from "next/script";
import Header from "@/components/layouts/Header";
import RegisterServiceWorker from "@/app/register-service-worker";
import localFont from "next/font/local";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import NaverAnalyticsTracker from "@/components/NaverAnalyticsTracker";
import "./globals.css";

import SendAuthToSW from "@/components/SendAuthToSW";
// import InstallPromptBanner from "@/src/components/InstallPromptBanner";
// import ClientOnly from "@/src/components/ClientOnly";
import ForegroundNotification from "@/components/ForegroundNotification";
// import LayoutClientWrapper from "@/src/components/LayoutClientWrapper";
import { ReactNode } from "react";
import BottomTabBar from "@/components/BottomTabBar";

export const metadata: Metadata = {
  title: "퀴즈벨 - 매일 쏟아지는 퀴즈 정답 알림 서비스 | QUIZBELLS",
  description:
    "퀴즈벨(QUIZBELLS)은 캐시워크, 쏠퀴즈, 토스 등 인기 앱의 퀴즈 정답을 가장 빠르게 알려주는 알림 기반 퀴즈 서비스입니다. 앱테크의 핵심, 퀴즈벨로 포인트 적립하세요!",
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
  themeColor: "#1D4ED8",
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=5.0",
  robots: "index, follow",
  openGraph: {
    title: "퀴즈벨 - 오늘의 퀴즈 정답 모음 알림 | QUIZBELLS",
    description:
      "퀴즈벨은 매일 업데이트되는 퀴즈 정답을 가장 빠르게 전달하는 앱테크 퀴즈 알림 서비스입니다. 포인트 적립의 지름길, 지금 바로 퀴즈벨에서 확인하세요!",
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
      "신한쏠퀴즈, 캐시워크, 토스퀴즈 등 다양한 퀴즈 정답을 매일 푸시 알림으로 알려주는 앱테크 필수 서비스, QUIZBELLS.",
    site: "@quizbells_official",
    creator: "@quizbells_official",
    images: ["https://quizbells.com/icons/og-image.png"], // Twitter 카드용 이미지 (1200x630)
  },
};

const pretendard = localFont({
  src: "../fonts/pretendard/PretendardVariable.woff2",
  display: "swap",
  weight: "100 900",
  variable: "--font-pretendard",
});

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: ReactNode;
  modal: ReactNode;
}>) {
  return (
    <html lang="en" className={`${pretendard.variable}`}>
      <head>
        <meta
          name="naver-site-verification"
          content="3f64e7db8e8deef8c04f1aaffd716f53498e30ee"
        />
        <meta
          name="google-site-verification"
          content="ouZeon6aBrcNKweLJU3eD7w5AjuYyq3MQFlk2jYv7d8"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        <Script type="text/javascript" src="//wcs.naver.net/wcslog.js" />
        <Script id="naver-analytics" type="text/javascript">{`
             if(!wcs_add) var wcs_add = {};
              wcs_add["wa"] = "136538e329b3cb0";
              if(window.wcs) {
              wcs_do();
            }
            `}</Script>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={pretendard.className}>
        {/* <ClientOnly /> */}
        <NaverAnalyticsTracker />
        <GoogleAnalytics />
        <ForegroundNotification />
        <main className="min-h-[80vh] w-full">
          <Header />
          {children}
          {modal}
        </main>
        <BottomTabBar />
        {/* <Toaster
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
        /> */}
        <RegisterServiceWorker />
        <SendAuthToSW />
        {/* <InstallPromptBanner /> */}
      </body>
    </html>
  );
}
