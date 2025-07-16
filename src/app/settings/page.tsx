"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { settingsStore } from "@/store/settingsStore";
import {
  getUserAuth,
  isWebView,
  isApple,
  requestAlarmPermission,
  quizItems,
} from "@/utils/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button"; // 이거 꼭 import 돼 있어야 함
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import ImageComponents from "@/components/ImageComponets";

export default function SettingsPage() {
  const { settings, setSettings, updateSettings } = settingsStore();
  const [isQuizAlarm, setIsQuizAlarm] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [checkedTypes, setCheckedTypes] = useState<string[]>([]);

  // ✅ 상태 변경 핸들러
  const handleCheckChange = async (type: string, checked: boolean) => {
    let newChecked: string[] = [];

    if (checked) {
      newChecked = [...checkedTypes, type];
    } else {
      newChecked = checkedTypes.filter((t) => t !== type);
    }

    setCheckedTypes(newChecked);

    // ✅ DB에 업데이트
    const allTypes = quizItems.map((q) => q.type);
    const isAllSelected = newChecked.length === allTypes.length;
    const newValue = isAllSelected ? "*" : newChecked.join(",");

    try {
      await updateSettings("alarmSettings", newValue);
    } catch (e) {
      console.error("알림 설정 저장 실패", e);
    }
  };

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

    if (settings.alarmSettings === "*") {
      setCheckedTypes(quizItems.map((q) => q.type));
    } else {
      setCheckedTypes(settings.alarmSettings.split(","));
    }
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
                      if (checked) {
                        setIsSheetOpen(true); // ✅ ON으로 변경될 때만 다이얼로그 오픈
                      }
                    } catch (e) {
                      console.error(e);
                      if (!isWebView()) {
                        const isGranted = await requestAlarmPermission();
                        if (isGranted) {
                          await setSettings();
                          await updateSettings("isQuizAlarm", newValue);

                          if (checked) {
                            setIsSheetOpen(true); // ✅ ON으로 변경될 때만 다이얼로그 오픈
                          }
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

                        if (checked) {
                          setIsSheetOpen(true); // ✅ ON으로 변경될 때만 다이얼로그 오픈
                        }
                      } else {
                        setIsQuizAlarm(!checked);
                        if (isApple()) {
                          alert(
                            "홈 화면에 앱을 추가하고 알림을 활성화해주세요."
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
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="bottom" className="sm:max-w-full gap-0">
          <SheetHeader>
            <SheetTitle>알림 설정을 해주세요!</SheetTitle>
            <SheetDescription>
              퀴즈 정답이 나오면 실시간으로 알려드릴게요.
              <br />
              알림 권한이 허용되었는지 꼭 확인해주세요 🙏
            </SheetDescription>
          </SheetHeader>
          <div className="overflow-auto max-h-[60vh] ">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px] text-left pl-4">
                    서비스명
                  </TableHead>
                  <TableHead className="w-[80px] text-right pr-4">
                    알림 설정
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quizItems.map((quizItem) => (
                  <TableRow key={quizItem.type}>
                    <TableCell className="font-medium flex items-center gap-2 text-left pl-4">
                      <div className="rounded-md overflow-hidden">
                        <ImageComponents
                          type={quizItem.type}
                          width={20}
                          height={20}
                        />
                      </div>
                      {quizItem.typeKr}
                    </TableCell>
                    <TableCell
                      className="text-right"
                      style={{ paddingRight: "30px" }}
                    >
                      <Checkbox
                        checked={checkedTypes.includes(quizItem.type)}
                        onCheckedChange={(checked) =>
                          handleCheckChange(quizItem.type, checked === true)
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <SheetFooter className="px-4 border-t">
            <Button
              variant="ghost"
              onClick={() => setIsSheetOpen(false)}
              className="w-full min-h-[50px] text-lg rounded-md bg-gray-900 text-white hover:bg-gray-800 hover:text-white"
            >
              닫기
            </Button>
            {/* <Button
              onClick={() => setIsSheetOpen(false)}
              className="w-full rounded-md bg-gray-900 text-white font-medium hover:bg-gray-800"
            >
              닫기
            </Button> */}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
