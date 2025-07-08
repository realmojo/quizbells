"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Share } from "lucide-react";
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
    location.href =
      "https://play.google.com/store/apps/details?id=com.mojoday.quizbells";
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

    if (isIOS()) {
      if (!dismissedRef.current) {
        setOpen(true);
      }
    } else {
      if (detectDevice().isMobile && !dismissedRef.current) {
        setOpen(true);
      }
    }
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
            <DrawerTitle className="text-base text-lg font-semibold">
              원활한 알람을 위해 <br />
              퀴즈벨 앱을 설치해주세요
            </DrawerTitle>
            <DrawerDescription className="mt-2 text-sm text-gray-500">
              퀴즈 정답을 실시간으로 알려드립니다
            </DrawerDescription>
          </div>
        </DrawerHeader>
        {isIOS() ? (
          <DrawerFooter className="flex gap-2 text-center justify-center">
            <div className="mt-2 flex flex-col justify-center text-md text-gray-600 bg-black text-white rounded-md p-4">
              <div className="flex justify-center items-center mb-2">
                공유버튼 <Share className="w-5 h-5 mx-1 font-bold" /> 버튼을
                눌러
              </div>
              <div>
                <strong className="mx-1">[홈 화면에 추가]</strong>를
                추가해주세요
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={() => handleClose()}
              className="w-full min-h-[50px] text-lg"
            >
              닫기
            </Button>
          </DrawerFooter>
        ) : (
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
        )}
      </DrawerContent>
    </Drawer>
  );
}
