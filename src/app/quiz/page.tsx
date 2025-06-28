"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

import { format, addDays, subDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { quizItems } from "@/utils/utils";

export default function QuizPage() {
  const [date, setDate] = useState(new Date());

  const today = new Date();
  const isToday = format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");

  const handlePrev = () => setDate((prev) => subDays(prev, 1));
  const handleNext = () => {
    if (!isToday) {
      setDate((prev) => addDays(prev, 1));
    }
  };

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

      <div className="max-w-4xl mx-auto p-4">
        {/* 타이틀 & 설명 */}
        <h1 className="text-2xl font-bold mb-2 text-gray-900">
          📌 오늘의 앱테크 퀴즈 정답 모음
        </h1>
        <p className="mb-6 text-gray-700 text-sm md:text-base leading-relaxed">
          매일매일 쏟아지는 앱테크 퀴즈 정답을 한 곳에 모았습니다. 캐시워크,
          쏠퀴즈, 토스 행운퀴즈 등 다양한 앱의 퀴즈 이벤트에 참여하고, 정답을
          통해 포인트를 빠르게 적립해보세요!
        </p>

        {/* 날짜 선택기 */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" onClick={handlePrev}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="text-xl font-bold">
            {format(date, "yyyy년 M월 d일")}
          </div>
          <Button
            variant="outline"
            onClick={handleNext}
            disabled={isToday}
            className={isToday ? "opacity-50 cursor-not-allowed" : ""}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* 퀴즈 카드 그리드 */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-3">
          {quizItems.map((quiz) => (
            <Link href={`/quiz/${quiz.type}`} prefetch key={quiz.type}>
              <Card className="hover:shadow-lg transition duration-200 py-0 cursor-pointer">
                <CardContent className="p-0">
                  <div className="w-full aspect-square relative overflow-hidden">
                    <Image
                      src={quiz.image}
                      alt={`${quiz.typeKr} 퀴즈 썸네일`}
                      fill
                      sizes="(max-width: 768px) 100vw, 200px"
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <h2 className="text-sm md:text-base lg:text-lg font-semibold p-2 pb-0">
                    {quiz.typeKr}
                  </h2>
                  <div className="text-sm md:text-base lg:text-lg font-semibold px-2 pb-2">
                    {quiz.title}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* 추가 설명 */}
        <section className="mt-10 text-gray-800 text-lg leading-loose tracking-tight mb-10">
          <h2 className="text-xl font-bold mb-4">
            💡 앱테크 퀴즈, 왜 매일 확인해야 할까요?
          </h2>
          <p className="mb-4">
            앱테크는 ‘앱’과 ‘재테크’의 합성어로, 스마트폰 애플리케이션을 통해
            소액 리워드를 쌓는 신개념 재테크 방식입니다. 특히{" "}
            <strong>퀴즈형 이벤트</strong>는 간단한 정답 입력만으로도 포인트를
            쉽게 얻을 수 있어 많은 사용자들이 매일 참여하고 있습니다.
          </p>
          <p className="mb-4">
            이 페이지에서는 <strong>신한쏠퀴즈, 캐시워크, 토스 행운퀴즈</strong>{" "}
            등 다양한 앱의 정답을 매일 업데이트하고 있습니다.{" "}
            <strong>퀴즈벨</strong>은 바쁜 일상 속에서도 정답만 빠르게 확인하고,
            포인트를 적립할 수 있도록 도와 드립니다.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">
            📊 포인트 적립을 놓치지 않는 꿀팁
          </h2>
          <ul className="list-disc list-inside mb-6">
            <li>
              <strong>매일 방문</strong>해서 퀴즈 정답을 빠르게 확인하세요.
            </li>
            <li>
              <strong>앱 알림 설정</strong>을 통해 퀴즈 오픈 시점을 놓치지
              마세요.
            </li>
            <li>
              정답 입력 후 <strong>제출 버튼</strong>을 꼭 눌러야 포인트가
              적립됩니다.
            </li>
            <li>
              일부 퀴즈는 <strong>한정 시간</strong> 또는{" "}
              <strong>선착순</strong>으로 종료됩니다.
            </li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">
            ✅ 이런 분들께 추천합니다
          </h2>
          <ul className="list-disc list-inside">
            <li>
              하루 5분으로 <strong>쏠쏠한 용돈</strong>을 만들고 싶은 분
            </li>
            <li>
              <strong>앱테크 초보자</strong>로 무엇부터 시작할지 고민 중인 분
            </li>
            <li>
              여러 앱을 동시에 쓰며 <strong>정답 찾기에 시간이 부족한</strong>{" "}
              분
            </li>
            <li>
              <strong>정답만 빠르게 보고</strong> 바로 입력하고 싶은 분
            </li>
          </ul>

          <p className="mt-6">
            아래에 나열된 퀴즈 카드들을 클릭하면 각 앱 퀴즈의 정답과 간단한 참여
            방법을 확인할 수 있습니다. 지금 바로 참여하고, 포인트 리워드의
            즐거움을 경험해보세요!
          </p>
        </section>
      </div>
    </>
  );
}
