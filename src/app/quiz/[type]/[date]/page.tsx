import { Metadata } from "next";

export const runtime = "edge";

import ImageComponents from "@/components/ImageComponets";
import { format, parseISO, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { getQuitItem } from "@/utils/utils";
import Adsense from "@/components/Adsense";
import SocialShare from "@/components/SocialShare";
import DescriptionComponent from "@/components/DescriptionComponent";
import QuizCardComponent from "@/components/QuizCardComponent";
import { getQuizbells } from "@/utils/api";
import { CheckCircle2, Lightbulb, ArrowRight } from "lucide-react";
import { subDays } from "date-fns";
import { supabaseAdmin } from "@/lib/supabase";
import { Fragment } from "react/jsx-runtime";
import PWAInstallButton from "@/components/PWAInstallButton";
import VisitTracker from "@/components/VisitTracker";
// import GoogleTagQuizComponent from "@/components/GoogleTagQuizComponent";
import RewardedAdButton from "@/components/RewardedAdButton";

// 한국 시간(KST, UTC+9)으로 현재 날짜 가져오기
// Edge Runtime에서도 정확하게 작동하도록 UTC에 9시간을 더하는 방식 사용
const getKoreaDate = (): Date => {
  const now = new Date();
  // UTC 시간에 9시간(한국 시간대)을 더함
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const koreaTime = new Date(utcTime + 9 * 60 * 60 * 1000); // UTC+9
  return koreaTime;
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
  // 제목 전략: [날짜] [퀴즈명] 정답 (실시간) | [사이트명]
  const fullTitle = `${typeName} ${typeTitle} 오늘 정답 ${shortDateLabel} | 퀴즈벨`;

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
      canonical:
        date === "today"
          ? `https://quizbells.com/quiz/${type}/today`
          : `https://quizbells.com/quiz/${type}/${answerDate}`,
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
          },
        );

        if (rpcError) {
          console.warn("참여자 수 증가 실패:", rpcError.message);
        }
      } catch (e) {
        console.error("참여자 수 증가 오류:", e);
      }
    })();
  }

  const h1Title = `${item.typeKr} ${item.title} 오늘 정답 ${shortDateLabel}`;
  const firstDescription = `${item.typeKr} ${item.title} ${answerDateString} 정답을 알려드립니다. 앱테크로 소소한 행복을 누리시는 분들을 위해 실시간으로 정답을 업데이트하고 있습니다. 매일 새로운 퀴즈와 함께 포인트를 적립하고 현금으로 환급받을 수 있는 기회를 제공합니다. 정확하고 빠른 정답 정보로 여러분의 앱테크 생활을 더욱 풍요롭게 만들어드리겠습니다.`;

  let quizItem = null;
  let lastDayQuizItem = null;

  // 어제 날짜 계산 (한국 시간 기준)
  let lastDayAnswerDate: string;
  try {
    if (answerDate && /^\d{4}-\d{2}-\d{2}$/.test(answerDate)) {
      const parsedDate = parseISO(answerDate);
      const yesterday = subDays(parsedDate, 1);
      lastDayAnswerDate = format(yesterday, "yyyy-MM-dd");
    } else {
      const koreaDate = getKoreaDate();
      const yesterday = subDays(koreaDate, 1);
      lastDayAnswerDate = format(yesterday, "yyyy-MM-dd");
    }
  } catch (error) {
    console.error("날짜 계산 오류:", error);
    const koreaDate = getKoreaDate();
    const yesterday = subDays(koreaDate, 1);
    lastDayAnswerDate = format(yesterday, "yyyy-MM-dd");
  }

  let todayUpdated: string | null = null;

  try {
    // 오늘 퀴즈 데이터 조회
    const todayQuizData = await getQuizbells(type, answerDate);
    todayUpdated = todayQuizData?.updated || null; // updated 컬럼 직접 조회
    quizItem =
      todayQuizData?.contents.map((quiz: any) => ({
        ...quiz,
        isToday: true,
        answerDate,
      })) ?? [];

    // 어제 퀴즈 데이터 조회
    const yesterdayQuizData = await getQuizbells(type, lastDayAnswerDate);
    lastDayQuizItem =
      yesterdayQuizData?.contents.map((quiz: any) => ({
        ...quiz,
        isToday: false,
        answerDate: lastDayAnswerDate,
      })) ?? [];
  } catch (error) {
    console.error("퀴즈 데이터 조회 오류:", error);
    quizItem = null;
  }

  const contentMerges = [...quizItem.reverse(), ...lastDayQuizItem];

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
      { next: { revalidate: 300 } }, // 5분 캐시
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
  // 구글 공식 FAQPage 형식에 맞춰 정확하게 구성
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity:
      contents.length > 0
        ? contents.map((quiz: any) => ({
            "@type": "Question",
            name: `${answerDateString} ${item.typeKr} ${item.title} ${quiz.question || "퀴즈"} 정답`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `정답은 [${quiz.answer}] 입니다.${quiz.otherAnswers?.length > 0 ? ` 다른 정답으로는 ${quiz.otherAnswers.join(", ")} 등이 있습니다.` : ""}`,
            },
          }))
        : [
            {
              "@type": "Question",
              name: `${answerDateString} ${item.typeKr} ${item.title} 퀴즈 정답은 무엇인가요?`,
              acceptedAnswer: {
                "@type": "Answer",
                text: "정답이 아직 업데이트되지 않았습니다. 곧 업데이트될 예정입니다.",
              },
            },
          ],
  };

  // Breadcrumb 구조화된 데이터
  const breadcrumbItems = [
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
  ];
  // today가 아닌 과거 날짜일 때만 3단계 추가 (today면 2번째와 URL이 중복되므로)
  if (date !== "today") {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 3,
      name: `${shortDateLabel} 정답`,
      item: `https://quizbells.com/quiz/${type}/${answerDate}`,
    });
  }
  const breadcrumbJsonLd = {
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  };

  // ISO 날짜 형식 생성
  const isoDate = `${answerDate}T00:00:00`;

  // updated 컬럼에서 최신 업데이트 시간 가져오기 (오늘 데이터의 updated 사용)
  const latestUpdated = todayUpdated;

  // 표시용 업데이트 시간 포맷팅 (상대 시간: 몇 분 전, 몇 시간 전 등)
  let updatedTimeDisplay: string | null = null;
  let updatedTimeISO: string | null = null; // SEO를 위한 ISO 형식
  let modifiedDate: string; // dateModified용 W3C Datetime 포맷

  const now = new Date();

  if (latestUpdated) {
    try {
      const updatedDate = new Date(latestUpdated);

      // updatedDate가 현재보다 미래면, 시간대 변환 문제로 간주하고 조정
      let targetDate = updatedDate;

      // updatedDate가 현재보다 미래인 경우 (시간대 문제)
      if (updatedDate > now) {
        // updated가 UTC로 저장되어 있고 한국 시간으로 해석된 경우
        // UTC 시간으로 변환 (9시간 빼기)
        targetDate = new Date(updatedDate.getTime() - 9 * 60 * 60 * 1000);
      }

      // 현재 시간과의 차이를 계산하여 상대 시간으로 표시
      // formatDistanceToNow는 과거 시간이면 "전", 미래 시간이면 "후"를 표시
      updatedTimeDisplay = formatDistanceToNow(targetDate, {
        addSuffix: true,
        locale: ko,
      });

      // SEO를 위한 ISO 8601 형식 (기계가 읽을 수 있는 형식)
      updatedTimeISO = updatedDate.toISOString();

      // dateModified용 W3C Datetime 포맷 (한국 시간대, 초 단위까지 정밀도 향상)
      const year = targetDate.getFullYear();
      const month = String(targetDate.getMonth() + 1).padStart(2, "0");
      const day = String(targetDate.getDate()).padStart(2, "0");
      const hours = String(targetDate.getHours()).padStart(2, "0");
      const minutes = String(targetDate.getMinutes()).padStart(2, "0");
      const seconds = String(targetDate.getSeconds()).padStart(2, "0");
      modifiedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    } catch (e) {
      console.error("업데이트 시간 포맷팅 오류:", e);
      // 오류 발생 시 기본값 사용
      modifiedDate = `${answerDate}T${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:00`;
    }
  } else {
    // updated가 없으면 현재 시간 사용
    modifiedDate = `${answerDate}T${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:00`;
  }

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
      url: "https://quizbells.com",
    },
    // Publisher 정보 보강 (필수 항목)
    publisher: {
      "@type": "Organization",
      "@id": "https://quizbells.com/#organization",
      name: "퀴즈벨",
      alternateName: "QUIZBELLS",
      url: "https://quizbells.com",
      logo: {
        "@type": "ImageObject",
        url: "https://quizbells.com/icons/android-icon-192x192.png",
        width: 192,
        height: 192,
      },
      sameAs: [
        "https://play.google.com/store/apps/details?id=com.mojoday.quizbells",
        "https://apps.apple.com/kr/app/%ED%80%B4%EC%A6%88%EB%B2%A8-%EC%95%B1%ED%85%8C%ED%81%AC-%ED%80%B4%EC%A6%88-%EC%A0%95%EB%8B%B5-%EC%95%8C%EB%A6%BC-%EC%84%9C%EB%B9%84%EC%8A%A4/id6748852703",
      ],
    },
    // mainEntityOfPage 추가 (페이지의 핵심 콘텐츠임을 명시)
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": currentUrl,
      url: currentUrl,
      name: h1Title,
      description: firstDescription,
      inLanguage: "ko",
      isPartOf: {
        "@type": "WebSite",
        "@id": "https://quizbells.com/#website",
        name: "퀴즈벨",
        url: "https://quizbells.com",
      },
    },
    // Image 정보 보강 (검색 결과 썸네일 노출 확률 향상)
    image: {
      "@type": "ImageObject",
      url: `https://quizbells.com/images/${type}.png`,
      width: 1200,
      height: 630,
      alt: `${item.typeKr} ${item.title} 퀴즈 정답`,
      caption: `${item.typeKr} ${item.title} ${answerDateString} 정답`,
    },
    keywords: keywords,
    articleSection: "앱테크/재테크",
    articleBody: articleBodyText,
    about: {
      "@type": "Thing",
      name: `${item.typeKr} ${item.title}`,
      description: `매일 출제되는 ${item.typeKr} ${item.title} 퀴즈 정답을 실시간으로 제공하는 서비스`,
    },
    // hasPart 제거: Article 타입에서 Question을 hasPart에 넣으면 에러 발생
    // FAQPage의 mainEntity에 Question을 넣는 것이 올바른 방법
    isPartOf: {
      "@type": "WebSite",
      "@id": "https://quizbells.com/#website",
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
      {/* 방문 기록 추적 (today 페이지일 때만) */}
      {date === "today" && <VisitTracker type={type} />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-indigo-950 dark:to-purple-950">
        <div className="max-w-xl mx-auto pt-6 pb-40">
          <main
            id="quiz-content"
            itemScope
            itemType="https://schema.org/WebPage"
          >
            {/* Header Section */}
            <div className="mb-4 px-4">
              <h1
                className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-br from-slate-900 to-indigo-600 dark:from-white dark:to-indigo-400 leading-tight"
                itemProp="headline"
              >
                {h1Title}
              </h1>
              {updatedTimeDisplay && updatedTimeISO && (
                <div className="mt-1 text-xs text-right text-slate-400 dark:text-slate-500">
                  최종 업데이트:{" "}
                  <time dateTime={updatedTimeISO} itemProp="dateModified">
                    {updatedTimeDisplay}
                  </time>
                </div>
              )}
            </div>

            {/*
              오늘 날짜가 아닌경우 /quiz/${type}/today 로 가능하게 버튼
            */}
            {date !== "today" && (
              <a
                href={`/quiz/${type}/today`}
                target="_self"
                className="block mb-3"
              >
                <div className="group rounded-xl border-2 border-emerald-300 dark:border-emerald-700 bg-linear-to-br from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40 px-6 py-5 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-500 dark:bg-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 dark:group-hover:bg-emerald-500 transition-colors">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-xl font-medium text-emerald-700 dark:text-emerald-300 mb-1">
                          {item.typeKr} 오늘({format(getKoreaDate(), "M월 d일")}
                          ) 퀴즈 정답 보기
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
            )}

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

            {/* Quiz Cards - 오늘/어제 퀴즈 모두 확인하기 버튼 */}

            {contents.length === 0 && (
              <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-10 text-center shadow-lg border border-white/50 dark:border-slate-800 mb-10">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-linear-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
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

                <div className="flex justify-center gap-3 mb-6">
                  <a
                    href={`/quiz/${type}/${format(subDays(parseISO(answerDate), 1), "yyyy-MM-dd")}`}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shadow-sm"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    <span>
                      {format(subDays(parseISO(answerDate), 1), "M월 d일")} 퀴즈
                      정답 보기
                    </span>
                  </a>
                </div>

                <PWAInstallButton />
              </div>
            )}

            {/* 요약 CTA - 문제 리스트 위 */}
            {contents.length > 0 && (
              <div className="mb-6 bg-linear-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-900/20 dark:via-green-900/20 dark:to-teal-900/20 border-2 border-emerald-200 dark:border-emerald-800 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4">
                  {/* <div className="shrink-0 w-12 h-12 rounded-full bg-emerald-500 dark:bg-emerald-600 flex items-center justify-center text-2xl">
                    💰
                  </div> */}
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                      💰 {item.typeKr} {item.title} 요약
                    </h2>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <span className="font-semibold">총 문제 수:</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {contents.length}개
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <span className="font-semibold">예상 적립:</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          약 {Math.round(contents.length * 50)} ~{" "}
                          {Math.round(contents.length * 200)}원
                        </span>
                      </div>
                    </div>
                    <a
                      href={`/quiz/${type}/${date === "today" ? "today" : answerDate}/answer`}
                      target="_self"
                      className="w-full group relative inline-flex items-center justify-center gap-3 px-8 py-6 bg-linear-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 dark:from-emerald-600 dark:via-green-600 dark:to-teal-600 dark:hover:from-emerald-500 dark:hover:via-green-500 dark:hover:to-teal-500 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 animate-pulse hover:animate-none ring-4 ring-emerald-200/50 dark:ring-emerald-800/50 hover:ring-emerald-300/70 dark:hover:ring-emerald-700/70 overflow-hidden"
                    >
                      {/* 반짝이는 배경 효과 */}
                      <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>

                      {/* 텍스트와 아이콘 */}
                      <span className="relative z-10 flex items-center gap-3">
                        <span className="text-xl">👉</span>
                        <span>정답 바로 보기</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {contents.map((quiz: any, idx: number) => (
              <Fragment key={idx}>
                <section
                  id={`quiz-${idx}`}
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
                    className="text-md font-bold text-slate-900 dark:text-white mb-4"
                    itemProp="name"
                  >
                    {quiz.isToday ? (
                      <span className="text-green-500">[오늘 퀴즈]</span>
                    ) : (
                      <span className="text-blue-500">[어제 퀴즈]</span>
                    )}{" "}
                    {quiz.question || quiz.type}
                  </h2>

                  {/* {idx === 0 && <GoogleTagQuizComponent />} */}
                  {(idx === 0 || idx === 1 || idx === 2) && (
                    <Adsense slotId={item.slotId || "8409513997"} />
                  )}

                  <RewardedAdButton
                    href={`/quiz/${type}/${quiz.isToday ? "today" : quiz.answerDate}/answer`}
                  >
                    <div
                      className="group rounded-xl border-2 border-emerald-300 dark:border-emerald-700 bg-linear-to-br from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40 px-6 py-5 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer"
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
                            <div className="text-xl font-medium text-emerald-700 dark:text-emerald-300 mb-1">
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
                  </RewardedAdButton>
                </section>

                {/* 사주라떼 오늘의 운세 카드 (today 페이지, 첫 번째 퀴즈 아래) */}
                {idx === 0 && date === "today" && (
                  <a
                    href="https://sajulatte.app/daily"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mb-8 group"
                  >
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 dark:from-purple-800 dark:via-pink-800 dark:to-rose-800 p-6 text-white shadow-xl shadow-purple-500/20 hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-[1.02]">
                      <div className="relative z-10 flex gap-4 items-start">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md shadow-inner border border-white/10">
                          <span className="text-2xl">🔮</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-purple-200 border-b border-white/10 pb-1 inline-block">
                            Today's Fortune
                          </h3>
                          <p className="text-lg font-bold leading-snug drop-shadow-sm mb-3">
                            퀴즈 정답 확인했으면, 오늘의 운세도 확인해보세요!
                          </p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium">
                              ✨ 무료 사주 풀이
                            </span>
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium">
                              📅 오늘의 운세
                            </span>
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium">
                              💕 궁합 분석
                            </span>
                          </div>
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/90 text-purple-700 font-bold text-sm group-hover:bg-white transition-colors">
                            사주라떼 바로가기
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                      {/* Decorative Background Elements */}
                      <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
                      <div className="absolute -left-6 -bottom-6 h-24 w-24 rounded-full bg-rose-500/20 blur-2xl" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-pink-500/10 blur-3xl" />
                    </div>
                  </a>
                )}
              </Fragment>
            ))}

            {/* Description Component */}
            <section className="mb-8 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 shadow-sm border border-white/50 dark:border-slate-800">
              <DescriptionComponent type={type} />
            </section>
            <SocialShare
              title={`${item.typeKr} ${item.title} ${answerDateString} 정답`}
              url={`https://quizbells.com/quiz/${type}/${date === "today" ? "today" : answerDate}`}
              imageUrl="https://quizbells.com/icons/og-image.png"
            />

            <Adsense slotId="4827796860" />
            {/* Related Quizzes */}
            <section className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 shadow-sm border border-white/50 dark:border-slate-800">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                앱테크 퀴즈 목록 ({dateLabel} 기준)
              </h2>
              <QuizCardComponent viewType="image" />
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
