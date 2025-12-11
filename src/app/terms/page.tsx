import {
  FileText,
  Scale,
  Users,
  ShieldAlert,
  HelpCircle,
  RefreshCw,
  BookOpen,
  Gavel,
} from "lucide-react";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "퀴즈벨 이용약관 - 앱테크 퀴즈 정답 알림 서비스",
  description:
    "퀴즈벨(Quizbells)의 이용약관 안내 페이지입니다. 퀴즈 정답 제공 및 서비스 이용 시 유의사항과 권리·의무를 확인하세요.",
  openGraph: {
    title: "퀴즈벨 이용약관",
    description:
      "퀴즈벨 서비스 이용과 관련된 사용자 권리 및 의무, 책임에 대한 약관을 안내합니다.",
    url: "https://quizbells.com/terms",
    type: "website",
  },
  alternates: {
    canonical: "https://quizbells.com/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-slate-50 dark:from-indigo-950 dark:via-blue-950 dark:to-slate-950">
      <main className="mx-auto max-w-3xl px-4 py-12 mb-20">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-sm font-medium mb-2">
            <Scale className="w-4 h-4" />
            <span>서비스 이용 약관</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400">
            이용약관
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            퀴즈벨 서비스 이용을 위한 약관을 안내해 드립니다.
          </p>
        </div>

        {/* Content Card */}
        <article className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-3xl shadow-sm border border-white/50 dark:border-slate-800 overflow-hidden">
          <div className="p-8 md:p-10 space-y-10">
            {/* Intro */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-6 text-slate-700 dark:text-slate-300 leading-relaxed border border-indigo-100 dark:border-indigo-800/50">
              <p>
                본 약관은 <strong>퀴즈벨(이하 회사)</strong>이 제공하는 퀴즈
                정답 알림 서비스(이하 서비스)의 이용과 관련하여 회사와 사용자
                간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을
                목적으로 합니다.
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-10">
              {[
                {
                  icon: Gavel,
                  title: "1. 목적",
                  content: (
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      본 약관은 퀴즈벨(이하 회사)이 제공하는 퀴즈 정답 알림
                      서비스(이하 서비스)의 이용과 관련하여 회사와 사용자 간의
                      권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을
                      목적으로 합니다.
                    </p>
                  ),
                },
                {
                  icon: BookOpen,
                  title: "2. 정의",
                  content: (
                    <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 ml-2">
                      <li>
                        서비스란 회사가 운영하는 웹사이트 및 모바일 앱을 통해
                        퀴즈 정답 및 알림 정보를 제공하는 행위를 의미합니다.
                      </li>
                      <li>
                        사용자란 본 약관에 따라 서비스를 이용하는 개인 또는
                        법인을 의미합니다.
                      </li>
                    </ul>
                  ),
                },
                {
                  icon: FileText,
                  title: "3. 서비스 제공",
                  content: (
                    <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 ml-2">
                      <li>
                        회사는 사용자에게 퀴즈 정답, 푸시 알림, 퀴즈 검색 및
                        기록 기능 등을 제공합니다.
                      </li>
                      <li>
                        서비스는 기본적으로 무료로 제공되며, 일부 기능에 대해
                        광고가 포함될 수 있습니다.
                      </li>
                    </ul>
                  ),
                },
                {
                  icon: Users,
                  title: "4. 이용자의 의무",
                  content: (
                    <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 ml-2">
                      <li>
                        서비스를 악의적으로 이용하거나 방해해서는 안 됩니다.
                      </li>
                      <li>
                        타인의 개인정보를 무단으로 수집하거나 저장·공유해서는 안
                        됩니다.
                      </li>
                      <li>
                        서비스와 관련된 지적 재산권은 회사에 귀속되며, 무단
                        복제·배포를 금지합니다.
                      </li>
                    </ul>
                  ),
                },
                {
                  icon: ShieldAlert,
                  title: "5. 책임의 제한",
                  content: (
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      회사는 무료로 제공되는 서비스와 관련하여, 서비스의 중단,
                      오류, 누락, 손해 등에 대해 법적 책임을 지지 않습니다. 단,
                      서비스의 안정적인 제공을 위해 최선을 다합니다.
                    </p>
                  ),
                },
                {
                  icon: Scale,
                  title: "6. 개인정보 보호",
                  content: (
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      회사는 개인정보 보호법 등 관계 법령을 준수하며, 사용자의
                      개인정보는 개인정보처리방침에 따라 보호됩니다. 사용자는{" "}
                      <a
                        href="/privacy"
                        className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                      >
                        개인정보처리방침
                      </a>
                      을 반드시 숙지해야 합니다.
                    </p>
                  ),
                },
                {
                  icon: RefreshCw,
                  title: "7. 약관의 변경",
                  content: (
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      회사는 관련 법령의 변경이나 서비스 개선을 위해 약관을
                      수정할 수 있으며, 변경 사항은 사이트 공지 또는 이메일을
                      통해 사전 안내합니다.
                    </p>
                  ),
                },
                {
                  icon: HelpCircle,
                  title: "8. 문의처",
                  content: (
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                      <p className="text-slate-600 dark:text-slate-400 mb-2">
                        본 약관과 관련된 문의사항은 아래 이메일로 접수해 주세요.
                      </p>
                      <a
                        className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                        href="mailto:quizbell.help@gmail.com"
                      >
                        quizbell.help@gmail.com
                      </a>
                    </div>
                  ),
                },
              ].map((section, index) => (
                <section key={index} className="relative pl-8 md:pl-0">
                  <div className="md:flex gap-6">
                    <div className="hidden md:flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm z-10">
                        <section.icon className="w-5 h-5" />
                      </div>
                      {index !== 7 && (
                        <div className="w-px h-full bg-slate-200 dark:bg-slate-800 my-2" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3 md:block">
                        <span className="md:hidden w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-sm">
                          <section.icon className="w-4 h-4" />
                        </span>
                        {section.title}
                      </h2>
                      {section.content}
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </div>
        </article>

        <div className="mt-12 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} 퀴즈벨. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}
