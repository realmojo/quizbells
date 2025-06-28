"use client";
import { use, Suspense } from "react";
import QuizModalClient from "./QuizModalClient";

export default function QuizModalPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = use(params);
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-50 bg-white">모달 로딩중...</div>
      }
    >
      <QuizModalClient type={type} />
    </Suspense>
  );
}
