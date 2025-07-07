// /app/@modal/(.)quiz/[type]/QuizModalClient.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import ImageComponents from "@/components/ImageComponets";
import { getQuitItem, isApple, requestAlarmPermission } from "@/utils/utils";
import DescriptionComponent from "@/components/DescriptionComponent";
import QuizCardComponent from "@/components/QuizCardComponent";
import Adsense from "@/components/Adsense";
import SocialShare from "@/components/SocialShare";
import AppOpen from "@/components/AppOpen";
import { Button } from "@/components/ui/button";
import { updateSettings } from "@/utils/api";
import { settingsStore } from "@/store/settingsStore";
import { toast } from "sonner";

interface Quiz {
  type: string;
  question: string;
  answer: string;
  otherAnswers: string[];
}

const useUpdateMetaTags = ({
  type,
  quizzes,
  answerDate,
  answerDateString,
}: {
  type: string;
  quizzes: {
    type: string;
    question: string;
    answer: string;
    otherAnswers: string[];
  }[];
  answerDate: string;
  answerDateString: string;
}) => {
  useEffect(() => {
    if (!quizzes || quizzes.length === 0) return;

    // 원래 값들 저장
    const originalTitle = document.title;
    const originalDescription =
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content") || null;
    const originalOgType =
      document
        .querySelector('meta[property="og:type"]')
        ?.getAttribute("content") || null;
    const originalOgTitle =
      document
        .querySelector('meta[property="og:title"]')
        ?.getAttribute("content") || null;
    const originalOgDescription =
      document
        .querySelector('meta[property="og:description"]')
        ?.getAttribute("content") || null;
    const originalOgUrl =
      document
        .querySelector('meta[property="og:url"]')
        ?.getAttribute("content") || null;
    const originalOgSiteName =
      document
        .querySelector('meta[property="og:site_name"]')
        ?.getAttribute("content") || null;
    const originalTwitterCard =
      document
        .querySelector('meta[name="twitter:card"]')
        ?.getAttribute("content") || null;
    const originalTwitterTitle =
      document
        .querySelector('meta[name="twitter:title"]')
        ?.getAttribute("content") || null;
    const originalTwitterDescription =
      document
        .querySelector('meta[name="twitter:description"]')
        ?.getAttribute("content") || null;
    const originalCanonical =
      document.querySelector('link[rel="canonical"]')?.getAttribute("href") ||
      null;

    const siteName = "퀴즈벨";
    const typeName = getQuitItem(type)?.typeKr || type;
    const typeTitle = getQuitItem(type)?.title ?? "";
    const quizTitle = `${typeName} ${typeTitle} ${answerDateString} 퀴즈 정답 확인하고 앱테크 적립하세요`;
    const description = `${answerDateString} 기준 ${typeName} 퀴즈 정답을 한눈에 확인하세요. 퀴즈를 풀고 포인트도 적립하세요.`;
    const ogDescription = `${typeName} ${answerDateString} 퀴즈 정답 확인하고 앱테크 리워드 적립!`;
    const twitterDescription = `${typeName} 퀴즈 정답 및 리워드 정보`;
    const canonicalUrl = `https://quizbells.com/quiz/${type}/${answerDate}`;

    // Title 업데이트
    document.title = `${quizTitle} | ${siteName}`;

    // 메타태그 업데이트/생성 함수
    const updateOrCreateMeta = (selector: string, content: string) => {
      let meta = document.querySelector(selector) as HTMLMetaElement;
      if (meta) {
        meta.content = content;
      } else {
        meta = document.createElement("meta");
        if (selector.includes("property=")) {
          const property = selector.match(/property="([^"]+)"/)?.[1];
          if (property) meta.setAttribute("property", property);
        } else if (selector.includes("name=")) {
          const name = selector.match(/name="([^"]+)"/)?.[1];
          if (name) meta.name = name;
        }
        meta.content = content;
        meta.setAttribute("data-quiz-dynamic", "true");
        document.head.appendChild(meta);
      }
    };

    // 메타태그들 업데이트
    updateOrCreateMeta('meta[name="description"]', description);
    updateOrCreateMeta('meta[property="og:type"]', "website");
    updateOrCreateMeta('meta[property="og:title"]', quizTitle);
    updateOrCreateMeta('meta[property="og:description"]', ogDescription);
    updateOrCreateMeta('meta[property="og:url"]', canonicalUrl);
    updateOrCreateMeta('meta[property="og:site_name"]', siteName);
    updateOrCreateMeta('meta[name="twitter:card"]', "summary");
    updateOrCreateMeta('meta[name="twitter:title"]', quizTitle);
    updateOrCreateMeta('meta[name="twitter:description"]', twitterDescription);

    // Canonical URL 업데이트/생성
    let canonicalLink = document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement;
    if (canonicalLink) {
      canonicalLink.href = canonicalUrl;
    } else {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      canonicalLink.href = canonicalUrl;
      canonicalLink.setAttribute("data-quiz-dynamic", "true");
      document.head.appendChild(canonicalLink);
    }

    // JSON-LD 생성
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: quizzes.map((quiz) => ({
        "@type": "Question",
        name: quiz.question || "질문 없음",
        acceptedAnswer: {
          "@type": "Answer",
          text: quiz.answer,
        },
        ...(quiz.otherAnswers?.length > 0 && {
          suggestedAnswer: quiz.otherAnswers.map((alt) => ({
            "@type": "Answer",
            text: alt,
          })),
        }),
      })),
    };

    // 기존 JSON-LD 제거
    const existingJsonLd = document.querySelector(
      'script[key="quiz-jsonld"], script[data-quiz-jsonld]'
    );
    if (existingJsonLd) existingJsonLd.remove();

    // 새 JSON-LD 추가
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-quiz-jsonld", "true");
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    // 클린업 함수
    return () => {
      // Title 복원
      document.title = originalTitle;

      // 기존 메타태그들을 원래 값으로 복원하는 함수
      const restoreOriginalMeta = (
        selector: string,
        originalValue: string | null
      ) => {
        const meta = document.querySelector(selector) as HTMLMetaElement;
        if (meta) {
          if (originalValue) {
            meta.content = originalValue;
          } else if (meta.hasAttribute("data-quiz-dynamic")) {
            // 동적으로 생성된 것이면 제거
            meta.remove();
          }
        }
      };

      // 기존 값들 복원
      restoreOriginalMeta('meta[name="description"]', originalDescription);
      restoreOriginalMeta('meta[property="og:type"]', originalOgType);
      restoreOriginalMeta('meta[property="og:title"]', originalOgTitle);
      restoreOriginalMeta(
        'meta[property="og:description"]',
        originalOgDescription
      );
      restoreOriginalMeta('meta[property="og:url"]', originalOgUrl);
      restoreOriginalMeta('meta[property="og:site_name"]', originalOgSiteName);
      restoreOriginalMeta('meta[name="twitter:card"]', originalTwitterCard);
      restoreOriginalMeta('meta[name="twitter:title"]', originalTwitterTitle);
      restoreOriginalMeta(
        'meta[name="twitter:description"]',
        originalTwitterDescription
      );

      // Canonical URL 복원
      const canonicalLink = document.querySelector(
        'link[rel="canonical"]'
      ) as HTMLLinkElement;
      if (canonicalLink) {
        if (originalCanonical) {
          canonicalLink.href = originalCanonical;
        } else if (canonicalLink.hasAttribute("data-quiz-dynamic")) {
          canonicalLink.remove();
        }
      }

      // 동적으로 추가한 메타태그들 제거
      document
        .querySelectorAll("meta[data-quiz-dynamic]")
        .forEach((meta) => meta.remove());
      document
        .querySelectorAll("link[data-quiz-dynamic]")
        .forEach((link) => link.remove());
      document
        .querySelectorAll("script[data-quiz-jsonld]")
        .forEach((script) => script.remove());
    };
  }, [type, quizzes, answerDate, answerDateString]);
};

