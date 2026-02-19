"use client";

import { useEffect } from "react";

interface RewardedAdButtonProps {
  href: string;
  children: React.ReactNode;
}

export default function RewardedAdButton({
  href,
  children,
}: RewardedAdButtonProps) {
  useEffect(() => {
    const w = window as any;
    if (typeof w.loadRewardedAd === "function") {
      w.loadRewardedAd();
    }
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const w = window as any;

    if (w.__rewardedAdHasAd && typeof w.__rewardedAdTrigger === "function") {
      // GPT 보상형 광고 준비됨 → 광고 표시 후 이동
      e.preventDefault();
      console.log("Showing rewarded ad...");
      w.__pendingNavUrl = href;
      w.__rewardedAdTrigger();
    } else {
      // 광고 없음 → <a> 태그 기본 동작으로 이동 (AdSense 바이네트 개입 가능)
      console.log("Ad not ready, navigating via <a> tag");
    }
  };

  return (
    <a href={href} onClick={handleClick} className="block mb-3 cursor-pointer">
      {children}
    </a>
  );
}
