"use client";

import { useEffect } from "react";

const GoogleTagComponent = () => {
  useEffect(() => {
    // 1. window.googletag 객체 안전하게 초기화
    const w = window as any;
    w.googletag = w.googletag || { cmd: [] };
    w.googletag.cmd = w.googletag.cmd || [];

    // 2. 명령 대기열(cmd)에 display 호출 추가
    // layout.tsx의 초기화 스크립트도 cmd.push를 사용하므로,
    // 먼저 실행된 layout의 스크립트가 먼저 처리되고, 이어서 display가 처리됩니다.
    w.googletag.cmd.push(() => {
      w.googletag.display("div-gpt-ad-1771410054443-0");
    });

    // 3. 컴포넌트 언마운트 시 해당 슬롯만 정리
    return () => {
      const googletag = w.googletag;
      if (googletag && googletag.destroySlots) {
        googletag.cmd.push(() => {
          // 현재 슬롯 ID에 해당하는 슬롯 객체를 찾아 제거 (전체 제거 방지)
          const pubads = googletag.pubads && googletag.pubads();
          if (pubads) {
            const slots = pubads.getSlots();
            const targetSlot = slots.find(
              (s: any) => s.getSlotElementId() === "div-gpt-ad-1771410054443-0",
            );
            if (targetSlot) {
              googletag.destroySlots([targetSlot]);
            }
          }
        });
      }
    };
  }, []);

  return (
    <div
      style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}
    >
      {/* 실제 광고가 그려질 HTML 요소 */}
      <div id="div-gpt-ad-1771410054443-0" />
    </div>
  );
};

export default GoogleTagComponent;
