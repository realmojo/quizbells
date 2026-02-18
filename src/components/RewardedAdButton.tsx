"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface RewardedAdButtonProps {
  href: string;
  children: React.ReactNode;
}

export default function RewardedAdButton({
  href,
  children,
}: RewardedAdButtonProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const w = window as any;

    // 광고 이벤트 객체가 있는지 확인
    if (w.__rewardedAdEvent) {
      console.log("Showing rewarded ad...");
      // 이동할 URL 저장
      w.__pendingNavUrl = href;
      // 광고 표시
      w.__rewardedAdEvent.makeRewardedVisible();
      // 이벤트 객체 초기화 (재사용 방지, 닫힌 후 refresh되면 다시 채워짐)
      w.__rewardedAdEvent = null;
    } else {
      console.log("Ad not ready, navigating directly");
      // 광고가 준비되지 않았으면 바로 이동
      router.push(href);
    }
  };

  return (
    <div onClick={handleClick} className="block mb-3 cursor-pointer">
      {children}
    </div>
  );
}
