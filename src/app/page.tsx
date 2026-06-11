import { Metadata } from "next";
import QuizComponent from "@/components/QuizComponent";
import { quizItems } from "@/utils/utils";
import { SITE_URL, websiteRef } from "@/lib/jsonld";

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
  // 홈을 "오늘의 퀴즈 정답 모음" CollectionPage로 선언하고,
  // 지원하는 모든 퀴즈의 today 페이지를 ItemList로 노출한다.
  // AI 검색엔진(GEO)이 사이트의 핵심 엔티티 구조를 한 번에 파악할 수 있다.
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: "퀴즈벨 - 오늘의 앱테크 퀴즈 정답 모음",
        description:
          "신한쏠퀴즈, 캐시워크, 토스 행운퀴즈 등 인기 앱테크 퀴즈 정답을 매일 실시간 업데이트.",
        inLanguage: "ko",
        isPartOf: websiteRef,
        about: {
          "@type": "Thing",
          name: "앱테크 퀴즈 정답",
          description:
            "포인트 적립형 앱(앱테크)에서 매일 출제되는 퀴즈의 정답 정보",
        },
        mainEntity: { "@id": `${SITE_URL}/#quiz-list` },
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/#quiz-list`,
        name: "오늘의 앱테크 퀴즈 정답 목록",
        description: `퀴즈벨이 매일 실시간으로 업데이트하는 ${quizItems.length}개 앱테크 퀴즈 정답 모음`,
        numberOfItems: quizItems.length,
        itemListElement: quizItems.map((q, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `${q.typeKr} ${q.title} 오늘 정답`,
          url: `${SITE_URL}/quiz/${q.type}/today`,
        })),
      },
    ],
  };

  return (
    <>
      <script
        id="structured-data-home"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <QuizComponent />
    </>
  );
}
