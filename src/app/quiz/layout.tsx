import { Metadata } from "next";

export const metadata: Metadata = {
  title: "퀴즈벨 - 오늘의 퀴즈 정답 모음 | QUIZBELLS",
  description:
    "퀴즈벨(QUIZBELLS)에서 오늘의 퀴즈 정답을 확인하세요. 캐시워크, 신한쏠퀴즈, 토스행운퀴즈, 캐시닥, 오케이케시백 등 다양한 앱테크 퀴즈 정답을 한눈에 모아보고, 실시간 알림으로 빠르게 받아보세요. 앱테크의 필수 도구 퀴즈벨!",
  keywords: [
    "퀴즈벨",
    "QUIZBELLS",
    "퀴즈 정답",
    "오늘의 퀴즈",
    "퀴즈 모음",
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
    "토스 두근두근 1등찍기 행운퀴즈",
    "퀴즈 정답 알림",
  ],
  openGraph: {
    title: "퀴즈벨 - 오늘의 퀴즈 정답 모음 | QUIZBELLS",
    description:
      "퀴즈벨(QUIZBELLS)에서 오늘의 퀴즈 정답을 확인하세요. 캐시워크, 신한쏠퀴즈, 토스행운퀴즈, 캐시닥, 오케이케시백 등 다양한 앱테크 퀴즈 정답을 한눈에 모아보고, 실시간 알림으로 빠르게 받아보세요.",
    url: "https://quizbells.com/quiz",
    siteName: "퀴즈벨",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "https://quizbells.com/icons/og-image.png",
        width: 1200,
        height: 630,
        alt: "퀴즈벨 - 오늘의 퀴즈 정답 모음",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "퀴즈벨 - 오늘의 퀴즈 정답 모음 | QUIZBELLS",
    description:
      "퀴즈벨(QUIZBELLS)에서 오늘의 퀴즈 정답을 확인하세요. 다양한 앱테크 퀴즈 정답을 한눈에 모아보고, 실시간 알림으로 빠르게 받아보세요.",
    site: "@quizbells_official",
    creator: "@quizbells_official",
    images: ["https://quizbells.com/icons/og-image.png"],
  },
  alternates: {
    canonical: "https://quizbells.com/quiz",
  },
  metadataBase: new URL("https://quizbells.com"),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": "https://quizbells.com/quiz",
      name: "퀴즈벨 - 오늘의 퀴즈 정답 모음",
      description:
        "퀴즈벨(QUIZBELLS)은 캐시워크, 신한쏠퀴즈, 토스행운퀴즈, 캐시닥, 오케이케시백 등 다양한 앱테크 퀴즈 정답을 실시간으로 알려주는 퀴즈 알림 서비스입니다.",
      url: "https://quizbells.com/quiz",
      inLanguage: "ko",
      isPartOf: {
        "@type": "WebSite",
        "@id": "https://quizbells.com/#website",
        name: "퀴즈벨",
        url: "https://quizbells.com",
      },
      publisher: {
        "@type": "Organization",
        "@id": "https://quizbells.com/#organization",
        name: "퀴즈벨",
        alternateName: "QUIZBELLS",
        url: "https://quizbells.com",
        logo: {
          "@type": "ImageObject",
          url: "https://quizbells.com/icons/android-icon-192x192.png",
          width: 192,
          height: 192,
        },
      },
      mainEntity: {
        "@type": "ItemList",
        name: "앱테크 퀴즈 정답 모음",
        description: "오늘의 다양한 앱테크 퀴즈 정답을 한눈에 확인",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "캐시워크 퀴즈", url: "https://quizbells.com/quiz/cashwalk/today" },
          { "@type": "ListItem", position: 2, name: "토스 퀴즈", url: "https://quizbells.com/quiz/toss/today" },
          { "@type": "ListItem", position: 3, name: "신한쏠 퀴즈", url: "https://quizbells.com/quiz/shinhan/today" },
          { "@type": "ListItem", position: 4, name: "카카오뱅크 퀴즈", url: "https://quizbells.com/quiz/kakaobank/today" },
        ],
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "홈", item: "https://quizbells.com" },
        { "@type": "ListItem", position: 2, name: "퀴즈 정답", item: "https://quizbells.com/quiz" },
      ],
    },
  ],
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        id="quiz-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      {children}
    </>
  );
}
