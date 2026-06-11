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

// JSON-LD는 이 레이아웃에 두면 /quiz/[type]/[date] 등 모든 하위 경로에
// /quiz용 CollectionPage가 잘못 주입되므로, 페이지 레벨(quiz/page.tsx)에서만 선언한다.
export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
