export const runtime = "edge";

const BASE_URL = "https://quizbells.com";

// 한국 시간(UTC+9) 기준 오늘 날짜 반환
function getKoreaTodayDate(): string {
  const now = new Date();
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const koreaTime = new Date(utcTime + 9 * 60 * 60 * 1000);
  const y = koreaTime.getFullYear();
  const m = String(koreaTime.getMonth() + 1).padStart(2, "0");
  const d = String(koreaTime.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export async function GET() {
  const today = getKoreaTodayDate();

  const sitemaps = [
    // 정적 페이지는 변경 빈도 낮음 — 고정 날짜
    { loc: `${BASE_URL}/sitemap-pages.xml`, lastmod: "2025-01-01" },
    // 오늘 퀴즈는 매일 변경
    { loc: `${BASE_URL}/sitemap-quiz-today.xml`, lastmod: today },
    // 주간/월간은 매일 업데이트
    { loc: `${BASE_URL}/sitemap-quiz-periods.xml`, lastmod: today },
    // 날짜별 아카이브는 변경 빈도 낮음
    { loc: `${BASE_URL}/sitemap-quiz-dates.xml`, lastmod: today },
    // 포스트 목록
    { loc: `${BASE_URL}/sitemap-posts.xml`, lastmod: today },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map(
    ({ loc, lastmod }) => `  <sitemap>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`,
  )
  .join("\n")}
</sitemapindex>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
