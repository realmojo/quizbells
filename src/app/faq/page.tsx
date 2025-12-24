import { Metadata } from "next";
import React from "react";
import { HelpCircle, MessageCircle } from "lucide-react";

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
    <div className="min-h-screen bg-linear-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-950 dark:via-purple-950 dark:to-fuchsia-950">
      <main className="mx-auto max-w-3xl px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 text-sm font-medium mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>궁금한 점이 있으신가요?</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400">
            자주 묻는 질문
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            퀴즈벨 서비스 이용에 도움이 되는 답변들을 모았습니다.
          </p>
        </div>

        {/* FAQ List */}
        <section className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-3xl shadow-sm border border-white/50 dark:border-slate-800 overflow-hidden p-6 md:p-8">
          <div
            className="space-y-4"
            itemScope
            itemType="https://schema.org/FAQPage"
          >
            {faqList.map((faq, index) => (
              <details
                key={index}
                className="group border border-slate-200 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-slate-800/50 open:bg-white dark:open:bg-slate-800 transition-all duration-300"
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none select-none">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 font-bold text-sm">
                      Q
                    </div>
                    <span
                      className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors"
                      itemProp="name"
                    >
                      {faq.question}
                    </span>
                  </div>
                  <div className="transform transition-transform duration-300 group-open:rotate-180">
                    <svg
                      className="w-5 h-5 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </summary>
                <div
                  className="px-6 pb-6 pt-0 ml-12"
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                >
                  <div className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl">
                    <span className="font-bold text-violet-600 dark:text-violet-400 mr-2">
                      A.
                    </span>
                    <span itemProp="text">{faq.answer}</span>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-900/50 px-6 py-3 rounded-full backdrop-blur-sm border border-white/20">
            <MessageCircle className="w-4 h-4" />
            <span>더 궁금한 점이 있으신가요? 고객센터로 문의해주세요.</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-8">
            &copy; {new Date().getFullYear()} 퀴즈벨. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}
