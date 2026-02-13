import { tips } from "./tipsData";
import { Metadata } from "next";
import Script from "next/script";
import {
  Lightbulb,
  TrendingUp,
  Calendar,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "앱테크 고수되기 - 앱으로 돈버는 꿀팁 총정리 | 적금 금리 비교, 대출, 보험, 투자",
  description:
    "앱테크 고수가 되는 방법과 금융 꿀팁을 소개합니다. 적금 금리 비교, 신용점수 관리, 주택담보대출, 자동차보험 비교, ETF 투자, 연말정산 소득공제 등 돈이 되는 금융 정보 총정리!",
  keywords: [
    "앱테크",
    "적금 금리 비교",
    "적금 추천",
    "신용점수 올리는 법",
    "주택담보대출 금리",
    "전세자금대출",
    "자동차보험 비교",
    "다이렉트 보험",
    "ETF 투자",
    "연말정산 소득공제",
    "카드 포인트 현금화",
    "파킹통장 금리",
    "CMA 통장",
    "재테크",
    "금융 꿀팁",
  ],
  openGraph: {
    title: "앱테크 고수되기 - 적금·대출·보험·투자 꿀팁 총정리",
    description:
      "앱테크 수익 극대화 방법부터 적금 금리 비교, 대출 금리 절약, 보험료 절감, ETF 투자 입문까지. 돈이 되는 금융 정보를 한곳에서 확인하세요.",
    type: "article",
    url: "https://quizbells.com/tips",
    siteName: "퀴즈벨",
    locale: "ko_KR",
    images: [
      {
        url: "https://quizbells.com/icons/og-image.png",
        width: 1200,
        height: 630,
        alt: "앱테크 고수되기 - 퀴즈벨 꿀팁 총정리",
      },
    ],
  },
  alternates: {
    canonical: "https://quizbells.com/tips",
  },
  twitter: {
    card: "summary_large_image",
    title: "앱테크 고수되기 - 적금·대출·보험·투자 꿀팁 총정리 | 퀴즈벨",
    description:
      "앱테크 수익 극대화 방법부터 적금 금리 비교, 대출 금리 절약, 보험료 절감까지. 돈이 되는 금융 정보를 확인하세요.",
    images: ["https://quizbells.com/icons/og-image.png"],
  },
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
};

export default function AppTechTipsPage() {
  return (
    <>
      <Script
        id="structured-data-tips"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "앱테크 고수가 되는 법 - 퀴즈벨 팁 모음",
            description:
              "앱테크 초보도 고수처럼 수익을 얻을 수 있는 실전 노하우 제공. 앱으로 돈버는 법, 퀴즈 적립 팁, 광고 시청 리워드 팁 정리.",
            image: {
              "@type": "ImageObject",
              url: "https://quizbells.com/icons/og-image.png",
              width: 1200,
              height: 630,
            },
            inLanguage: "ko",
            author: {
              "@type": "Organization",
              name: "퀴즈벨",
              url: "https://quizbells.com",
            },
            publisher: {
              "@type": "Organization",
              name: "Quizbells",
              logo: {
                "@type": "ImageObject",
                url: "https://quizbells.com/icons/android-icon-192x192.png",
              },
            },
            mainEntityOfPage: "https://quizbells.com/tips",
            datePublished: "2025-06-30",
          }),
        }}
      />

      <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-950 dark:via-orange-950 dark:to-amber-950">
        <main className="mx-auto max-w-3xl px-4 py-12">
          {/* Header Section */}
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300 text-sm font-medium mb-2">
              <TrendingUp className="w-4 h-4" />
              <span>실전 노하우 공개</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-br from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400">
              앱테크 고수가 되는 법
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              퀴즈벨이 알려주는 실전 팁으로 수익을 극대화하세요.
              <br className="hidden md:block" />각 항목을 클릭하면 상세한
              노하우와 전략을 확인할 수 있습니다.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {[
              { icon: Lightbulb, label: "실전 팁", value: `${tips.length}개` },
              { icon: TrendingUp, label: "평균 수익", value: "월 10만원" },
              { icon: Sparkles, label: "성공률", value: "70% 이상" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/50 dark:border-slate-800 text-center"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-amber-600 dark:text-amber-400" />
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Tips List */}
          <div className="space-y-4">
            {tips.map((tip: any, index: number) => (
              <a
                key={tip.id}
                href={`/tips/${tip.id}`}
                target="_self"
                className="block group"
              >
                <article className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/50 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  {/* Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-linear-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-300 text-xs font-bold">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>TIP #{index + 1}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{tip.date}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors flex items-start gap-2">
                    <span className="flex-1">{tip.title}</span>
                    <ArrowRight className="w-5 h-5 mt-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                  </h2>

                  {/* Description */}
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {tip.description}
                  </p>

                  {/* Read More */}
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400 group-hover:gap-3 transition-all duration-300">
                    <span>자세히 보기</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </article>
              </a>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-12 bg-linear-to-br from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 rounded-3xl p-8 md:p-10 text-center shadow-lg">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
              지금 바로 시작하세요!
            </h3>
            <p className="text-amber-50 text-base mb-6 max-w-xl mx-auto">
              위의 팁들을 활용하면 누구나 앱테크 고수가 될 수 있습니다. 오늘부터
              실천해보세요!
            </p>
            <a
              href="/"
              target="_self"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-amber-600 font-bold rounded-xl hover:bg-amber-50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span>퀴즈 정답 보러가기</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </main>
      </div>
    </>
  );
}
