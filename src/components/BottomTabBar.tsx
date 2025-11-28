"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Book, Lightbulb, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomTabBar() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/quiz");
    router.prefetch("/tips");
    router.prefetch("/posts");
    router.prefetch("/settings");
  }, [router]);

  const tabs = [
    {
      name: "퀴즈",
      path: "/", // 메인 페이지로 이동
      match: (path: string) =>
        path === "/" || path.includes("/quiz") || path.startsWith("/quiz"),
      icon: Bell,
      activeColor: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      name: "팁",
      path: "/tips",
      match: (path: string) => path.includes("/tips"),
      icon: Lightbulb,
      activeColor: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      name: "콘텐츠",
      path: "/posts",
      match: (path: string) =>
        path.includes("/posts") || path.includes("/post"),
      icon: Book,
      activeColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      name: "설정",
      path: "/settings",
      match: (path: string) => path === "/settings",
      icon: Settings,
      activeColor: "text-slate-600 dark:text-slate-400",
      bgColor: "bg-slate-100 dark:bg-slate-800",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none flex justify-center pb-6 md:pb-8 safe-area-bottom">
      <nav className="pointer-events-auto mx-4 flex h-16 w-full max-w-md items-center justify-around rounded-2xl border border-white/20 bg-white/90 px-2 shadow-2xl backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/90 dark:shadow-slate-950/50 transition-all duration-300">
        {tabs.map((tab) => {
          const active = tab.match(pathname);
          const Icon = tab.icon;

          return (
            <button
              key={tab.name}
              onClick={() => router.push(tab.path)}
              className="group relative flex flex-1 flex-col items-center justify-center py-2"
            >
              {/* Active Indicator Background */}
              <span
                className={cn(
                  "absolute inset-x-3 top-1/2 -translate-y-1/2 h-10 rounded-xl transition-all duration-300 opacity-0 scale-90",
                  active && "opacity-100 scale-100",
                  tab.bgColor
                )}
              />

              {/* Icon & Label Container */}
              <div
                className={cn(
                  "relative z-10 transition-all duration-300 flex flex-col items-center",
                  active ? "-translate-y-1" : "translate-y-0"
                )}
              >
                <Icon
                  className={cn(
                    "h-6 w-6 transition-all duration-300",
                    active
                      ? tab.activeColor
                      : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
                  )}
                  strokeWidth={active ? 2.5 : 2}
                  fill={active ? "currentColor" : "none"}
                />

                {/* Label - 활성화될 때만 표시 */}
                <span
                  className={cn(
                    "text-[10px] font-bold transition-all duration-300 absolute -bottom-4 w-full text-center whitespace-nowrap",
                    active
                      ? cn("opacity-100 translate-y-0", tab.activeColor)
                      : "opacity-0 -translate-y-2 pointer-events-none"
                  )}
                >
                  {tab.name}
                </span>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
