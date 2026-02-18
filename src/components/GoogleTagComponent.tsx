"use client";

import { useEffect } from "react";

const GoogleTagComponent = () => {
  useEffect(() => {
    // 전역 googletag 객체 확인 및 초기화
    const w = window as any;
    w.googletag = w.googletag || {};
    w.googletag.cmd = w.googletag.cmd || [];

    const googletag = w.googletag;

    googletag.cmd.push(() => {
      // 정의된 슬롯에 광고를 표시함
      googletag.display("div-gpt-ad-1771389317304-0");
    });

    // 선택 사항: 컴포넌트가 사라질 때 광고 슬롯을 비워주는 것이 좋습니다.
    return () => {
      if (googletag.destroySlots) {
        googletag.cmd.push(() => {
          googletag.destroySlots();
        });
      }
    };
  }, []);

  return (
    <div
      style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}
    >
      {/* 실제 광고가 그려질 HTML 요소 */}
      <div
        id="div-gpt-ad-1771389317304-0"
        style={{ minWidth: "336px", minHeight: "280px" }}
      />
    </div>
  );
};

export default GoogleTagComponent;
