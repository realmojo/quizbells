"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";

const STORAGE_KEY = "sajulatte-modal-closed";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export default function SajuLatteModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 클라이언트에서만 실행
    const checkShouldShow = () => {
      const closedTime = localStorage.getItem(STORAGE_KEY);

      if (!closedTime) {
        // 처음 방문한 경우 - 2초 후 모달 표시
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 2000);
        return () => clearTimeout(timer);
      }

      const timeSinceClosed = Date.now() - parseInt(closedTime, 10);

      // 24시간이 지났으면 다시 표시
      if (timeSinceClosed >= ONE_DAY_MS) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 2000);
        return () => clearTimeout(timer);
      }
    };

    checkShouldShow();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  };

  const handleVisit = () => {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    window.open("https://sajulatte.app", "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden border-0 bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 dark:from-purple-800 dark:via-pink-800 dark:to-rose-800">
        {/* 닫기 버튼 */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-50 rounded-full p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
          aria-label="닫기"
        >
          <X className="h-4 w-4 text-white" />
        </button>

        {/* 모달 콘텐츠 */}
        <div className="relative text-white p-6">
          <DialogHeader className="space-y-3 text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md shadow-inner border border-white/10">
                <span className="text-2xl">🔮</span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-purple-200">
                  Today's Fortune
                </p>
                <DialogTitle className="text-white text-xl font-bold mt-1">
                  오늘의 운세 확인하세요!
                </DialogTitle>
              </div>
            </div>

            <DialogDescription className="text-white/90 text-base leading-relaxed">
              퀴즈 정답 확인했으면,<br />
              나의 사주와 오늘의 운세도 확인해보세요!
            </DialogDescription>
          </DialogHeader>

          {/* 기능 배지 */}
          <div className="flex flex-wrap gap-2 mt-4 mb-6">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium">
              ✨ 무료 사주 풀이
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium">
              📅 오늘의 운세
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium">
              💕 궁합 분석
            </span>
          </div>

          {/* CTA 버튼들 */}
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleVisit}
              className="w-full bg-white hover:bg-white/95 text-purple-700 font-bold text-base py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              사주라떼 바로가기
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <button
              onClick={handleClose}
              className="w-full text-center text-sm text-white/70 hover:text-white py-2 transition-colors"
            >
              하루 동안 보지 않기
            </button>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-6 -bottom-6 h-24 w-24 rounded-full bg-rose-500/20 blur-2xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
