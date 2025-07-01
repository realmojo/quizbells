// app/quiz/[type]/page.tsx
import { redirect } from "next/navigation";

interface Props {
  params: { type: string };
  searchParams: { answerDate?: string };
}

export default function QuizTypePage({ params, searchParams }: Props) {
  const { type } = params;
  const { answerDate } = searchParams;

  if (!answerDate) {
    // answerDate 없으면 today 등 기본 처리 가능
    redirect(`/quiz/${type}/today`);
  }

  redirect(`/quiz/${type}/${answerDate}`);
}
