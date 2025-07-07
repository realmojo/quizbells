"use client";
import { usePathname } from "next/navigation";
// import MainSidebarRightButton from "../MainSidebarRightButton";

export default function Header() {
  const pathname = usePathname();

  // WebView에서는 헤더를 렌더링하지 않음
  // if (isWebView()) return null;

  // 경로별 제목 정의
  const getTitle = (path: string) => {
    if (path.includes("/quiz")) return "퀴즈벨 정답";
    if (path === "/fortune") return "운세";
    if (path === "/sale") return "특가";
    if (path === "/settings") return "설정";
    if (path === "/about") return "퀴즈벨 소개";
    if (path === "/faq") return "자주 묻는 질문 (FAQ)";
    if (path === "/privacy") return "개인정보 처리방침";
    if (path === "/terms") return "이용약관";
    if (path.includes("/posts") || path.includes("/post")) return "콘텐츠";
    // if (path.includes("/product")) return "상품정보";
    // if (path.includes("/search"))
    //   return `${decodeURIComponent(path.split("/")[2])} 검색`;
    return "퀴즈벨 정답";
  };

  const title = getTitle(pathname);

  return (
    <header className="container mx-auto flex h-16 w-full max-w-[720px] items-center justify-between px-4 shadow-[0_2px_6px_-2px_rgba(0,0,0,0.15)]">
      {/* 왼쪽: 제목 */}
      <div className="flex items-center gap-3 text-2xl font-semibold">
        {title}
      </div>

      {/* 오른쪽: 알림 버튼 또는 설정 버튼 */}
      {/* <MainSidebarRightButton /> */}
    </header>
  );
}
