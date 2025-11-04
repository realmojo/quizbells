import PostComponent from "@/components/PostComponent";
import { getPost } from "@/utils/api";
import { getPlainTextFromFirstParagraph, getQuitItem } from "@/utils/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);
  const firstParagraph = getPlainTextFromFirstParagraph(post.contents);
  const publishedDate = post.regdated || "";
  const typeKr = getQuitItem(post.type)?.typeKr || post.type;
  const pageTitle = `${post.title} | 퀴즈벨`;
  const pageDescription =
    firstParagraph || `${publishedDate} ${typeKr} 퀴즈 콘텐츠`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      `${typeKr} 퀴즈`,
      "퀴즈벨",
      "퀴즈 콘텐츠",
      "앱테크",
      "포인트 퀴즈",
    ],
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      type: "article",
      url: `https://quizbells.com/posts/${post.id}`,
      siteName: "퀴즈벨",
      publishedTime: post.regdated,
      authors: [post.author],
      images: [
        {
          url: `https://quizbells.com/images/${post.type}.png`,
          width: 1200,
          height: 630,
          alt: `${typeKr} 퀴즈 썸네일`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      creator: "@quizbells",
      images: [`https://quizbells.com/images/${post.type}.png`],
    },
    alternates: {
      canonical: `https://quizbells.com/posts/${post.id}`,
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PostComponent id={id} />;
}
