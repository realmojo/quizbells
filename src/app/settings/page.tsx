"use client";

import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { settingsStore } from "@/store/settingsStore";
import AlarmSetting from "@/components/AlarmSetting";
// import { getUserAuth } from "@/utils/utils";
import { updateSettings } from "@/utils/api";
import {
  Bell,
  ChevronRight,
  FileText,
  HelpCircle,
  Info,
  Settings,
  Shield,
  Lock,
} from "lucide-react";

export default function SettingsPage() {
  const { settings, setSettings } = settingsStore();
  const [isQuizAlarm, setIsQuizAlarm] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    if (isSheetOpen) {
      window.history.pushState({ sheetOpen: true }, "");

      const handlePopState = (e: PopStateEvent) => {
        console.log(e);
        setIsSheetOpen(false);
      };

      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [isSheetOpen]);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    setSettings();
  }, []);

  useEffect(() => {
    if (settings?.isQuizAlarm) {
      setIsQuizAlarm(settings.isQuizAlarm === "Y");
    }

    if (!settings?.alarmSettings) return;
  }, [settings]);

  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-950 dark:via-gray-950 dark:to-zinc-950">
        <div className="max-w-3xl mx-auto px-4 py-12">
          {/* Header Section */}
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium mb-2">
              <Settings className="w-4 h-4" />
              <span>환경설정</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-br from-slate-900 to-gray-600 dark:from-white dark:to-gray-400">
              설정
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              알림 및 앱 설정을 관리하세요.
            </p>
          </div>

          {/* Settings Content */}
          <div className="space-y-8">
            {/* Notification Settings */}
            <section className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-3xl shadow-sm border border-white/50 dark:border-slate-800 overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                <h2
                  className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 cursor-pointer select-none"
                  onClick={() => setIsClicked(!isClicked)}
                >
                  <Bell className="w-5 h-5 text-slate-500" />
                  알림 설정
                </h2>
                {/* {isClicked && (
                  <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-mono break-all text-slate-600 dark:text-slate-400">
                    {JSON.stringify(getUserAuth(), null, 2)}
                  </div>
                )} */}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <Label
                      className="text-base font-semibold text-slate-900 dark:text-white cursor-pointer"
                      htmlFor="quiz-alert"
                    >
                      퀴즈 정답 알림 받기
                    </Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      퀴즈 정답이 나오면 실시간으로 알림을 보내드립니다.
                      {isQuizAlarm}
                    </p>
                    <div className="pt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        {!isQuizAlarm
                          ? "알람 수신 안함"
                          : settings?.alarmSettings === "*"
                            ? "모든 알림 수신 중"
                            : "선택한 알림만 수신 중"}
                      </span>
                    </div>
                  </div>
                  <Checkbox
                    id="quiz-alert"
                    className="mt-1 w-6 h-6 border-2 data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 dark:data-[state=checked]:bg-white dark:data-[state=checked]:border-white"
                    checked={isQuizAlarm}
                    onCheckedChange={async (checked: boolean) => {
                      setIsQuizAlarm(checked);
                      const newValue = checked ? "Y" : "N";

                      if (newValue === "Y" && settings?.userId) {
                        setIsSheetOpen(true);
                      } else {
                        setIsSheetOpen(false);
                        await updateSettings(settings?.userId, {
                          isQuizAlarm: newValue,
                          alarmSettings: settings?.alarmSettings,
                        });
                      }
                    }}
                  />
                </div>
              </div>
            </section>

            {/* App Info Settings */}
            <section className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-3xl shadow-sm border border-white/50 dark:border-slate-800 overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Info className="w-5 h-5 text-slate-500" />
                  퀴즈벨 정보
                </h2>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {[
                  {
                    href: "/about",
                    icon: FileText,
                    label: "퀴즈벨 소개",
                    color: "text-green-600 dark:text-green-400",
                    bg: "bg-green-100 dark:bg-green-900/30",
                  },
                  {
                    href: "/faq",
                    icon: HelpCircle,
                    label: "자주 묻는 질문 (FAQ)",
                    color: "text-violet-600 dark:text-violet-400",
                    bg: "bg-violet-100 dark:bg-violet-900/30",
                  },
                  {
                    href: "/privacy",
                    icon: Lock,
                    label: "개인정보 처리방침",
                    color: "text-blue-600 dark:text-blue-400",
                    bg: "bg-blue-100 dark:bg-blue-900/30",
                  },
                  {
                    href: "/terms",
                    icon: Shield,
                    label: "이용약관",
                    color: "text-indigo-600 dark:text-indigo-400",
                    bg: "bg-indigo-100 dark:bg-indigo-900/30",
                  },
                ].map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    target="_self"
                    className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center`}
                      >
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                        {item.label}
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-1 transition-all" />
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
      {isSheetOpen && <AlarmSetting isForceOpen={true} />}
    </>
  );
}
