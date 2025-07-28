"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { settingsStore } from "@/store/settingsStore";
import AlarmSetting from "@/components/AlarmSetting";
import { getUserAuth } from "@/utils/utils";
import { updateSettings } from "@/utils/api";

export default function SettingsPage() {
  const { settings, setSettings } = settingsStore();
  const [isQuizAlarm, setIsQuizAlarm] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    if (isSheetOpen) {
      // Sheet 열릴 때 현재 상태를 푸시 (뒤로가기 대상이 되도록)
      window.history.pushState({ sheetOpen: true }, "");

      const handlePopState = (e: PopStateEvent) => {
        console.log(e);
        setIsSheetOpen(false); // 뒤로가기 시 Sheet 닫기
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

  // ✅ 초기 설정 상태 불러오기
  useEffect(() => {
    if (settings?.isQuizAlarm) {
      setIsQuizAlarm(settings.isQuizAlarm === "Y");
    }

    if (!settings?.alarmSettings) return;
  }, [settings]);

  return (
    <>
      <article className="mt-4 mb-24 flex flex-col items-center justify-center">
        <section className="w-full max-w-[720px] ">
          <h2
            className="mb-6 text-xl px-4 font-bold"
            onClick={() => setIsClicked(!isClicked)}
          >
            알림 설정
          </h2>
          {isClicked && (
            <div className="px-4">
              <p>{JSON.stringify(getUserAuth())}</p>
            </div>
          )}

          <ul className="space-y-4 ">
            <li className="flex items-center justify-between border-b py-3 px-4">
              <div className="flex flex-col ">
                <Label className="text-md" htmlFor="random-alert">
                  🔔 퀴즈 정답 알림 받기
                </Label>
                <span className="mt-1 text-xs text-gray-500">
                  퀴즈 정답이 나오면 알람을 보내드립니다.
                </span>
                <span className="mt-1 text-xs text-gray-500">
                  {settings?.alarmSettings === "*"
                    ? "현재 모든 알림을 받습니다. 원치 않은 퀴즈가 있으시면 개별적으로 해제 가능합니다."
                    : "현재 선택한 퀴즈만 알림을 받습니다. 원치 않은 퀴즈가 있으시면 개별적으로 해제 가능합니다."}
                </span>
              </div>
              <Checkbox
                id="quiz-alert"
                checked={isQuizAlarm}
                onCheckedChange={async (checked: boolean) => {
                  // 1. 먼저 UI 반영
                  setIsQuizAlarm(checked);
                  const { userId } = getUserAuth();

                  const newValue = checked ? "Y" : "N";
                  await updateSettings(userId, {
                    isQuizAlarm: newValue,
                    alarmSettings: settings?.alarmSettings,
                  });
                  await setSettings();

                  if (newValue === "Y" && userId) {
                    setIsSheetOpen(true);
                  } else {
                    setIsSheetOpen(false);
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
            <Link href="/privacy">
              <li className="flex items-center justify-between border-b py-3 px-4 hover:bg-gray-50 cursor-pointer">
                <span>🔒 개인정보 처리방침</span>
                <span className="text-black-600 font-medium">→</span>
              </li>
            </Link>
            <Link href="/terms">
              <li className="flex items-center justify-between border-b py-3 px-4 hover:bg-gray-50 cursor-pointer">
                <span>📜 이용약관</span>
                <span className="text-black-600 font-medium">→</span>
              </li>
            </Link>
          </ul>
        </section>
      </article>
      {isSheetOpen && <AlarmSetting isForceOpen={true} />}
    </>
  );
}
