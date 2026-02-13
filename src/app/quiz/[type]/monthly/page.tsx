import { Metadata } from "next";
import { format, startOfMonth, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { getQuitItem } from "@/utils/utils";
import Adsense from "@/components/Adsense";
import SocialShare from "@/components/SocialShare";
import { getMonthlyQuizbells } from "@/utils/api";
import { Calendar, TrendingUp, Award, Sparkles, CheckCircle2 } from "lucide-react";
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

type MonthlyPageParams = {
  params: Promise<{
    type: string;
  }>;
};

export async function generateMetadata({
  params,
}: MonthlyPageParams): Promise<Metadata> {
  const { type } = await params;
  const item = getQuitItem(type);
  const typeName = item?.typeKr || type;
  const typeTitle = item?.title || "";

  const today = getKoreaDate();
  const monthLabel = format(today, "M월", { locale: ko });
  const yearMonth = format(today, "yyyy년 M월", { locale: ko });

  const fullTitle = `${typeName} ${typeTitle} ${monthLabel} 정답 총정리 (이번 달 전체) | 퀴즈벨`;
  const description = `${typeName} ${typeTitle} ${yearMonth} 전체 퀴즈 정답을 한눈에 확인하세요. 이번 달 모든 퀴즈 정답을 날짜별로 정리했습니다. 앱테크 포인트 적립에 활용하세요.`;

  return {
    title: fullTitle,
    description,
    applicationName: "퀴즈벨",
    keywords: [
      `${typeName} 월간 정답`,
      `${typeName} ${monthLabel}`,
      `${typeName} 정답 모음`,
      "월간 퀴즈 정답",
      "앱테크 정답",
      typeName,
      typeTitle,
      "퀴즈 총정리",
      "이번 달 정답",
    ],
    openGraph: {
      title: fullTitle,
      description,
      url: `https://quizbells.com/quiz/${type}/monthly`,
      siteName: "퀴즈벨",
      type: "article",
      locale: "ko_KR",
      images: [`https://quizbells.com/icons/og-image.png`],
      authors: ["퀴즈벨"],
      section: "앱테크/재테크",
      tags: [typeName, "앱테크", "월간정답"],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [`https://quizbells.com/icons/og-image.png`],
    },
    alternates: {
      canonical: `https://quizbells.com/quiz/${type}/monthly`,
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

export default async function MonthlyQuizPage({ params }: MonthlyPageParams) {
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
  const monthStart = startOfMonth(today);
  const monthLabel = format(today, "M월", { locale: ko });
  const yearMonth = format(today, "yyyy년 M월", { locale: ko });

  // 이번 달 1일부터 오늘까지의 퀴즈 데이터 조회 (API 한 번 호출)
  const monthlyData = await getMonthlyQuizbells(type);

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

  const monthlyQuizzes: Array<{
    date: string;
    dateLabel: string;
    contents: any[];
  }> = monthlyData?.data
    ? monthlyData.data.map((item: any) => ({
        date: item.answerDate,
        dateLabel: format(parseISO(item.answerDate), "M월 d일 (E)", {
          locale: ko,
        }),
        contents: removeDuplicateAnswers(item.contents || []),
      }))
    : [];

  const h1Title = `${item.typeKr} ${item.title} ${monthLabel} 정답 총정리`;

  const totalQuizCount = monthlyQuizzes.reduce(
    (sum, day) => sum + day.contents.length,
    0,
  );

  return (
    <>
      <VisitTracker type={type} answerDate="monthly" />
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* 헤더 섹션 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">{yearMonth}</div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {h1Title}
                </h1>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed">
              {item.typeKr} {item.title} {yearMonth} 전체 퀴즈 정답을 한눈에
              확인하세요. 이번 달 모든 날짜의 정답을 실시간으로 업데이트합니다.
            </p>

            {/* 통계 정보 */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <span className="text-xs text-purple-700 font-medium">
                    총 퀴즈
                  </span>
                </div>
                <div className="text-2xl font-bold text-purple-900">
                  {totalQuizCount}개
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <span className="text-xs text-blue-700 font-medium">
                    업데이트일
                  </span>
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  {monthlyQuizzes.length}일
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  <span className="text-xs text-amber-700 font-medium">
                    평균/일
                  </span>
                </div>
                <div className="text-2xl font-bold text-amber-900">
                  {monthlyQuizzes.length > 0
                    ? Math.round(totalQuizCount / monthlyQuizzes.length)
                    : 0}
                  개
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
            {monthlyQuizzes.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <p className="text-gray-500">
                  이번 달 퀴즈 정답이 아직 등록되지 않았습니다.
                </p>
              </div>
            ) : (
              monthlyQuizzes.map((dayQuiz, dayIndex) => (
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
                      className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                    >
                      자세히 보기 →
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {dayQuiz.contents.map((quiz: any, quizIndex: number) => (
                      <div
                        key={`${dayIndex}-${quizIndex}`}
                        className="bg-gradient-to-r from-purple-50 to-white border border-purple-200 rounded-xl p-5 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-md bg-purple-100 text-purple-700 text-xs font-medium">
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
                href={`/quiz/${type}/weekly`}
                className="p-4 border-2 border-green-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all"
              >
                <div className="font-semibold text-green-900">주간 정답</div>
                <div className="text-sm text-gray-600">이번 주 전체 퀴즈</div>
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
              url={`https://quizbells.com/quiz/${type}/monthly`}
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
