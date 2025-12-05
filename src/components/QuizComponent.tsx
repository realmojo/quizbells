"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import QuizCardComponent from "@/components/QuizCardComponent";
import { useAppStore } from "@/store/useAppStore";
import { quizItems } from "@/utils/utils";
import Link from "next/link";
import { cn } from "@/lib/utils";
import EmailSubscribe from "./EmailSubscribe";

export default function QuizPage() {
  const date = useAppStore((s) => s.date);
  const goPrevDate = useAppStore((s) => s.goPrevDate);
  const goNextDate = useAppStore((s) => s.goNextDate);

  const today = new Date();
  const isToday = format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");

  const [clientDate, setClientDate] = useState<string>("");

  useEffect(() => {
    setClientDate(format(date, "yyyy년 M월 d일"));
  }, [date]);

  return (
    <>
      <Head>
        <title>
          퀴즈벨 - 매일 업데이트되는 앱테크 퀴즈 정답 모음 - 쏠퀴즈, 캐시워크,
          토스
        </title>
        <meta
          name="description"
          content="매일 갱신되는 앱테크 퀴즈 정답! 신한쏠퀴즈, 캐시워크, 토스 행운퀴즈 등 다양한 앱의 정답을 한곳에서 확인하세요. 퀴즈로 포인트 적립까지!"
        />
        <meta
          name="keywords"
          content="앱테크, 퀴즈 정답, 쏠퀴즈, 캐시워크, 토스, 오늘의 정답, 포인트 앱"
        />
        <meta property="og:title" content="앱테크 퀴즈 정답 모음" />
        <meta
          property="og:description"
          content="퀴즈 정답으로 포인트 쌓자! 매일 업데이트되는 앱테크 퀴즈 정답."
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950">
        <div className="max-w-3xl mx-auto px-4 py-12 mb-10">
          {/* Header Section */}
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-sm font-medium mb-2">
              <Sparkles className="w-4 h-4" />
              <span>매일 업데이트되는 정답</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
              오늘의 앱테크 퀴즈
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              다양한 앱의 퀴즈 정답을 한곳에서 확인하세요.
              <br className="hidden md:block" /> 정답을 맞추고 포인트를 적립하여
              스마트한 앱테크를 시작해보세요.
            </p>
          </div>

          <EmailSubscribe />

          {/* Controls Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-4 rounded-2xl border border-white/20 shadow-sm">
            {/* Date Navigation */}
            <div className="flex items-center gap-4 bg-white dark:bg-slate-800 rounded-xl p-1.5 shadow-sm border border-slate-100 dark:border-slate-700">
              <Button
                variant="ghost"
                size="icon"
                onClick={goPrevDate}
                aria-label="이전 날짜"
                className="hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg h-9 w-9"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="text-lg font-bold min-w-[140px] text-center text-slate-800 dark:text-slate-100">
                {clientDate || "로딩중..."}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={goNextDate}
                disabled={isToday}
                aria-label="다음 날짜"
                className={cn(
                  "hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg h-9 w-9",
                  isToday && "opacity-30"
                )}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Tips Button */}
            <Link href="/tips" className="w-full md:w-auto">
              <Button
                variant="default"
                className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
              >
                💡 앱테크 꿀팁 보러가기
              </Button>
            </Link>
          </div>

          {/* Quiz Grid */}
          <div className="mb-16">
            <QuizCardComponent viewType="grid" />
          </div>

          {/* Info Section */}
          <section className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-sm border border-white/50 dark:border-slate-800 space-y-10">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-2xl">💡</span> 왜 매일 확인해야 할까요?
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                앱테크는 스마트폰으로 소액 리워드를 쌓는 재테크 방식입니다. 특히{" "}
                <strong className="text-purple-600 dark:text-purple-400">
                  퀴즈형 이벤트
                </strong>
                는 정답 입력만으로 포인트를 쉽게 얻을 수 있어 인기가 많습니다.
                퀴즈벨에서는{" "}
                <strong className="text-slate-900 dark:text-slate-200">
                  {quizItems
                    .map((item) => `${item.typeKr}`)
                    .slice(0, 3)
                    .join(", ")}
                </strong>{" "}
                등 다양한 정답을 실시간으로 제공합니다.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                  📊 포인트 적립 꿀팁
                </h3>
                <ul className="space-y-3">
                  {[
                    "매일 방문해서 정답 확인하기",
                    "앱 알림 설정으로 놓치지 않기",
                    "정답 입력 후 제출 버튼 필수",
                    "선착순/한정 시간 퀴즈 주의",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-slate-600 dark:text-slate-400"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                  ✅ 이런 분들께 추천해요
                </h3>
                <ul className="space-y-3">
                  {[
                    "하루 5분으로 용돈 벌고 싶은 분",
                    "앱테크를 처음 시작하는 분",
                    "정답 찾을 시간이 부족한 분",
                    "빠르게 포인트만 쌓고 싶은 분",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-slate-600 dark:text-slate-400"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
              <p className="text-slate-500 dark:text-slate-500 text-sm">
                지금 바로 위 퀴즈 카드를 클릭하여 포인트를 적립해보세요!
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
