// app/about/page.tsx
import { Metadata } from "next";
import {
  Bell,
  CheckCircle2,
  Heart,
  Lightbulb,
  MessageCircle,
  Rocket,
  Search,
  Smartphone,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "퀴즈벨 소개 - 앱테크 퀴즈 정답 실시간 알림 서비스",
  description:
    "퀴즈벨은 매일 앱테크 퀴즈 정답을 실시간으로 알려주는 퀴즈 알림 서비스입니다. 캐시워크, 오퀴즈, 리브메이트 등 다양한 퀴즈를 빠르게 확인하세요.",
  keywords: [
    "퀴즈벨",
    "앱테크",
    "퀴즈 정답",
    "캐시워크",
    "오퀴즈",
    "리브메이트",
    "포인트 적립",
    "실시간 퀴즈 알림",
    "FCM 푸시",
    "퀴즈 앱",
  ],
  openGraph: {
    title: "퀴즈벨 - 앱테크 퀴즈 정답 알림 서비스",
    description:
      "매일 실시간으로 퀴즈 정답을 확인하고, 푸시 알림으로 빠르게 받아보세요. 퀴즈벨은 캐시워크, 오퀴즈, 리브메이트 등 다양한 앱을 지원합니다.",
    url: "https://quizbells.com/about",
    type: "website",
    images: [
      {
        url: "https://quizbells.com/icons/android-icon-192x192.png",
        width: 192,
        height: 192,
        alt: "퀴즈벨 아이콘",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "퀴즈벨 소개",
    description:
      "앱테크 유저를 위한 퀴즈 정답 실시간 알림 서비스 - 캐시워크, 오퀴즈, 리브메이트 등을 한곳에!",
    images: ["https://quizbells.com/icons/android-icon-192x192.png"],
  },
  metadataBase: new URL("https://quizbells.com"),
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-green-50 dark:from-emerald-950 dark:via-teal-950 dark:to-green-950">
      <main className="mx-auto max-w-3xl px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 text-sm font-medium mb-2">
            <Rocket className="w-4 h-4" />
            <span>앱테크의 시작</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-br from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">
            퀴즈벨 소개
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            매일 쏟아지는 퀴즈 정답, 퀴즈벨과 함께라면 놓치지 않습니다.
          </p>
        </div>

        <div className="space-y-8">
          {/* Intro Card */}
          <section className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-white/50 dark:border-slate-800">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  스마트한 앱테크 파트너
                </h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  <strong className="text-emerald-600 dark:text-emerald-400">
                    퀴즈벨(Quizbells)
                  </strong>
                  은 다양한 앱테크 플랫폼의 퀴즈 정답을 실시간으로 알려주는
                  서비스입니다. 매일 아침 빠르게 퀴즈를 확인하고 싶거나, 퀴즈
                  적중률을 높이고 싶은 분들에게 최적화된 플랫폼이에요.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {["실시간 알림", "빠른 정답", "편리한 UI"].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="w-full md:w-1/3 flex justify-center">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 bg-linear-to-br from-emerald-200 to-teal-200 dark:from-emerald-800 dark:to-teal-800 rounded-full blur-2xl opacity-50 animate-pulse" />
                  <div className="relative w-full h-full bg-linear-to-br from-emerald-500 to-teal-500 rounded-3xl rotate-6 flex items-center justify-center shadow-xl">
                    <Sparkles className="w-16 h-16 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            <section className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-white/50 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-500" />
                주요 기능
              </h2>
              <ul className="space-y-4">
                {[
                  {
                    icon: Bell,
                    text: "실시간 정답 푸시 알림",
                    desc: "정답이 뜨자마자 바로 알려드려요",
                  },
                  {
                    icon: Search,
                    text: "과거 퀴즈 검색",
                    desc: "지난 퀴즈 데이터도 쉽게 찾아보세요",
                  },
                  {
                    icon: Lightbulb,
                    text: "적중률 높이는 팁",
                    desc: "퀴즈 고수가 되는 노하우 제공",
                  },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {item.text}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {item.desc}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-white/50 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" />
                추구하는 가치
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                퀴즈벨은 단순히 정답을 전달하는 서비스가 아니라, 사용자와 함께
                성장하는 앱테크 파트너가 되고자 합니다.
              </p>
              <div className="space-y-3">
                {[
                  "정확하고 빠른 정보 제공",
                  "편리한 사용자 인터페이스",
                  "효율적인 시간 관리 도구",
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Usage Steps */}
          <section className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-white/50 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-blue-500" />
              이용 방법 안내
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { step: "01", text: "웹사이트 접속 또는 앱 설치" },
                { step: "02", text: "원하는 퀴즈 카테고리 탐색" },
                { step: "03", text: "실시간 정답 알림 허용" },
                { step: "04", text: "정답 입력하고 포인트 적립" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 text-center group hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                >
                  <div className="text-2xl font-black text-slate-200 dark:text-slate-700 mb-2 group-hover:text-emerald-200 dark:group-hover:text-emerald-800 transition-colors">
                    {item.step}
                  </div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 text-center mt-6 bg-slate-100 dark:bg-slate-800 py-2 px-4 rounded-full inline-block mx-auto w-full">
              * Android에서는 설치 시 앱처럼 실행되며, iOS는 Safari 홈화면 추가
              기능을 활용하세요.
            </p>
          </section>

          {/* Reviews */}
          <section className="bg-linear-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-lg">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Users className="w-5 h-5" />
              사용자 후기
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "매일 아침 퀴즈벨 덕분에 시간을 절약해요! 포인트 쏠쏠하게 모으는 재미도 있어요.",
                "여러 앱을 왔다갔다 할 필요 없이 한 곳에서 퀴즈를 확인할 수 있어 너무 편리해요.",
              ].map((review, i) => (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20"
                >
                  <MessageCircle className="w-6 h-6 mb-3 opacity-80" />
                  <p className="text-sm leading-relaxed opacity-90">{review}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-12 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} 퀴즈벨. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}
