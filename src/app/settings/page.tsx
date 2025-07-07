"use client";

import React, { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { settingsStore } from "@/store/settingsStore";
import {
  getUserAuth,
  isWebView,
  isApple,
  requestAlarmPermission,
} from "@/utils/utils";
import Link from "next/link";

export default function SettingsPage() {
  const { settings, setSettings, updateSettings } = settingsStore();
  const [isQuizAlarm, setIsQuizAlarm] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    setSettings();
  }, []);

  // settings가 바뀌면 상태 반영
  useEffect(() => {
    if (settings?.isQuizAlarm) {
      setIsQuizAlarm(settings.isQuizAlarm === "Y");
    }
  }, [settings]);

  return (
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
            </div>
            <Switch
              id="quiz-alert"
              checked={isQuizAlarm}
              onCheckedChange={async (checked) => {
                // 1. 먼저 UI 반영
                setIsQuizAlarm(checked);

                const auth = getUserAuth();

                const newValue = checked ? "Y" : "N";

                if (auth.userId) {
                  try {
                    await updateSettings("isQuizAlarm", newValue);
                  } catch (e) {
                    console.error(e);
                    if (!isWebView()) {
                      const isGranted = await requestAlarmPermission();
                      if (isGranted) {
                        await setSettings();
                        await updateSettings("isQuizAlarm", newValue);
                      } else {
                        // 실패 시 롤백
                        setIsQuizAlarm(!checked);
                      }
                    }
                  }
                } else {
                  if (!isWebView()) {
                    const isGranted = await requestAlarmPermission();
                    if (isGranted) {
                      await setSettings();
                      await updateSettings("isQuizAlarm", newValue);
                    } else {
                      setIsQuizAlarm(!checked);
                      if (isApple()) {
                        alert(
                          "iOS 브라우저 앱 출시 후 알림을 사용할 수 있습니다."
                        );
                      }
                    }
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
  );
}
