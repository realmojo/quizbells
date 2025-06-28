import { messaging, getToken } from "@/lib/firebase";

export const detectDevice = () => {
  const ua = navigator.userAgent;
  const isMobile =
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

  // iPadOS 대응 (iPad가 데스크탑 Safari처럼 보일 수 있음)
  const isIPadPro =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;

  return {
    isMobile: isMobile || isIPadPro,
    isDesktop: !(isMobile || isIPadPro),
    userAgent: ua,
  };
};

export const sendNotification = async () => {
  const auth = getUserAuth();
  const response = await fetch("/api/notify", {
    method: "POST",
    body: JSON.stringify({
      token: auth.fcmToken,
      title: "퀴즈벨 퀴즈 풀기 알림 🔔",
      body: "퀴즈벨 퀴즈 풀기 알림입니다.",
      icon: "https://quizbells.com/icons/app-icon@96.png",
      link: "https://quizbells.com",
    }),
  });

  return response;
};

export const refreshToken = async (messaging: any, isTest: boolean = false) => {
  if (!messaging) return;

  const fcmToken = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
  });

  const auth = getUserAuth();

  const quizbellsInfo = {
    userId: auth.userId,
    fcmToken,
  };

  const res = await fetch("/api/token", {
    method: "PATCH",
    body: JSON.stringify(quizbellsInfo),
  });

  if (res.ok) {
    console.log("🔐 토큰 갱신 완료");
    localStorage.setItem("quizbells-auth", JSON.stringify(quizbellsInfo));
    if (isTest) {
      await sendNotification();
    }
  }
};

export const sendNotificationTest = async () => {
  const auth = getUserAuth();
  if (isWebView()) {
    await sendNotification();
  } else {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      if (auth.fcmToken) {
        try {
          const response = await sendNotification();

          const result = await response.json();
          if (!result.success) {
            // 토큰이 만료되서 갱신 후 다시 보냅니다.
            if (messaging) {
              refreshToken(messaging, true);
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      alert("알림 권한이 필요합니다.");
    }
  }
};

export const getUserAuth = () => {
  const item = localStorage.getItem("quizbells-auth") || "";
  if (item) {
    return JSON.parse(item || "{}");
  } else {
    return {
      userId: "",
      fcmToken: "",
    };
  }
};

export const setUserAuth = (quizbellsInfo: any) => {
  localStorage.setItem("quizbells-auth", JSON.stringify(quizbellsInfo));
};

export const isDesktopBrowser = (): boolean => {
  const ua = navigator.userAgent;
  const platform = navigator.platform;
  const maxTouchPoints = navigator.maxTouchPoints || 0;

  const isMobile =
    /Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isTablet =
    /iPad|Tablet/i.test(ua) || (platform === "MacIntel" && maxTouchPoints > 1); // iPadOS 대응

  return !isMobile && !isTablet;
};

export const isApple = () => {
  const ua = navigator.userAgent;
  const platform = navigator.platform;
  const maxTouchPoints = navigator.maxTouchPoints || 0;

  const isIOS = /iPhone|iPod/.test(ua);
  const isIPad =
    /iPad/.test(ua) || (platform === "MacIntel" && maxTouchPoints > 1);
  const isMac = platform === "MacIntel" && maxTouchPoints <= 1;

  return isIOS || isIPad || isMac;
};

export const isWebView = () => {
  if (typeof window === "undefined") return false;

  const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
  const isAndroidWebView = /wv|reactnative|react-native/i.test(ua);
  const isiOS = /iPhone|iPad|iPod/i.test(ua);
  const isSafari = /Safari/.test(ua);
  const isCriOS = /CriOS/.test(ua); // iOS Chrome
  const isFxiOS = /FxiOS/.test(ua); // iOS Firefox
  const isiOSWebView = isiOS && !isSafari && !isCriOS && !isFxiOS;

  return isAndroidWebView || isiOSWebView;
};
