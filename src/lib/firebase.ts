// Firebase 클라이언트 SDK는 모듈 로드 시 initializeApp() 부수효과가 있고
// firebase/messaging 평가 비용이 커서, top-level 정적 import를 두면 이 모듈을
// import 하는 모든 청크(=layout에서 항상 렌더되는 ForegroundNotification)의 메인
// 번들에 firebase 전체가 포함되어 매 페이지 로드마다 평가된다(Script Evaluation 급증).
//
// 따라서 firebase/app·firebase/messaging는 함수 내부에서 동적 import로만 로드하고,
// 실제로 알림이 필요한 시점(유휴/사용자 동작)에만 초기화한다.

import type { FirebaseApp } from "firebase/app";
import type { Messaging, MessagePayload } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_E2U2dgb8Smz-dBzcrpVlsQtwnxOBCMQ",
  authDomain: "quizbells-2d26a.firebaseapp.com",
  projectId: "quizbells-2d26a",
  storageBucket: "quizbells-2d26a.firebasestorage.app",
  messagingSenderId: "116519638071",
  appId: "1:116519638071:web:f03b878d06712a4e1adbb2",
  measurementId: "G-KH8RLMC19C",
};

let appPromise: Promise<FirebaseApp> | null = null;
let messagingPromise: Promise<Messaging | null> | null = null;

const getApp = (): Promise<FirebaseApp> => {
  if (!appPromise) {
    appPromise = import("firebase/app").then(({ initializeApp }) =>
      initializeApp(firebaseConfig),
    );
  }
  return appPromise;
};

/**
 * 브라우저에서 FCM 지원 시 Messaging 인스턴스를 (한 번만) 초기화해 반환한다.
 * SSR 또는 미지원 브라우저에서는 null.
 */
export const getMessagingInstance = (): Promise<Messaging | null> => {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (!messagingPromise) {
    messagingPromise = (async () => {
      const { isSupported, getMessaging } = await import("firebase/messaging");
      if (!(await isSupported())) {
        console.warn("⚠️ 이 브라우저는 FCM을 지원하지 않습니다.");
        return null;
      }
      console.log("✅ Firebase Messaging Init");
      return getMessaging(await getApp());
    })();
  }
  return messagingPromise;
};

export const getToken = async (
  messaging: Messaging,
  options: { vapidKey?: string },
): Promise<string> => {
  const { getToken } = await import("firebase/messaging");
  return getToken(messaging, options);
};

export const onMessage = async (
  messaging: Messaging,
  next: (payload: MessagePayload) => void,
): Promise<() => void> => {
  const { onMessage } = await import("firebase/messaging");
  return onMessage(messaging, next);
};
