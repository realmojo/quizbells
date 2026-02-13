import { Metadata } from "next";

export const metadata: Metadata = {
  title: "콘텐츠 - 금융, 세금, 앱테크 실생활 정보 모음 | 퀴즈벨",
  description:
    "금융, 세금, 정부지원, 앱테크, 건강, 쇼핑 등 실생활에 도움되는 정보를 한곳에서 확인하세요. 퀴즈벨이 엄선한 유용한 콘텐츠 모음입니다.",
  keywords: [
    "금융 정보",
    "세금 절약",
    "정부지원금",
    "앱테크 팁",
    "재테크 정보",
    "퀴즈벨",
    "생활 꿀팁",
  ],
  openGraph: {
    title: "콘텐츠 - 금융, 세금, 앱테크 실생활 정보 모음 | 퀴즈벨",
    description:
      "금융, 세금, 정부지원, 앱테크 등 실생활에 도움되는 정보를 한곳에서 확인하세요.",
    url: "https://quizbells.com/posts",
    siteName: "퀴즈벨",
    type: "website",
    locale: "ko_KR",
    images: [
      {
        url: "https://quizbells.com/icons/og-image.png",
        width: 1200,
        height: 630,
        alt: "퀴즈벨 콘텐츠 - 실생활 정보 모음",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "콘텐츠 - 금융, 세금, 앱테크 실생활 정보 모음 | 퀴즈벨",
    description:
      "금융, 세금, 정부지원, 앱테크 등 실생활에 도움되는 정보를 한곳에서 확인하세요.",
    images: ["https://quizbells.com/icons/og-image.png"],
  },
  alternates: {
    canonical: "https://quizbells.com/posts",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
