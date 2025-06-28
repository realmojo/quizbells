import QuizModalPage from "@/app/@modal/(.)quiz/[type]/QuizModalClient";

type PageProps = {
  params: {
    type: string;
  };
};

export default async function QuizPage({ params }: PageProps) {
  // 이 위치에서 params 사용은 OK (함수가 async이기 때문에)
  return <QuizModalPage type={params.type} />;
}
