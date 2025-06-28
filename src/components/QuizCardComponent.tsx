"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { quizItems } from "@/utils/utils";
import { Card, CardContent } from "./ui/card";
import { useAppStore } from "@/store/useAppStore";

export default function QuizCardComponent() {
  const date = useAppStore((s) => s.date);
  const today = new Date();
  const isToday = format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
  const answerDate = format(date, "yyyy-MM-dd");

  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-3">
      {quizItems.map((quiz) => {
        const href = isToday
          ? `/quiz/${quiz.type}`
          : `/quiz/${quiz.type}?answerDate=${answerDate}`;

        return (
          <Link href={href} prefetch key={quiz.type}>
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
                <div className="text-sm md:text-base lg:text-lg font-normal px-2 pb-2">
                  {quiz.title}
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
