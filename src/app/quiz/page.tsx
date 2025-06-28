// app/page.tsx or any page
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { format, addDays, subDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

const quizList = [
  {
    id: 1,
    type: "toss",
    title: "토스 행운퀴즈",
    image: "/images/toss.png",
  },
  {
    id: 5,
    type: "cashwalk",
    title: "캐시워크 돈버는퀴즈",
    image: "/images/cashwalk.png",
  },
  {
    id: 4,
    type: "kakaobank",
    title: "카카오뱅크 OX퀴즈",
    image: "/images/kakaobank.png",
  },
  {
    id: 6,
    type: "kakaopay",
    title: "카카오페이 퀴즈타임",
    image: "/images/kakaopay.png",
  },
  {
    id: 2,
    type: "hanabank",
    title: "하나은행 퀴즈하나",
    image: "/images/quizhana.png",
    description1:
      "본 이벤트는 하나은행의 사정에 따라 내용이 변경되거나 종료될 수 있습니다.(단 기조건 충족 손님 제외)",
    description2:
      "매일 퀴즈HANA 정답을 맞히시면 5~10,000개의 원큐볼이 랜덤으로 즉시 적립됩니다. (1인/1회 참여가능)",
    description3:
      "원큐볼 지급 개수는 변경될 수 있으며, 적립된 원큐볼은 락커룸 > 원큐볼에서 확인 가능합니다.",
    description4:
      "이벤트 관련 자세한 사항은 하나은행 고객센터(1599-1111)로 문의 바랍니다.",
    description:
      "보유 원큐볼은 2025년 1월 2일부터 하나머니로 전환 후 사용 가능합니다. (1회 전환: 최소 100개 ~ 최대 30,000개 / 1일 최대 500,000개 전환 가능) * 2024년 6월 11일 부터 2024년 12월 10일 18시까지 적립된 원큐볼은 2024년 12월 10일 자정 리셋 되었습니다. * 2024년 12월 11일 이후 확인되는 원큐볼은 2025년 12월 10일까지만 유효합니다. (2024년 12월 10일 18시 이후 적립 분)",
  },
  {
    id: 3,
    type: "kbstar",
    title: "도전미션 스타퀴즈",
    image: "/images/kbstar.png",
  },
];

export default function QuizPage() {
  const [date, setDate] = useState(new Date());

  const handlePrev = () => setDate((prev) => subDays(prev, 1));
  const handleNext = () => setDate((prev) => addDays(prev, 1));

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* 날짜 선택기 */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={handlePrev}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="text-xl font-bold">
          {format(date, "yyyy년 MM월 dd일")}
        </div>
        <Button variant="ghost" onClick={handleNext}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* 퀴즈 카드 그리드 */}
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-3">
        {quizList.map((quiz) => (
          <Link href={`/quiz/${quiz.type}`} prefetch key={quiz.type}>
            <Card className="hover:shadow-lg transition duration-200 py-0 cursor-pointer">
              <CardContent className="p-0">
                <div className="w-full aspect-square relative overflow-hidden">
                  <Image
                    src={quiz.image}
                    alt={quiz.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 200px"
                    className="object-cover"
                  />
                </div>
                <div className="text-sm md:text-base lg:text-lg font-semibold p-2">
                  {quiz.title}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
