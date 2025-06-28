import type { Metadata } from "next";
// import { Toaster } from "@/components/ui/sonner";

import Script from "next/script";
import Header from "@/components/layouts/Header";
import RegisterServiceWorker from "@/app/register-service-worker";
import localFont from "next/font/local";
// import GoogleAnalytics from "@/src/components/GoogleAnalytics";
// import NaverAnalyticsTracker from "@/src/components/NaverAnalyticsTracker";
import "./globals.css";

import SendAuthToSW from "@/components/SendAuthToSW";
// import InstallPromptBanner from "@/src/components/InstallPromptBanner";
// import ClientOnly from "@/src/components/ClientOnly";
// import ForegroundNotification from "@/src/components/ForegroundNotification";
// import LayoutClientWrapper from "@/src/components/LayoutClientWrapper";
import { ReactNode } from "react";
import BottomTabBar from "@/components/BottomTabBar";

export const metadata: Metadata = {
  title: "퀴즈벨 - 퀴즈 풀기 알림 서비스",
  description: "퀴즈벨(QUIZBELLS)은 퀴즈 풀기 알림 서비스입니다.",
  keywords: ["QUIZBELLS", "퀴즈 풀기 알림 서비스"],
  authors: [{ name: "QUIZBELLS", url: "https://quizbells.com" }],
  openGraph: {
    title: "퀴즈벨 - 퀴즈 풀기 알림 서비스",
    description: "퀴즈벨(QUIZBELLS)은 퀴즈 풀기 알림 서비스입니다.",
    url: "https://quizbells.com",
    siteName: "퀴즈벨",
    images: [
      {
        url: "https://quizbells.com/icons/android-icon-192x192.png",
        width: 192,
        height: 192,
        alt: "퀴즈벨(QUIZBELLS) 퀴즈 풀기 알림",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "퀴즈벨 - 퀴즈 풀기 알림 서비스",
    description: "퀴즈 풀기 알림 서비스입니다.",
    site: "@quizbells_official",
    creator: "@quizbells_official",
    images: ["https://quizbells.com/android-icon-512x512.png"],
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
        {/* <meta
          name="naver-site-verification"
          content="80d6139455845cdbf1c9f9457d7dceef48681fb3"
        />
        <meta
          name="google-site-verification"
          content="FrevTocD5esK1kGfI3LURLhqx1zfKAcM-v_-WvAI9Qw"
        /> */}

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
        {/* <ClientOnly />
        <NaverAnalyticsTracker />
        <GoogleAnalytics />
        <ForegroundNotification /> */}
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
