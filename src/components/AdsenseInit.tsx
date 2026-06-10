import Script from "next/script";
import { FunctionComponent } from "react";

export const GoogleAdSense: FunctionComponent = () => {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }
  return (
    // lazyOnload: 초기 렌더·LCP가 끝난 뒤 브라우저 유휴 시점에 광고 스크립트를
    // 로드한다. Adsense 컴포넌트는 window.adsbygoogle 큐에 push 하므로 스크립트가
    // 나중에 로드돼도 대기 중인 광고 요청이 정상 처리된다.
    <Script
      id="google-adsense"
      strategy="lazyOnload"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9130836798889522"
      crossOrigin="anonymous"
    />
  );
};
