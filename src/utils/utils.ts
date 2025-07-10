import { messaging, getToken } from "@/lib/firebase";
import { nanoid } from "nanoid";

export const getQuitItem = (type: string) => {
  const item = quizItems.find((item) => item.type === type);
  return item;
};

export const quizItems = [
  {
    type: "toss",
    typeKr: "토스",
    title: "행운퀴즈",
    image: "/images/toss.png",
    slotId: "6798248536",
  },
  {
    type: "cashwalk",
    typeKr: "캐시워크",
    title: "돈버는퀴즈",
    image: "/images/cashwalk.png",
    slotId: "4172085197",
  },
  {
    type: "shinhan",
    typeKr: "신한쏠페이",
    title: "쏠퀴즈, 퀴즈팡팡, 출석퀴즈",
    image: "/images/shinhan.png",
    slotId: "5131294718",
  },
  {
    type: "kakaobank",
    typeKr: "카카오뱅크",
    title: "OX 퀴즈",
    image: "/images/kakaobank.png",
    slotId: "3818213044",
  },
  {
    type: "nh",
    typeKr: "농협",
    title: "디깅 퀴즈",
    image: "/images/nh.png",
    slotId: "7102851930",
  },
  {
    type: "kakaopay",
    typeKr: "카카오페이",
    title: "퀴즈타임",
    image: "/images/kakaopay.png",
    slotId: "2505131371",
  },
  {
    type: "bitbunny",
    typeKr: "비트버니",
    title: "오늘의 퀴즈",
    image: "/images/bitbunny.png",
    slotId: "1192049702",
  },
  {
    type: "okcashbag",
    typeKr: "오케이캐시백",
    title: "오퀴즈",
    image: "/images/okcashbag.png",
    slotId: "3728112507",
  },
  {
    type: "cashdoc",
    typeKr: "캐시닥",
    title: "용돈퀴즈",
    image: "/images/cashdoc.png",
    slotId: "8878968030",
  },
  {
    type: "kbstar",
    typeKr: "KB스타 KBPAY",
    title: "도전미션 스타퀴즈, 오늘의 퀴즈",
    image: "/images/kbstar.png",
    slotId: "8224361914",
  },
  {
    type: "3o3",
    typeKr: "삼쩜삼",
    title: "오늘의 퀴즈",
    image: "/images/3o3.png",
    slotId: "1150336034",
  },
  {
    type: "doctornow",
    typeKr: "닥터나우",
    title: "오늘의 퀴즈",
    image: "/images/doctornow.png",
    slotId: "2667431838",
  },
  {
    type: "mydoctor",
    typeKr: "나만의 닥터",
    title: "건강 퀴즈",
    image: "/images/mydoctor.png",
    slotId: "9392622289",
  },
  {
    type: "hpoint",
    typeKr: "에이치포인트",
    title: "오늘의 퀴즈",
    image: "/images/hpoint.png",
    slotId: "5598198579",
  },
  {
    type: "climate",
    typeKr: "기후행동 기회소득",
    title: "오늘의 퀴즈",
    image: "/images/climate.png",
    slotId: "8079540616",
  },
  {
    type: "skstoa",
    typeKr: "SK 스토아",
    title: "퀴즈타임",
    image: "/images/skstoa.png",
    slotId: "7374314675",
  },
  {
    type: "hanabank",
    typeKr: "하나은행",
    title: "퀴즈하나",
    image: "/images/hanabank.png",
    slotId: "6061233003",
  },
  {
    type: "auction",
    typeKr: "옥션",
    title: "매일퀴즈",
    image: "/images/auction.png",
    slotId: "4748151334",
  },
];

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

export const requestAlarmPermission = async () => {
  if ("Notification" in window) {
    try {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        // 권한 허용시 /mynow로 이동

        if (messaging) {
          // FCM 토큰 받아오기
          const userId = nanoid(12);
          const fcmToken = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
          });

          const quizbellInfo = {
            userId,
            joinType:
              isBrowser().isDesktopBrowser || isBrowser().isMobileBrowser
                ? "web"
                : isApple()
                  ? "ios"
                  : "android",
            fcmToken,
          };
          const res = await fetch("/api/token", {
            method: "POST",
            body: JSON.stringify(quizbellInfo),
          });
          const r = await res.json();
          if (r.data === "ok") {
            setUserAuth(quizbellInfo);
            console.log("🔔 토큰 저장", quizbellInfo);
          }

          // if (detectDevice().isDesktop) {
          sendNotificationTest();
          // }

          return true;
        }
      } else {
        // 권한 거부시 메시지 유지
        alert(
          "알림 권한이 거부되었습니다. 브라우저 설정에서 알림을 허용해주세요."
        );
        return false;
      }
    } catch (error) {
      console.error("알림 권한 요청 실패:", error);
      return false;
    }
  } else {
    return false;
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

export const isBrowser = (): {
  isBrowser: boolean;
  isMobileBrowser: boolean;
  isDesktopBrowser: boolean;
} => {
  const isBrowser =
    typeof window !== "undefined" &&
    typeof window.document !== "undefined" &&
    typeof navigator !== "undefined";

  if (!isBrowser) {
    return {
      isBrowser: false,
      isMobileBrowser: false,
      isDesktopBrowser: false,
    };
  }

  const ua = navigator.userAgent;
  const platform = navigator.platform;
  const maxTouchPoints = navigator.maxTouchPoints || 0;

  const isMobileBrowser =
    /Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

  const isTabletBrowser =
    /iPad|Tablet/i.test(ua) || (platform === "MacIntel" && maxTouchPoints > 1); // iPadOS Safari 대응

  const isDesktopBrowser = !isMobileBrowser && !isTabletBrowser;

  return {
    isBrowser: true,
    isMobileBrowser,
    isDesktopBrowser,
  };
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

export const isIOS = () => {
  const ua = navigator.userAgent;
  const platform = navigator.platform;
  const maxTouchPoints = navigator.maxTouchPoints || 0;

  const isIOS = /iPhone|iPod/.test(ua);
  const isIPad =
    /iPad/.test(ua) || (platform === "MacIntel" && maxTouchPoints > 1);

  return isIOS || isIPad;
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
export const getPlainTextFromFirstParagraph = (html: string): string => {
  if (!html) return "";

  const match = html.match(/<p[^>]*>(.*?)<\/p>/i);
  if (match && match[1]) {
    return match[1].replace(/<[^>]*>/g, "").trim();
  }
  return "";
};
