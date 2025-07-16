"use client";
import { Button } from "@/components/ui/button";
import { isIOS } from "@/utils/utils";
import { ArrowRight } from "lucide-react";

export default function AppOpen({ type }: { type: string }) {
  if (type === "toss") {
    return (
      <div className="w-full flex justify-center my-6">
        <a
          href={
            isIOS()
              ? "https://apps.apple.com/kr/app/%ED%86%A0%EC%8A%A4/id839333328"
              : "https://play.google.com/store/apps/details?id=viva.republica.toss&hl=ko"
          }
          target="_self"
          rel="noopener noreferrer"
          className="group w-full min-h-[50px]"
        >
          <Button className="bg-blue-600 w-full min-h-[50px] hover:bg-blue-700 text-white px-6 py-4 text-lg font-semibold shadow-md transition-all duration-300 group-hover:scale-102">
            토스 행운퀴즈 참여하기
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </a>
      </div>
    );
  } else if (type === "cashwalk") {
    return (
      <div className="w-full flex justify-center my-6">
        <a
          href={
            isIOS()
              ? "https://apps.apple.com/kr/app/%EC%BA%90%EC%8B%9C%EC%9B%8C%ED%81%AC-%EB%8F%88-%EB%B2%84%EB%8A%94-%EB%A7%8C%EB%B3%B4%EA%B8%B0/id1220307907"
              : "https://play.google.com/store/apps/details?id=com.cashwalk.cashwalk&hl=ko"
          }
          target="_self"
          rel="noopener noreferrer"
          className="group w-full min-h-[50px]"
        >
          <Button className="bg-yellow-300 w-full min-h-[50px] hover:bg-yellow-300 text-black px-6 py-4 text-lg font-semibold shadow-md transition-all duration-300 group-hover:scale-102">
            캐시워크 퀴즈 참여하기
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </a>
      </div>
    );
  } else if (type === "shinhan") {
    return (
      <div className="w-full flex justify-center my-6">
        <a
          href={
            isIOS()
              ? "https://apps.apple.com/kr/app/%EC%8B%A0%ED%95%9C-%EC%8A%88%ED%8D%BCsol-%EC%8B%A0%ED%95%9C-%EC%9C%A0%EB%8B%88%EB%B2%84%EC%84%A4-%EA%B8%88%EC%9C%B5-%EC%95%B1/id486872386"
              : "https://play.google.com/store/apps/details?id=com.shinhan.smartcaremgr"
          }
          target="_self"
          rel="noopener noreferrer"
          className="group w-full min-h-[50px]"
        >
          <Button className="bg-blue-600 w-full min-h-[50px] hover:bg-blue-700 text-white px-6 py-4 text-lg font-semibold shadow-md transition-all duration-300 group-hover:scale-102">
            신한쏠페이 퀴즈 참여하기
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </a>
      </div>
    );
  } else if (type === "kakaobank") {
    return (
      <div className="w-full flex justify-center my-6">
        <a
          href={
            "https://kakaobank.onelink.me/0qMi/ysxkqbud"
            // isIOS()
            //   ? "https://apps.apple.com/kr/app/%EC%B9%B4%EC%B9%B4%EC%98%A4%EB%B1%85%ED%81%AC/id1258016944"
            //   : "https://play.google.com/store/apps/details?id=com.kakaobank.channel"
          }
          target="_self"
          rel="noopener noreferrer"
          className="group w-full min-h-[50px]"
        >
          <Button className="bg-yellow-300 w-full min-h-[50px] hover:bg-yellow-300 text-black px-6 py-4 text-lg font-semibold shadow-md transition-all duration-300 group-hover:scale-102">
            카카오뱅크 OX 퀴즈 참여하기
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </a>
      </div>
    );
  } else if (type === "kakaopay") {
    return (
      <div className="w-full flex justify-center my-6">
        <a
          href={
            isIOS()
              ? "https://apps.apple.com/kr/app/%EC%B9%B4%EC%B9%B4%EC%98%A4%ED%8E%98%EC%9D%B4/id1464496236"
              : "https://play.google.com/store/apps/details?id=com.kakaopay.app"
          }
          target="_self"
          rel="noopener noreferrer"
          className="group w-full min-h-[50px]"
        >
          <Button className="bg-yellow-300 w-full min-h-[50px] hover:bg-yellow-300 text-black px-6 py-4 text-lg font-semibold shadow-md transition-all duration-300 group-hover:scale-102">
            카카오페이 퀴즈 참여하기
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </a>
      </div>
    );
  } else if (type === "okcashbag") {
    return (
      <div className="w-full flex justify-center my-6">
        <a
          href={
            isIOS()
              ? "https://apps.apple.com/kr/app/ok-cashbag/id358731598"
              : "https://play.google.com/store/apps/details?id=com.skmc.okcashbag.home_google&hl=ko"
          }
          target="_self"
          rel="noopener noreferrer"
          className="group w-full min-h-[50px]"
        >
          <Button className="bg-red-400 w-full min-h-[50px] hover:bg-red-400 text-white px-6 py-4 text-lg font-semibold shadow-md transition-all duration-300 group-hover:scale-102">
            오케이캐시백 퀴즈 참여하기
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </a>
      </div>
    );
  } else if (type === "cashdoc") {
    return (
      <div className="w-full flex justify-center my-6">
        <a
          href={
            isIOS()
              ? "https://apps.apple.com/kr/app/%EC%BA%90%EC%8B%9C%EB%8B%A5-%EB%B3%91%EC%9B%90-%EC%B0%BE%EA%B8%B0-%EC%8B%9C%EC%88%A0-%EC%B5%9C%EC%A0%80%EA%B0%80-%ED%98%9C%ED%83%9D-%EB%B3%91%EC%9B%90-%EC%98%88%EC%95%BD-%ED%95%98%EA%B8%B0/id1483471584"
              : "https://play.google.com/store/apps/details?id=com.cashdoc.cashdoc&hl=ko"
          }
          target="_self"
          rel="noopener noreferrer"
          className="group w-full min-h-[50px]"
        >
          <Button className="bg-yellow-300 w-full min-h-[50px] hover:bg-yellow-300 text-black px-6 py-4 text-lg font-semibold shadow-md transition-all duration-300 group-hover:scale-102">
            캐시닥 퀴즈 참여하기
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </a>
      </div>
    );
  } else if (type === "kbstar") {
    return (
      <div className="w-full flex justify-center my-6">
        <a
          href={
            isIOS()
              ? "https://apps.apple.com/kr/app/kb%EC%8A%A4%ED%83%80%EB%B1%85%ED%82%B9/id373742138"
              : "https://play.google.com/store/apps/details?id=com.kbstar.kbbank&hl=ko"
          }
          target="_self"
          rel="noopener noreferrer"
          className="group w-full min-h-[50px]"
        >
          <Button className="bg-yellow-300 w-full min-h-[50px] hover:bg-yellow-300 text-black px-6 py-4 text-lg font-semibold shadow-md transition-all duration-300 group-hover:scale-102">
            KB스타뱅킹 퀴즈 참여하기
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </a>
      </div>
    );
  } else if (type === "bitbunny") {
    return (
      <div className="w-full flex justify-center my-6">
        <a
          href={
            isIOS()
              ? "https://apps.apple.com/kr/app/%EB%B9%84%ED%8A%B8%EB%B2%84%EB%8B%88-%EA%B1%B7%EA%B8%B0%EB%A5%BC-%ED%86%B5%ED%95%9C-%EB%8F%88%EB%B2%8C%EA%B8%B0-%EC%95%B1%ED%85%8C%ED%81%AC-%EB%A7%8C%EB%B3%B4%EA%B8%B0-%EC%95%B1/id6464288548"
              : "https://play.google.com/store/apps/details?id=io.heybit.bitbunny&hl=ko"
          }
          target="_self"
          rel="noopener noreferrer"
          className="group w-full min-h-[50px]"
        >
          <Button className="bg-violet-400 w-full min-h-[50px] hover:bg-violet-400 text-white px-6 py-4 text-lg font-semibold shadow-md transition-all duration-300 group-hover:scale-102">
            비트버니 퀴즈 참여하기
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </a>
      </div>
    );
  } else if (type === "3o3") {
    return (
      <div className="w-full flex justify-center my-6">
        <a
          href={
            isIOS()
              ? "https://apps.apple.com/kr/app/%EC%82%BC%EC%A9%9C%EC%82%BC-%EC%84%B8%EA%B8%88-%EC%8B%A0%EA%B3%A0-%ED%99%98%EA%B8%89-%EB%8F%84%EC%9A%B0%EB%AF%B8/id1584600717"
              : "https://play.google.com/store/apps/details?id=co.jobis.szs&hl=ko"
          }
          target="_self"
          rel="noopener noreferrer"
          className="group w-full min-h-[50px]"
        >
          <Button className="bg-blue-600 w-full min-h-[50px] hover:bg-blue-600 text-white px-6 py-4 text-lg font-semibold shadow-md transition-all duration-300 group-hover:scale-102">
            삼쩜삼 퀴즈 참여하기
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </a>
      </div>
    );
  } else if (type === "doctornow") {
    return (
      <div className="w-full flex justify-center my-6">
        <a
          href={
            isIOS()
              ? "https://apps.apple.com/kr/app/%EB%8B%A5%ED%84%B0%EB%82%98%EC%9A%B0-%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD-1%EC%9C%84-%EB%B9%84%EB%8C%80%EB%A9%B4%EC%A7%84%EB%A3%8C-%EC%95%B1/id1513718380"
              : "https://play.google.com/store/apps/details?id=com.baedalyakgook_user&hl=ko"
          }
          target="_self"
          rel="noopener noreferrer"
          className="group w-full min-h-[50px]"
        >
          <Button className="bg-orange-400 w-full min-h-[50px] hover:bg-orange-400 text-white px-6 py-4 text-lg font-semibold shadow-md transition-all duration-300 group-hover:scale-102">
            닥터나우 퀴즈 참여하기
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </a>
      </div>
    );
  } else if (type === "mydoctor") {
    return (
      <div className="w-full flex justify-center my-6">
        <a
          href={
            isIOS()
              ? "https://apps.apple.com/kr/app/%EB%82%98%EB%A7%8C%EC%9D%98%EB%8B%A5%ED%84%B0-1%EC%9C%84-%EB%B9%84%EB%8C%80%EB%A9%B4%EC%A7%84%EB%A3%8C-%EC%95%BD%EA%B5%AD%EC%B0%BE%EA%B8%B0-%EC%95%B1/id1584940053"
              : "https://play.google.com/store/apps/details?id=com.merakiplace.mydoctor&hl=ko"
          }
          target="_self"
          rel="noopener noreferrer"
          className="group w-full min-h-[50px]"
        >
          <Button className="bg-blue-400 w-full min-h-[50px] hover:bg-blue-400 text-white px-6 py-4 text-lg font-semibold shadow-md transition-all duration-300 group-hover:scale-102">
            나만의닥터 퀴즈 참여하기
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </a>
      </div>
    );
  } else if (type === "climate") {
    return (
      <div className="w-full flex justify-center my-6">
        <a
          href={
            isIOS()
              ? "https://apps.apple.com/kr/app/%EA%B8%B0%ED%9B%84%ED%96%89%EB%8F%99-%EA%B8%B0%ED%9A%8C%EC%86%8C%EB%93%9D/id6504476252"
              : "https://play.google.com/store/apps/details?id=kr.or.ggaction&hl=ko"
          }
          target="_self"
          rel="noopener noreferrer"
          className="group w-full min-h-[50px]"
        >
          <Button className="bg-indigo-600 w-full min-h-[50px] hover:bg-indigo-600 text-white px-6 py-4 text-lg font-semibold shadow-md transition-all duration-300 group-hover:scale-102">
            기후동행기회소득 퀴즈 참여하기
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </a>
      </div>
    );
  } else if (type === "hpoint") {
    return (
      <div className="w-full flex justify-center my-6">
        <a
          href={
            isIOS()
              ? "https://apps.apple.com/kr/app/h-point/id1255389331"
              : "https://play.google.com/store/apps/details?id=kr.co.hpoint.hdgm"
          }
          target="_self"
          rel="noopener noreferrer"
          className="group w-full min-h-[50px]"
        >
          <Button className="bg-indigo-600 w-full min-h-[50px] hover:bg-indigo-600 text-white px-6 py-4 text-lg font-semibold shadow-md transition-all duration-300 group-hover:scale-102">
            에이치포인트 퀴즈 참여하기
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </a>
      </div>
    );
  } else if (type === "skstoa") {
    return (
      <div className="w-full flex justify-center my-6">
        <a
          href={
            isIOS()
              ? "https://apps.apple.com/kr/app/sk%EC%8A%A4%ED%86%A0%EC%95%84/id1129146609"
              : "https://play.google.com/store/apps/details?id=sk.com.shopping&hl=ko"
          }
          target="_self"
          rel="noopener noreferrer"
          className="group w-full min-h-[50px]"
        >
          <Button className="bg-red-400 w-full min-h-[50px] hover:bg-red-400 text-white px-6 py-4 text-lg font-semibold shadow-md transition-all duration-300 group-hover:scale-102">
            SK스토아 퀴즈 참여하기
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </a>
      </div>
    );
  } else if (type === "hanabank") {
    return (
      <div className="w-full flex justify-center my-6">
        <a
          href={
            isIOS()
              ? "https://apps.apple.com/kr/app/%ED%95%98%EB%82%98%EC%9D%80%ED%96%89-%ED%95%98%EB%82%98%EC%9B%90%ED%81%90%EB%8A%94-%EC%A6%90%EA%B1%B0%EC%9A%B4-%ED%98%9C%ED%83%9D%EC%9D%B4-%EA%B0%80%EB%93%9D%ED%95%9C-%EC%9D%80%ED%96%89-%EC%95%B1/id1362508015"
              : "https://play.google.com/store/apps/details?id=com.kebhana.hanapush"
          }
          target="_self"
          rel="noopener noreferrer"
          className="group w-full min-h-[50px]"
        >
          <Button className="bg-teal-400 w-full min-h-[50px] hover:bg-teal-400 text-white px-6 py-4 text-lg font-semibold shadow-md transition-all duration-300 group-hover:scale-102">
            하나원큐 퀴즈 참여하기
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </a>
      </div>
    );
  } else if (type === "auction") {
    return (
      <div className="w-full flex justify-center my-6">
        <a
          href={
            isIOS()
              ? "https://apps.apple.com/kr/app/%EB%AA%A8%EB%B0%94%EC%9D%BC-%EC%87%BC%ED%95%91%EC%9D%80-%EC%98%A5%EC%85%98/id380239756"
              : "https://play.google.com/store/apps/details?id=com.ebay.kr.auction"
          }
          target="_self"
          rel="noopener noreferrer"
          className="group w-full min-h-[50px]"
        >
          <Button className="bg-red-400 w-full min-h-[50px] hover:bg-red-400 text-white px-6 py-4 text-lg font-semibold shadow-md transition-all duration-300 group-hover:scale-102">
            옥션 퀴즈 참여하기
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </a>
      </div>
    );
  } else if (type === "nh") {
    return (
      <div className="w-full flex justify-center my-6">
        <a
          href={
            isIOS()
              ? "https://apps.apple.com/kr/app/nh%EC%98%AC%EC%9B%90%EB%B1%85%ED%81%AC-%EB%86%8D%ED%98%91%EC%9D%80%ED%96%89-%EB%8C%80%ED%91%9C-%ED%94%8C%EB%9E%AB%ED%8F%BC/id1641628055"
              : "https://play.google.com/store/apps/details?id=com.nonghyup.nhallonebank"
          }
          target="_self"
          rel="noopener noreferrer"
          className="group w-full min-h-[50px]"
        >
          <Button className="bg-green-700 w-full min-h-[50px] hover:bg-green-700 text-white px-6 py-4 text-lg font-semibold shadow-md transition-all duration-300 group-hover:scale-102">
            농협 퀴즈 참여하기
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </a>
      </div>
    );
  }

  return null;
}
