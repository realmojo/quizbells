"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

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
      alert("URL이 복사되었습니다.");
    } catch (error) {
      console.error(error);
      alert("URL 복사에 실패했습니다.");
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

      window.Kakao.Link.createDefaultButton({
        container: "#kakao-link-btn",
        objectType: "feed",
        content: {
          title,
          description: title,
          imageUrl,
          link: { mobileWebUrl: url, webUrl: url },
        },
        buttons: [
          {
            title: "정답 확인하기",
            link: { mobileWebUrl: url, webUrl: url },
          },
        ],
      });
    };

    document.head.appendChild(script);
  }, [title, url, imageUrl]);

  return (
    <div className="flex flex-col items-center space-y-4 pb-8">
      <div className="flex justify-center items-center space-x-4">
        <Link
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&hashtags=퀴즈벨`}
          target="_blank"
          className="hover:scale-102 transition-transform"
        >
          <Image
            src="/images/x.png"
            alt="x-share-icon"
            width={50}
            height={50}
            priority
            className="rounded-md"
          />
        </Link>

        <button
          onClick={shareFacebook}
          className="hover:scale-102 transition-transform"
        >
          <Image
            src="/images/facebook.png"
            alt="facebook-share-icon"
            width={60}
            height={60}
            priority
          />
        </button>

        <button
          id="kakao-link-btn"
          className="hover:scale-102 transition-transform"
        >
          <Image
            src="/images/kakao.png"
            alt="kakao-share-icon"
            width={60}
            height={60}
            priority
            className="rounded-md"
          />
        </button>

        <button onClick={copy} className="hover:scale-102 transition-transform">
          <Image
            src="/images/link.png"
            alt="link-share-icon"
            width={50}
            height={50}
            priority
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
