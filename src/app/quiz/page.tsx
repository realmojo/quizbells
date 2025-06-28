// app/page.tsx or any page
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { format, addDays, subDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { quizItems } from "@/utils/utils";
// import { getQuizbellsList } from "@/utils/api";

export default function QuizPage() {
  // const [quizbellsList, setQuizbellsList] = useState<any[]>([]);
  const [date, setDate] = useState(new Date());

  const today = new Date();
  const isToday = format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");

  const handlePrev = () => setDate((prev) => subDays(prev, 1));
  const handleNext = () => {
    if (!isToday) {
      setDate((prev) => addDays(prev, 1));
    }
  };

  // useEffect(() => {
  //   const fetchQuizbellsList = async () => {
  //     const quizbellsList = await getQuizbellsList(format(date, "yyyy-MM-dd"));
  //     setQuizbellsList(quizbellsList);
  //   };
  //   fetchQuizbellsList();
  // }, [date]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* 날짜 선택기 */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" onClick={handlePrev}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="text-xl font-bold">
          {format(date, "yyyy년 MM월 dd일")}
        </div>
        <Button
          variant="outline"
          onClick={handleNext}
          disabled={isToday} // 오늘이면 비활성화
          className={isToday ? "opacity-50 cursor-not-allowed" : ""}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* 퀴즈 카드 그리드 */}
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-2">
        {quizItems.map((quiz) => (
          <Link href={`/quiz/${quiz.type}`} prefetch key={quiz.type}>
            <Card className="hover:shadow-lg transition duration-200 py-0 cursor-pointer">
              <CardContent className="p-0">
                <div className="w-full aspect-square relative overflow-hidden">
                  <Image
                    src={quiz.image}
                    alt={quiz.title}
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
    </div>
  );
}
