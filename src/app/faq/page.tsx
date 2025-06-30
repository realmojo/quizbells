import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "자주 묻는 질문 - 퀴즈벨(Quizbells) FAQ",
  description:
    "앱테크 퀴즈 정답 알림 서비스 퀴즈벨에 대한 자주 묻는 질문을 확인하세요. 푸시 알림, 앱 설치 방법, 과거 퀴즈 검색 등 사용자 안내 FAQ 제공.",
  keywords: [
    "퀴즈벨",
    "FAQ",
    "자주 묻는 질문",
    "앱테크",
    "앱 설치",
    "푸시 알림",
    "퀴즈 정답",
    "오퀴즈",
    "리브메이트",
    "캐시워크",
  ],
  openGraph: {
    title: "퀴즈벨 FAQ - 자주 묻는 질문",
    description:
      "앱테크 유저를 위한 퀴즈 정답 실시간 알림 서비스 퀴즈벨의 자주 묻는 질문을 모았습니다. 설치, 알림, 정답 확인 관련 안내.",
    url: "https://quizbells.com/faq",
    type: "website",
    images: [
      {
        url: "https://quizbells.com/icons/android-icon-192x192.png",
        width: 192,
        height: 192,
        alt: "퀴즈벨 로고",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "퀴즈벨 FAQ",
    description:
      "앱테크 퀴즈 알림 서비스 퀴즈벨의 설치, 사용 방법, 알림 문제 등 자주 묻는 질문 모음.",
    images: ["https://quizbells.com/icons/android-icon-192x192.png"],
  },
  metadataBase: new URL("https://quizbells.com"),
};

export default function FAQPage() {
  const faqList = [
    {
      question: "퀴즈벨은 어떤 앱인가요?",
      answer:
        "퀴즈벨은 캐시워크, 오퀴즈, 리브메이트 등의 앱테크 퀴즈 정답을 실시간으로 받아볼 수 있는 알림 서비스입니다.",
    },
    {
      question: "푸시 알림이 오지 않아요. 어떻게 하나요?",
      answer:
        "브라우저 또는 안드로이드 앱의 알림 권한이 허용되어 있는지 확인해주세요. 또한 배터리 절전 설정이 알림을 차단할 수 있으니 확인이 필요합니다.",
    },
    {
      question: "앱 설치는 어떻게 하나요?",
      answer:
        "현재 안드로이드 기반 웹앱으로 제공 중이며, 퀴즈벨 홈페이지 접속 시 설치 배너가 표시됩니다. iOS의 경우 Safari에서 홈화면에 추가해 이용하실 수 있습니다.",
    },
    {
      question: "과거 퀴즈 정답도 확인할 수 있나요?",
      answer:
        "네, 퀴즈벨에서는 달력 기능을 통해 원하는 날짜의 퀴즈 정답을 확인할 수 있습니다.",
    },
    {
      question: "퀴즈 정답은 언제쯤 올라오나요?",
      answer:
        "보통 오전 9시부터 11시 사이에 실시간으로 퀴즈 정답이 등록됩니다. 상황에 따라 일부 지연될 수 있습니다.",
    },
    {
      question: "회원가입이 필요한가요?",
      answer:
        "아닙니다. 퀴즈벨은 별도의 회원가입 없이도 퀴즈 정답 확인과 알림 수신이 가능합니다.",
    },
    {
      question: "서비스 이용에 요금이 발생하나요?",
      answer:
        "퀴즈벨은 무료로 제공되는 서비스입니다. 광고를 통해 수익이 발생하며, 유료 기능은 없습니다.",
    },
  ];

  return (
    <main className="max-w-[860] mx-auto px-2 py-12 mb-10 ">
      <Card>
        <CardContent className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ❓ 자주 묻는 질문 (FAQ)
          </h1>

          <Separator />

          <div
            className="space-y-6 text-gray-800"
            itemScope
            itemType="https://schema.org/FAQPage"
          >
            {faqList.map((faq, index) => (
              <React.Fragment key={index}>
                <div
                  itemProp="mainEntity"
                  itemScope
                  itemType="https://schema.org/Question"
                >
                  <strong itemProp="name">Q. {faq.question}</strong>
                  <div
                    itemProp="acceptedAnswer"
                    itemScope
                    itemType="https://schema.org/Answer"
                  >
                    <p itemProp="text">A. {faq.answer}</p>
                  </div>
                </div>
                <Separator />
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
