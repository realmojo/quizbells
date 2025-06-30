// app/about/page.tsx
import { Metadata } from "next";

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
    <main className="max-w-[860] mx-auto px-4 pt-4">
      <p className="text-gray-700 leading-relaxed">
        <strong>퀴즈벨(Quizbells)</strong>은 다양한 앱테크 플랫폼의 퀴즈 정답을
        실시간으로 알려주는 서비스입니다. 매일 아침 빠르게 퀴즈를 확인하고
        싶거나, 퀴즈 적중률을 높이고 싶은 분들에게 최적화된 플랫폼이에요. 실시간
        푸시 알림, 검색 기능, 사용자 친화적 UI 등 앱테크 초보자부터 고수까지
        누구나 쉽게 사용할 수 있는 기능을 제공합니다. 🚀
      </p>

      <div className="mt-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          🔧 주요 기능
        </h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>📅 매일 업데이트되는 퀴즈 정답 제공</li>
          <li>📲 FCM 푸시 알림으로 정답을 실시간 수신</li>
          <li>📚 과거 퀴즈 검색 및 아카이브 제공</li>
          <li>💡 퀴즈 적중률을 높이는 팁과 해설</li>
          <li>🧭 카테고리별 필터 및 퀴즈 시간대별 정렬 기능</li>
          <li>🎯 퀴즈 유형별 통계와 참여자 반응 기반 정확도 표시</li>
        </ul>
      </div>

      <div className="mt-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          💎 우리가 추구하는 가치
        </h2>
        <p className="text-gray-700 leading-relaxed">
          퀴즈벨은 단순히 정답을 전달하는 서비스가 아니라, 사용자와 함께
          성장하는 앱테크 파트너가 되고자 합니다. 정확하고 빠른 정보, 편리한
          인터페이스, 그리고 알림 기반의 효율적인 시간 관리 도구로서 사용자 삶의
          질을 높이는 데 기여하고자 합니다. 🧡
        </p>
      </div>

      <div className="mt-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          📱 이용 방법 안내
        </h2>
        <ol className="list-decimal list-inside text-gray-700 space-y-1">
          <li>퀴즈벨 웹사이트에 접속하거나 앱을 설치합니다.</li>
          <li>카테고리 또는 날짜별로 원하는 퀴즈를 탐색합니다.</li>
          <li>푸시 알림을 허용하면, 실시간 정답을 받을 수 있습니다.</li>
          <li>과거 기록을 통해 나만의 퀴즈 노하우를 쌓을 수 있습니다.</li>
        </ol>
        <p className="text-sm text-gray-500 mt-2">
          * Android에서는 설치 시 앱처럼 실행되며, iOS는 Safari 홈화면 추가
          기능을 활용하세요.
        </p>
      </div>

      <div className="mt-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          🌟 사용자 후기
        </h2>
        <div className="space-y-3 text-gray-700">
          <blockquote className="border-l-4 pl-4 italic text-sm">
            "매일 아침 퀴즈벨 덕분에 시간을 절약해요! 포인트 쏠쏠하게 모으는
            재미도 있어요."
          </blockquote>
          <blockquote className="border-l-4 pl-4 italic text-sm">
            "여러 앱을 왔다갔다 할 필요 없이 한 곳에서 퀴즈를 확인할 수 있어
            너무 편리해요."
          </blockquote>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          ❓ 자주 묻는 질문 (FAQ)
        </h2>
        <div className="space-y-3 text-gray-700">
          <div>
            <strong>Q. 퀴즈 정답은 언제 업데이트되나요?</strong>
            <p>A. 대부분의 퀴즈는 오전 9시~10시 사이에 빠르게 반영됩니다.</p>
          </div>
          <div>
            <strong>Q. 알림이 오지 않을 때는 어떻게 하나요?</strong>
            <p>
              A. 브라우저 알림 권한을 확인하고, 배터리 최적화에서 앱을
              제외해주세요.
            </p>
          </div>
          <div>
            <strong>Q. 무료 서비스인가요?</strong>
            <p>A. 네, 현재 퀴즈벨은 모든 사용자에게 무료로 제공됩니다.</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-10 mb-20 text-center">
        &copy; {new Date().getFullYear()} 퀴즈벨. All rights reserved.
      </p>
    </main>
  );
}
