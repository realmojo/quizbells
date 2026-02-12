"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ko">
      <body>
        <main style={{ display: "flex", minHeight: "100vh", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ maxWidth: "400px", width: "100%", textAlign: "center" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
              오류가 발생했습니다
            </h1>
            <p style={{ color: "#666", fontSize: "14px", marginBottom: "24px" }}>
              페이지를 불러오는 중 문제가 발생했습니다.
              <br />
              잠시 후 다시 시도해 주세요.
            </p>
            <button
              onClick={reset}
              style={{ padding: "8px 24px", fontSize: "14px", borderRadius: "6px", border: "1px solid #ccc", cursor: "pointer", marginRight: "8px" }}
            >
              다시 시도
            </button>
            <a href="/" style={{ padding: "8px 24px", fontSize: "14px", borderRadius: "6px", border: "1px solid #ccc", textDecoration: "none", color: "#333" }}>
              홈으로 돌아가기
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
