import { quizItems } from "@/utils/utils";

export const runtime = "edge";

const BASE_URL = "https://quizbells.com";
const QUIZ_TYPES = quizItems.map((item) => item.type);

export async function GET() {
  const lastmod = new Date().toISOString().split("T")[0];

  const urls: {
    loc: string;
    lastmod: string;
    priority: string;
    changefreq: string;
  }[] = [];

  // 모든 퀴즈 타입에 대해 주간/월간 페이지 생성
  for (const type of QUIZ_TYPES) {
    // 주간 페이지
    urls.push({
      loc: `${BASE_URL}/quiz/${type}/weekly`,
      lastmod,
      priority: "0.9",
      changefreq: "daily",
    });

    // 월간 페이지
    urls.push({
      loc: `${BASE_URL}/quiz/${type}/monthly`,
      lastmod,
      priority: "0.9",
      changefreq: "daily",
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
