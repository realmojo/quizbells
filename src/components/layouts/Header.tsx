"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bell,
  BookOpen,
  FileText,
  HelpCircle,
  Home,
  Lightbulb,
  Menu,
  Settings,
  Shield,
  Sparkles,
  Trophy,
} from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  // 경로별 제목과 아이콘 정의
  const getPageInfo = (path: string) => {
    if (path === "/")
      return {
        title: "퀴즈벨",
        icon: Home,
        gradient: "from-purple-600 to-indigo-600",
      };
    if (path.includes("/quiz"))
      return {
        title: "퀴즈 정답",
        icon: Trophy,
        gradient: "from-blue-600 to-indigo-600",
      };
    if (path.includes("/tips"))
      return {
        title: "앱테크 팁",
        icon: Lightbulb,
        gradient: "from-amber-600 to-orange-600",
      };
    if (path.includes("/posts"))
      return {
        title: "콘텐츠",
        icon: BookOpen,
        gradient: "from-cyan-600 to-blue-600",
      };
    if (path === "/fortune")
      return {
        title: "운세",
        icon: Sparkles,
        gradient: "from-pink-600 to-purple-600",
      };
    if (path === "/sale")
      return {
        title: "특가",
        icon: Bell,
        gradient: "from-red-600 to-pink-600",
      };
    if (path === "/settings")
      return {
        title: "설정",
        icon: Settings,
        gradient: "from-slate-600 to-gray-600",
      };
    if (path === "/about")
      return {
        title: "퀴즈벨 소개",
        icon: FileText,
        gradient: "from-green-600 to-emerald-600",
      };
    if (path === "/faq")
      return {
        title: "FAQ",
        icon: HelpCircle,
        gradient: "from-violet-600 to-purple-600",
      };
    if (path === "/privacy")
      return {
        title: "개인정보 처리방침",
        icon: Shield,
        gradient: "from-blue-600 to-cyan-600",
      };
    if (path === "/terms")
      return {
        title: "이용약관",
        icon: FileText,
        gradient: "from-indigo-600 to-blue-600",
      };
    return {
      title: "퀴즈벨",
      icon: Home,
      gradient: "from-purple-600 to-indigo-600",
    };
  };

  const pageInfo = getPageInfo(pathname);
  const Icon = pageInfo.icon;

  // 네비게이션 메뉴 항목
  const menuItems = [
    {
      name: "퀴즈",
      path: "/",
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
      icon: BookOpen,
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
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-sm">
      <div className="container mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-4">
        {/* 왼쪽: 로고 + 제목 */}
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${pageInfo.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-indigo-600 dark:group-hover:from-purple-400 dark:group-hover:to-indigo-400 transition-all duration-300">
              {pageInfo.title}
            </div>
            {pathname === "/" && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                매일 업데이트되는 퀴즈 정답
              </p>
            )}
          </div>
        </Link>

        {/* 오른쪽: 메뉴 아이콘 */}
        <Drawer direction="right">
          <DrawerTrigger asChild>
            <button
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="메뉴 열기"
            >
              <Menu className="w-6 h-6 text-slate-700 dark:text-slate-300" />
            </button>
          </DrawerTrigger>
          <DrawerContent className="max-w-sm">
            <DrawerHeader>
              <DrawerTitle className="text-xl font-bold">메뉴</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-4 space-y-2">
              {menuItems.map((item) => {
                const active = item.match(pathname);
                const ItemIcon = item.icon;

                return (
                  <DrawerClose key={item.name} asChild>
                    <button
                      onClick={() => router.push(item.path)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left",
                        active
                          ? cn(item.activeColor, item.bgColor)
                          : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      )}
                    >
                      <ItemIcon
                        className={cn(
                          "w-6 h-6",
                          active
                            ? item.activeColor
                            : "text-slate-500 dark:text-slate-400"
                        )}
                        strokeWidth={active ? 2.5 : 2}
                      />
                      <span className="font-semibold">{item.name}</span>
                    </button>
                  </DrawerClose>
                );
              })}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </header>
  );
}
