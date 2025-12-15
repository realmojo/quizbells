"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { detectDevice, isIOS, isWebView } from "@/utils/utils";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

const BANNER_DISMISS_KEY = "quizbells_install_banner_dismissed_at";
const ONE_HOUR = 10 * 60 * 1000;

export default function InstallPromptBanner() {
  const [open, setOpen] = useState(false);
  const dismissedRef = useRef(false);

  const handleInstall = async () => {
    if (isIOS()) {
      location.href =
        "https://apps.apple.com/kr/app/%ED%80%B4%EC%A6%88%EB%B2%A8-%EC%95%B1%ED%85%8C%ED%81%AC-%ED%80%B4%EC%A6%88-%EC%A0%95%EB%8B%B5-%EC%95%8C%EB%A6%BC-%EC%84%9C%EB%B9%84%EC%8A%A4/id6748852703";
    } else {
      location.href =
        "https://play.google.com/store/apps/details?id=com.mojoday.quizbells";
    }
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem(BANNER_DISMISS_KEY, Date.now().toString());
  };

  useEffect(() => {
    const lastDismissed = localStorage.getItem(BANNER_DISMISS_KEY);
    if (lastDismissed && Date.now() - Number(lastDismissed) < ONE_HOUR) {
      dismissedRef.current = true;
    }

    // setTimeout을 사용하여 다음 이벤트 루프에서 상태 업데이트
    const timer = setTimeout(() => {
      if (isIOS()) {
        if (!dismissedRef.current) {
          setOpen(true);
        }
      } else {
        if (detectDevice().isMobile && !dismissedRef.current) {
          setOpen(true);
        }
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  if (!open || detectDevice().isDesktop || isWebView()) return null;

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="max-w-screen-md mx-auto px-4 pb-6">
        <DrawerHeader className="flex items-center gap-4">
          <Image
            src="/icons/android-icon-48x48.png"
            alt="App Logo"
            width={40}
            height={40}
            className="rounded-sm"
            priority
          />
          <div className="text-center">
            <DrawerTitle className="text-base font-semibold">
              원활한 알람을 위해 <br />
              퀴즈벨 앱을 설치해주세요
            </DrawerTitle>
            <DrawerDescription className="mt-2 text-sm text-gray-500">
              퀴즈 정답을 실시간으로 알려드립니다
            </DrawerDescription>
          </div>
        </DrawerHeader>
        <DrawerFooter className="flex gap-2 justify-end">
          <Button
            onClick={() => handleInstall()}
            className="w-full min-h-[50px] text-lg font-semibold"
          >
            설치
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleClose()}
            className="w-full min-h-[50px] text-lg"
          >
            닫기
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
