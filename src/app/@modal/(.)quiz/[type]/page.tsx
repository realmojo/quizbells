"use client";

import { use, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import QuizModalClient from "./QuizModalClient";

export default function QuizModalPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = use(params);

  // 쿼리스트링에서 answerDate 가져오기
  const searchParams = useSearchParams();
  const queryDate = searchParams?.get("answerDate");

  // answerDate가 없으면 오늘 날짜 (yyyy-MM-dd)
  const answerDate = queryDate || format(new Date(), "yyyy-MM-dd");

  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-50 bg-white">
          데이터를 가져오고 있습니다.
        </div>
      }
    >
      <QuizModalClient type={type} date={answerDate} />
    </Suspense>
  );
}
