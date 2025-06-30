"use client";

import React, { useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { settingsStore } from "@/store/settingsStore";
import { getUserAuth, isWebView, requestAlarmPermission } from "@/utils/utils";
import Link from "next/link";

export default function SettingsPage() {
  const { settings, setSettings, updateSettings } = settingsStore();

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    setSettings();
  }, []);

  return (
    <article className="mt-4 mb-24 flex flex-col items-center justify-center">
      <section className="w-full max-w-[860px] ">
        <h2 className="mb-6 text-xl px-4 font-bold">알림 설정</h2>

        <ul className="space-y-4 ">
          <li className="flex items-center justify-between border-b py-3 px-4">
            <div className="flex flex-col ">
              <Label htmlFor="random-alert">퀴즈 정답 알림 받기</Label>
              <span className="mt-1 text-xs text-gray-500">
                퀴즈 정답이 나오면 알람을 보내드립니다.
              </span>
            </div>
            <Switch
              id="quiz-alert"
              checked={settings?.isQuizAlarm === "Y"}
              onCheckedChange={async () => {
                const auth = getUserAuth();
                if (auth.userId) {
                  await updateSettings(
                    "isQuizAlarm",
                    settings?.isQuizAlarm === "Y" ? "N" : "Y"
                  );
                } else {
                  if (!isWebView()) {
                    await requestAlarmPermission();
                    await updateSettings(
                      "isQuizAlarm",
                      settings?.isQuizAlarm === "Y" ? "N" : "Y"
                    );
                  }
                }
              }}
            />
          </li>
        </ul>
        {/* 기존 알림 설정 <ul> 아래에 바로 추가 */}

        <h2 className="mb-6 text-xl font-bold mt-10 px-4">퀴즈벨 정보</h2>
        <ul className="space-y-4 ">
          <Link href="/about">
            <li className="flex items-center justify-between border-b py-3 px-4 hover:bg-gray-50 cursor-pointer">
              <span>📘 퀴즈벨 소개</span>
              <span className="text-black-600 font-medium">→</span>
            </li>
          </Link>
          <Link href="/faq">
            <li className="flex items-center justify-between border-b py-3 px-4 hover:bg-gray-50 cursor-pointer">
              <span>❓ 자주 묻는 질문 (FAQ)</span>
              <span className="text-black-600 font-medium">→</span>
            </li>
          </Link>
        </ul>
      </section>
    </article>
  );
}
