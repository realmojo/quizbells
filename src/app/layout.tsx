import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import RegisterServiceWorker from "@/app/register-service-worker";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import NaverAnalyticsTracker from "@/components/NaverAnalyticsTracker";
import "./globals.css";
import Script from "next/script";
import SendAuthToSW from "@/components/SendAuthToSW";
import ForegroundNotification from "@/components/ForegroundNotification";
import AlarmSetting from "@/components/AlarmSetting";
import { ReactNode } from "react";
import { GoogleAdSense } from "@/components/AdsenseInit";
export const metadata: Metadata = {
  title:
    "퀴즈벨 - 오늘의 앱테크 퀴즈 정답 모음 | 신한쏠, 캐시워크, 토스 퀴즈 정답",
  description:
    "매일 업데이트되는 앱테크 퀴즈 정답! 신한쏠퀴즈, 캐시워크, 토스 행운퀴즈, 캐시닥, 오케이캐시백 등 인기 앱의 퀴즈 정답을 실시간으로 확인하세요. 퀴즈 정답 푸시 알림으로 포인트 적립을 놓치지 마세요!",
  keywords: [
    "퀴즈벨",
    "QUIZBELLS",
    "퀴즈 정답",
    "앱테크 퀴즈",
    "신한쏠퀴즈 정답",
    "캐시워크 퀴즈",
    "토스 두근두근 1등찍기 행운퀴즈",
    "캐시닥 퀴즈",
    "오케이캐시백 퀴즈",
    "오늘의 퀴즈 정답",
    "앱테크",
    "포인트 적립",
    "쏠퀴즈 정답",
    "퀴즈 알림",
    "앱 퀴즈 정답 모음",
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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "ouZeon6aBrcNKweLJU3eD7w5AjuYyq3MQFlk2jYv7d8",
    other: {
      "naver-site-verification": "3f64e7db8e8deef8c04f1aaffd716f53498e30ee",
    },
  },
  icons: {
    icon: "/icons/android-icon-48x48.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "퀴즈벨 - 오늘의 앱테크 퀴즈 정답 모음",
    description:
      "신한쏠퀴즈, 캐시워크, 토스 행운퀴즈 등 인기 앱테크 앱의 퀴즈 정답을 실시간으로 확인하세요. 알림으로 매일 포인트 적립!",
    url: "https://quizbells.com",
    siteName: "퀴즈벨",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "https://quizbells.com/images/quizbells_og_1200.png",
        width: 1200,
        height: 630,
        alt: "퀴즈벨 - 앱테크 퀴즈 정답 알림 서비스",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "퀴즈벨 - 오늘의 앱테크 퀴즈 정답 모음",
    description:
      "신한쏠퀴즈, 캐시워크, 토스 행운퀴즈 등 퀴즈 정답을 실시간 업데이트! 알림으로 포인트 적립을 놓치지 마세요.",
    images: ["https://quizbells.com/images/quizbells_og_1200.png"],
  },
  alternates: {
    canonical: "https://quizbells.com",
  },
  metadataBase: new URL("https://quizbells.com"),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Script
          strategy="beforeInteractive"
          id="naver-analytics"
          src="//wcs.naver.net/wcslog.js"
        />
        <Script
          strategy="beforeInteractive"
          id="naver-analytics-init"
          dangerouslySetInnerHTML={{
            __html:
              'if(!wcs_add) var wcs_add = {}; wcs_add["wa"] = "136538e329b3cb0"; if(window.wcs) {wcs_do();}',
          }}
        />
        <Script
          strategy="beforeInteractive"
          id="google-tag-manager"
          dangerouslySetInnerHTML={{
            __html:
              '(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({"gtm.start":new Date().getTime(),event:"gtm.js"});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!="dataLayer"?"&l="+l:"";j.async=true;j.src="https://www.googletagmanager.com/gtm.js?id="+i+dl;f.parentNode.insertBefore(j,f);})(window,document,"script","dataLayer","GTM-M3V3PSB");',
          }}
        />
        {/* Google Analytics */}
        <Script
          strategy="beforeInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-ZPZFXZ11GR"
          async
        />
        <Script
          strategy="beforeInteractive"
          id="google-analytics"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZPZFXZ11GR', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
        <Script
          id="clarity-tracking"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){ c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)}; t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt"; y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y); })(window, document, "clarity", "script", "umxzbajlwf");`,
          }}
        />
        {/* Google Ad Manager (GPT) */}
        <Script
          async
          src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
          crossOrigin="anonymous"
        />
        <Script
          id="gpt-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.googletag = window.googletag || {cmd: []};
              window.googletag.cmd = window.googletag.cmd || [];
              window.__rewardedAdEvent = null;
              
              googletag.cmd.push(function() {
                var mapping1 = googletag.sizeMapping()
                  .addSize([1024, 768], [[970, 250], [750, 200], [750, 300]]) 
                  .addSize([640, 480], [[336, 280], [250, 250]])
                  .addSize([0, 0], [[336, 280], [250, 250], [300, 250], 'fluid'])
                  .build();

                googletag.defineSlot('/23331430035/quizbells_main_top', [[336, 280], [250, 250], [750, 200], [970, 250], 'fluid', [750, 300]], 'div-gpt-ad-1771394382291-0')
                  .defineSizeMapping(mapping1)
                  .addService(googletag.pubads());
                  
                googletag.defineSlot('/23331430035/quizbells_quiz', [[200, 200], [125, 125], 'fluid', [120, 90], [336, 280], [1, 1], [300, 250], [120, 60], [300, 100]], 'div-gpt-ad-1771406658372-0').addService(googletag.pubads());
                googletag.pubads().enableSingleRequest();
                googletag.enableServices();
                  
                var rewardedSlot = googletag.defineOutOfPageSlot('/23331430035/quizbells_Rewarded_Ad', googletag.enums.OutOfPageFormat.REWARDED);
                if (rewardedSlot) {
                  rewardedSlot.addService(googletag.pubads());
                }

                // 리워드 광고 이벤트 리스너
                googletag.pubads().addEventListener('rewardedSlotReady', function(event) {
                  console.log('Rewarded ad slot ready');
                  window.__rewardedAdEvent = event;
                });

                googletag.pubads().addEventListener('rewardedSlotClosed', function() {
                  console.log('Rewarded ad closed');
                  if (window.__pendingNavUrl) {
                     window.location.href = window.__pendingNavUrl;
                     window.__pendingNavUrl = null;
                  }
                  // 광고가 닫힌 후 슬롯 갱신 (다음 클릭을 위해)
                  if (rewardedSlot) {
                    googletag.pubads().refresh([rewardedSlot]);
                  }
                });

                googletag.pubads().enableSingleRequest();
                googletag.enableServices();
              });
            `,
          }}
        />
        <GoogleAdSense />
        {/* 구조화된 데이터 (Schema.org JSON-LD) - Organization & Ariticle */}
        <Script
          id="structured-data-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "퀴즈벨",
              alternateName: "QUIZBELLS",
              url: "https://quizbells.com",
              logo: "https://quizbells.com/icons/android-icon-192x192.png",
              sameAs: [
                "https://play.google.com/store/apps/details?id=com.mojoday.quizbells",
                "https://apps.apple.com/kr/app/%ED%80%B4%EC%A6%88%EB%B2%A8-%EC%95%B1%ED%85%8C%ED%81%AC-%ED%80%B4%EC%A6%88-%EC%A0%95%EB%8B%B5-%EC%95%8C%EB%A6%BC-%EC%84%9C%EB%B9%84%EC%8A%A4/id6748852703",
              ],
            }),
          }}
        />
        <Script
          strategy="beforeInteractive"
          id="structured-data-webapp"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              name: "퀴즈벨",
              alternateName: "QUIZBELLS",
              url: "https://quizbells.com",
              description:
                "매일 업데이트되는 앱테크 퀴즈 정답 모음. 신한쏠퀴즈, 캐시워크, 토스 행운퀴즈 등 인기 앱의 퀴즈 정답을 실시간으로 제공합니다.",
              applicationCategory: "UtilityApplication",
              operatingSystem: "Web, iOS, Android",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "KRW",
              },
              author: {
                "@type": "Organization",
                name: "QUIZBELLS",
                url: "https://quizbells.com",
              },
              provider: {
                "@type": "Organization",
                name: "QUIZBELLS",
                url: "https://quizbells.com",
              },
              potentialAction: {
                "@type": "SearchAction",
                target: "https://quizbells.com/quiz?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <NaverAnalyticsTracker />
        <GoogleAnalytics />
        <ForegroundNotification />
        <main className="min-h-[80vh] w-full">
          <Header />
          {children}
        </main>
        <Footer />
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
        <AlarmSetting />
      </body>
    </html>
  );
}
