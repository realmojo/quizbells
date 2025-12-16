import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "네이버 카페 글쓰기 - 관리자",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function NaverCafeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
