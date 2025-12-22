import { redirect } from "next/navigation";

export const runtime = 'edge';

export default async function QuizTypePage({ 
  params, 
  searchParams 
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ answerDate?: string }>;
}) {
  const { type } = await params;
  const { answerDate } = await searchParams;

  if (!answerDate) {
    redirect(`/quiz/${type}/today`);
  }

  redirect(`/quiz/${type}/${answerDate}`);
}