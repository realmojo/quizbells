"use client";
import { isIOS } from "@/utils/utils";
import { ArrowRight } from "lucide-react";

interface AppData {
  ios: string;
  android: string;
  buttonText: string;
  bgColor: string;
  hoverColor: string;
  textColor: string;
}

const APP_DATA: Record<string, AppData> = {
  toss: {
    ios: "https://apps.apple.com/kr/app/%ED%86%A0%EC%8A%A4/id839333328",
    android:
      "https://play.google.com/store/apps/details?id=viva.republica.toss&hl=ko",
    buttonText: "토스 행운퀴즈 참여하기",
    bgColor: "bg-blue-600",
    hoverColor: "hover:bg-blue-700",
    textColor: "text-white",
  },
  cashwalk: {
    ios: "https://apps.apple.com/kr/app/%EC%BA%90%EC%8B%9C%EC%9B%8C%ED%81%AC-%EB%8F%88-%EB%B2%84%EB%8A%94-%EB%A7%8C%EB%B3%B4%EA%B8%B0/id1220307907",
    android:
      "https://play.google.com/store/apps/details?id=com.cashwalk.cashwalk&hl=ko",
    buttonText: "캐시워크 퀴즈 참여하기",
    bgColor: "bg-yellow-300",
    hoverColor: "hover:bg-yellow-300",
    textColor: "text-black",
  },
  shinhan: {
    ios: "https://apps.apple.com/kr/app/%EC%8B%A0%ED%95%9C-%EC%8A%88%ED%8D%BCsol-%EC%8B%A0%ED%95%9C-%EC%9C%A0%EB%8B%88%EB%B2%84%EC%84%A4-%EA%B8%88%EC%9C%B5-%EC%95%B1/id486872386",
    android:
      "https://play.google.com/store/apps/details?id=com.shinhan.smartcaremgr",
    buttonText: "신한쏠페이 퀴즈 참여하기",
    bgColor: "bg-blue-600",
    hoverColor: "hover:bg-blue-700",
    textColor: "text-white",
  },
  kakaobank: {
    ios: "https://kakaobank.onelink.me/0qMi/ysxkqbud",
    android: "https://kakaobank.onelink.me/0qMi/ysxkqbud",
    buttonText: "카카오뱅크 OX 퀴즈 참여하기",
    bgColor: "bg-yellow-300",
    hoverColor: "hover:bg-yellow-300",
    textColor: "text-black",
  },
  kakaopay: {
    ios: "https://link.kakaopay.com/_/9mQy4i0",
    android: "https://link.kakaopay.com/_/9mQy4i0",
    buttonText: "카카오페이 퀴즈 참여하기",
    bgColor: "bg-yellow-300",
    hoverColor: "hover:bg-yellow-300",
    textColor: "text-black",
  },
  okcashbag: {
    ios: "https://apps.apple.com/kr/app/ok-cashbag/id358731598",
    android:
      "https://play.google.com/store/apps/details?id=com.skmc.okcashbag.home_google&hl=ko",
    buttonText: "오케이캐시백 퀴즈 참여하기",
    bgColor: "bg-red-400",
    hoverColor: "hover:bg-red-400",
    textColor: "text-white",
  },
  cashdoc: {
    ios: "https://apps.apple.com/kr/app/%EC%BA%90%EC%8B%9C%EB%8B%A5-%EB%B3%91%EC%9B%90-%EC%B0%BE%EA%B8%B0-%EC%8B%9C%EC%88%A0-%EC%B5%9C%EC%A0%80%EA%B0%80-%ED%98%9C%ED%83%9D-%EB%B3%91%EC%9B%90-%EC%98%88%EC%95%BD-%ED%95%98%EA%B8%B0/id1483471584",
    android:
      "https://play.google.com/store/apps/details?id=com.cashdoc.cashdoc&hl=ko",
    buttonText: "캐시닥 퀴즈 참여하기",
    bgColor: "bg-yellow-300",
    hoverColor: "hover:bg-yellow-300",
    textColor: "text-black",
  },
  kbstar: {
    ios: "https://apps.apple.com/kr/app/kb%EC%8A%A4%ED%83%80%EB%B1%85%ED%82%B9/id373742138",
    android:
      "https://play.google.com/store/apps/details?id=com.kbstar.kbbank&hl=ko",
    buttonText: "KB스타뱅킹 퀴즈 참여하기",
    bgColor: "bg-yellow-300",
    hoverColor: "hover:bg-yellow-300",
    textColor: "text-black",
  },
  bitbunny: {
    ios: "https://apps.apple.com/kr/app/%EB%B9%84%ED%8A%B8%EB%B2%84%EB%8B%88-%EA%B1%B7%EA%B8%B0%EB%A5%BC-%ED%86%B5%ED%95%9C-%EB%8F%88%EB%B2%8C%EA%B8%B0-%EC%95%B1%ED%85%8C%ED%81%AC-%EB%A7%8C%EB%B3%B4%EA%B8%B0-%EC%95%B1/id6464288548",
    android:
      "https://play.google.com/store/apps/details?id=io.heybit.bitbunny&hl=ko",
    buttonText: "비트버니 퀴즈 참여하기",
    bgColor: "bg-violet-400",
    hoverColor: "hover:bg-violet-400",
    textColor: "text-white",
  },
  "3o3": {
    ios: "https://apps.apple.com/kr/app/%EC%82%BC%EC%A9%9C%EC%82%BC-%EC%84%B8%EA%B8%88-%EC%8B%A0%EA%B3%A0-%ED%99%98%EA%B8%89-%EB%8F%84%EC%9A%B0%EB%AF%B8/id1584600717",
    android: "https://play.google.com/store/apps/details?id=co.jobis.szs&hl=ko",
    buttonText: "삼쩜삼 퀴즈 참여하기",
    bgColor: "bg-blue-600",
    hoverColor: "hover:bg-blue-600",
    textColor: "text-white",
  },
  doctornow: {
    ios: "https://apps.apple.com/kr/app/%EB%8B%A5%ED%84%B0%EB%82%98%EC%9A%B0-%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD-1%EC%9C%84-%EB%B9%84%EB%8C%80%EB%A9%B4%EC%A7%84%EB%A3%8C-%EC%95%B1/id1513718380",
    android:
      "https://play.google.com/store/apps/details?id=com.baedalyakgook_user&hl=ko",
    buttonText: "닥터나우 퀴즈 참여하기",
    bgColor: "bg-orange-400",
    hoverColor: "hover:bg-orange-400",
    textColor: "text-white",
  },
  mydoctor: {
    ios: "https://apps.apple.com/kr/app/%EB%82%98%EB%A7%8C%EC%9D%98%EB%8B%A5%ED%84%B0-1%EC%9C%84-%EB%B9%84%EB%8C%80%EB%A9%B4%EC%A7%84%EB%A3%8C-%EC%95%BD%EA%B5%AD%EC%B0%BE%EA%B8%B0-%EC%95%B1/id1584940053",
    android:
      "https://play.google.com/store/apps/details?id=com.merakiplace.mydoctor&hl=ko",
    buttonText: "나만의닥터 퀴즈 참여하기",
    bgColor: "bg-blue-400",
    hoverColor: "hover:bg-blue-400",
    textColor: "text-white",
  },
  climate: {
    ios: "https://apps.apple.com/kr/app/%EA%B8%B0%ED%9B%84%ED%96%89%EB%8F%99-%EA%B8%B0%ED%9A%8C%EC%86%8C%EB%93%9D/id6504476252",
    android:
      "https://play.google.com/store/apps/details?id=kr.or.ggaction&hl=ko",
    buttonText: "기후동행기회소득 퀴즈 참여하기",
    bgColor: "bg-indigo-600",
    hoverColor: "hover:bg-indigo-600",
    textColor: "text-white",
  },
  hpoint: {
    ios: "https://apps.apple.com/kr/app/h-point/id1255389331",
    android: "https://play.google.com/store/apps/details?id=kr.co.hpoint.hdgm",
    buttonText: "에이치포인트 퀴즈 참여하기",
    bgColor: "bg-indigo-600",
    hoverColor: "hover:bg-indigo-600",
    textColor: "text-white",
  },
  skstoa: {
    ios: "https://apps.apple.com/kr/app/sk%EC%8A%A4%ED%86%A0%EC%95%84/id1129146609",
    android:
      "https://play.google.com/store/apps/details?id=sk.com.shopping&hl=ko",
    buttonText: "SK스토아 퀴즈 참여하기",
    bgColor: "bg-red-400",
    hoverColor: "hover:bg-red-400",
    textColor: "text-white",
  },
  hanabank: {
    ios: "https://apps.apple.com/kr/app/%ED%95%98%EB%82%98%EC%9D%80%ED%96%89-%ED%95%98%EB%82%98%EC%9B%90%ED%81%90%EB%8A%94-%EC%A6%90%EA%B1%B0%EC%9A%B4-%ED%98%9C%ED%83%9D%EC%9D%B4-%EA%B0%80%EB%93%9D%ED%95%9C-%EC%9D%80%ED%96%89-%EC%95%B1/id1362508015",
    android:
      "https://play.google.com/store/apps/details?id=com.kebhana.hanapush",
    buttonText: "하나원큐 퀴즈 참여하기",
    bgColor: "bg-teal-400",
    hoverColor: "hover:bg-teal-400",
    textColor: "text-white",
  },
  auction: {
    ios: "https://apps.apple.com/kr/app/%EB%AA%A8%EB%B0%94%EC%9D%BC-%EC%87%BC%ED%95%91%EC%9D%80-%EC%98%A5%EC%85%98/id380239756",
    android:
      "https://play.google.com/store/apps/details?id=com.ebay.kr.auction",
    buttonText: "옥션 퀴즈 참여하기",
    bgColor: "bg-red-400",
    hoverColor: "hover:bg-red-400",
    textColor: "text-white",
  },
  nh: {
    ios: "https://apps.apple.com/kr/app/nh%EC%98%AC%EC%9B%90%EB%B1%85%ED%81%AC-%EB%86%8D%ED%98%91%EC%9D%80%ED%96%89-%EB%8C%80%ED%91%9C-%ED%94%8C%EB%9E%AB%ED%8F%BC/id1641628055",
    android:
      "https://play.google.com/store/apps/details?id=com.nonghyup.nhallonebank",
    buttonText: "디깅 퀴즈 참여하기",
    bgColor: "bg-green-700",
    hoverColor: "hover:bg-green-700",
    textColor: "text-white",
  },
  kbank: {
    ios: "https://apps.apple.com/kr/app/%EC%BC%80%EC%9D%B4%EB%B1%85%ED%81%AC/id1178872627",
    android:
      "https://play.google.com/store/apps/details?id=com.kbankwith.smartbank",
    buttonText: "케이뱅크 퀴즈 참여하기",
    bgColor: "bg-blue-600",
    hoverColor: "hover:bg-blue-600",
    textColor: "text-white",
  },
  monimo: {
    ios: "https://apps.apple.com/kr/app/monimo-%EB%AA%A8%EB%8B%88%EB%AA%A8-%EC%82%BC%EC%84%B1%EA%B8%88%EC%9C%B5%EB%84%A4%ED%8A%B8%EC%9B%8D%EC%8A%A4/id379577046",
    android:
      "https://play.google.com/store/apps/details?id=net.ib.android.smcard&hl=ko",
    buttonText: "모니스쿨 퀴즈 참여하기",
    bgColor: "bg-blue-600",
    hoverColor: "hover:bg-blue-600",
    textColor: "text-white",
  },
};

export default function AppOpen({ type }: { type: string }) {
  const appData = APP_DATA[type];

  if (!appData) {
    return null;
  }

  const url = isIOS() ? appData.ios : appData.android;

  return (
    <div className="w-full flex justify-center my-6">
      <a
        href={url}
        target="_self"
        className={`group w-full min-h-[50px] ${appData.bgColor} ${appData.hoverColor} ${appData.textColor} px-6 py-4 text-lg font-semibold shadow-md transition-all duration-300 hover:scale-102 rounded-md flex items-center justify-center`}
      >
        {appData.buttonText}
        <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
      </a>
    </div>
  );
}
