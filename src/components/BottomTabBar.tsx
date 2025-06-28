// components/BottomTabBar.tsx
"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  // Plus,
  // Heart,
  // Flame,
  // Rocket,
  Settings,
  Bell,
  // Box,
  // BowArrow,
} from "lucide-react";
// import { useAppStore } from "../store/useAppStore";

export default function BottomTabBar() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // 사용자에게 많이 노출될 가능성이 높은 페이지들을 prefetch
    router.prefetch("/quiz");
    router.prefetch("/fortune");
    router.prefetch("/sale");
    router.prefetch("/settings");
  }, [router]);

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 flex h-16 border-t bg-white shadow-inner">
      {/* 1. 퀴즈 */}
      <button
        onClick={() => router.push("/quiz")}
        className={`flex flex-1 flex-col items-center justify-center ${
          pathname === "/quiz"
            ? "text-primary"
            : "text-muted-foreground hover:text-primary"
        }`}
      >
        <Bell
          className={`h-5 w-5 ${pathname === "/quiz" ? "fill-current" : ""}`}
        />
        <span className="mt-1 text-xs">퀴즈</span>
      </button>

      {/* 2. 운세 */}
      {/* <button
        onClick={() => router.push("/fortune")}
        className={`flex flex-1 flex-col items-center justify-center ${
          pathname === "/fortune"
            ? "text-primary"
            : "text-muted-foreground hover:text-primary"
        }`}
      >
        <BowArrow
          className={`h-5 w-5 ${pathname === "/fortune" ? "fill-current" : ""}`}
        />
        <span className="mt-1 text-xs">운세</span>
      </button> */}

      {/* 3. 특가 */}
      {/* <button
        onClick={() => router.push("/sale")}
        className={`flex flex-1 flex-col items-center justify-center ${
          pathname === "/sale"
            ? "text-primary"
            : "text-muted-foreground hover:text-primary"
        }`}
      >
        <Box
          className={`h-5 w-5 ${pathname === "/sale" ? "fill-current" : ""}`}
        />
        <span className="mt-1 text-xs">특가</span>
      </button> */}

      {/* 4. 설정 */}
      <button
        onClick={() => router.push("/settings")}
        className={`flex flex-1 flex-col items-center justify-center ${
          pathname === "/settings"
            ? "text-primary"
            : "text-muted-foreground hover:text-primary"
        }`}
      >
        <Settings
          className={`h-5 w-5 ${
            pathname === "/settings" ? "fill-current" : ""
          }`}
        />
        <span className="mt-1 text-xs">설정</span>
      </button>
    </nav>
  );
}
