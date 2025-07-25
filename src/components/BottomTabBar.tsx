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
  Book,
  Lightbulb,
  // Box,
  // BowArrow,
} from "lucide-react";
// import { useAppStore } from "../store/useAppStore";
const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
  const button = event.currentTarget;
  const circle = document.createElement("span");

  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${
    event.clientX - button.getBoundingClientRect().left - radius
  }px`;
  circle.style.top = `${
    event.clientY - button.getBoundingClientRect().top - radius
  }px`;
  circle.classList.add("ripple-effect");

  const ripple = button.getElementsByClassName("ripple-effect")[0];
  if (ripple) ripple.remove();

  button.appendChild(circle);
};

export default function BottomTabBar() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // 사용자에게 많이 노출될 가능성이 높은 페이지들을 prefetch
    router.prefetch("/quiz");
    router.prefetch("/posts");
    // router.prefetch("/sale");
    router.prefetch("/settings");
  }, [router]);

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 flex h-16 border-t bg-white shadow-inner">
      {/* 1. 퀴즈 */}
      <button
        onClick={(e) => {
          createRipple(e);
          router.push("/quiz");
        }}
        className={`ripple relative flex flex-1 flex-col items-center justify-center ${
          pathname.includes("/quiz")
            ? "text-primary"
            : "text-muted-foreground hover:text-primary"
        }`}
      >
        <Bell
          className={`h-5 w-5 ${
            pathname.includes("/quiz") ? "fill-current" : ""
          }`}
        />
        <span className="mt-1 text-xs">퀴즈</span>
      </button>

      {/* 2. 팁 */}
      <button
        onClick={() => router.push("/tips")}
        className={`flex flex-1 flex-col items-center justify-center ${
          pathname.includes("/tips")
            ? "text-primary"
            : "text-muted-foreground hover:text-primary"
        }`}
      >
        <Lightbulb
          className={`h-5 w-5 ${
            pathname.includes("/tips") ? "fill-current" : ""
          }`}
        />
        <span className="mt-1 text-xs">팁</span>
      </button>

      {/* 3. 콘텐츠 */}
      <button
        onClick={() => router.push("/posts")}
        className={`flex flex-1 flex-col items-center justify-center ${
          pathname.includes("/posts") || pathname.includes("/post")
            ? "text-primary"
            : "text-muted-foreground hover:text-primary"
        }`}
      >
        <Book
          className={`h-5 w-5 ${
            pathname.includes("/posts") || pathname.includes("/post")
              ? "fill-current"
              : ""
          }`}
        />
        <span className="mt-1 text-xs">콘텐츠</span>
      </button>

      {/* 4. 설정 */}
      <button
        onClick={(e) => {
          createRipple(e);
          router.push("/settings");
        }}
        className={`ripple relative flex flex-1 flex-col items-center justify-center ${
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
