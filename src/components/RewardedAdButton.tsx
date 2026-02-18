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

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const w = window as any;

    if (w.__rewardedAdHasAd && typeof w.__rewardedAdTrigger === "function") {
      console.log("Showing rewarded ad...");
      w.__pendingNavUrl = href;
      w.__rewardedAdTrigger();
    } else {
      console.log("Ad not ready, navigating directly");
      window.location.href = href;
    }
  };

  return (
    <div onClick={handleClick} className="block mb-3 cursor-pointer">
      {children}
    </div>
  );
}
