import { quizItems } from "@/utils/utils";

export const runtime = "edge";

const BASE_URL = "https://quizbells.com";
const QUIZ_TYPES = quizItems.map((type) => type.type);

// 최근 1개월(30일) + 내일까지 포함된 날짜 리스트 생성
function generateDatesLastMonth(): string[] {
  const dates: string[] = [];
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 30);

  for (let d = new Date(startDate); d <= tomorrow; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split("T")[0]);
  }

  return dates.reverse();
}

export async function GET() {
  const recentDates = generateDatesLastMonth();

  const urls: {
    loc: string;
    lastmod: string;
    priority: string;
    changefreq: string;
  }[] = [];

  // 게시글 목록 (posts/{id})
  for (const index of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    urls.push({
      loc: `${BASE_URL}/posts/${index}`,
      lastmod: "2025-12-05",
      priority: "0.7",
      changefreq: "weekly",
    });
  }

  // 날짜별 퀴즈 페이지 (quiz/{type}/{date})
  for (const date of recentDates) {
    for (const type of QUIZ_TYPES) {
      urls.push({
        loc: `${BASE_URL}/quiz/${type}/${date}`,
        lastmod: date,
        priority: "0.7",
        changefreq: "daily",
      });
    }
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, lastmod, priority, changefreq }) => `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`,
  )
  .join("")}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
