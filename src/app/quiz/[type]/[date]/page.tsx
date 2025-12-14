import { Metadata } from "next";
import Script from "next/script";
import ImageComponents from "@/components/ImageComponets";
import { format, parseISO } from "date-fns";
import { getQuitItem, isIOS } from "@/utils/utils";
import Adsense from "@/components/Adsense";
import SocialShare from "@/components/SocialShare";
import DescriptionComponent from "@/components/DescriptionComponent";
import QuizCardComponent from "@/components/QuizCardComponent";
import { Button } from "@/components/ui/button";
import { getQuizbells } from "@/utils/api";
import { CheckCircle2, Lightbulb, Calendar } from "lucide-react";
import moment from "moment";

// 한국 시간(KST, UTC+9)으로 현재 날짜 가져오기
const getKoreaDate = (): Date => {
  const now = new Date();
  // 한국 시간대(Asia/Seoul)의 현재 시간을 가져옴
  const koreaTimeString = now.toLocaleString("en-US", {
    timeZone: "Asia/Seoul",
  });
  return new Date(koreaTimeString);
};

type QuizPageParams = {
  params: Promise<{
    type: string;
    date: string;
  }>;
};

export async function generateMetadata({
  params,
}: QuizPageParams): Promise<Metadata> {
  // params와 searchParams를 await로 해결
  const { type, date } = await params;
  // const resolvedSearchParams = await searchParams;
  const answerDate =
    date === "today"
      ? format(getKoreaDate(), "yyyy-MM-dd")
      : date || format(getKoreaDate(), "yyyy-MM-dd");

  const item = getQuitItem(type);

  // 날짜 포맷팅 (안전하게 처리)
  let dateLabel: string;
  try {
    if (answerDate && /^\d{4}-\d{2}-\d{2}$/.test(answerDate)) {
      const parsedDate = parseISO(answerDate);
      dateLabel = format(parsedDate, "yyyy년 MM월 dd일");
    } else {
      dateLabel = format(getKoreaDate(), "yyyy년 MM월 dd일");
    }
  } catch (e) {
    console.error("날짜 파싱 오류:", e);
    dateLabel = format(getKoreaDate(), "yyyy년 MM월 dd일");
  }

  const typeName = item?.typeKr || type;
  const typeTitle = item?.title || "";
  const fullTitle = `${typeName} ${typeTitle} 정답 ${dateLabel} | 퀴즈벨`;
  const description = `${dateLabel} 기준 ${typeName} 퀴즈 정답을 한 눈에 확인하고, 앱테크 리워드를 적립해 보세요. 다양한 퀴즈 이벤트가 매일 업데이트됩니다.`;

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
      url: `https://quizbells.com/quiz/${type}/${answerDate}`,
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
      canonical: `https://quizbells.com/quiz/${type}/${answerDate}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function QuizPage({ params }: QuizPageParams) {
  const { type, date } = await params;
  const answerDate =
    date === "today" ? format(getKoreaDate(), "yyyy-MM-dd") : date;
  const item = getQuitItem(type);

  // 날짜 파싱 및 포맷팅 (안전하게 처리)
  let answerDateString: string;
  let dateLabel: string;

  try {
    if (answerDate && /^\d{4}-\d{2}-\d{2}$/.test(answerDate)) {
      const parsedDate = parseISO(answerDate);
      answerDateString = format(parsedDate, "yyyy년 MM월 dd일");
      dateLabel = format(parsedDate, "yyyy년 MM월 dd일");
    } else {
      const koreaDate = getKoreaDate();
      answerDateString = format(koreaDate, "yyyy년 MM월 dd일");
      dateLabel = format(koreaDate, "yyyy년 MM월 dd일");
    }
  } catch (error) {
    console.error("날짜 파싱 오류:", error);
    const koreaDate = getKoreaDate();
    answerDateString = format(koreaDate, "yyyy년 MM월 dd일");
    dateLabel = format(koreaDate, "yyyy년 MM월 dd일");
  }

  // item이 없으면 404 처리
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

  const h1Title = `${item.typeKr} ${item.title} ${answerDateString} 정답`;
  const firstDescription = `앱테크는 광고 시청이나 퀴즈 참여를 통해 포인트를 적립하는 방식으로 많은 사용자들의 관심을 받고 있습니다. ${answerDateString} 기준, ${item.typeKr} ${item.title} 등 다양한 앱에서 퀴즈 이벤트가 활발히 진행되고 있으며, 정답을 맞히면 현금처럼 사용 가능한 리워드를 받을 수 있어 앱 사용자들 사이에서 큰 호응을 얻고 있습니다.`;

  let quizItem = null;
  let lastDayQuizItem = null;
  try {
    quizItem = await getQuizbells(type, answerDate);
    lastDayQuizItem = await getQuizbells(
      type,
      moment(answerDate).subtract(1, "day").format("YYYY-MM-DD")
    );
  } catch (error) {
    console.error("퀴즈 데이터 조회 오류:", error);
    quizItem = null;
  }

  const contents = quizItem?.contents ?? [];

  contents.push(...(lastDayQuizItem?.contents ?? []));

  const jsonLd = contents.map((quiz: any) => ({
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: quiz.question || "질문 없음",
      text: quiz.question || "질문 없음",
      answerCount: 1 + (quiz.otherAnswers?.length || 0),
      acceptedAnswer: {
        "@type": "Answer",
        text: quiz.answer,
        upvoteCount: 100, // 정답 신뢰도 (선택)
        dateCreated: answerDate,
      },
      ...(quiz.otherAnswers?.length > 0 && {
        suggestedAnswer: quiz.otherAnswers.map((alt: any) => ({
          "@type": "Answer",
          text: alt,
          upvoteCount: 10,
          dateCreated: answerDate,
        })),
      }),
    },
  }));

  return (
    <>
      {jsonLd.map((data: any, index: number) => (
        <Script
          id={`jsonld-${type}-${answerDate}`}
          key={`jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-indigo-950 dark:to-purple-950">
        <div className="max-w-xl mx-auto pt-6 pb-40 px-4">
          <section
            id="quiz-content"
            itemScope
            itemType="https://schema.org/WebPage"
          >
            {/* Header Section */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-sm font-medium mb-4">
                <Calendar className="w-4 h-4" />
                <span>{answerDateString}</span>
              </div>
              <h1
                className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-indigo-600 dark:from-white dark:to-indigo-400 mb-4 leading-tight"
                itemProp="headline"
              >
                {h1Title}
              </h1>
            </div>

            {/* Image Section */}
            <div className="mb-6 rounded-2xl overflow-hidden shadow-lg ring-1 ring-slate-900/5 dark:ring-white/10">
              <ImageComponents
                answerDate={answerDateString?.toString() || ""}
                type={type}
                width={600}
                height={600}
              />
            </div>
            <div className="text-sm text-center mb-8 text-slate-500 dark:text-slate-400 font-medium">
              {`${answerDateString} ${item.typeKr} ${item.title} 퀴즈 정답`}
            </div>

            {/* Description */}
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 mb-8 shadow-sm border border-white/50 dark:border-slate-800">
              <p
                className="text-slate-700 dark:text-slate-300 text-base leading-relaxed"
                itemProp="description"
              >
                {firstDescription}
              </p>
            </div>

            <Adsense slotId={item.slotId || "8409513997"} />

            {/* Empty State */}
            {contents.length === 0 && (
              <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-3xl p-10 text-center shadow-lg border border-white/50 dark:border-slate-800 mb-10">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
                  <Lightbulb className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                </div>
                <p className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">
                  {answerDateString}
                  <br />
                  등록된 퀴즈가 아직 없습니다.
                </p>
                <p className="text-base mb-4 text-slate-600 dark:text-slate-400">
                  곧 정답이 업데이트될 예정입니다. 잠시 후 다시 확인해 주세요.
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mb-6">
                  새로운 정답이 올라오면 알려드릴게요! 즐겨찾기 해두시면
                  편리해요 😊
                </p>

                <a
                  href={
                    isIOS()
                      ? "https://apps.apple.com/kr/app/%ED%80%B4%EC%A6%88%EB%B2%A8-%EC%95%B1%ED%85%8C%ED%81%AC-%ED%80%B4%EC%A6%88-%EC%A0%95%EB%8B%B5-%EC%95%8C%EB%A6%BC-%EC%84%9C%EB%B9%84%EC%8A%A4/id6748852703"
                      : "https://play.google.com/store/apps/details?id=com.mojoday.quizbells"
                  }
                  target="_self"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full px-6 py-6 text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
                    🔔 퀴즈 정답 알림받기
                  </Button>
                </a>
              </div>
            )}

            {/* Quiz Cards */}
            <div className="space-y-4 mb-8">
              {contents.map((quiz: any, idx: number) => (
                <article
                  key={idx}
                  className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/50 dark:border-slate-800 hover:shadow-lg transition-all duration-300"
                  itemScope
                  itemType="https://schema.org/Question"
                >
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium mb-3"
                    itemProp="about"
                  >
                    📌 <span>{quiz.type}</span>
                  </div>

                  <h2
                    className="text-xl font-bold text-slate-900 dark:text-white mb-4"
                    itemProp="name"
                  >
                    {moment(quiz.answerDate).isSame(
                      moment(answerDate),
                      "day"
                    ) ? (
                      <span className="text-indigo-500">[어제 퀴즈]</span>
                    ) : (
                      ""
                    )}{" "}
                    {quiz.question}
                  </h2>

                  <a
                    href={`/quiz/${type}/${date === "today" ? "today" : answerDate}/answer`}
                    target="_self"
                    className="block mb-3"
                  >
                    <div
                      className="group rounded-xl border-2 border-emerald-300 dark:border-emerald-700 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40 px-6 py-5 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                      itemProp="acceptedAnswer"
                      itemScope
                      itemType="https://schema.org/Answer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-emerald-500 dark:bg-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 dark:group-hover:bg-emerald-500 transition-colors">
                            <CheckCircle2 className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-1">
                              정답 확인하기
                            </div>
                            <div className="text-xs text-emerald-600 dark:text-emerald-400">
                              클릭하여 정답 보기 →
                            </div>
                          </div>
                        </div>
                        <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300 group-hover:text-emerald-800 dark:group-hover:text-emerald-200 transition-colors">
                          →
                        </div>
                      </div>
                    </div>
                  </a>

                  {quiz.otherAnswers?.length > 0 && (
                    <div
                      className="rounded-xl border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/50 dark:to-yellow-950/50 px-5 py-4 shadow-sm"
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
              ))}
            </div>

            {/* Description Component */}
            <article className="mb-8 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/50 dark:border-slate-800">
              <DescriptionComponent type={type} />
            </article>

            <SocialShare
              title={`${item.typeKr} ${item.title} ${answerDateString} 정답`}
              url={`https://quizbells.com/quiz/${type}/${date === "today" ? "today" : answerDate}`}
              imageUrl="https://quizbells.com/icons/default-icon.png"
            />

            {/* Related Quizzes */}
            <article className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/50 dark:border-slate-800">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                앱테크 퀴즈 목록 ({dateLabel} 기준)
              </h2>
              <QuizCardComponent viewType="list" />
            </article>
          </section>
        </div>
      </div>
    </>
  );
}
