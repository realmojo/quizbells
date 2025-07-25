import Link from "next/link";
import { tips } from "./tipsData";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import Head from "next/head";

export const metadata: Metadata = {
  title: "앱테크 고수되기 - 앱으로 돈버는 꿀팁 총정리",
  description:
    "앱테크 고수가 되는 방법을 소개합니다. 포인트 앱, 퀴즈 이벤트, 광고 시청으로 수익 창출하는 방법부터 꿀팁까지 총정리!",
  openGraph: {
    title: "앱테크 고수되기 - 앱으로 돈버는 꿀팁 총정리",
    description:
      "앱테크로 매달 수익을 만들 수 있는 방법을 하나하나 짚어드립니다. 캐시워크, 오퀴즈, 리브메이트, 앱테크 퀴즈 등 앱 수익화 팁을 확인하세요.",
    type: "article",
    url: "https://quizbells.com/tips",
    images: [
      {
        url: "https://quizbells.com/icons/android-icon-192x192.png",
        width: 192,
        height: 192,
        alt: "앱테크 고수 이미지",
      },
    ],
  },
};

export default function AppTechTipsPage() {
  return (
    <>
      <Head>
        <title>앱테크 고수가 되는 법 - 퀴즈벨 팁 모음</title>
        <meta
          name="description"
          content="앱테크 고수되는 법을 알려드립니다. 퀴즈 정답, 포인트 적립, 광고 시청 등으로 수익을 높이는 노하우를 확인하세요."
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: "앱테크 고수가 되는 법 - 퀴즈벨 팁 모음",
              description:
                "앱테크 초보도 고수처럼 수익을 얻을 수 있는 실전 노하우 제공. 앱으로 돈버는 법, 퀴즈 적립 팁, 광고 시청 리워드 팁 정리.",
              image: "https://quizbells.com/icons/android-icon-192x192.png",
              author: {
                "@type": "Person",
                name: "퀴즈벨",
              },
              publisher: {
                "@type": "Organization",
                name: "Quizbells",
                logo: {
                  "@type": "ImageObject",
                  url: "https://quizbells.com/icons/android-icon-192x192.png",
                },
              },
              mainEntityOfPage: "https://quizbells.com/tips",
              datePublished: "2025-06-30",
            }),
          }}
        ></script>
      </Head>

      <main className="mx-auto max-w-[720px] px-4 py-4 mb-20">
        <h1 className="text-3xl font-bold text-left text-gray-900 pb-4">
          앱테크 고수가 되는 법 - 퀴즈벨이 알려주는 실전 팁
        </h1>
        <Separator />
        <div className="space-y-2 pt-6">
          <p className="text-base text-gray-700 mb-4">
            앱테크로 수익을 올리고 싶은 분들을 위한 실전 팁 모음입니다. 각
            항목을 클릭하면 상세한 노하우와 전략을 확인할 수 있습니다.
          </p>
          <ul className="divide-y divide-gray-200">
            {tips.map((tip: any) => (
              <li key={tip.id} className="py-4">
                <Link href={`/tips/${tip.id}`} className="block group">
                  <span className="text-lg font-semibold text-blue-700 group-hover:underline">
                    {tip.title}
                  </span>
                  <div className="text-gray-600 text-sm mt-1">
                    {tip.description}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    등록일: {tip.date}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
