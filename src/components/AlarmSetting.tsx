"use client";
import { useEffect, useState } from "react";
import { Sheet } from "@/components/ui/sheet";
import { getUserAuth, quizItems, requestAlarmPermission } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import {
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import ImageComponents from "@/components/ImageComponets";
import { updateSettings } from "@/utils/api";
import { Bell, Check, Sparkles } from "lucide-react";
import { settingsStore } from "@/store/settingsStore";

interface AlarmSettingProps {
  isForceOpen?: boolean;
}

export default function InstallPromptBanner({
  isForceOpen,
}: AlarmSettingProps) {
  const { settings, setSettings } = settingsStore();
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

    // userId가 있을 때만 즉시 업데이트 (기존 유저)
    const { userId } = getUserAuth();
    if (userId) {
      const allTypes = quizItems.map((q) => q.type);
      const isAllSelected =
        newChecked.length === 0 || newChecked.length === allTypes.length;
      const newValue = isAllSelected ? "*" : newChecked.join(",");

      try {
        const params = {
          isQuizAlarm: "Y",
          alarmSettings: newValue,
        };
        await updateSettings(userId, params);
      } catch (e) {
        console.error("알림 설정 저장 실패", e);
      }
    }
  };

  useEffect(() => {
    const initializeAlarmSetting = async () => {
      const { userId } = getUserAuth();

      if (isForceOpen) {
        if (userId) {
          await setSettings();
          const freshSettings = settingsStore.getState().settings;
          setCheckedTypes(
            freshSettings?.alarmSettings !== "*"
              ? freshSettings?.alarmSettings?.split(",") || []
              : []
          );
        }
        setIsSheetOpen(true);
      }
    };

    initializeAlarmSetting();
  }, [isForceOpen, setSettings]);

  return (
    <>
      <Sheet
        open={isSheetOpen}
        onOpenChange={async (open) => {
          setIsSheetOpen(open);
          if (!open) {
            // 닫을 때도 userId가 없으면 생성 시도하지 않음 (사용자가 취소한 것으로 간주)
            // 단, 다시 안 보게 하려면 로컬스토리지는 설정해야 함
            if (getUserAuth().userId) {
              localStorage.setItem("isFirstAlarmSetting", "true");
            }
            await setSettings();
          }
        }}
      >
        <SheetContent
          side="bottom"
          className="sm:max-w-[720px] p-0 gap-0 rounded-t-[2rem] border-t-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl max-h-[85vh] flex flex-col"
          style={{ margin: "0 auto" }}
        >
          <SheetHeader className="p-6 pb-2 text-left space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <SheetTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                  알림 설정
                </SheetTitle>
                <SheetDescription className="text-slate-500 dark:text-slate-400 text-sm">
                  원하는 퀴즈의 정답 알림만 쏙쏙 골라 받으세요!
                </SheetDescription>
              </div>
            </div>

            <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-4 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                아무것도 선택하지 않으면{" "}
                <span className="font-bold text-slate-900 dark:text-white">
                  모든 퀴즈
                </span>
                의 알림을 받게 됩니다.
                <br />
                저장 버튼을 누르면 알림 권한 요청이 진행됩니다.
              </p>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-2">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 pb-4">
              {quizItems.map((quizItem) => {
                const isSelected = checkedTypes.includes(quizItem.type);

                return (
                  <button
                    key={quizItem.type}
                    onClick={() =>
                      handleCheckChange(quizItem.type, !isSelected)
                    }
                    className={cn(
                      "group relative flex flex-col items-center gap-3 p-3 rounded-2xl transition-all duration-300",
                      isSelected
                        ? "bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500 dark:ring-blue-400"
                        : "bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                  >
                    {/* 선택 표시 배지 */}
                    <div
                      className={cn(
                        "absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 z-10",
                        isSelected
                          ? "bg-blue-500 scale-100"
                          : "bg-slate-200 dark:bg-slate-700 scale-0 opacity-0"
                      )}
                    >
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>

                    {/* 이미지 컨테이너 */}
                    <div
                      className={cn(
                        "relative w-14 h-14 rounded-xl overflow-hidden transition-transform duration-300",
                        isSelected
                          ? "scale-105 shadow-md"
                          : "grayscale-[0.5] group-hover:grayscale-0"
                      )}
                    >
                      <ImageComponents
                        type={quizItem.type}
                        width={100}
                        height={100}
                      />
                    </div>

                    {/* 텍스트 */}
                    <span
                      className={cn(
                        "text-xs font-semibold text-center transition-colors duration-300 line-clamp-1 w-full",
                        isSelected
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200"
                      )}
                    >
                      {quizItem.typeKr}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <SheetFooter className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 pb-safe-area">
            <Button
              onClick={async () => {
                // 1. 권한 요청 및 userId 생성 (없을 경우)
                let { userId } = getUserAuth();
                if (!userId) {
                  await requestAlarmPermission();
                  const auth = getUserAuth();
                  userId = auth.userId;
                }

                // 2. 설정 저장
                if (userId) {
                  const allTypes = quizItems.map((q) => q.type);
                  const isAllSelected =
                    checkedTypes.length === 0 ||
                    checkedTypes.length === allTypes.length;
                  const newValue = isAllSelected ? "*" : checkedTypes.join(",");

                  await updateSettings(userId, {
                    isQuizAlarm: "Y",
                    alarmSettings: newValue,
                  });

                  localStorage.setItem("isFirstAlarmSetting", "true");
                }

                setIsSheetOpen(false);
                await setSettings();
              }}
              className="w-full h-14 text-lg font-bold rounded-xl bg-linear-to-br from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 dark:from-white dark:to-slate-200 dark:text-slate-900 dark:hover:from-slate-200 dark:hover:to-slate-300 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              알림 받고 시작하기
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
