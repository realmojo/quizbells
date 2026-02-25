import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "문의하기 - 퀴즈벨(Quizbells) Contact",
  description:
    "퀴즈벨 광고, 제휴, 서비스 피드백 등 문의사항은 이메일로 연락해 주세요. 24시간 이내 회신드립니다.",
  openGraph: {
    title: "퀴즈벨 문의하기",
    description:
      "광고, 제휴, 기타 문의사항이 있으시다면 이메일로 연락해 주세요.",
    url: "https://quizbells.com/contact",
    type: "website",
  },
  alternates: {
    canonical: "https://quizbells.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
