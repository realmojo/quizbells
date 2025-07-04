"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { detectDevice } from "@/utils/utils";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

const BANNER_DISMISS_KEY = "quizbells_install_banner_dismissed_at";
const ONE_HOUR = 10 * 60 * 1000;

export default function InstallPromptBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const dismissedRef = useRef(false);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("✅ 설치 완료");
    }
    setOpen(false);
  };

  const handleClose = () => {
    dismissedRef.current = true;
    setOpen(false);
    localStorage.setItem(BANNER_DISMISS_KEY, Date.now().toString());
  };

  useEffect(() => {
    const lastDismissed = localStorage.getItem(BANNER_DISMISS_KEY);
    if (lastDismissed && Date.now() - Number(lastDismissed) < ONE_HOUR) {
      dismissedRef.current = true;
    }

    const handler = (e: any) => {
      console.log("🔔 beforeinstallprompt 감지됨");
      e.preventDefault();
      if (!dismissedRef.current) {
        setDeferredPrompt(e);
        setOpen(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      console.log("✅ 앱 설치 완료!");
      alert("설치가 완료되었습니다!");
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  if (!open || detectDevice().isDesktop) return null;

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
              퀴즈벨 앱을 설치해주세요
            </DrawerTitle>
            <p className="text-sm text-gray-500">
              퀴즈 정답을 실시간으로 알려드립니다
            </p>
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
