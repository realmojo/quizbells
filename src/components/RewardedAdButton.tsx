"use client";

import { useEffect } from "react";

// 모듈 스코프: 보상형 광고 이벤트 & 네비게이션 URL 저장
let rewardedAdEvent: any = null;
let pendingNavigationUrl: string | null = null;
let listenerRegistered = false;

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
    w.googletag = w.googletag || { cmd: [] };

    if (!listenerRegistered) {
      listenerRegistered = true;

      w.googletag.cmd.push(() => {
        // 보상형 광고 준비 완료 이벤트
        w.googletag.pubads().addEventListener(
          "rewardedSlotReady",
          (event: any) => {
            rewardedAdEvent = event;
          },
        );

        // 보상형 광고 닫힘 이벤트 → 정답 페이지로 이동
        w.googletag.pubads().addEventListener("rewardedSlotClosed", () => {
          if (pendingNavigationUrl) {
            window.location.href = pendingNavigationUrl;
            pendingNavigationUrl = null;
          }
        });

        // 보상 지급 완료 이벤트
        w.googletag.pubads().addEventListener("rewardedSlotGranted", () => {
          // 보상 지급 완료, close 시 네비게이션 진행
        });
      });
    }
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (rewardedAdEvent) {
      // 광고 준비됨 → 전면광고 표시
      pendingNavigationUrl = href;
      rewardedAdEvent.makeRewardedVisible();
      rewardedAdEvent = null; // 1회만 표시 가능
    } else {
      // 광고 미준비 → 바로 이동
      window.location.href = href;
    }
  };

  return (
    <a href={href} onClick={handleClick} className="block mb-3">
      {children}
    </a>
  );
}
