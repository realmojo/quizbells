"use client";

import Image from "next/image";
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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {quizItems.map((quiz) => {
        const href = `/quiz/${quiz.type}/${isToday ? "today" : answerDate}`;

        return (
          <a
            href={href}
            key={quiz.type}
            target="_self"
            className="block group"
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
      {quizItems.map((quiz) => {
        const href = `/quiz/${quiz.type}/${isToday ? "today" : answerDate}`;

        return (
          <a
            href={href}
            key={quiz.type}
            target="_self"
            className="block group"
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