export default function QuizModalClient({
  type,
  date,
}: {
  type: string;
  date: string;
}) {
  const { setSettings } = settingsStore();
  date = date === "today" ? format(new Date(), "yyyy-MM-dd") : date;
  const pathname = usePathname();
  const hasFetched = useRef(false);
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [answerDate, setAnswerDate] = useState<string>(
    date
      ? format(parseISO(date), "yyyy-MM-dd")
      : format(new Date(), "yyyy-MM-dd")
  );
  const [answerDateString, setAnswerDateString] = useState<string>(
    date
      ? format(parseISO(date), "yyyy년 MM월 dd일")
      : format(new Date(), "yyyy년 MM월 dd일")
  );

  const fetchQuizData = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/quizbells?type=${type}&answerDate=${answerDate}`
      );
      const json = await res.json();

      if (json?.contents) {
        const parsed = JSON.parse(json.contents);
        const filtered = parsed.filter((item: any) => item.answer);

        setQuizzes(filtered);
        setAnswerDate(json.answerDate?.split("T")[0] || null);
        setAnswerDateString(
          format(parseISO(json.answerDate), "yyyy년 MM월 dd일")
        );
      }
    } catch (err) {
      console.error("퀴즈 로딩 실패", err);
    } finally {
      setLoading(false);
    }
  }, [type, answerDate]);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchQuizData();
    }
  }, []);

  useEffect(() => {
    const splitPathname = pathname.split("/");
    console.log("splitPathname", splitPathname);
    if (splitPathname.length === 3 && splitPathname[1] === "quiz") {
      setOpen(true);
    }
  }, [pathname]);

  const moveClose = useCallback(() => {
    const hasReferrer =
      document.referrer !== "" && document.referrer !== window.location.href;

    setTimeout(() => {
      if (hasReferrer) {
        router.back();
      } else {
        router.push("/quiz");
      }
    }, 300);
  }, [router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        moveClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [moveClose]);

  useUpdateMetaTags({
    type,
    quizzes,
    answerDate,
    answerDateString,
  });

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={() => {
          setOpen(false);
          moveClose();
        }}
      >
        <DialogContent className="flex flex-col !m-0 p-0 h-screen max-h-none w-screen max-w-none !gap-0 !rounded-none !border-none overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-start text-base font-semibold">
              <div className="flex items-center">
                <button
                  onClick={() => router.back()}
                  className="rounded-full p-3 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                  aria-label="뒤로가기"
                >
                  <span className="text-xl">←</span>
                </button>
              </div>
            </DialogTitle>
            <DialogDescription className="text-left" />
          </DialogHeader>
          <style>{`.ring-offset-background { display: none !important; }`}</style>
          {loading && (
            <p className="text-center text-gray-500">
              퀴즈 정답을 불러오는 중입니다...
            </p>
          )}

          {!loading && (
            <section itemScope itemType="https://schema.org/WebPage">
              {/* 페이지 대표 제목 */}
              <h1
                className="text-2xl font-semibold text-gray-900 mb-4 px-4"
                itemProp="headline"
              >
                {getQuitItem(type)?.typeKr} {getQuitItem(type)?.title}{" "}
                {answerDateString} 정답 확인하고 앱테크 적립하세요
              </h1>

              {/* 퀴즈 이미지 */}
              <>
                <ImageComponents
                  answerDate={answerDateString?.toString() || ""}
                  type={type}
                  width={600}
                  height={600}
                />
                <div className="text-xs text-center mt-2 mb-2 text-gray-500">
                  {`${answerDateString} ${getQuitItem(type)?.typeKr} ${getQuitItem(type)?.title} 퀴즈 정답`}
                </div>
              </>

              {/* SEO-friendly 설명 */}
              <p
                className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6 px-4"
                itemProp="description"
              >
                앱테크는 광고 시청이나 퀴즈 참여를 통해 포인트를 적립하는
                방식으로, 많은 사용자들의 관심을 받고 있습니다.{" "}
                {answerDateString}
                기준, {getQuitItem(type)?.typeKr} {getQuitItem(type)?.title} 등
                다양한 앱에서 퀴즈 이벤트가 활발히 진행되고 있으며, 정답을
                맞히면 현금처럼 사용 가능한 리워드를 받을 수 있어 앱 사용자들
                사이에서 큰 호응을 얻고 있습니다.
              </p>

              <Adsense slotId={getQuitItem(type)?.slotId || "8409513997"} />

              {!loading && quizzes.length === 0 && (
                <div className="text-center text-gray-700 px-4 py-10 mb-10">
                  <p className="text-lg font-semibold mb-2">
                    {answerDateString}
                    <br />
                    등록된 퀴즈가 아직 없습니다.
                  </p>
                  <p className="text-sm mb-4">
                    곧 정답이 업데이트될 예정입니다. 잠시 후 다시 확인해 주세요.
                  </p>
                  <p className="text-sm text-gray-500">
                    새로운 정답이 올라오면 알려드릴게요! 즐겨찾기 해두시면
                    편리해요 😊
                  </p>

                  <Button
                    className="mt-4 w-full px-4 min-h-[50px] text-lg font-semibold"
                    onClick={async () => {
                      const isGranted = await requestAlarmPermission();
                      if (isGranted) {
                        await setSettings();
                        await updateSettings("isQuizAlarm", "Y");
                        toast.success("알림 설정 완료");
                      } else {
                        if (isApple()) {
                          alert(
                            "iOS 브라우저 앱 출시 후 알림을 사용할 수 있습니다."
                          );
                        }
                      }
                    }}
                  >
                    🔔 퀴즈 정답 알림받기
                  </Button>
                </div>
              )}

              {/* 퀴즈 목록 */}
              {quizzes.length > 0 && (
                <article className="mb-6 bg-white px-4 tracking-tight">
                  <AppOpen type={type} />
                </article>
              )}

              {quizzes.map((quiz, idx) => (
                <article
                  key={idx}
                  className="mb-6 rounded-lg border mx-4 border-gray-200 bg-white p-5 tracking-tight shadow-sm"
                  itemScope
                  itemType="https://schema.org/Question"
                >
                  {/* 퀴즈 유형 */}
                  <div className="text-xs text-gray-500 mb-1" itemProp="about">
                    📌 <span className="ml-1">{quiz.type}</span>
                  </div>

                  {/* 퀴즈 질문 */}
                  <h2 className="text-lg text-gray-800 mb-2" itemProp="name">
                    문제: {quiz.question}
                  </h2>

                  {/* 정답 */}
                  <div
                    className="my-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800 shadow-sm"
                    itemProp="acceptedAnswer"
                    itemScope
                    itemType="https://schema.org/Answer"
                  >
                    <span className="block text-sm font-semibold text-green-600 mb-1">
                      ✅ 정답
                    </span>
                    <span itemProp="text" className="text-xl font-bold">
                      {quiz.answer}
                    </span>
                  </div>

                  {/* 유사 정답 (있을 경우) */}
                  {quiz.otherAnswers?.length > 0 && (
                    <div
                      className="my-3 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-yellow-800 shadow-sm"
                      itemProp="suggestedAnswer"
                      itemScope
                      itemType="https://schema.org/SuggestedAnswer"
                    >
                      <span className="block text-sm font-semibold text-yellow-600 mb-1">
                        💡 다른 정답
                      </span>
                      <div className="text-xl font-bold">
                        <span itemProp="text">
                          {quiz.otherAnswers.join(", ")}
                        </span>
                      </div>
                    </div>
                  )}
                </article>
              ))}

              <article className="mb-6 bg-white px-4 tracking-tight">
                <AppOpen type={type} />
              </article>

              <article className="mb-6 bg-white px-4 tracking-tight">
                <DescriptionComponent type={type} />
              </article>

              <SocialShare
                title={`${getQuitItem(type)?.typeKr} ${getQuitItem(type)?.title} ${answerDateString} 퀴즈 정답 확인하고 앱테크 적립하세요`}
                url={window.location.href}
                imageUrl="https://quizbells.com/icons/default-icon.png"
              />

              <article className="mb-6 px-4 bg-white tracking-tight">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  💡 앱테크 퀴즈 목록
                </h2>
                <QuizCardComponent viewType="list" />
              </article>
            </section>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
