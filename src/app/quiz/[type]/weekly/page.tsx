import { Metadata } from "next";
import { format, subDays, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { getQuitItem } from "@/utils/utils";
import Adsense from "@/components/Adsense";
import SocialShare from "@/components/SocialShare";
import { getWeeklyQuizbells } from "@/utils/api";
import { CalendarDays, TrendingUp, Sparkles, CheckCircle2 } from "lucide-react";
import PWAInstallButton from "@/components/PWAInstallButton";
import VisitTracker from "@/components/VisitTracker";
import Link from "next/link";

export const runtime = "edge";

// 한국 시간 기준 날짜 가져오기
const getKoreaDate = (): Date => {
  const now = new Date();
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const koreaTime = new Date(utcTime + 9 * 60 * 60 * 1000);
  return koreaTime;
};

type WeeklyPageParams = {
  params: Promise<{
    type: string;
  }>;
};

export async function generateMetadata({
  params,
}: WeeklyPageParams): Promise<Metadata> {
  const { type } = await params;
  const item = getQuitItem(type);
  const typeName = item?.typeKr || type;
  const typeTitle = item?.title || "";

  const today = getKoreaDate();
  const weekStart = format(subDays(today, 6), "M월 d일", { locale: ko });
  const weekEnd = format(today, "M월 d일", { locale: ko });

  const fullTitle = `${typeName} ${typeTitle} 이번 주 정답 총정리 (${weekStart}~${weekEnd}) | 퀴즈벨`;
  const description = `${typeName} ${typeTitle} 이번 주 ${weekStart}부터 ${weekEnd}까지 전체 퀴즈 정답을 한눈에 확인하세요. 7일간의 모든 퀴즈 정답을 실시간으로 업데이트합니다.`;

  return {
    title: fullTitle,
    description,
    applicationName: "퀴즈벨",
    keywords: [
      `${typeName} 주간 정답`,
      `${typeName} 이번주`,
      `${typeName} 정답 모음`,
      "주간 퀴즈 정답",
      "앱테크 정답",
      typeName,
      typeTitle,
      "퀴즈 총정리",
    ],
    openGraph: {
      title: fullTitle,
      description,
      url: `https://quizbells.com/quiz/${type}/weekly`,
      siteName: "퀴즈벨",
      type: "article",
      locale: "ko_KR",
      images: [`https://quizbells.com/icons/og-image.png`],
      authors: ["퀴즈벨"],
      section: "앱테크/재테크",
      tags: [typeName, "앱테크", "주간정답"],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [`https://quizbells.com/icons/og-image.png`],
    },
    alternates: {
      canonical: `https://quizbells.com/quiz/${type}/weekly`,
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
}

export default async function WeeklyQuizPage({ params }: WeeklyPageParams) {
  const { type } = await params;
  const item = getQuitItem(type);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">퀴즈를 찾을 수 없습니다</h1>
          <p className="text-gray-600">
            요청하신 퀴즈 타입({type})이 존재하지 않습니다.
          </p>
        </div>
      </div>
    );
  }

  const today = getKoreaDate();
  const weekStart = format(subDays(today, 6), "M월 d일", { locale: ko });
  const weekEnd = format(today, "M월 d일", { locale: ko });

  // 최근 7일간 퀴즈 데이터 조회 (API 한 번 호출)
  const weeklyData = await getWeeklyQuizbells(type);

  // 중복 정답 제거 함수 (질문이 가장 긴 것만 남김)
  const removeDuplicateAnswers = (quizzes: any[]) => {
    const answerMap = new Map<string, any>();

    quizzes.forEach((quiz) => {
      const answer = quiz.answer?.trim();
      if (!answer) return;

      const existing = answerMap.get(answer);
      const questionLength = (quiz.question || "").length;

      // 같은 정답이 없거나, 현재 질문이 더 길면 교체
      if (
        !existing ||
        questionLength > (existing.question || "").length
      ) {
        answerMap.set(answer, quiz);
      }
    });

    return Array.from(answerMap.values());
  };

  const weeklyQuizzes: Array<{
    date: string;
    dateLabel: string;
    contents: any[];
  }> = weeklyData?.data
    ? weeklyData.data.map((item: any) => ({
        date: item.answerDate,
        dateLabel: format(parseISO(item.answerDate), "M월 d일 (E)", {
          locale: ko,
        }),
        contents: removeDuplicateAnswers(item.contents || []),
      }))
    : [];

  const h1Title = `${item.typeKr} ${item.title} 이번 주 정답 총정리`;

  return (
    <>
      <VisitTracker type={type} answerDate="weekly" />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* 헤더 섹션 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <CalendarDays className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">
                  {weekStart} ~ {weekEnd}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {h1Title}
                </h1>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed">
              {item.typeKr} {item.title} 이번 주 전체 퀴즈 정답을 한눈에
              확인하세요. 매일 업데이트되는 정답을 실시간으로 제공합니다.
            </p>

            {/* 통계 정보 */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-blue-700 font-medium">
                    주간 퀴즈 수
                  </span>
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  {weeklyQuizzes.reduce(
                    (sum, day) => sum + day.contents.length,
                    0,
                  )}
                  개
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-purple-700 font-medium">
                    업데이트 일수
                  </span>
                </div>
                <div className="text-2xl font-bold text-purple-900">
                  {weeklyQuizzes.length}일
                </div>
              </div>
            </div>
          </div>

          {/* 광고 */}
          <div className="mb-8">
            <Adsense slotId={item.slotId} />
          </div>

          {/* 일자별 퀴즈 정답 */}
          <div className="space-y-6">
            {weeklyQuizzes.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <p className="text-gray-500">
                  이번 주 퀴즈 정답이 아직 등록되지 않았습니다.
                </p>
              </div>
            ) : (
              weeklyQuizzes.map((dayQuiz, dayIndex) => (
                <div
                  key={dayQuiz.date}
                  className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                      {dayQuiz.dateLabel}
                    </h2>
                    <Link
                      href={`/quiz/${type}/${dayQuiz.date}`}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      자세히 보기 →
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {dayQuiz.contents.map((quiz: any, quizIndex: number) => (
                      <div
                        key={`${dayIndex}-${quizIndex}`}
                        className="bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-medium">
                                Q{quizIndex + 1}
                              </span>
                              {quiz.type && (
                                <span className="text-xs text-gray-500">
                                  {quiz.type}
                                </span>
                              )}
                            </div>
                            <h3 className="text-base font-semibold text-gray-900 mb-3">
                              {quiz.question || "퀴즈"}
                            </h3>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                              <div>
                                <div className="text-sm text-gray-600 mb-1">
                                  정답
                                </div>
                                <div className="text-lg font-bold text-emerald-700">
                                  {quiz.answer}
                                </div>
                              </div>
                            </div>
                            {quiz.otherAnswers &&
                              quiz.otherAnswers.length > 0 && (
                                <div className="mt-3 text-sm text-gray-600">
                                  <span className="font-medium">
                                    다른 정답:{" "}
                                  </span>
                                  {quiz.otherAnswers.join(", ")}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 광고 */}
          <div className="my-8">
            <Adsense slotId={item.slotId} />
          </div>

          {/* 네비게이션 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
            <h3 className="text-lg font-bold mb-4">다른 기간 보기</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href={`/quiz/${type}/today`}
                className="p-4 border-2 border-blue-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all"
              >
                <div className="font-semibold text-blue-900">오늘의 정답</div>
                <div className="text-sm text-gray-600">
                  {format(today, "M월 d일")} 퀴즈
                </div>
              </Link>
              <Link
                href={`/quiz/${type}/monthly`}
                className="p-4 border-2 border-purple-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all"
              >
                <div className="font-semibold text-purple-900">월간 정답</div>
                <div className="text-sm text-gray-600">이번 달 전체 퀴즈</div>
              </Link>
              <Link
                href="/quiz"
                className="p-4 border-2 border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                <div className="font-semibold text-gray-900">전체 퀴즈</div>
                <div className="text-sm text-gray-600">모든 앱 보기</div>
              </Link>
            </div>
          </div>

          {/* 소셜 공유 */}
          <div className="mt-8">
            <SocialShare
              url={`https://quizbells.com/quiz/${type}/weekly`}
              title={h1Title}
            />
          </div>

          {/* PWA 설치 버튼 */}
          <div className="mt-8">
            <PWAInstallButton />
          </div>
        </div>
      </div>
    </>
  );
}
