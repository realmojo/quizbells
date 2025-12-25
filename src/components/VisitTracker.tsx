"use client";

import { useEffect } from "react";
import { recordVisit } from "@/utils/visitHistory";

interface VisitTrackerProps {
  type: string;
}

/**
 * 퀴즈 페이지 방문 추적 컴포넌트
 * /quiz/[type]/today 페이지에서 사용
 */
export default function VisitTracker({ type }: VisitTrackerProps) {
  useEffect(() => {
    // 페이지 로드 시 방문 기록 저장
    recordVisit(type);
  }, [type]);

  // UI를 렌더링하지 않음
  return null;
}
