"use client";

import { useEffect } from "react";
import { recordVisit } from "@/utils/visitHistory";

interface VisitTrackerProps {
  type: string;
  answerDate?: string; // 선택적: "weekly", "monthly" 등
}

/**
 * 퀴즈 페이지 방문 추적 컴포넌트
 * /quiz/[type]/today, /quiz/[type]/weekly, /quiz/[type]/monthly 페이지에서 사용
 */
export default function VisitTracker({ type, answerDate }: VisitTrackerProps) {
  useEffect(() => {
    // 페이지 로드 시 방문 기록 저장
    recordVisit(type);
  }, [type, answerDate]);

  // UI를 렌더링하지 않음
  return null;
}
