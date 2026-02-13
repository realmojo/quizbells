import { Metadata } from "next";
import { format, parseISO } from "date-fns";
import { getQuitItem } from "@/utils/utils";

export const runtime = "edge";
import { getQuizbells } from "@/utils/api";
import { CheckCircle2, Calendar, Lightbulb } from "lucide-react";
import AppOpen from "@/components/AppOpen";
import { Fragment } from "react";
import PWAInstallButton from "@/components/PWAInstallButton";
import Adsense from "@/components/Adsense";
import QuizFeedback from "@/components/QuizFeedback";

// 한국 시간(KST, UTC+9)으로 현재 날짜 가져오기
// Edge Runtime에서도 정확하게 작동하도록 UTC에 9시간을 더하는 방식 사용
const getKoreaDate = (): Date => {
  const now = new Date();
  // UTC 시간에 9시간(한국 시간대)을 더함
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const koreaTime = new Date(utcTime + 9 * 60 * 60 * 1000); // UTC+9
  return koreaTime;
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
  const fullTitle = `${typeName} ${typeTitle} ${dateLabel} 정답 확인 | 퀴즈벨`;
  const description = `${typeName} ${typeTitle} ${dateLabel} 기준 정답을 확인하고, 앱테크 리워드를 적립해 보세요.`;

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
      images: [`https://quizbells.com/images/${type}.png`],
    },
    alternates: {
      canonical: `https://quizbells.com/quiz/${type}/${answerDate}/answer`,
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

  const contentMerges = quizItem?.contents.reverse() ?? [];

  const prevAnswers: string[] = [];
  const contents: any[] = [];

  contentMerges.forEach((q: any) => {
    if (prevAnswers.includes(q.answer)) {
      return;
    }
    prevAnswers.push(q.answer);
    contents.push(q);
  });

  // JSON-LD 구조화 데이터
  const answerJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: contents.length > 0
          ? contents.map((quiz: any) => ({
              "@type": "Question",
              name: `${answerDateString} ${item.typeKr} ${item.title} ${quiz.question || "퀴즈"} 정답`,
              acceptedAnswer: {
                "@type": "Answer",
                text: `정답은 [${quiz.answer}] 입니다.${quiz.otherAnswers?.length > 0 ? ` 다른 정답으로는 ${quiz.otherAnswers.join(", ")} 등이 있습니다.` : ""}`,
              },
            }))
          : [{
              "@type": "Question",
              name: `${answerDateString} ${item.typeKr} ${item.title} 퀴즈 정답은 무엇인가요?`,
              acceptedAnswer: {
                "@type": "Answer",
                text: "정답이 아직 업데이트되지 않았습니다. 곧 업데이트될 예정입니다.",
              },
            }],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "홈", item: "https://quizbells.com" },
          { "@type": "ListItem", position: 2, name: `${item.typeKr} 퀴즈`, item: `https://quizbells.com/quiz/${type}/today` },
          { "@type": "ListItem", position: 3, name: `${answerDateString} 정답`, item: `https://quizbells.com/quiz/${type}/${answerDate}/answer` },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-indigo-950 dark:to-purple-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(answerJsonLd) }}
      />
      <div className="max-w-xl mx-auto pt-6 pb-4">
        <section
          id="quiz-content"
          itemScope
          itemType="https://schema.org/WebPage"
        >
          {/* Header Section */}
          <div className="mb-6 px-4">
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

          <Adsense slotId={item.slotId || "8409513997"} />

          {/* Empty State */}
          {contents.length === 0 && (
            <div className="mt-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-10 text-center shadow-lg border border-white/50 dark:border-slate-800 mb-10">
              <p className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                등록된 퀴즈가 아직 없습니다.
              </p>
              <p className="text-base text-slate-600 dark:text-slate-400 mb-6">
                곧 정답이 업데이트될 예정입니다.
              </p>
              <div className="mt-6">
                <PWAInstallButton />
              </div>
            </div>
          )}

          {/* Answer Cards */}
          <div className="space-y-4">
            {contents.map((quiz: any, idx: number) => {
              // answerLink가 있으면 그것을 우선 사용, 없으면 answer에서 URL 추출 시도
              let answerUrl = quiz.answerLink;
              let displayAnswer = quiz.answer;

              if (!answerUrl) {
                const urlMatch = quiz.answer.match(/(https?:\/\/[^\s]+)/);
                answerUrl = urlMatch ? urlMatch[0] : null;
                if (answerUrl) {
                  displayAnswer = quiz.answer.replace(answerUrl, "").trim();
                }
              }

              return (
                <Fragment key={idx}>
                  <article
                    key={idx}
                    className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-6 shadow-sm border border-white/50 dark:border-slate-800"
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
                      className="rounded-xl border-2 border-emerald-200 dark:border-emerald-800 bg-linear-to-br from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50 px-5 py-4 shadow-sm"
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
                        {displayAnswer}
                      </span>

                      {answerUrl && (
                        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                          <span>퀴즈 참여하기:</span>
                          <a
                            href={answerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 dark:text-emerald-400 underline underline-offset-4 break-all hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
                          >
                            {answerUrl}
                          </a>
                        </div>
                      )}
                      {type === "kakaobank" && (
                        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                          <span>카카오뱅크 앱 열기:</span>
                          <a
                            href="https://kakaobank.onelink.me/0qMi/jcwk0sbz"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 dark:text-emerald-400 underline underline-offset-4 break-all hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
                          >
                            https://kakaobank.onelink.me/0qMi/jcwk0sbz
                          </a>
                        </div>
                      )}
                      {type === "kakaopay" && (
                        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                          <span>카카오페이 앱 열기:</span>
                          <a
                            href="https://link.kakaopay.com/_/fMLguKC"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 dark:text-emerald-400 underline underline-offset-4 break-all hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
                          >
                            https://link.kakaopay.com/_/fMLguKC
                          </a>
                        </div>
                      )}
                      {type === "shinhan" && (
                        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                          <span>신한쏠페이 앱 열기:</span>
                          <a
                            href="https://spa.shinhan.com/app_link.html?pr_id=ACXCZ10010010"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 dark:text-emerald-400 underline underline-offset-4 break-all hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
                          >
                            https://spa.shinhan.com/app_link.html?pr_id=ACXCZ10010010
                          </a>
                        </div>
                      )}
                      {type === "hanabank" && (
                        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                          <span>하나원큐 앱 열기:</span>
                          <a
                            href="https://mbp.hanabank.com/oneqplus.jsp?MENUM/mbp/resource/html/LLFN/LLFN11/LLFN1101001.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 dark:text-emerald-400 underline underline-offset-4 break-all hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
                          >
                            https://mbp.hanabank.com/oneqplus.jsp?MENUM/mbp/resource/html/LLFN/LLFN11/LLFN1101001.html
                          </a>
                        </div>
                      )}
                      {type === "hpoint" && (
                        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                          <span>에이치포인트 앱 열기:</span>
                          <a
                            href="https://www.h-point.co.kr/cma/invite.nhd?scheme=quizMain"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 dark:text-emerald-400 underline underline-offset-4 break-all hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
                          >
                            https://www.h-point.co.kr/cma/invite.nhd?scheme=quizMain
                          </a>
                        </div>
                      )}
                      {type === "kbstar" && (
                        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                          <span>KB스타 KBPAY 앱 열기:</span>
                          <a
                            href="https://m.liivmate.com/katsv4/kbpay/share.do?appId=https://m.liivmate.com/katsv4/kbpay/share.do/goEv?F000070"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 dark:text-emerald-400 underline underline-offset-4 break-all hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
                          >
                            https://m.liivmate.com/katsv4/kbpay/share.do?appId=https://m.liivmate.com/katsv4/kbpay/share.do/goEv?F000070
                          </a>
                        </div>
                      )}
                    </div>
                    {quiz.otherAnswers?.length > 0 && (
                      <div
                        className="rounded-xl border-2 border-amber-200 dark:border-amber-800 bg-linear-to-br from-amber-50 to-yellow-50 dark:from-amber-950/50 dark:to-yellow-950/50 px-5 py-4 shadow-sm mt-4"
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
                  {idx === 0 && (
                    <div className="mt-4 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                      <QuizFeedback
                        type={type}
                        date={
                          date === "today"
                            ? format(getKoreaDate(), "yyyy-MM-dd")
                            : answerDate
                        }
                      />
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>

          {/* App Open Button - 정답 아래에 배치 */}
          <div className="mb-8 px-4">
            <AppOpen type={type} />
          </div>

          {/* 관련 금융 팁 섹션 */}
          <div className="mb-8 px-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              알아두면 돈이 되는 금융 팁
            </h3>
            <div className="space-y-3">
              {[
                { id: "3", title: "2026년 적금 금리 비교 - 은행별 최고 금리 적금 추천 총정리", category: "적금" },
                { id: "5", title: "주택담보대출 금리 비교 - 전세자금대출 조건과 금리 총정리", category: "대출" },
                { id: "6", title: "자동차보험료 비교 견적 - 다이렉트 보험으로 20% 절약하는 법", category: "보험" },
              ].map((tip) => (
                <a
                  key={tip.id}
                  href={`/tips/${tip.id}`}
                  target="_self"
                  className="block bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-xl p-4 border border-white/50 dark:border-slate-800 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span className="inline-block text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 mb-2">
                    {tip.category}
                  </span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">
                    {tip.title}
                  </p>
                </a>
              ))}
            </div>
          </div>

          <Adsense slotId="9099705716" format="autorelaxed" />
        </section>
      </div>
    </div>
  );
}
