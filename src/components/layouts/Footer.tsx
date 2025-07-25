"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [isVisibleToken, setIsVisibleToken] = useState(false);

  return (
    <footer className="w-full border-t bg-white py-6">
      <div className="container mx-auto px-4 text-center text-sm text-gray-700">
        {/* 로고 및 개발자 토큰 */}
        <div className="mb-3 flex justify-center">
          <Image
            src="/icons/android-icon-72x72.png"
            alt="퀴즈벨 로고"
            width={32}
            height={32}
            priority
            onDoubleClick={() => {
              setIsVisibleToken(true);
            }}
          />
        </div>
        {isVisibleToken && (
          <div className="text-xs text-gray-500 mb-2">
            <p>Token: {localStorage.getItem("cpnow-auth")}</p>
          </div>
        )}

        {/* 네비게이션 바 */}
        <nav className="mt-4 flex justify-center gap-6 text-sm">
          <Link href="/" className="hover:underline">
            홈
          </Link>
          <Link href="/tips" className="hover:underline">
            팁
          </Link>
          <Link href="/quiz" className="hover:underline">
            퀴즈
          </Link>
          <Link href="/posts" className="hover:underline">
            포스트
          </Link>
          <Link
            href="/tips"
            className="hover:underline font-semibold text-blue-700"
          >
            앱테크 팁
          </Link>
        </nav>

        {/* 브랜드 설명 */}
        <p className="leading-relaxed text-sm text-gray-700">
          <strong>퀴즈벨(Quizbell)</strong>은 퀴즈 정답과 앱테크 정보를
          실시간으로 제공하는 서비스입니다. 다양한 퀴즈 유형을 빠르게 확인하고,
          포인트 리워드를 효율적으로 적립하세요. 퀴즈벨은 여러분의 스마트한 N잡
          생활을 응원합니다.
        </p>

        {/* 카피라이트 */}
        <p className="mt-2 text-xs text-gray-400">
          © 2025 퀴즈벨(Quizbell). All rights reserved.
        </p>

        {/* 링크: 개인정보처리방침 */}
        <div className="mt-3">
          <Link
            href="/privacy"
            className="text-xs text-gray-500 hover:underline"
          >
            개인정보처리방침 보기
          </Link>
        </div>
      </div>
    </footer>
  );
}
