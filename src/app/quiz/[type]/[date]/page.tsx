import { Metadata } from "next";
import Script from "next/script";
import ImageComponents from "@/components/ImageComponets";
import { format, parseISO } from "date-fns";
import { getQuitItem } from "@/utils/utils";
import Adsense from "@/components/Adsense";
import SocialShare from "@/components/SocialShare";
import AppOpen from "@/components/AppOpen";
import DescriptionComponent from "@/components/DescriptionComponent";
import QuizCardComponent from "@/components/QuizCardComponent";
import { Button } from "@/components/ui/button";
import { getQuizbells } from "@/utils/api";

type QuizPageParams = {
  params: Promise<{
    type: string;
    date: string;
  }>;
};

export async function generateMetadata({
  params,
}: QuizPageParams): Promise<Metadata> {
  // params와 searchParams를 await로 해결
  const { type, date } = await params;
  // const resolvedSearchParams = await searchParams;
  const answerDate = date || new Date().toISOString().split("T")[0];

  const item = getQuitItem(type);
  const typeName = item?.typeKr || type;
  const typeTitle = item?.title || "";
  const dateLabel = answerDate.replace(/-/g, "년 ").replace(/-/, "월 ") + "일";
  const fullTitle = `${typeName} ${typeTitle} ${dateLabel === "today일" ? "오늘" : dateLabel} 퀴즈 정답 확인하고 앱테크 포인트 받으세요 | 퀴즈벨`;
  const description = `${dateLabel === "today일" ? "오늘" : dateLabel} 기준 ${typeName} 퀴즈 정답을 한 눈에 확인하고, 앱테크 리워드를 적립해 보세요. 다양한 퀴즈 이벤트가 매일 업데이트됩니다.`;

  return {
    title: fullTitle,
    description,
    applicationName: "퀴즈벨",
    keywords: [
      "퀴즈 정답",
      "앱테크",
      "포인트 적립",
      "퀴즈벨",
      typeName,
      typeTitle,
      "퀴즈 이벤트",
      "오늘의 퀴즈",
    ],
    openGraph: {
      title: fullTitle,
      description,
      url: `https://quizbells.com/quiz/${type}/${answerDate}`,
      siteName: "퀴즈벨",
      type: "website",
      locale: "ko_KR",
      images: [`https://quizbells.com/images/${type}.png`],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    alternates: {
      canonical: `https://quizbells.com/quiz/${type}/${answerDate}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function QuizPage({ params }: QuizPageParams) {
  const { type, date } = await params;
  const answerDate = date === "today" ? format(new Date(), "yyyy-MM-dd") : date;
  const item = getQuitItem(type);
  const typeName = item?.typeKr || type;
  const typeTitle = item?.title || "";
  const dateLabel = answerDate.replace(/-/g, "년 ").replace(/-/, "월 ") + "일";

  const answerDateString = answerDate
    ? format(parseISO(answerDate), "yyyy년 MM월 dd일")
    : format(new Date(), "yyyy년 MM월 dd일");

  console.log(type, answerDate, item, typeName, typeTitle, dateLabel);

  const h1Title = `${getQuitItem(type)?.typeKr} ${getQuitItem(type)?.title} ${answerDateString} 정답 확인하고 앱테크 적립하세요`;
  const firstDescription = `앱테크는 광고 시청이나 퀴즈 참여를 통해 포인트를 적립하는 방식으로 많은 사용자들의 관심을 받고 있습니다. ${answerDateString} 기준, ${getQuitItem(type)?.typeKr} ${getQuitItem(type)?.title} 등 다양한 앱에서 퀴즈 이벤트가 활발히 진행되고 있으며, 정답을 맞히면 현금처럼 사용 가능한 리워드를 받을 수 있어 앱 사용자들 사이에서 큰 호응을 얻고 있습니다.`;
  const quizItem = await getQuizbells(type, answerDate);

  const contents = JSON.parse(quizItem.contents) || [];

  const jsonLd = contents.map((quiz: any) => ({
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: quiz.question || "질문 없음",
      text: quiz.question || "질문 없음",
      answerCount: 1 + (quiz.otherAnswers?.length || 0),
      acceptedAnswer: {
        "@type": "Answer",
        text: quiz.answer,
        upvoteCount: 100, // 정답 신뢰도 (선택)
        dateCreated: answerDate,
      },
      ...(quiz.otherAnswers?.length > 0 && {
        suggestedAnswer: quiz.otherAnswers.map((alt: any) => ({
          "@type": "Answer",
          text: alt,
          upvoteCount: 10,
          dateCreated: answerDate,
        })),
      }),
    },
  }));

  return (
    <>
      {jsonLd.map((data: any, index: number) => (
        <Script
          id={`jsonld-${type}-${answerDate}`}
          key={`jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      <div className="max-w-[720px] mx-auto pt-4 mb-20">
        <section
          id="quiz-content"
          itemScope
          itemType="https://schema.org/WebPage"
        >
          <h1
            className="text-2xl font-semibold text-gray-900 mb-4 px-4"
            itemProp="headline"
          >
            {h1Title}
          </h1>

          <ImageComponents
            answerDate={answerDateString?.toString() || ""}
            type={type}
            width={600}
            height={600}
          />
          <div className="text-xs text-center mt-2 mb-2 text-gray-500">
            {`${answerDateString} ${getQuitItem(type)?.typeKr} ${getQuitItem(type)?.title} 퀴즈 정답`}
          </div>

          <p
            className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6 px-4"
            itemProp="description"
          >
            {firstDescription}
          </p>

          <Adsense slotId={getQuitItem(type)?.slotId || "8409513997"} />

          {contents.length === 0 && (
            <div className="text-center text-gray-700 px-4 py-10 mb-10">
              <p className="text-lg font-semibold mb-2">
                {answerDateString}
                <br />
                등록된 퀴즈가 아직 없습니다.
              </p>
              <p className="text-sm mb-4">
                곧 정답이 업데이트될 예정입니다. 잠시 후 다시 확인해 주세요.
              </p>
              <p className="text-sm text-gray-500">
                새로운 정답이 올라오면 알려드릴게요! 즐겨찾기 해두시면 편리해요
                😊
              </p>

              <Button
                className="mt-4 w-full px-4 min-h-[50px] text-lg font-semibold"
                onClick={async () => {
                  location.href =
                    "https://play.google.com/store/apps/details?id=com.mojoday.quizbells";
                  // const isGranted = await requestAlarmPermission();
                  // if (isGranted) {
                  //   await setSettings();
                  //   await updateSettings("isQuizAlarm", "Y");
                  //   toast.success("알림 설정 완료");
                  // } else {
                  //   if (isApple()) {
                  //     alert("iOS 브라우저 앱 출시 후 알림을 사용할 수 있습니다.");
                  //   }
                  // }
                }}
              >
                🔔 퀴즈 정답 알림받기
              </Button>
            </div>
          )}

          {/* 퀴즈 목록 */}
          {contents.length > 0 && (
            <article className="mb-6 bg-white px-4 tracking-tight">
              <AppOpen type={type} />
            </article>
          )}

          {contents.map((quiz: any, idx: number) => (
            <article
              key={idx}
              className="mb-6 rounded-lg border mx-4 border-gray-200 bg-white p-5 tracking-tight shadow-sm"
              itemScope
              itemType="https://schema.org/Question"
            >
              <div className="text-xs text-gray-500 mb-1" itemProp="about">
                📌 <span className="ml-1">{quiz.type}</span>
              </div>

              <h2 className="text-lg text-gray-800 mb-2" itemProp="name">
                문제: {quiz.question}
              </h2>

              <div
                className="my-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800 shadow-sm"
                itemProp="acceptedAnswer"
                itemScope
                itemType="https://schema.org/Answer"
              >
                <span className="block text-sm font-semibold text-green-600 mb-1">
                  ✅ 정답
                </span>
                <span itemProp="text" className="text-xl font-bold">
                  {quiz.answer}
                </span>
              </div>

              {quiz.otherAnswers?.length > 0 && (
                <div
                  className="my-3 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-yellow-800 shadow-sm"
                  itemProp="suggestedAnswer"
                  itemScope
                  itemType="https://schema.org/SuggestedAnswer"
                >
                  <span className="block text-sm font-semibold text-yellow-600 mb-1">
                    💡 다른 정답
                  </span>
                  <div className="text-xl font-bold">
                    <span itemProp="text">{quiz.otherAnswers.join(", ")}</span>
                  </div>
                </div>
              )}
            </article>
          ))}

          <article className="mb-6 bg-white px-4 tracking-tight">
            <AppOpen type={type} />
          </article>

          <article className="mb-6 bg-white px-4 tracking-tight">
            <DescriptionComponent type={type} />
          </article>

          <SocialShare
            title={`${getQuitItem(type)?.typeKr} ${getQuitItem(type)?.title} ${answerDateString} 퀴즈 정답 확인하고 앱테크 적립하세요`}
            url={`https://quizbells.com/quiz/${type}/${answerDate}`}
            imageUrl="https://quizbells.com/icons/default-icon.png"
          />

          <article className="mb-6 px-4 bg-white tracking-tight">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              💡 앱테크 퀴즈 목록 ({dateLabel} 기준)
            </h2>
            <QuizCardComponent viewType="list" />
          </article>
        </section>
      </div>
    </>
  );
}
