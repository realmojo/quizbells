"use client";
import { getUserAuth, refreshToken } from "@/utils/utils";
import type { MessagePayload } from "firebase/messaging";
import { useEffect } from "react";

export default function ForegroundNotification() {
  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | null = null;

    const setup = async () => {
      // firebase는 유휴 시점에만 동적 로드한다(초기 렌더/LCP 비방해).
      const { getMessagingInstance, onMessage } = await import("@/lib/firebase");
      const messaging = await getMessagingInstance();
      if (!messaging || cancelled) return;

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
      unsubscribe = await onMessage(messaging, (payload: MessagePayload) => {
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

      if (cancelled) {
        // setup 도중 언마운트된 경우 즉시 해제
        unsubscribe?.();
        unsubscribe = null;
      }
    };

    const hasRic = typeof window.requestIdleCallback === "function";
    const idleId = hasRic
      ? window.requestIdleCallback(setup, { timeout: 3000 })
      : window.setTimeout(setup, 1500);

    return () => {
      cancelled = true;
      if (hasRic) {
        window.cancelIdleCallback(idleId as number);
      } else {
        clearTimeout(idleId as number);
      }
      unsubscribe?.();
    };
  }, []);

  return null;
}
