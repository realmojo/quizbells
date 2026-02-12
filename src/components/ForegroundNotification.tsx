"use client";
import { messaging, onMessage } from "@/lib/firebase";
import { getUserAuth, refreshToken } from "@/utils/utils";
import { MessagePayload } from "firebase/messaging";
import { useEffect } from "react";

export default function ForegroundNotification() {
  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | null = null;

    const interval = setInterval(() => {
      if (!messaging || cancelled) return;
      clearInterval(interval);

      // 토큰 유효성 검사
      const auth = getUserAuth();
      if (auth.fcmToken) {
        fetch("/api/notify/check", {
          method: "POST",
          body: JSON.stringify({
            token: auth.fcmToken,
            data: { check: "validity", silent: "true" },
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (!cancelled && !data.success) {
              refreshToken(messaging, false);
            }
          })
          .catch(() => {});
      }

      // onMessage 리스너 등록
      unsubscribe = onMessage(messaging, (payload: MessagePayload) => {
        if (
          payload.data?.silent === "true" &&
          payload.data?.check === "validity"
        ) {
          return;
        }
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(payload.data?.title || "", {
            body: payload.data?.body,
            icon:
              payload.data?.icon ||
              "https://quizbells.com/icons/android-icon-48x48.png",
            requireInteraction: true,
            data: {
              url: payload.data?.link || "https://quizbells.com",
            },
          });
        });
      });
    }, 300);

    return () => {
      cancelled = true;
      clearInterval(interval);
      unsubscribe?.();
    };
  }, []);

  return null;
}
