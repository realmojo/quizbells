import { Metadata } from "next";
import QuizComponent from "@/components/QuizComponent";

export const metadata: Metadata = {
  title: "퀴즈벨 - 오늘의 앱테크 퀴즈 정답 모음",
  description:
    "신한쏠퀴즈, 캐시워크, 토스 행운퀴즈 등 인기 앱테크 퀴즈 정답을 매일 실시간 업데이트. 퀴즈벨에서 확인하고 포인트 적립하세요.",
  alternates: {
    canonical: "https://quizbells.com",
  },
  openGraph: {
    title: "퀴즈벨 - 오늘의 앱테크 퀴즈 정답 모음",
    description:
      "신한쏠퀴즈, 캐시워크, 토스 행운퀴즈 등 인기 앱테크 앱의 퀴즈 정답을 실시간으로 확인하세요. 알림으로 매일 포인트 적립!",
    url: "https://quizbells.com",
    type: "website",
  },
};

export default function Page() {
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "홈",
        item: "https://quizbells.com",
      },
    ],
  };

  return (
    <>
      <script
        id="structured-data-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />

      <QuizComponent />
    </>
  );
}
