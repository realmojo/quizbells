"use client";

interface RewardedAdButtonProps {
  href: string;
  children: React.ReactNode;
}

export default function RewardedAdButton({
  href,
  children,
}: RewardedAdButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const w = window as any;

    if (w.__rewardedAdEvent) {
      // 광고 준비됨 → 전면광고 표시
      w.__pendingNavUrl = href;
      w.__rewardedAdEvent.makeRewardedVisible();
      w.__rewardedAdEvent = null;
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
