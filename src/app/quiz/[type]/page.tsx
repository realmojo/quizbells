// app/quiz/[type]/page.tsx

import { redirect } from "next/navigation";

export default function Page({
  params,
  searchParams,
}: {
  params: { type: string };
  searchParams: { answerDate?: string };
}) {
  const { type } = params;
  const { answerDate } = searchParams;

  if (!answerDate) {
    redirect(`/quiz/${type}/today`);
  }

  redirect(`/quiz/${type}/${answerDate}`);
}
