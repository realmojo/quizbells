"use client";

import { useEffect } from "react";
import { Workbox } from "workbox-window";
import { toast } from "sonner";

export default function RegisterServiceWorker() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator))
      return;

    const currentVersion = localStorage.getItem("quizbell_sw_version");
    const version = "1.0.1";
    const SW_URL = `/firebase-messaging-sw.js?v=${version}`;
    localStorage.setItem("quizbell_sw_version", version);

    let wb: Workbox | null = null;

    const registerNewSW = () => {
      wb = new Workbox(SW_URL);

      wb.addEventListener("waiting", () => {
        toast("새 버전이 있습니다", {
          action: {
            label: "업데이트",
            onClick: () => {
              wb?.messageSkipWaiting();
            },
          },
          duration: Infinity,
        });
      });

      wb.addEventListener("controlling", () => {
        window.location.reload();
      });

      wb.addEventListener("activated", (event) => {
        if (event.isUpdate) {
          console.log("🔄 업데이트된 서비스워커가 활성화됨");
        } else {
          console.log("🆕 새로운 서비스워커가 활성화됨");
        }
      });

      wb.register()
        .then((reg) => {
          console.log("🛠 새 서비스워커 등록 완료:", reg);
        })
        .catch((err) => {
          console.error("❌ 서비스워커 등록 실패:", err);
        });
    };

    if (currentVersion !== version) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        const deletionPromises = registrations.map((reg) => {
          if (reg.active?.scriptURL.includes("firebase-messaging-sw.js")) {
            return reg.unregister();
          }
          return Promise.resolve();
        });

        Promise.all(deletionPromises).then(() => {
          registerNewSW();
        });
      });
    }

    return () => {
      wb = null;
    };
  }, []);

  return null;
}
