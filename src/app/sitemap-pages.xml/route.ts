export const runtime = "edge";

const BASE_URL = "https://quizbells.com";

// 정적 페이지 목록 — lastmod는 실제 변경 주기에 맞게 고정
const staticPages = [
  { path: "/", priority: "1.0", changefreq: "daily", lastmod: null },      // 매일 변경
  // /quiz는 /quiz/${type}/today로 redirect만 하는 페이지라 제외
  { path: "/posts", priority: "0.8", changefreq: "weekly", lastmod: null }, // 콘텐츠 추가 시
  { path: "/tips", priority: "0.7", changefreq: "monthly", lastmod: "2025-06-01" },
  { path: "/faq", priority: "0.6", changefreq: "monthly", lastmod: "2025-01-01" },
  { path: "/about", priority: "0.5", changefreq: "monthly", lastmod: "2025-01-01" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly", lastmod: "2025-01-01" },
  { path: "/terms", priority: "0.3", changefreq: "yearly", lastmod: "2025-01-01" },
];

// 한국 시간 기준 오늘 날짜
function getKoreaTodayDate(): string {
  const now = new Date();
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const koreaTime = new Date(utcTime + 9 * 60 * 60 * 1000);
  return koreaTime.toISOString().split("T")[0];
}

export async function GET() {
  const today = getKoreaTodayDate();

  const urls: {
    loc: string;
    lastmod: string;
    priority: string;
    changefreq: string;
  }[] = [];

  for (const page of staticPages) {
    urls.push({
      loc: `${BASE_URL}${page.path}`,
      lastmod: page.lastmod ?? today,
      changefreq: page.changefreq,
      priority: page.priority,
    });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, lastmod, priority, changefreq }) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
