import { Metadata } from "next";
import QuizComponent from "@/components/QuizComponent";

export const metadata: Metadata = {
  title: "오늘의 퀴즈 정답 - 앱테크 퀴즈 모음 | 퀴즈벨",
  description:
    "캐시워크, 토스, 신한쏠, 카카오뱅크 등 오늘의 앱테크 퀴즈 정답을 실시간으로 확인하세요. 매일 업데이트되는 퀴즈 정답으로 포인트를 적립하세요.",
  keywords: [
    "오늘의 퀴즈 정답",
    "앱테크 퀴즈",
    "캐시워크 정답",
    "토스 퀴즈 정답",
    "신한쏠 퀴즈",
    "카카오뱅크 퀴즈",
    "퀴즈벨",
    "포인트 적립",
  ],
  openGraph: {
    title: "오늘의 퀴즈 정답 - 앱테크 퀴즈 모음 | 퀴즈벨",
    description:
      "캐시워크, 토스, 신한쏠, 카카오뱅크 등 오늘의 앱테크 퀴즈 정답을 실시간으로 확인하세요.",
    url: "https://quizbells.com/quiz",
    siteName: "퀴즈벨",
    type: "website",
    locale: "ko_KR",
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
    title: "오늘의 퀴즈 정답 - 앱테크 퀴즈 모음 | 퀴즈벨",
    description:
      "캐시워크, 토스, 신한쏠, 카카오뱅크 등 오늘의 앱테크 퀴즈 정답을 실시간으로 확인하세요.",
    images: ["https://quizbells.com/icons/og-image.png"],
  },
  alternates: {
    canonical: "https://quizbells.com/quiz",
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

export default function QuizPage() {
  return <QuizComponent />;
}
