"use client";
import { useEffect } from "react";

export default function ClientOnly() {
  useEffect(() => {
    // ✅ 사이드 로그 패널 스타일 추가
    const style = document.createElement("style");
    style.textContent = `
    #tm-console-panel {
      position: fixed;
      bottom: 0; /* 화면 하단에 고정 */
      left: 0; /* 화면 왼쪽에 고정 */
      width: 100%; /* 전체 너비로 확장 */
      height: 300px; /* 높이를 고정 */
      background: rgba(0, 0, 0, 0.85);
      color: #0f0;
      font-family: monospace;
      font-size: 12px;
      overflow-y: auto;
      padding: 10px;
      z-index: 999999;
      white-space: pre-wrap;
    }
    #tm-console-toggle {
      position: fixed;
      bottom: 310px; /* 패널 위쪽에 위치 */
      left: 10px; /* 왼쪽으로 위치 */
      background: #111;
      color: #0f0;
      padding: 5px 10px;
      font-size: 12px;
      z-index: 1000000;
      cursor: pointer;
    }
    .tm-log-line {
      margin-bottom: 5px;
    }
  `;
    document.head.appendChild(style);

    // ✅ 사이드바 DOM 요소 추가
    const panel = document.createElement("div");
    panel.id = "tm-console-panel";
    document.body.appendChild(panel);

    const toggle = document.createElement("div");
    toggle.id = "tm-console-toggle";
    toggle.textContent = "👁️ 로그 보기";
    toggle.onclick = () => {
      panel.style.display = panel.style.display === "none" ? "block" : "none";
    };
    document.body.appendChild(toggle);

    // ✅ 기존 console.log 저장
    const originalConsoleLog = console.log;

    // ✅ console.log 재정의
    console.log = (...args) => {
      // 원래 로그도 출력
      originalConsoleLog(...args);

      // 로그 문자열화
      const logText = args
        .map((arg) =>
          typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)
        )
        .join(" ");

      // 패널에 추가
      const line = document.createElement("div");
      line.className = "tm-log-line";
      line.textContent = "🟢 " + logText;
      panel.appendChild(line);

      // 스크롤 아래로
      panel.scrollTop = panel.scrollHeight;
    };
  }, []);

  return null;
}
