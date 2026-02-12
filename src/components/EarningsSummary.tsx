"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useAppStore } from "@/store/useAppStore";
import { TrendingUp } from "lucide-react";
import { getTodayQuizbells } from "@/utils/api";

export default function EarningsSummary() {
  const date = useAppStore((s) => s.date);
  const today = new Date();
  const isToday = format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");

  const [totalEarnings, setTotalEarnings] = useState(0);
  const [quizCount, setQuizCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // 한국 시간 날짜 가져오기 (API 호출용)
  const getKoreaDate = (): string => {
    const now = new Date();
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
    const koreaTime = new Date(utcTime + 9 * 60 * 60 * 1000); // UTC+9
    return format(koreaTime, "yyyy-MM-dd");
  };

  useEffect(() => {
    // 오늘 날짜가 아니면 계산하지 않음 (또는 해당 날짜 데이터로 계산할 수도 있음)
    // 여기서는 오늘 날짜일 때만 실시간 계산을 수행
    if (!isToday) {
      setTotalEarnings(0);
      setQuizCount(0);
      setIsLoading(false);
      return;
    }

    const calculateEarnings = async () => {
      try {
        const todayDate = getKoreaDate();
        // isNew=true로 호출해서 어떤 퀴즈가 있는지 확인
        const data = (await getTodayQuizbells(todayDate, true)) as Record<
          string,
          boolean
        >;

        if (data) {
          // true인 퀴즈 개수 파악
          const activeQuizzes = Object.values(data).filter(
            (exists) => exists === true
          ).length;
          setQuizCount(activeQuizzes);

          // 퀴즈가 하나도 없으면 0원
          if (activeQuizzes === 0) {
            setTotalEarnings(0);
          } else {
            // 결정적인 랜덤 값을 위해 날짜 + 퀴즈개수를 시드로 활용할 수도 있지만,
            // 간단하게는 '퀴즈 개수 * 약 45원' 정도로 평균치를 내거나
            // 매번 랜덤하게 바뀌면 사용자 경험이 안좋으니 퀴즈 개수에 비례하는 고정 로직 사용
            // 예: (퀴즈수 * 35) + (퀴즈수 * 10) = 퀴즈당 약 45원

            // 더 재미있게: 각 퀴즈마다 가상의 랜덤 금액을 배정 (5~100)
            // 하지만 클라이언트에서 매번 바뀌면 이상하니 퀴즈 개수에 따라 정해진 금액 범위 연출

            // 퀴즈 1개당 약 50원으로 잡고 계산 (최소 5, 최대 100의 중간)
            const estimatedAmount = activeQuizzes * 50;
            setTotalEarnings(estimatedAmount);
          }
        }
      } catch (error) {
        console.error("수익 계산 오류:", error);
      } finally {
        setIsLoading(false);
      }
    };

    calculateEarnings();
  }, [isToday]);

  if (!isToday || isLoading || quizCount === 0) return null;

  return (
    <div className="mb-8 w-full">
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-lg p-6">
        {/* Background Decoration */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50" />

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-3">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>오늘의 수익 리포트</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              오늘{" "}
              <span className="text-purple-600 dark:text-purple-400">
                {quizCount}개
              </span>
              의 퀴즈가 있습니다
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              지금 참여하면 약{" "}
              <span className="font-bold text-slate-900 dark:text-slate-200">
                {totalEarnings.toLocaleString()}원
              </span>
              을 적립할 수 있어요!
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto">
            <div className="flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                1년 예상 적립금
              </span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                {(totalEarnings * 365).toLocaleString()}원
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
