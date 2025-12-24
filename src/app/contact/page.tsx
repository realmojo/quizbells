"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Mail } from "lucide-react";

export default function ContactPage() {
  const [copied, setCopied] = useState(false);
  const email = "quizbells.official@gmail.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    toast.success("이메일 주소가 복사되었습니다.");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center py-20 px-4">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800 relative">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-br from-purple-500 via-indigo-500 to-blue-500" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="p-8 md:p-16 text-center space-y-10 relative z-10">
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto bg-linear-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <Mail className="w-10 h-10 text-purple-600 dark:text-purple-400" />
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-br from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
              Contact Us
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
              광고, 제휴, 기타 문의사항이 있으시다면
              <br />
              아래 이메일로 언제든지 연락주세요.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-6 md:p-8 border border-slate-100 dark:border-slate-800 max-w-xl mx-auto flex flex-col items-center gap-6 group hover:border-purple-200 dark:hover:border-purple-900 transition-colors">
            <div className="w-full text-center">
              <p className="text-sm text-slate-500 dark:text-slate-500 font-medium mb-2">
                Email Address
              </p>
              <p className="text-xl md:text-3xl font-bold text-slate-900 dark:text-white font-mono tracking-tight break-all select-all">
                {email}
              </p>
            </div>
            <button
              onClick={handleCopy}
              className="w-full sm:w-auto min-w-[160px] px-8 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-500 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 rounded-xl font-medium transition-all shadow-sm flex items-center justify-center gap-2 group-hover:shadow-md"
            >
              {copied ? (
                <>
                  <span className="text-green-600 dark:text-green-500 font-bold">
                    Copied!
                  </span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <span className="px-4 py-2 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-sm font-medium border border-purple-100 dark:border-purple-900/50">
              ✨ 광고 문의
            </span>
            <span className="px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-sm font-medium border border-indigo-100 dark:border-indigo-900/50">
              🤝 제휴 제안
            </span>
            <span className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium border border-slate-200 dark:border-slate-700">
              💡 서비스 피드백
            </span>
          </div>

          <div className="text-sm text-slate-500 dark:text-slate-500 mt-2">
            보내주신 메일은 담당자 확인 후 <strong>24시간 이내</strong>에
            회신드립니다.
          </div>
        </div>
      </div>
    </div>
  );
}
