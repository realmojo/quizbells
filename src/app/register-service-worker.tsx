"use client";

import { useEffect } from "react";
import { Workbox } from "workbox-window"; // ✅ npm 설치된 모듈 import

export default function RegisterServiceWorker() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator))
      return;

    const currentVersion = localStorage.getItem("quizbell_sw_version");
    const version = "1.0.1";
    const SW_URL = `/firebase-messaging-sw.js?v=${version}`;
    localStorage.setItem("quizbell_sw_version", version);

    const registerNewSW = () => {
      const wb = new Workbox(SW_URL);

      wb.addEventListener("waiting", () => {
        console.log("🆕 새로운 SW가 waiting 상태입니다. 강제 활성화 요청");

        wb.addEventListener("controlling", () => {
          console.log("✅ 새로운 SW가 페이지를 제어함 → 새로고침");
          window.location.reload();
        });

        wb.messageSkipWaiting();
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

    // 👉 업데이트 되면 기존에 등록된 firebase-messaging-sw.js 제거
    if (currentVersion !== version) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        const deletionPromises = registrations.map((reg) => {
          if (reg.active?.scriptURL.includes("firebase-messaging-sw.js")) {
            console.log("🧹 기존 firebase-messaging 서비스워커 제거 중...");
            return reg.unregister();
          }
          return Promise.resolve();
        });

        // 기존 삭제 후 새로 등록
        Promise.all(deletionPromises).then(() => {
          console.log("✅ 기존 서비스워커 정리 완료. 새로 등록 시작...");
          registerNewSW(); // 신규 SW 등록
        });
      });
    }
  }, []);

  return null;
}
