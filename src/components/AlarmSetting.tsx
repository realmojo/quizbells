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
import { Checkbox } from "@/components/ui/checkbox";
import ImageComponents from "@/components/ImageComponets";
import { updateSettings } from "@/utils/api";
import { Check } from "lucide-react";
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

    // ✅ DB에 업데이트
    const allTypes = quizItems.map((q) => q.type);
    const isAllSelected =
      newChecked.length === 0 || newChecked.length === allTypes.length;
    const newValue = isAllSelected ? "*" : newChecked.join(",");

    try {
      const { userId } = getUserAuth();
      const params = {
        isQuizAlarm: "Y",
        alarmSettings: newValue,
      };
      await updateSettings(userId, params);
    } catch (e) {
      console.error("알림 설정 저장 실패", e);
    }
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const initializeAlarmSetting = async () => {
      const isFirstAlarmSetting = localStorage.getItem("isFirstAlarmSetting");
      if (!isFirstAlarmSetting || isForceOpen) {
        const { userId } = getUserAuth();
        if (!userId) {
          await requestAlarmPermission();
        }
        await setSettings();
        setIsSheetOpen(true);
        setCheckedTypes(
          settings?.alarmSettings !== "*"
            ? settings?.alarmSettings?.split(",") || []
            : []
        );
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
            localStorage.setItem("isFirstAlarmSetting", "true");
            await setSettings();
          }
        }}
      >
        <SheetContent side="bottom" className="sm:max-w-full gap-0">
          <SheetHeader>
            <SheetTitle>알림 설정을 해주세요!</SheetTitle>
            <SheetDescription>
              퀴즈 정답이 나오면 실시간으로 알려드릴게요.
              <br />
              선택을 하나도 안하면 전체 알림을 받게 됩니다.
              <br />
              알림 권한이 허용되었는지 꼭 확인해주세요 🙏
            </SheetDescription>
          </SheetHeader>
          <div className="w-full">
            <div className="grid grid-cols-5 gap-4 p-4">
              {quizItems.map((quizItem) => {
                const isSelected = checkedTypes.includes(quizItem.type);

                return (
                  <div
                    key={quizItem.type}
                    className={cn(
                      "relative border-1 rounded-lg cursor-pointer transition-all duration-200 hover:border-blue-300",
                      "flex flex-col items-center min-h-[90px]",
                      isSelected
                        ? "bg-gray-100 border-blue-500 shadow-md"
                        : "border-gray-200 hover:bg-gray-50"
                    )}
                    onClick={() =>
                      handleCheckChange(quizItem.type, !isSelected)
                    }
                  >
                    {/* 체크박스 - 우상단 */}
                    <div className="absolute top-2 right-2">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          handleCheckChange(quizItem.type, checked === true)
                        }
                        className={cn(
                          "w-5 h-5",
                          isSelected && "border-blue-500 bg-blue-500"
                        )}
                      />
                    </div>

                    {/* 아이콘 */}
                    <div className="rounded-t-md overflow-hidden flex-shrink-0">
                      <ImageComponents
                        type={quizItem.type}
                        width={300}
                        height={300}
                      />
                    </div>

                    {/* 텍스트 */}
                    <div className="text-center">
                      <p
                        className={cn(
                          "text-sm font-medium line-clamp-1",
                          isSelected ? "text-blue-700" : "text-gray-700"
                        )}
                      >
                        {quizItem.typeKr}
                      </p>
                    </div>

                    {/* 선택됨 표시 오버레이 */}
                    {isSelected && (
                      <div
                        className="absolute inset-0 bg-blue-50 rounded-lg border-1 border-blue-300 flex items-center justify-center"
                        style={{ opacity: 0.85 }}
                      >
                        <Check className="w-10 h-10 text-blue-500" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <SheetFooter className="px-4 border-t">
            <Button
              variant="ghost"
              onClick={async () => {
                setIsSheetOpen(false);
                localStorage.setItem("isFirstAlarmSetting", "true");
                await setSettings();
              }}
              className="w-full min-h-[50px] text-lg rounded-md bg-gray-900 text-white hover:bg-gray-800 hover:text-white"
            >
              저장
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
