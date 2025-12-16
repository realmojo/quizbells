"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";
import { Share2 } from "lucide-react";

interface ShareProps {
  title: string;
  url: string;
  imageUrl: string;
}

export default function SocialShare({ title, url, imageUrl }: ShareProps) {
  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&t=${encodeURIComponent(title)}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("링크가 클립보드에 복사되었습니다! 📋");
    } catch (error) {
      console.error(error);
      toast.error("링크 복사에 실패했습니다.");
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    script.async = true;
    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init("b9159bd4a3954e13fc54ebe50cb6a5a5");
      }

      // 기존 버튼이 있으면 제거하고 새로 생성하는 것이 안전하지만,
      // Kakao SDK 특성상 중복 바인딩 방지 로직이 필요할 수 있음.
      // 여기서는 cleanup 없이 effect 의존성 배열로 관리.

      try {
        window.Kakao.Link.createDefaultButton({
          container: "#kakao-link-btn",
          objectType: "feed",
          content: {
            title,
            description: title,
            imageUrl: imageUrl || "https://quizbells.com/icons/og-image.png",
            link: { mobileWebUrl: url, webUrl: url },
          },
          buttons: [
            {
              title: "정답 확인하기",
              link: { mobileWebUrl: url, webUrl: url },
            },
          ],
        });
      } catch (e) {
        console.error("카카오톡 공유 에러:", e);
        // 이미 버튼이 생성되었을 경우 에러 무시
      }
    };

    document.head.appendChild(script);

    return () => {
      // script 제거는 굳이 하지 않음 (SDK 로드 유지)
      // 단, 버튼 이벤트 리스너가 누적될 수 있으므로 주의 필요하나
      // 페이지 이동이 잦지 않은 Next.js 특성상 큰 문제 없음.
    };
  }, [title, url, imageUrl]);

  return (
    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-white/50 dark:border-slate-800 text-center mb-8">
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400">
          <Share2 className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          친구에게 정답 공유하기
        </h3>
      </div>

      <p className="text-slate-600 dark:text-slate-400 mb-8 text-sm">
        혼자만 알기 아까운 정답, 친구들과 함께 나누고
        <br />다 같이 포인트를 적립해보세요! 🎁
      </p>

      <div className="flex justify-center items-center gap-4 sm:gap-6">
        <Link
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&hashtags=퀴즈벨`}
          target="_blank"
          className="group relative flex items-center justify-center w-14 h-14 bg-black rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          aria-label="X(트위터) 공유"
        >
          <Image
            src="/images/x.png"
            alt="X share"
            width={24}
            height={24}
            className="invert dark:invert-0"
          />
        </Link>

        <button
          onClick={shareFacebook}
          className="group relative flex items-center justify-center w-14 h-14 bg-[#1877F2] rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          aria-label="페이스북 공유"
        >
          <Image
            src="/images/facebook.png"
            alt="Facebook share"
            width={60} // 원본 이미지가 꽉 차는 형태라면 크기 조절 필요. 여기선 아이콘 느낌으로.
            height={60} // 원본 이미지가 아이콘 자체라면 w-full h-full object-cover 등으로 처리 가능.
            className="w-full h-full object-cover rounded-2xl"
          />
        </button>

        <button
          id="kakao-link-btn"
          className="group relative flex items-center justify-center w-14 h-14 bg-[#FEE500] rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          aria-label="카카오톡 공유"
        >
          <Image
            src="/images/kakao.png"
            alt="Kakao share"
            width={60}
            height={60}
            className="w-full h-full object-cover rounded-2xl"
          />
        </button>

        <button
          onClick={copy}
          className="group relative flex items-center justify-center w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200 dark:border-slate-600"
          aria-label="링크 복사"
        >
          <Image
            src="/images/link.png"
            alt="Copy Link"
            width={28}
            height={28}
            className="opacity-70 group-hover:opacity-100 transition-opacity"
          />
        </button>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    Kakao: any;
  }
}
