// ✅ 타입 생략: Next.js가 알아서 처리
import { redirect } from "next/navigation";

export default function QuizTypePage({ params, searchParams }: {
  params: { type: string };
  searchParams: { answerDate: string };
}) {
  const { type } = params;
  const answerDate = searchParams?.answerDate;

  if (!answerDate) {
    redirect(`/quiz/${type}/today`);
  }

  redirect(`/quiz/${type}/${answerDate}`);
}
