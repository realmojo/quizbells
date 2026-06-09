// components/Adsense.tsx
"use client";
declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}
import { useEffect } from "react";

type AdsenseProps = {
  slotId: string;
  format?: "auto" | "autorelaxed";
};

export default function Adsense({ slotId, format = "auto" }: AdsenseProps) {
  const isDev = process.env.NODE_ENV === "development";

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (!isDev) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("Adsense load error", e);
      }
    }
  }, [slotId]);

  if (isDev) {
    return (
      <div className="adsense-dev text-white bg-gray-800 p-2 min-h-[320px] mb-8 rounded">
        애드센스 {slotId}
      </div>
    );
  }

  if (format === "autorelaxed") {
    // CLS 방지: 광고 로드 전 영역을 미리 확보 (matched content는 세로로 김)
    return (
      <div style={{ minHeight: 600 }} className="mb-8">
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-9130836798889522"
          data-ad-slot={slotId}
          data-matched-content-ui-type="text"
          data-matched-content-rows-num="4"
          data-matched-content-columns-num="1"
          data-ad-format="autorelaxed"
        />
      </div>
    );
  }

  // CLS 방지: 광고가 비동기로 로드되며 아래 콘텐츠를 밀어내지 않도록
  // 인스트림 광고 영역 높이를 미리 예약한다.
  return (
    <div style={{ minHeight: 280 }} className="mb-8">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-9130836798889522"
        data-ad-slot={slotId}
        data-ad-format={format || "auto"}
        data-full-width-responsive="true"
      />
    </div>
  );
}
