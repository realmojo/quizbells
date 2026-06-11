import { Metadata } from "next";


import ImageComponents from "@/components/ImageComponets";
import { format, parseISO, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { getQuitItem, quizItems } from "@/utils/utils";
import Adsense from "@/components/Adsense";
import SocialShare from "@/components/SocialShare";
import DescriptionComponent from "@/components/DescriptionComponent";
import QuizCardComponent from "@/components/QuizCardComponent";
import { getQuizbells } from "@/utils/api";
import { CheckCircle2, Lightbulb, ArrowRight } from "lucide-react";
import { subDays, addDays } from "date-fns";
import { supabaseAdmin } from "@/lib/supabase";
import { Fragment } from "react/jsx-runtime";
import PWAInstallButton from "@/components/PWAInstallButton";
import VisitTracker from "@/components/VisitTracker";
// import GoogleTagQuizComponent from "@/components/GoogleTagQuizComponent";
import RewardedAdButton from "@/components/RewardedAdButton";
import { buildQuizStructuredData } from "./structuredData";

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
  const searchKeywords = item?.searchKeywords || [];
  // 제목 전략: [날짜] [퀴즈명] 정답 (실시간) | [사이트명]
  // 네이버 모바일 검색 가독성 최적화
  const fullTitle = `${typeName} ${typeTitle} ${shortDateLabel} 오늘 정답 | 퀴즈벨`;

  // 설명문: 핵심 검색 키워드를 자연스럽게 포함
  const topSearchKeyword = searchKeywords.length > 0 ? searchKeywords[0] : "";
  const description = topSearchKeyword
    ? `${typeName} ${typeTitle} ${shortDateLabel} 정답을 실시간으로 공개합니다. ${topSearchKeyword} 정답을 퀴즈벨에서 확인하고 즉시 포인트 적립하세요. 늦으면 종료될 수 있습니다.`
    : `${typeName} ${typeTitle} ${shortDateLabel} 정답을 실시간으로 공개합니다. 퀴즈벨에서 정답 확인하고 즉시 포인트 적립하세요. 늦으면 종료될 수 있습니다.`;

  // canonical URL: today(또는 오늘 날짜)는 /today로, 과거는 /YYYY-MM-DD로 통일
  // og.url도 canonical과 일치시켜 구글의 중복 판별 혼란 제거
  const canonicalUrl =
    date === "today" || answerDate === format(getKoreaDate(), "yyyy-MM-dd")
      ? `https://quizbells.com/quiz/${type}/today`
      : `https://quizbells.com/quiz/${type}/${answerDate}`;

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
      ...searchKeywords,
    ],
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: "퀴즈벨",
      type: "article",
      locale: "ko_KR",
      images: [`https://quizbells.com/icons/og-image.png`],
      publishedTime: answerDate,
      authors: ["퀴즈벨"],
      section: "앱테크/재테크",
      tags: [typeName, "앱테크", "퀴즈정답", ...searchKeywords],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [`https://quizbells.com/icons/og-image.png`],
    },
    alternates: {
      canonical: canonicalUrl,
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

  const h1Title = `${item.typeKr} ${item.title} ${shortDateLabel} 오늘 정답`;
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

  // 이전/다음 날 내비게이션 (크롤 깊이·체류시간·SEO 페이지네이션)
  const todayStr = format(getKoreaDate(), "yyyy-MM-dd");
  const baseDateObj = /^\d{4}-\d{2}-\d{2}$/.test(answerDate)
    ? parseISO(answerDate)
    : getKoreaDate();
  const prevDateStr = format(subDays(baseDateObj, 1), "yyyy-MM-dd");
  const nextDateStr = format(addDays(baseDateObj, 1), "yyyy-MM-dd");
  // 다음 날이 오늘 이후(미래)면 링크를 만들지 않는다.
  const hasNextDate = nextDateStr <= todayStr;
  // 다음 날이 오늘이면 canonical 일관성을 위해 /today 로 연결
  const nextHref =
    nextDateStr === todayStr
      ? `/quiz/${type}/today`
      : `/quiz/${type}/${nextDateStr}`;
  const prevShortLabel = format(subDays(baseDateObj, 1), "M월 d일");
  const nextShortLabel = format(addDays(baseDateObj, 1), "M월 d일");

  // 구조화된 데이터(JSON-LD) 생성은 structuredData.ts로 분리
  const structuredData = buildQuizStructuredData({
    type,
    date,
    answerDate,
    item,
    answerDateString,
    shortDateLabel,
    h1Title,
    firstDescription,
    currentUrl,
    isoDate,
    modifiedDate,
    contents,
    participantCount,
  });

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
                            Today&apos;s Fortune
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

            {/* 같은 앱 다른 기간 정답 - 내부 링크 (체류시간/PV 향상) */}
            <section className="mb-8 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 shadow-sm border border-white/50 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                📅 {item.typeKr} {item.title} 정답 더 보기
              </h2>

              {/* 주간 / 월간 모아보기 */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <a
                  href={`/quiz/${type}/weekly`}
                  target="_self"
                  className="group flex items-center justify-between rounded-xl border border-indigo-200 dark:border-indigo-800 bg-linear-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 px-4 py-4 hover:shadow-md transition-all duration-300"
                >
                  <div>
                    <div className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
                      주간 정답 모아보기
                    </div>
                    <div className="text-xs text-indigo-500 dark:text-indigo-400 mt-0.5">
                      최근 7일 {item.typeKr} 정답
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href={`/quiz/${type}/monthly`}
                  target="_self"
                  className="group flex items-center justify-between rounded-xl border border-purple-200 dark:border-purple-800 bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 px-4 py-4 hover:shadow-md transition-all duration-300"
                >
                  <div>
                    <div className="text-sm font-bold text-purple-700 dark:text-purple-300">
                      월간 정답 모아보기
                    </div>
                    <div className="text-xs text-purple-500 dark:text-purple-400 mt-0.5">
                      이번 달 {item.typeKr} 정답
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-purple-500 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* 최근 날짜별 바로가기 */}
              <div className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">
                날짜별 정답 바로가기
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 7 }).map((_, i) => {
                  const baseDate = parseISO(answerDate);
                  const targetDate = subDays(baseDate, i + 1);
                  const targetStr = format(targetDate, "yyyy-MM-dd");
                  return (
                    <a
                      key={targetStr}
                      href={`/quiz/${type}/${targetStr}`}
                      target="_self"
                      className="inline-flex items-center px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 font-medium hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                      {format(targetDate, "M월 d일", { locale: ko })} 정답
                    </a>
                  );
                })}
              </div>

              {/* 이전/다음 날 페이저 (SEO 페이지네이션·크롤 깊이) */}
              <nav
                aria-label="날짜 이동"
                className="mt-5 grid grid-cols-2 gap-3"
              >
                <a
                  href={`/quiz/${type}/${prevDateStr}`}
                  rel="prev"
                  target="_self"
                  className="group flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <ArrowRight className="w-4 h-4 rotate-180 text-slate-400 group-hover:text-emerald-500" />
                  <div className="text-left">
                    <div className="text-[11px] text-slate-400 dark:text-slate-500">
                      이전 날
                    </div>
                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {prevShortLabel} {item.typeKr} 정답
                    </div>
                  </div>
                </a>
                {hasNextDate && (
                  <a
                    href={nextHref}
                    rel="next"
                    target="_self"
                    className="group flex items-center justify-end gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    <div className="text-right">
                      <div className="text-[11px] text-slate-400 dark:text-slate-500">
                        다음 날
                      </div>
                      <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {nextShortLabel} {item.typeKr} 정답
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
                  </a>
                )}
              </nav>
            </section>

            {/* 같은 날짜 다른 앱 정답 - 날짜 키워드 교차 내부링크 (SEO) */}
            <section className="mb-8 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 shadow-sm border border-white/50 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                🗓️ {shortDateLabel} 다른 앱 퀴즈 정답
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {quizItems
                  .filter((q) => q.type !== type)
                  .map((q) => (
                    <a
                      key={q.type}
                      href={`/quiz/${q.type}/${date === "today" ? "today" : answerDate}`}
                      target="_self"
                      className="group flex items-center justify-between rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2.5 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 truncate">
                        {q.typeKr} {shortDateLabel} 정답
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                    </a>
                  ))}
              </div>
            </section>

            <SocialShare
              title={`${item.typeKr} ${item.title} ${answerDateString} 정답`}
              url={`https://quizbells.com/quiz/${type}/${date === "today" ? "today" : answerDate}`}
              imageUrl="https://quizbells.com/icons/og-image.png"
            />

            <Adsense slotId="9099705716" format="autorelaxed" />
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
