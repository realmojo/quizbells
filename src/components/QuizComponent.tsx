"use client";

import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Bell,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import QuizCardComponent from "@/components/QuizCardComponent";
import { useAppStore } from "@/store/useAppStore";
import { quizItems } from "@/utils/utils";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import EarningsSummary from "@/components/EarningsSummary";

// PWA 설치 프롬프트 이벤트 타입
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function QuizPage() {
  const date = useAppStore((s) => s.date);
  const goPrevDate = useAppStore((s) => s.goPrevDate);
  const goNextDate = useAppStore((s) => s.goNextDate);

  const today = new Date();
  const isToday = format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");

  const [clientDate, setClientDate] = useState<string>("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [showInstallSuccessDialog, setShowInstallSuccessDialog] =
    useState(false);
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    setClientDate(format(date, "yyyy년 M월 d일"));
  }, [date]);

  // PWA 설치 여부 확인
  useEffect(() => {
    const checkPWAInstalled = () => {
      // standalone 모드로 실행 중인지 확인 (Android, Desktop)
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true; // iOS Safari

      setIsPWAInstalled(isStandalone);
    };

    checkPWAInstalled();

    // display-mode 변경 감지 (설치 후 standalone 모드로 전환)
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleChange = () => {
      checkPWAInstalled();
    };

    // 일부 브라우저에서는 change 이벤트를 지원하지 않을 수 있음
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    }
  }, []);

  // PWA 설치 프롬프트 이벤트 캡처
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // 기본 프롬프트 방지
      e.preventDefault();
      // 이벤트 저장
      deferredPromptRef.current = e as BeforeInstallPromptEvent;
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // beforeinstallprompt 이벤트가 발생하지 않으면 이미 설치되었을 가능성
    // 일정 시간 후에도 이벤트가 없으면 설치된 것으로 간주
    const timeout = setTimeout(() => {
      if (!deferredPromptRef.current && !isPWAInstalled) {
        // standalone 모드가 아니더라도 설치 프롬프트가 없으면 이미 설치되었을 수 있음
        const isStandalone =
          window.matchMedia("(display-mode: standalone)").matches ||
          (window.navigator as any).standalone === true;

        if (isStandalone) {
          setIsPWAInstalled(true);
        }
      }
    }, 1000);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      clearTimeout(timeout);
    };
  }, [isPWAInstalled]);

  // PWA 설치 프롬프트 표시 함수
  const promptPWAInstall = async () => {
    if (!deferredPromptRef.current) {
      // 설치 프롬프트가 없는 경우 (이미 설치됨 또는 지원 안 함)
      toast.info("이미 설치되어 있거나 설치를 지원하지 않는 브라우저입니다.");
      return false;
    }

    try {
      // 설치 프롬프트 표시
      await deferredPromptRef.current.prompt();

      // 사용자 선택 대기
      const { outcome } = await deferredPromptRef.current.userChoice;

      if (outcome === "accepted") {
        // 이벤트 초기화
        deferredPromptRef.current = null;
        // 설치 성공 알림창 표시
        setShowInstallSuccessDialog(true);
        // 설치 완료 후 상태 업데이트 (약간의 지연 후)
        setTimeout(() => {
          setIsPWAInstalled(true);
        }, 500);
        return true;
      } else {
        toast.info("설치가 취소되었습니다.");
        return false;
      }
    } catch (error) {
      console.error("PWA 설치 프롬프트 오류:", error);
      toast.error("설치 중 오류가 발생했습니다.");
      return false;
    }
  };

  const handleRegisterNotification = async () => {
    setIsRegistering(true);
    try {
      // 먼저 PWA 설치 프롬프트 표시
      // const installed = await promptPWAInstall();
      promptPWAInstall();

      // PWA 설치 후 알림 권한 요청
      // if (installed || !deferredPromptRef.current) {
      //   const isGranted = await requestAlarmPermission();
      //   if (isGranted) {
      //     toast.success("알림 등록이 완료되었습니다! 🔔");
      //   } else {
      //     toast.error("알림 권한이 필요합니다.");
      //   }
      // }
    } catch (error) {
      console.error("알림 등록 오류:", error);
      toast.error("알림 등록에 실패했습니다.");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950">
      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* Header Section */}
        <header className="text-center mb-4 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-sm font-medium mb-2">
            <Sparkles className="w-4 h-4" />
            <span>매일 업데이트되는 정답</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
            오늘의 앱테크 퀴즈
          </h1>
        </header>

        {/* 오늘 예상 수익 요약 */}
        <EarningsSummary />
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

          {/* 알림 등록 Button - PWA가 설치되지 않은 경우에만 표시 */}
          {!isPWAInstalled && (
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
          )}
        </nav>

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

      {/* 설치 성공 알림창 */}
      <Dialog
        open={showInstallSuccessDialog}
        onOpenChange={setShowInstallSuccessDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl font-bold">
              앱 설치가 완료되었습니다! 🎉
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              설치된 앱으로 이동하여 알림을 허용해주세요.
              <br />
              알림을 허용하시면 퀴즈 정답을 실시간으로 받아보실 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              onClick={() => setShowInstallSuccessDialog(false)}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
            >
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
