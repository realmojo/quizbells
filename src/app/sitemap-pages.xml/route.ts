export const runtime = "edge";

const BASE_URL = "https://quizbells.com";

// 정적 페이지 목록
// lastmod가 null이면 요청 시점의 오늘 날짜로 대체됨
// 고정값은 실제로 해당 페이지가 최근에 수정된 날짜를 반영해야 함
const staticPages = [
  { path: "/", priority: "1.0", changefreq: "daily", lastmod: null },
  { path: "/posts", priority: "0.8", changefreq: "weekly", lastmod: null },
  { path: "/tips", priority: "0.7", changefreq: "monthly", lastmod: null },
  { path: "/faq", priority: "0.6", changefreq: "monthly", lastmod: null },
  { path: "/about", priority: "0.5", changefreq: "monthly", lastmod: null },
  { path: "/privacy", priority: "0.3", changefreq: "yearly", lastmod: null },
  { path: "/terms", priority: "0.3", changefreq: "yearly", lastmod: null },
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
