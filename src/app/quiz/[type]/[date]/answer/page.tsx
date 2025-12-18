import { Metadata } from "next";
import { format, parseISO } from "date-fns";
import { getQuitItem } from "@/utils/utils";
import { getQuizbells } from "@/utils/api";
import { CheckCircle2, Calendar, ArrowLeft, Lightbulb } from "lucide-react";
import AppOpen from "@/components/AppOpen";
import CoupangPartnerAd from "@/components/CoupangPartnerAd";
import { Fragment } from "react";
import EventLink from "@/components/EventLink";

// 한국 시간(KST, UTC+9)으로 현재 날짜 가져오기
const getKoreaDate = (): Date => {
  const now = new Date();
  const koreaTimeString = now.toLocaleString("en-US", {
    timeZone: "Asia/Seoul",
  });
  return new Date(koreaTimeString);
};

type AnswerPageParams = {
  params: Promise<{
    type: string;
    date: string;
  }>;
};

export async function generateMetadata({
  params,
}: AnswerPageParams): Promise<Metadata> {
  const { type, date } = await params;
  const answerDate =
    date === "today" ? format(getKoreaDate(), "yyyy-MM-dd") : date;

  const item = getQuitItem(type);

  let dateLabel: string;
  try {
    if (answerDate && /^\d{4}-\d{2}-\d{2}$/.test(answerDate)) {
      const parsedDate = parseISO(answerDate);
      dateLabel = format(parsedDate, "yyyy년 MM월 dd일");
    } else {
      dateLabel = format(getKoreaDate(), "yyyy년 MM월 dd일");
    }
  } catch (error) {
    console.error("날짜 파싱 오류:", error);
    dateLabel = format(getKoreaDate(), "yyyy년 MM월 dd일");
  }

  const typeName = item?.typeKr || type;
  const typeTitle = item?.title || "";
  const fullTitle = `${typeName} ${typeTitle} 퀴즈 ${dateLabel} 정답 확인 | 퀴즈벨`;
  const description = `${typeName} ${typeTitle} 퀴즈 ${dateLabel} 기준 정답을 확인하고, 앱테크 리워드를 적립해 보세요.`;

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
      url: `https://quizbells.com/quiz/${type}/${answerDate}/answer`,
      siteName: "퀴즈벨",
      type: "website",
      locale: "ko_KR",
      images: [`https://quizbells.com/images/${type}.png`],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    alternates: {
      canonical: `https://quizbells.com/quiz/${type}/${answerDate}/answer`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function AnswerPage({ params }: AnswerPageParams) {
  const { type, date } = await params;
  const answerDate =
    date === "today" ? format(getKoreaDate(), "yyyy-MM-dd") : date;
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

  // 날짜 파싱 및 포맷팅 (안전하게 처리)
  let answerDateString: string;

  try {
    if (answerDate && /^\d{4}-\d{2}-\d{2}$/.test(answerDate)) {
      const parsedDate = parseISO(answerDate);
      answerDateString = format(parsedDate, "yyyy년 MM월 dd일");
    } else {
      const koreaDate = getKoreaDate();
      answerDateString = format(koreaDate, "yyyy년 MM월 dd일");
    }
  } catch (error) {
    console.error("날짜 파싱 오류:", error);
    const koreaDate = getKoreaDate();
    answerDateString = format(koreaDate, "yyyy년 MM월 dd일");
  }

  const h1Title = `${item.typeKr} ${item.title} ${answerDateString} 정답`;

  let quizItem;
  try {
    quizItem = await getQuizbells(type, answerDate);
  } catch (error) {
    console.error("퀴즈 데이터 조회 오류:", error);
    quizItem = null;
  }

  const contentMerges = quizItem?.contents ?? [];

  const prevAnswers: string[] = [];
  const contents: any[] = [];

  contentMerges.forEach((q: any) => {
    if (prevAnswers.includes(q.answer)) {
      return;
    }
    prevAnswers.push(q.answer);
    contents.push(q);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-indigo-950 dark:to-purple-950">
      <div className="max-w-xl mx-auto pt-6 pb-40 px-4">
        <section
          id="quiz-content"
          itemScope
          itemType="https://schema.org/WebPage"
        >
          {/* Back Button */}
          <a
            target="_self"
            href={`/quiz/${type}/${date === "today" ? "today" : answerDate}`}
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>퀴즈 목록으로 돌아가기</span>
          </a>

          {/* Header Section */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-sm font-medium mb-4">
              <Calendar className="w-4 h-4" />
              <span>{answerDateString}</span>
            </div>
            <h1
              className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6"
              itemProp="headline"
            >
              {h1Title}
            </h1>
          </div>

          <CoupangPartnerAd />

          {/* Empty State */}
          {contents.length === 0 && (
            <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-3xl p-10 text-center shadow-lg border border-white/50 dark:border-slate-800 mb-10">
              <p className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                등록된 퀴즈가 아직 없습니다.
              </p>
              <p className="text-base text-slate-600 dark:text-slate-400">
                곧 정답이 업데이트될 예정입니다.
              </p>
            </div>
          )}

          {/* Answer Cards */}
          <div className="space-y-6 mb-8">
            {contents.map((quiz: any, idx: number) => (
              <Fragment key={idx}>
                <article
                  key={idx}
                  className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/50 dark:border-slate-800"
                  itemScope
                  itemType="https://schema.org/Question"
                >
                  <h2
                    className="text-xl font-bold text-slate-900 dark:text-white mb-6"
                    itemProp="name"
                  >
                    {quiz.question}
                  </h2>

                  <div
                    className="rounded-xl border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50 px-5 py-4 shadow-sm"
                    itemProp="acceptedAnswer"
                    itemScope
                    itemType="https://schema.org/Answer"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                        정답
                      </span>
                    </div>
                    <span
                      itemProp="text"
                      className="text-3xl font-extrabold text-emerald-800 dark:text-emerald-300"
                    >
                      {quiz.answer}
                    </span>
                  </div>
                  {quiz.otherAnswers?.length > 0 && (
                    <div
                      className="rounded-xl border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/50 dark:to-yellow-950/50 px-5 py-4 shadow-sm mt-4"
                      itemProp="suggestedAnswer"
                      itemScope
                      itemType="https://schema.org/SuggestedAnswer"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
                          다른 정답
                        </span>
                      </div>
                      <div className="text-xl font-bold text-amber-800 dark:text-amber-300">
                        <span itemProp="text">
                          {quiz.otherAnswers.join(", ")}
                        </span>
                      </div>
                    </div>
                  )}
                </article>

                {/* 2개 나오고 그 다음에 쿠팡 파트너스 광고 */}
                {idx === 0 && <EventLink />}
                {idx > 0 && idx % 2 === 1 && <CoupangPartnerAd />}
              </Fragment>
            ))}
          </div>

          {/* App Open Button - 정답 아래에 배치 */}
          <div className="mb-8">
            <AppOpen type={type} />
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-4">
            이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의
            수수료를 제공받습니다.
          </div>
        </section>
      </div>
    </div>
  );
}
