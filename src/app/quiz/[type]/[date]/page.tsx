import { Metadata } from "next";

export const runtime = 'edge';

import ImageComponents from "@/components/ImageComponets";
import { format, parseISO } from "date-fns";
import { getQuitItem } from "@/utils/utils";
import Adsense from "@/components/Adsense";
import SocialShare from "@/components/SocialShare";
import DescriptionComponent from "@/components/DescriptionComponent";
import QuizCardComponent from "@/components/QuizCardComponent";
import { getQuizbells } from "@/utils/api";
import { CheckCircle2, Lightbulb, Calendar } from "lucide-react";
import moment from "moment-timezone";
import CoupangPartnerAdBanner from "@/components/CoupangPartnerAdBanner";
import CoupangPartnerAd from "@/components/CoupangPartnerAd";
import EventLink from "@/components/EventLink";
import { supabaseAdmin } from "@/lib/supabase";
import { Fragment } from "react/jsx-runtime";
import PWAInstallButton from "@/components/PWAInstallButton";

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

  // 네이버 검색 최적화: 날짜를 강조하는 짧은 포맷 (예: 12월 15일)
  let shortDateLabel: string;
  try {
    if (answerDate && /^\d{4}-\d{2}-\d{2}$/.test(answerDate)) {
      shortDateLabel = format(parseISO(answerDate), "M월 d일");
    } else {
      shortDateLabel = format(getKoreaDate(), "M월 d일");
    }
  } catch (e) {
    console.error("날짜 파싱 오류:", e);
    shortDateLabel = format(getKoreaDate(), "M월 d일");
  }

  const typeName = item?.typeKr || type;
  const typeTitle = item?.title || "";
  // 제목 전략: [날짜] [퀴즈명] 정답 (실시간) | [사이트명]
  // 네이버 모바일 검색 가독성 최적화
  const fullTitle = `${typeName} ${typeTitle} 정답 ${shortDateLabel} | 퀴즈벨`;

  // 설명문: 핵심 키워드 전진 배치
  const description = `${typeName} ${typeTitle} ${shortDateLabel} 정답을 실시간으로 공개합니다. 퀴즈벨에서 정답 확인하고 즉시 포인트 적립하세요. 늦으면 종료될 수 있습니다.`;

  return {
    title: fullTitle,
    description,
    applicationName: "퀴즈벨",
    keywords: [
      `${typeName} 정답`,
      `${shortDateLabel} ${typeName}`,
      "실시간 정답",
      "오늘의 퀴즈",
      "앱테크",
      typeName,
      typeTitle,
    ],
    openGraph: {
      title: fullTitle,
      description,
      // 사용자가 수정한 전략(/today) 유지
      url: `https://quizbells.com/quiz/${type}/today`,
      siteName: "퀴즈벨",
      type: "article",
      locale: "ko_KR",
      images: [`https://quizbells.com/icons/og-image.png`],
      publishedTime: answerDate,
      authors: ["퀴즈벨"],
      section: "앱테크/재테크",
      tags: [typeName, "앱테크", "퀴즈정답"],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [`https://quizbells.com/icons/og-image.png`],
    },
    alternates: {
      canonical: `https://quizbells.com/quiz/${type}/today`,
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

export default async function QuizPage({ params }: QuizPageParams) {
  const { type, date } = await params;
  const answerDate =
    date === "today" ? format(getKoreaDate(), "yyyy-MM-dd") : date;
  const item = getQuitItem(type);

  // 날짜 파싱 및 포맷팅 (안전하게 처리)
  let answerDateString: string;
  let dateLabel: string;
  let shortDateLabel: string;

  try {
    let parsedDate: Date;
    if (answerDate && /^\d{4}-\d{2}-\d{2}$/.test(answerDate)) {
      parsedDate = parseISO(answerDate);
    } else {
      parsedDate = getKoreaDate();
    }
    answerDateString = format(parsedDate, "yyyy년 MM월 dd일");
    dateLabel = format(parsedDate, "yyyy년 MM월 dd일");
    shortDateLabel = format(parsedDate, "M월 d일");
  } catch (error) {
    console.error("날짜 파싱 오류:", error);
    const koreaDate = getKoreaDate();
    answerDateString = format(koreaDate, "yyyy년 MM월 dd일");
    dateLabel = format(koreaDate, "yyyy년 MM월 dd일");
    shortDateLabel = format(koreaDate, "M월 d일");
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

  // 페이지 진입 시 참여자 수 증가 (비동기 처리, 사용자 응답 대기 안 함)
  if (supabaseAdmin) {
    (async () => {
      try {
        const { error: rpcError } = await supabaseAdmin.rpc(
          "increment_answer_count",
          {
            p_quiz_type: type,
          }
        );

        if (rpcError) {
          console.warn("참여자 수 증가 실패:", rpcError.message);
        }
      } catch (e) {
        console.error("참여자 수 증가 오류:", e);
      }
    })();
  }

  const h1Title = `${item.typeKr} ${item.title} 정답 ${shortDateLabel} | 퀴즈벨`;
  const firstDescription = `${item.typeKr} ${item.title} ${answerDateString} 정답을 알려드립니다. 앱테크로 소소한 행복을 누리시는 분들을 위해 실시간으로 정답을 업데이트하고 있습니다. 매일 새로운 퀴즈와 함께 포인트를 적립하고 현금으로 환급받을 수 있는 기회를 제공합니다. 정확하고 빠른 정답 정보로 여러분의 앱테크 생활을 더욱 풍요롭게 만들어드리겠습니다.`;

  let quizItem = null;
  let lastDayQuizItem = null;

  // 어제 날짜 계산 (한국 시간 기준)
  const lastDayAnswerDate = moment
    .tz(answerDate, "Asia/Seoul")
    .subtract(1, "day")
    .format("YYYY-MM-DD");

  try {
    // 오늘 퀴즈 데이터 조회
    quizItem = await getQuizbells(type, answerDate);
    quizItem =
      quizItem?.contents.map((quiz: any) => ({
        ...quiz,
        isToday: true,
        answerDate,
      })) ?? [];

    // 어제 퀴즈 데이터 조회
    lastDayQuizItem = await getQuizbells(type, lastDayAnswerDate);

    lastDayQuizItem =
      lastDayQuizItem?.contents.map((quiz: any) => ({
        ...quiz,
        isToday: false,
        answerDate: lastDayAnswerDate,
      })) ?? [];
  } catch (error) {
    console.error("퀴즈 데이터 조회 오류:", error);
    quizItem = null;
  }

  const contentMerges = [...quizItem, ...lastDayQuizItem];

  const prevAnswers: string[] = [];
  const contents: any[] = [];

  contentMerges.forEach((q: any) => {
    if (prevAnswers.includes(q.answer)) {
      return;
    }
    prevAnswers.push(q.answer);
    contents.push(q);
  });

  // 참여자 수 조회 (누적값)
  let participantCount = 1000; // 기본값
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const countResponse = await fetch(
      `${baseUrl}/api/quizbells/count?type=${type}`,
      { next: { revalidate: 300 } } // 5분 캐시
    );
    if (countResponse.ok) {
      const countData = await countResponse.json();
      if (countData.success && countData.count !== undefined) {
        participantCount = countData.count;
      }
    }
  } catch (error) {
    console.error("참여자 수 조회 오류:", error);
    // 오류 발생 시 기본값 사용
  }

  // FAQPage 구조화된 데이터 (검색결과 리치 스니펫용)
  const faqJsonLd = {
    "@type": "FAQPage",
    mainEntity: contents.map((quiz: any) => ({
      "@type": "Question",
      name: `Q. ${quiz.question || item.typeKr + " 퀴즈 정답은 무엇인가요?"}`,
      acceptedAnswer: {
        "@type": "Answer",
        text: `A. 정답은 [${quiz.answer}] 입니다. ${quiz.otherAnswers?.length > 0 ? `다른 정답으로는 ${quiz.otherAnswers.join(", ")} 등이 있습니다.` : ""}`,
      },
    })),
  };

  // Breadcrumb 구조화된 데이터
  const breadcrumbJsonLd = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "홈",
        item: "https://quizbells.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `${item.typeKr} 퀴즈`,
        item: `https://quizbells.com/quiz/${type}/today`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${shortDateLabel} 정답`,
        item: `https://quizbells.com/quiz/${type}/${date === "today" ? "today" : answerDate}`,
      },
    ],
  };

  // ISO 날짜 형식 생성
  const isoDate = `${answerDate}T09:00:00+09:00`;
  const now = new Date();
  const modifiedDate = `${answerDate}T${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:00+09:00`;

  // 현재 페이지 URL
  const currentUrl = `https://quizbells.com/quiz/${type}/${date === "today" ? "today" : answerDate}`;

  // 키워드 생성
  const keywords = [
    `${item.typeKr} 정답`,
    `${item.typeKr} ${item.title} 정답`,
    `${shortDateLabel} ${item.typeKr}`,
    `${item.typeKr} 퀴즈`,
    `${item.typeKr} 퀴즈 정답`,
    "앱테크 퀴즈",
    "퀴즈 정답",
    "실시간 정답",
    "오늘의 퀴즈",
    "퀴즈벨",
  ].join(", ");

  // articleBody 생성 (퀴즈 내용 포함)
  const articleBodyText = `${item.typeKr} ${item.title} ${answerDateString} 정답을 알려드립니다. ${contents.length > 0 ? `오늘의 퀴즈 정답은 ${contents.map((q: any) => q.answer).join(", ")} 등이 있습니다.` : ""} 앱테크로 소소한 행복을 누리시는 분들을 위해 실시간으로 정답을 업데이트하고 있습니다. 매일 새로운 퀴즈와 함께 포인트를 적립하고 현금으로 환급받을 수 있는 기회를 제공합니다. 정확하고 빠른 정답 정보로 여러분의 앱테크 생활을 더욱 풍요롭게 만들어드리겠습니다.`;

  // hasPart: Question 구조 생성 (여러 퀴즈에 대해)
  const hasPartQuestions =
    contents.length > 0
      ? contents.map((quiz: any) => ({
          "@type": "Question",
          name: `${answerDateString} ${item.typeKr} ${item.title} 퀴즈`,
          text: `${answerDateString} ${item.typeKr} ${item.title} 퀴즈 정답은 무엇인가요? ${quiz.question ? `질문: ${quiz.question}` : ""}`,
          acceptedAnswer: {
            "@type": "Answer",
            text: quiz.answer,
            dateCreated: isoDate,
          },
        }))
      : [
          {
            "@type": "Question",
            name: `${answerDateString} ${item.typeKr} ${item.title} 퀴즈`,
            text: `${answerDateString} ${item.typeKr} ${item.title} 퀴즈 정답은 무엇인가요?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: "정답이 아직 업데이트되지 않았습니다. 곧 업데이트될 예정입니다.",
              dateCreated: isoDate,
            },
          },
        ];

  const articleJsonLd = {
    "@type": "Article",
    "@id": currentUrl,
    url: currentUrl,
    headline: h1Title,
    description: firstDescription,
    inLanguage: "ko",
    isAccessibleForFree: true,
    datePublished: isoDate,
    dateModified: modifiedDate,
    dateCreated: isoDate,
    author: {
      "@type": "Person",
      name: "퀴즈벨 에디터",
    },
    publisher: {
      "@type": "Organization",
      name: "퀴즈벨",
      logo: {
        "@type": "ImageObject",
        url: "https://quizbells.com/icons/android-icon-192x192.png",
        width: 192,
        height: 192,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": currentUrl,
    },
    image: {
      "@type": "ImageObject",
      url: `https://quizbells.com/images/${type}.png`,
      width: 300,
      height: 300,
    },
    keywords: keywords,
    articleSection: "앱테크/재테크",
    articleBody: articleBodyText,
    about: {
      "@type": "Thing",
      name: `${item.typeKr} ${item.title}`,
      description: `매일 출제되는 ${item.typeKr} ${item.title} 퀴즈 정답을 실시간으로 제공하는 서비스`,
    },
    hasPart:
      hasPartQuestions.length > 0
        ? hasPartQuestions.length === 1
          ? hasPartQuestions[0]
          : hasPartQuestions
        : undefined,
    isPartOf: {
      "@type": "WebSite",
      name: "퀴즈벨",
      url: "https://quizbells.com",
    },
    interactionStatistic: [
      {
        "@type": "InteractionCounter",
        interactionType: {
          "@type": "https://schema.org/ReadAction",
        },
        userInteractionCount: participantCount,
      },
    ],
  };

  // @graph를 사용하여 모든 구조화된 데이터 통합
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [faqJsonLd, breadcrumbJsonLd, articleJsonLd],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-indigo-950 dark:to-purple-950">
        <div className="max-w-xl mx-auto pt-6 pb-40">
          <main
            id="quiz-content"
            itemScope
            itemType="https://schema.org/WebPage"
          >
            {/* Header Section */}
            <div className="mb-8 px-4">
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

            <Adsense slotId={item.slotId || "8409513997"} />

            {/* Description */}
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md mt-4 p-4 mb-4 shadow-sm border border-white/50 dark:border-slate-800 overflow-hidden">
              {/* Image Section - float-left로 배치 */}
              <div className="float-left w-[94px] max-h-[94px] mr-4 mb-2 rounded-xl overflow-hidden shadow-lg ring-1 ring-slate-900/5 dark:ring-white/10">
                <div className="h-full w-full [&>img]:h-full [&>img]:w-full [&>img]:object-contain">
                  <ImageComponents
                    answerDate={answerDateString?.toString() || ""}
                    type={type}
                    width={100}
                    height={100}
                  />
                </div>
              </div>
              {/* Description Section - 이미지 옆에서 시작, 길어지면 아래로 */}
              <p
                className="text-slate-700 dark:text-slate-300 text-base leading-relaxed"
                itemProp="description"
              >
                {firstDescription}
              </p>
              {/* float clear */}
              <div className="clear-both"></div>
            </div>
            <div className="text-sm text-center mb-4 text-slate-500 dark:text-slate-400 font-medium">
              {`${answerDateString} ${item.typeKr} ${item.title} 퀴즈 정답`}
            </div>

            <CoupangPartnerAdBanner />
            {/* Quiz Cards - 오늘/어제 퀴즈 모두 확인하기 버튼 */}

            {contents.length === 0 && (
              <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-10 text-center shadow-lg border border-white/50 dark:border-slate-800 mb-10">
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

                <PWAInstallButton />
              </div>
            )}

            {contents.map((quiz: any, idx: number) => (
              <Fragment key={idx}>
                <section
                  key={idx}
                  className="mb-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-6 shadow-sm border border-white/50 dark:border-slate-800 hover:shadow-lg transition-all duration-300"
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
                    {quiz.isToday ? (
                      <span className="text-green-500">[오늘 퀴즈]</span>
                    ) : (
                      <span className="text-blue-500">[어제 퀴즈]</span>
                    )}{" "}
                    {quiz.question || quiz.type}
                  </h2>

                  <a
                    href={`/quiz/${type}/${quiz.isToday ? "today" : quiz.answerDate}/answer`}
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
                </section>
              </Fragment>
            ))}
            <EventLink />
            {/* Description Component */}
            <section className="mb-8 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 shadow-sm border border-white/50 dark:border-slate-800">
              <DescriptionComponent type={type} />
            </section>
            <SocialShare
              title={`${item.typeKr} ${item.title} ${answerDateString} 정답`}
              url={`https://quizbells.com/quiz/${type}/${date === "today" ? "today" : answerDate}`}
              imageUrl="https://quizbells.com/icons/og-image.png"
            />
            {/* Related Quizzes */}
            <section className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 shadow-sm border border-white/50 dark:border-slate-800">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                앱테크 퀴즈 목록 ({dateLabel} 기준)
              </h2>
              <QuizCardComponent viewType="list" />
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
