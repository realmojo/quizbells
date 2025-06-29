import QuizModalPage from "@/app/@modal/(.)quiz/[type]/page";
import { getQuitItem } from "@/utils/utils";
import { Metadata } from "next";

type QuizPageParams = {
  params: Promise<{
    type: string;
  }>;
  searchParams: Promise<{
    answerDate?: string;
  }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: QuizPageParams): Promise<Metadata> {
  // params와 searchParams를 await로 해결
  const { type } = await params;
  const resolvedSearchParams = await searchParams;
  const answerDate =
    resolvedSearchParams.answerDate || new Date().toISOString().split("T")[0];

  const item = getQuitItem(type);
  const typeName = item?.typeKr || type;
  const typeTitle = item?.title || "";
  const dateLabel = answerDate.replace(/-/g, "년 ").replace(/-/, "월 ") + "일";
  const fullTitle = `${typeName} ${typeTitle} ${dateLabel} 퀴즈 정답 확인하고 앱테크 포인트 받으세요`;
  const description = `${dateLabel} 기준 ${typeName} 퀴즈 정답을 한눈에 확인하고, 앱테크 리워드를 적립해 보세요. 다양한 퀴즈 이벤트가 매일 업데이트됩니다.`;

  return {
    title: fullTitle,
    description,
    applicationName: "퀴즈벨",
    keywords: [
      "퀴즈 정답",
      "앱테크",
      "포인트 적립",
      "퀴즈벨",
      typeName,
      typeTitle,
      "퀴즈 이벤트",
      "오늘의 퀴즈",
    ],
    openGraph: {
      title: fullTitle,
      description,
      url: `https://quizbell.com/quiz/${type}?answerDate=${answerDate}`,
      siteName: "퀴즈벨",
      type: "website",
      locale: "ko_KR",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    alternates: {
      canonical: `https://quizbell.com/quiz/${type}?answerDate=${answerDate}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function QuizPage({ params }: QuizPageParams) {
  return <QuizModalPage params={params} />;
}
