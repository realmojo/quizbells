import {
  Shield,
  Lock,
  Eye,
  Database,
  UserCheck,
  Mail,
  FileText,
} from "lucide-react";
import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-cyan-50 to-sky-50 dark:from-blue-950 dark:via-cyan-950 dark:to-sky-950">
      <main className="mx-auto max-w-3xl px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-sm font-medium mb-2">
            <Shield className="w-4 h-4" />
            <span>개인정보 보호</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-br from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
            개인정보처리방침
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            퀴즈벨은 사용자의 개인정보를 소중하게 생각하며,
            <br className="hidden md:block" /> 안전하게 보호하기 위해 최선을
            다하고 있습니다.
          </p>
        </div>

        {/* Content Card */}
        <article className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-3xl shadow-sm border border-white/50 dark:border-slate-800 overflow-hidden">
          <div className="p-8 md:p-10 space-y-10">
            {/* Intro */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 text-slate-700 dark:text-slate-300 leading-relaxed border border-blue-100 dark:border-blue-800/50">
              <p>
                <strong>퀴즈벨(Quizbell)</strong>은 다양한 앱테크 퀴즈의 정답
                정보를 실시간으로 제공하고, 사용자에게 퀴즈 알림 및 포인트 적립
                정보를 안내하는 서비스입니다. 본 페이지는 개인정보 보호 관련
                사항을 사용자에게 명확히 알리기 위한 목적으로 제공됩니다.
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-10">
              {[
                {
                  icon: Database,
                  title: "1. 수집하는 개인정보 항목",
                  content: (
                    <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 ml-2">
                      <li>FCM 푸시 알림용 디바이스 토큰</li>
                      <li>사용자가 선택한 퀴즈 유형(type) 및 알림 설정 값</li>
                    </ul>
                  ),
                },
                {
                  icon: Eye,
                  title: "2. 개인정보 수집 목적",
                  content: (
                    <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 ml-2">
                      <li>퀴즈 정답 알림 및 앱테크 정보 푸시 알림 제공</li>
                      <li>사용자 맞춤형 퀴즈 추천 서비스 운영</li>
                      <li>시스템 오류 분석 및 사용성 개선을 위한 통계 분석</li>
                    </ul>
                  ),
                },
                {
                  icon: FileText,
                  title: "3. 개인정보 보유 및 이용 기간",
                  content: (
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      수집된 정보는 푸시 알림 및 서비스 제공을 위한 최소한의
                      기간 동안만 보유되며, 사용자가 알림 수신을 중단하거나
                      서비스 탈퇴 시 즉시 파기됩니다.
                    </p>
                  ),
                },
                {
                  icon: Lock,
                  title: "4. 개인정보 제3자 제공",
                  content: (
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      퀴즈벨은 사용자의 개인정보를 제3자에게 제공하지 않습니다.
                      단, 관계 법령에 따라 수사기관의 요청이 있는 경우에는 관련
                      법률에 따라 제공될 수 있습니다.
                    </p>
                  ),
                },
                {
                  icon: UserCheck,
                  title: "5. 사용자 권리 및 행사 방법",
                  content: (
                    <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 ml-2">
                      <li>언제든지 푸시 알림 수신 동의/철회가 가능합니다.</li>
                      <li>서비스 탈퇴 시 개인정보는 자동으로 삭제됩니다.</li>
                      <li>
                        기타 개인정보 열람, 수정, 삭제 요청은 이메일로 접수
                        가능합니다.
                      </li>
                    </ul>
                  ),
                },
                {
                  icon: Mail,
                  title: "6. 개인정보 보호책임자 안내",
                  content: (
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                      <p className="text-slate-600 dark:text-slate-400 mb-2">
                        개인정보 관련 문의는 아래 이메일로 접수해 주세요.
                      </p>
                      <a
                        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:underline"
                        href="mailto:quizbells.official@gmail.com"
                      >
                        <Mail className="w-4 h-4" />
                        quizbells.official@gmail.com
                      </a>
                      <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                        문의사항은 신속히 검토 및 처리해드리겠습니다.
                      </p>
                    </div>
                  ),
                },
              ].map((section, index) => (
                <section key={index} className="relative pl-8 md:pl-0">
                  <div className="md:flex gap-6">
                    <div className="hidden md:flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm z-10">
                        <section.icon className="w-5 h-5" />
                      </div>
                      {index !== 5 && (
                        <div className="w-px h-full bg-slate-200 dark:bg-slate-800 my-2" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3 md:block">
                        <span className="md:hidden w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm">
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
