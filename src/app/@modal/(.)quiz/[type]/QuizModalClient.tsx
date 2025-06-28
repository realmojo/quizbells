"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import moment from "moment";
import ImageComponents from "@/components/ImageComponets";
import { getQuitItem } from "@/utils/utils";
// import Adsense from "@/components/Adsense";

interface Quiz {
  type: string;
  question: string;
  answer: string;
  otherAnswers: string[];
}

export default function QuizModalClient({ type }: { type: string }) {
  const hasFetched = useRef(false);
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [answerDate, setAnswerDate] = useState<string | null>(
    moment().format("YYYY-MM-DD")
  );
  const [answerDateString, setAnswerDateString] = useState<string | null>(
    moment().format("YYYY년 MM월 DD일")
  );

  const fetchQuizData = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/quizbells?type=${type}&answerDate=${answerDate}`
      );
      const json = await res.json();

      if (json?.contents) {
        const parsed = JSON.parse(json.contents);
        const filtered = parsed.filter(
          (item: any) => item.type && item.question && item.answer
        );

        setQuizzes(filtered);
        setAnswerDate(json.answerDate?.split("T")[0] || null);
        setAnswerDateString(moment(json.answerDate).format("YYYY년 MM월 DD일"));
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
      console.log("여기?");
      hasFetched.current = true;
      fetchQuizData();
    }
  }, []);

  useEffect(() => {
    setOpen(true); // URL(type)이 바뀌었을 때 다시 열기
  }, [type]);

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

  return (
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
        </DialogHeader>
        <style>{`.ring-offset-background { display: none !important; }`}</style>

        {loading && (
          <p className="text-center text-gray-500">
            퀴즈를 불러오는 중입니다...
          </p>
        )}

        {!loading && (
          <section
            className="px-4 pb-8"
            itemScope
            itemType="https://schema.org/WebPage"
          >
            {/* 페이지 대표 제목 */}
            <h1
              className="text-2xl font-bold text-gray-900 mb-4"
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
              />
              <div className="text-xs text-center mt-2 mb-2 text-gray-500">
                {`${answerDateString} ${type} 퀴즈 정답`}
              </div>
            </>

            {/* SEO-friendly 설명 */}
            <p
              className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
              itemProp="description"
            >
              앱테크는 광고 시청이나 퀴즈 참여를 통해 포인트를 적립하는
              방식으로, 많은 사용자들의 관심을 받고 있습니다. {answerDateString}
              기준, {getQuitItem(type)?.typeKr} {getQuitItem(type)?.title} 등
              다양한 앱에서 퀴즈 이벤트가 활발히 진행되고 있으며, 정답을 맞히면
              현금처럼 사용 가능한 리워드를 받을 수 있어 앱 사용자들 사이에서 큰
              호응을 얻고 있습니다.
            </p>

            {/* <Adsense slotId="1234567890" /> */}

            {!loading && quizzes.length === 0 && (
              <div className="text-center text-gray-700 px-6 py-10 mb-10">
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
              </div>
            )}

            {/* 퀴즈 목록 */}
            {quizzes.map((quiz, idx) => (
              <article
                key={idx}
                className="mb-6 rounded-lg border border-gray-200 bg-white p-5 tracking-tight shadow-sm"
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
                    className="text-sm text-gray-500 mt-2"
                    itemProp="suggestedAnswer"
                  >
                    유사 정답:{" "}
                    <span className="font-medium">
                      {quiz.otherAnswers.join(", ")}
                    </span>
                  </div>
                )}
              </article>
            ))}
          </section>
        )}
      </DialogContent>
    </Dialog>
  );
}
