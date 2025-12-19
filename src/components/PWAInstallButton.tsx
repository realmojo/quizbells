"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

// PWA 설치 프롬프트 이벤트 타입
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallButton() {
  const [isInstalling, setIsInstalling] = useState(false);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [showInstallSuccessDialog, setShowInstallSuccessDialog] =
    useState(false);
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);

  // PWA 설치 여부 확인
  useEffect(() => {
    const checkPWAInstalled = () => {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true;

      setIsPWAInstalled(isStandalone);
    };

    checkPWAInstalled();

    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleChange = () => {
      checkPWAInstalled();
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    }
  }, []);

  // PWA 설치 프롬프트 이벤트 캡처
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e as BeforeInstallPromptEvent;
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    const timeout = setTimeout(() => {
      if (!deferredPromptRef.current && !isPWAInstalled) {
        const isStandalone =
          window.matchMedia("(display-mode: standalone)").matches ||
          (window.navigator as any).standalone === true;

        if (isStandalone) {
          setIsPWAInstalled(true);
        }
      }
    }, 1000);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      clearTimeout(timeout);
    };
  }, [isPWAInstalled]);

  // PWA 설치 프롬프트 표시 함수
  const handleInstall = async () => {
    if (!deferredPromptRef.current) {
      toast.info("이미 설치되어 있거나 설치를 지원하지 않는 브라우저입니다.");
      return;
    }

    setIsInstalling(true);
    try {
      await deferredPromptRef.current.prompt();
      const { outcome } = await deferredPromptRef.current.userChoice;

      if (outcome === "accepted") {
        deferredPromptRef.current = null;
        setShowInstallSuccessDialog(true);
        setTimeout(() => {
          setIsPWAInstalled(true);
        }, 500);
      } else {
        toast.info("설치가 취소되었습니다.");
      }
    } catch (error) {
      console.error("PWA 설치 프롬프트 오류:", error);
      toast.error("설치 중 오류가 발생했습니다.");
    } finally {
      setIsInstalling(false);
    }
  };

  // 이미 설치되어 있으면 버튼 숨김
  if (isPWAInstalled) {
    return null;
  }

  return (
    <>
      <Button
        onClick={handleInstall}
        disabled={isInstalling}
        className="w-full px-6 py-6 text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
      >
        {isInstalling ? "설치 중..." : "🔔 퀴즈 정답 알림 받기"}
      </Button>

      {/* 설치 성공 알림창 */}
      <Dialog
        open={showInstallSuccessDialog}
        onOpenChange={setShowInstallSuccessDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl font-bold">
              앱 설치가 완료되었습니다! 🎉
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              설치된 앱으로 이동하여 알림을 허용해주세요.
              <br />
              알림을 허용하시면 퀴즈 정답을 실시간으로 받아보실 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              onClick={() => setShowInstallSuccessDialog(false)}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
            >
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
