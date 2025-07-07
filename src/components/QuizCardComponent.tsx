"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { quizItems } from "@/utils/utils";
import { Card, CardContent } from "./ui/card";
import { useAppStore } from "@/store/useAppStore";

interface QuizCardComponentProps {
  viewType?: "grid" | "list";
}

export default function QuizCardComponent({
  viewType = "grid",
}: QuizCardComponentProps) {
  const date = useAppStore((s) => s.date);
  const today = new Date();
  const isToday = format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
  const answerDate = format(date, "yyyy-MM-dd");

  return viewType === "grid" ? (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {quizItems.map((quiz) => {
        const href = `/quiz/${quiz.type}/${isToday ? "today" : answerDate}`;

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
                    priority
                  />
                </div>
                <h2 className="text-sm md:text-base line-clamp-1 lg:text-lg font-semibold p-2 pb-0">
                  {quiz.typeKr}
                </h2>
                <div className="text-sm md:text-xs line-clamp-1 lg:text-xs font-normal px-2 pb-2">
                  {quiz.title}
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  ) : (
    <div className="flex flex-col space-y-4">
      {quizItems.map((quiz) => {
        const href = `/quiz/${quiz.type}/${isToday ? "today" : answerDate}`;

        return (
          <Link href={href} prefetch key={quiz.type}>
            <Card className="gap-0 py-0 hover:shadow-lg transition duration-200 cursor-pointer">
              <CardContent className="flex p-0 space-x-4">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={quiz.image}
                    alt={`${quiz.typeKr} 퀴즈 썸네일`}
                    fill
                    className="object-cover rounded-md"
                    priority
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h2 className="text-base lg:text-lg font-semibold">
                    {quiz.typeKr}
                  </h2>
                  <div className="text-sm lg:text-base text-gray-600">
                    {quiz.title}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
