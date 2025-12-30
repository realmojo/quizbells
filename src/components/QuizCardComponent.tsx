"use client";

import Image from "next/image";
import { format } from "date-fns";
import { quizItems } from "@/utils/utils";
import { Card, CardContent } from "./ui/card";
import { useAppStore } from "@/store/useAppStore";
import { useEffect, useState } from "react";
import { getTodayQuizbells } from "@/utils/api";
import { sortQuizzesByVisitHistory } from "@/utils/visitHistory";
import { Skeleton } from "./ui/skeleton";

interface QuizCardComponentProps {
  viewType?: "grid" | "list" | "image";
}

export default function QuizCardComponent({
  viewType = "grid",
}: QuizCardComponentProps) {
  const date = useAppStore((s) => s.date);
  const today = new Date();
  const isToday = format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
  const answerDate = format(date, "yyyy-MM-dd");

  // 오늘 날짜의 퀴즈 정답 존재 여부 (한 번만 API 호출)
  const [hasAnswers, setHasAnswers] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [hiddenBadges, setHiddenBadges] = useState<Set<string>>(new Set());
  // 정렬된 퀴즈 목록 (정렬 완료 후에만 설정)
  const [sortedQuizItems, setSortedQuizItems] = useState<
    typeof quizItems | null
  >(null);

  const STORAGE_KEY = "hideQuizBadgeDate";

  const setHideBadgeStorage = (dateStr: string, type: string) => {
    if (typeof window === "undefined") return;
    try {
      const key = `${STORAGE_KEY}_${type}`;
      localStorage.setItem(key, dateStr);
    } catch (e) {
      console.error("배지 숨김 상태 저장 실패:", e);
    }
  };

  const getHideBadgeStorage = (type: string): string | null => {
    if (typeof window === "undefined") return null;
    try {
      const key = `${STORAGE_KEY}_${type}`;
      return localStorage.getItem(key);
    } catch (e) {
      console.error("배지 숨김 상태 조회 실패:", e);
      return null;
    }
  };

  // 한국 시간으로 오늘 날짜 계산
  const getKoreaDate = (): string => {
    const now = new Date();
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
    const koreaTime = new Date(utcTime + 9 * 60 * 60 * 1000); // UTC+9
    return format(koreaTime, "yyyy-MM-dd");
  };

  // 정렬된 퀴즈 목록 준비 (마운트 시 한 번만 실행)
  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window === "undefined") return;

    // 정렬 수행
    const sorted = sortQuizzesByVisitHistory(quizItems);
    setSortedQuizItems(sorted);
  }, []);

  // 배지 노출 여부를 로컬스토리지로 제어
  useEffect(() => {
    if (!isToday) {
      setHiddenBadges(new Set());
      return;
    }
    const todayDate = getKoreaDate();
    const hidden = new Set<string>();
    quizItems.forEach((quiz) => {
      const stored = getHideBadgeStorage(quiz.type);
      if (stored === todayDate) {
        hidden.add(quiz.type);
      }
    });
    setHiddenBadges(hidden);
  }, [isToday]);

  useEffect(() => {
    // 오늘 날짜일 때만 API 호출
    if (!isToday) {
      setIsLoading(false);
      return;
    }

    // 한 번만 모든 퀴즈 타입의 정답 존재 여부 확인
    const checkAllAnswers = async () => {
      try {
        const todayDate = getKoreaDate();

        // 한 번의 API 호출로 모든 퀴즈 타입의 오늘 날짜 정답 존재 여부만 조회 (isNew=true)
        const data = (await getTodayQuizbells(todayDate, true)) as Record<
          string,
          boolean
        >;

        // API에서 이미 boolean 값으로 반환되므로 그대로 사용
        setHasAnswers(data);
      } catch (error) {
        console.error("퀴즈 정답 확인 오류:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAllAnswers();
  }, [isToday]);

  const handleCardClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    type: string,
    todayDate: string
  ) => {
    // 배지가 표시되어 있고 아직 숨겨지지 않았다면 배지 숨김 처리
    if (isToday && !isLoading && hasAnswers[type] && !hiddenBadges.has(type)) {
      setHideBadgeStorage(todayDate, type);
      setHiddenBadges((prev) => new Set(prev).add(type));
    }
    // 페이지 이동은 정상적으로 진행됨
  };

  // 정렬이 완료될 때까지 로딩 표시
  if (sortedQuizItems === null) {
    if (viewType === "image") {
      return (
        <div className="grid grid-cols-3 gap-4">
          {quizItems.map((quiz) => (
            <Card
              key={quiz.type}
              className="border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md shadow-sm overflow-hidden rounded-2xl ring-1 ring-slate-900/5 dark:ring-white/10"
            >
              <CardContent className="p-0">
                <div className="w-full aspect-square relative overflow-hidden">
                  <Skeleton className="w-full h-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    return viewType === "grid" ? (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {quizItems.map((quiz) => (
          <Card
            key={quiz.type}
            className="h-full border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md shadow-sm overflow-hidden rounded-2xl ring-1 ring-slate-900/5 dark:ring-white/10"
          >
            <CardContent className="p-0">
              <div className="w-full aspect-square relative overflow-hidden">
                <Skeleton className="w-full h-full" />
              </div>
              <div className="p-4">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    ) : (
      <div className="flex flex-col space-y-4">
        {quizItems.map((quiz) => (
          <Card
            key={quiz.type}
            className="border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md shadow-sm overflow-hidden rounded-xl ring-1 ring-slate-900/5 dark:ring-white/10"
          >
            <CardContent className="flex p-0">
              <div className="relative w-24 h-24 flex-shrink-0">
                <Skeleton className="w-full h-full" />
              </div>
              <div className="flex flex-col justify-center p-4 flex-1">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (viewType === "image") {
    return (
      <div className="grid grid-cols-3 gap-4">
        {sortedQuizItems.map((quiz) => {
          const href = `/quiz/${quiz.type}/${isToday ? "today" : answerDate}`;

          return (
            <a
              href={href}
              key={quiz.type}
              target="_self"
              className="block group"
              onClick={(e) => handleCardClick(e, quiz.type, getKoreaDate())}
            >
              <Card className="border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden rounded-2xl ring-1 ring-slate-900/5 dark:ring-white/10">
                <CardContent className="p-0">
                  <div className="w-full aspect-square relative overflow-hidden">
                    <Image
                      src={quiz.image}
                      alt={`${quiz.typeKr} 퀴즈 썸네일`}
                      fill
                      sizes="(max-width: 768px) 33vw, 200px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      priority
                    />
                    {/* 오늘 정답이 있으면 빨간색 동그라미 배지 표시 */}
                    {isToday &&
                      !isLoading &&
                      hasAnswers[quiz.type] &&
                      !hiddenBadges.has(quiz.type) && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center shadow-lg z-10 animate-pulse ring-2 ring-red-300 ring-offset-2">
                          <span
                            className="text-white font-bold"
                            style={{ fontSize: "10px", marginRight: "1px" }}
                          >
                            N
                          </span>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            </a>
          );
        })}
      </div>
    );
  }

  return viewType === "grid" ? (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {sortedQuizItems.map((quiz) => {
        const href = `/quiz/${quiz.type}/${isToday ? "today" : answerDate}`;

        return (
          <a
            href={href}
            key={quiz.type}
            target="_self"
            className="block group"
            onClick={(e) => handleCardClick(e, quiz.type, getKoreaDate())}
          >
            <Card className="h-full border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden rounded-2xl ring-1 ring-slate-900/5 dark:ring-white/10">
              <CardContent className="p-0">
                <div className="w-full aspect-square relative overflow-hidden">
                  <Image
                    src={quiz.image}
                    alt={`${quiz.typeKr} 퀴즈 썸네일`}
                    fill
                    sizes="(max-width: 768px) 100vw, 200px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* 오늘 정답이 있으면 빨간색 동그라미 배지 표시 */}
                  {isToday &&
                    !isLoading &&
                    hasAnswers[quiz.type] &&
                    !hiddenBadges.has(quiz.type) && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center shadow-lg z-10 animate-pulse ring-2 ring-red-300 ring-offset-2">
                        <span
                          className="text-white font-bold"
                          style={{ fontSize: "10px", marginRight: "1px" }}
                        >
                          N
                        </span>
                      </div>
                    )}
                </div>
                <div className="p-4">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {quiz.typeKr}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {quiz.title}
                  </p>
                </div>
              </CardContent>
            </Card>
          </a>
        );
      })}
    </div>
  ) : (
    <div className="flex flex-col space-y-4">
      {sortedQuizItems.map((quiz) => {
        const href = `/quiz/${quiz.type}/${isToday ? "today" : answerDate}`;

        return (
          <a
            href={href}
            key={quiz.type}
            target="_self"
            className="block group"
            onClick={(e) => handleCardClick(e, quiz.type, getKoreaDate())}
          >
            <Card className="border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden rounded-xl ring-1 ring-slate-900/5 dark:ring-white/10">
              <CardContent className="flex p-0">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image
                    src={quiz.image}
                    alt={`${quiz.typeKr} 퀴즈 썸네일`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    priority
                  />
                  {/* 오늘 정답이 있으면 빨간색 동그라미 배지 표시 */}
                  {isToday &&
                    !isLoading &&
                    hasAnswers[quiz.type] &&
                    !hiddenBadges.has(quiz.type) && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center shadow-lg z-10 animate-pulse ring-2 ring-red-300 ring-offset-1">
                        <span
                          className="text-white font-bold text-xs"
                          style={{ fontSize: "10px", marginRight: "1px" }}
                        >
                          N
                        </span>
                      </div>
                    )}
                </div>
                <div className="flex flex-col justify-center p-4">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {quiz.typeKr}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {quiz.title}
                  </p>
                </div>
              </CardContent>
            </Card>
          </a>
        );
      })}
    </div>
  );
}
