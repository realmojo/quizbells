"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Bell,
  Loader2,
} from "lucide-react";
import QuizCardComponent from "@/components/QuizCardComponent";
import { useAppStore } from "@/store/useAppStore";
import { isWebView, quizItems, requestAlarmPermission } from "@/utils/utils";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function QuizPage() {
  const date = useAppStore((s) => s.date);
  const goPrevDate = useAppStore((s) => s.goPrevDate);
  const goNextDate = useAppStore((s) => s.goNextDate);

  const today = new Date();
  const isToday = format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");

  const [clientDate, setClientDate] = useState<string>("");
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    setClientDate(format(date, "yyyy년 M월 d일"));
  }, [date]);

  const handleRegisterNotification = async () => {
    setIsRegistering(true);
    try {
      const isGranted = await requestAlarmPermission();
      if (isGranted) {
        toast.success("알림 등록이 완료되었습니다! 🔔");
      } else {
        toast.error("알림 권한이 필요합니다.");
      }
    } catch (error) {
      console.error("알림 등록 오류:", error);
      toast.error("알림 등록에 실패했습니다.");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950">
      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* Header Section */}
        <header className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-sm font-medium mb-2">
            <Sparkles className="w-4 h-4" />
            <span>매일 업데이트되는 정답</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
            오늘의 앱테크 퀴즈
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            다양한 앱의 퀴즈 정답을 한곳에서 확인하세요.
            <br className="hidden md:block" /> 정답을 맞추고 포인트를 적립하여
            스마트한 앱테크를 시작해보세요.
          </p>
        </header>
        {/* <EmailSubscribe /> */}
        {/* Controls Section */}
        <nav
          className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-4 rounded-2xl border border-white/20 shadow-sm"
          aria-label="퀴즈 날짜 네비게이션"
        >
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
            <time className="text-lg font-bold min-w-[140px] text-center text-slate-800 dark:text-slate-100">
              {clientDate || "로딩중..."}
            </time>
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

          {/* 알림 등록 Button */}
          <Button
            variant="default"
            onClick={handleRegisterNotification}
            disabled={isRegistering}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
          >
            {isRegistering ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                등록 중...
              </>
            ) : (
              <>
                <Bell className="mr-2 h-4 w-4" />
                퀴즈 정답 알림 받기
              </>
            )}
          </Button>
        </nav>
        {!isWebView() && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
            <Button
              variant="default"
              onClick={() => {
                location.href =
                  "https://play.google.com/store/apps/details?id=com.mojoday.quizbells";
              }}
              className="group relative w-full sm:w-auto sm:flex-1 max-w-xs overflow-hidden bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 hover:from-emerald-600 hover:via-green-600 hover:to-teal-700 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl py-6 px-8 border border-emerald-400/30 hover:border-emerald-300/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <div className="relative flex items-center justify-center gap-3">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <span className="text-base">안드로이드 설치</span>
              </div>
            </Button>
            <Button
              variant="default"
              onClick={() => {
                location.href =
                  "https://apps.apple.com/kr/app/%ED%80%B4%EC%A6%88%EB%B2%A8-%EC%95%B1%ED%85%8C%ED%81%AC-%ED%80%B4%EC%A6%88-%EC%A0%95%EB%8B%B5-%EC%95%8C%EB%A6%BC-%EC%84%9C%EB%B9%84%EC%8A%A4/id6748852703";
              }}
              className="group relative w-full sm:w-auto sm:flex-1 max-w-xs overflow-hidden bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 hover:from-slate-600 hover:via-slate-700 hover:to-slate-800 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl py-6 px-8 border border-slate-500/30 hover:border-slate-400/50 dark:from-slate-600 dark:via-slate-700 dark:to-slate-900 dark:hover:from-slate-500 dark:hover:via-slate-600 dark:hover:to-slate-800"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <div className="relative flex items-center justify-center gap-3">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <span className="text-base">앱 스토어 설치</span>
              </div>
            </Button>
          </div>
        )}
        {/* Quiz Grid */}
        <section className="mb-16" aria-label="오늘의 퀴즈 정답">
          <QuizCardComponent viewType="grid" />
        </section>
        {/* Info Section */}
        <section
          className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-sm border border-white/50 dark:border-slate-800 space-y-10"
          aria-label="앱테크 퀴즈 가이드"
        >
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
      </article>
    </div>
  );
}
