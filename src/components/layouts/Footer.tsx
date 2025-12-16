"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [isVisibleToken, setIsVisibleToken] = useState(false);

  return (
    <footer className="w-full border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="/images/quizbells_logo.png"
                alt="Quizbells Logo"
                width={40}
                height={40}
                className="rounded-lg shadow-sm"
              />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                QUIZBELLS
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              매일 업데이트되는 앱테크 퀴즈 정답과 <br />
              다양한 리워드 정보를 가장 빠르게 만나보세요.
            </p>
          </div>

          {/* Links Section 1 */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-6">
              서비스
            </h3>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link
                  href="/"
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  홈
                </Link>
              </li>
              <li>
                <Link
                  href="/quiz/toss/today"
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  오늘의 퀴즈
                </Link>
              </li>
              <li>
                <Link
                  href="/posts"
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  커뮤니티
                </Link>
              </li>
              <li>
                <Link
                  href="/tips"
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  앱테크 꿀팁
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Section 2 */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-6">
              고객지원
            </h3>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              {/* <li>
                <Link href="/faq" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  자주 묻는 질문
                </Link>
              </li> */}
              <li>
                <Link
                  href="/contact"
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  광고/제휴 문의
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  서비스 소개
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  이용약관
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-500">
            © {new Date().getFullYear()} Quizbells. All rights reserved.
          </p>

          <div
            className="text-xs text-slate-400 cursor-pointer hover:text-slate-600 transition-colors"
            onDoubleClick={() => setIsVisibleToken(!isVisibleToken)}
          >
            {isVisibleToken ? (
              <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                Token:{" "}
                {typeof window !== "undefined"
                  ? localStorage.getItem("cpnow-auth")?.slice(0, 10) + "..."
                  : ""}
              </span>
            ) : (
              <span>Developer Access</span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
