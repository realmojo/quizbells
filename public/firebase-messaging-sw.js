importScripts(
  "https://www.gstatic.com/firebasejs/11.6.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/11.6.0/firebase-messaging-compat.js"
);
firebase.initializeApp({
  apiKey: "AIzaSyC_E2U2dgb8Smz-dBzcrpVlsQtwnxOBCMQ",
  authDomain: "quizbells-2d26a.firebaseapp.com",
  projectId: "quizbells-2d26a",
  storageBucket: "quizbells-2d26a.firebasestorage.app",
  messagingSenderId: "116519638071",
  appId: "1:116519638071:web:f03b878d06712a4e1adbb2",
  measurementId: "G-KH8RLMC19C",
});

const messaging = firebase.messaging();
const isSupported = firebase.messaging.isSupported();

if (messaging && isSupported) {
  console.log("✅ SW 백그라운드를 수신 합니다.v1.0.1");
  messaging.onBackgroundMessage(function (payload) {
    console.log("Received background message", payload);

    if (payload.data?.silent === "true" && payload.data?.check === "validity") {
      console.log("🔐 B 토큰 유효성 검사 완료");
      return;
    }

    const notificationTitle = payload.data?.title || "";
    const notificationOptions = {
      body: payload.data?.body || "",
      icon: payload.data?.icon || "https://quizbells.com/icons/app-icon@96.png",
      requireInteraction: true,
      data: {
        click_action: payload.data?.link || "https://quizbells.com",
      },
      image: payload.data?.image || "",
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });

  self.addEventListener("notificationclick", function (event) {
    console.log("🔐 노티 클릭", event);
    event.notification.close();
    event.waitUntil(
      clients.openWindow(
        event.notification.data?.url ||
          event.notification.data?.click_action ||
          "https://quizbells.com"
      )
    );
  });

  self.addEventListener("install", (event) => {
    console.log("🔐 설치 이벤트", event);
    self.skipWaiting();
  });

  self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim());
  });

  self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
      self.skipWaiting();
    }
  });
}
