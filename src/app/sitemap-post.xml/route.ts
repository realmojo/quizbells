// src/app/api/sitemap.xml/route.ts

const BASE_URL = "https://quizbells.com";

const QUIZ_TYPES = [
  "toss",
  "cashwalk",
  "shinhan",
  "okcashbag",
  "cashdoc",
  "kbstar",
  "bitbunny",
];

// 최근 N일 날짜 리스트
function generateDatesFromTomorrowToPast(days: number = 30): string[] {
  const dates: string[] = [];

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1); // 내일

  for (let i = 0; i <= days; i++) {
    const date = new Date(tomorrow);
    date.setDate(tomorrow.getDate() - i);
    dates.push(date.toISOString().split("T")[0]); // YYYY-MM-DD
  }

  return dates;
}

export async function GET() {
  const recentDates = generateDatesFromTomorrowToPast(90); // 최근 3개월
  const urls: { loc: string; lastmod: string }[] = [];

  // 날짜 기준 정렬 → 하루 날짜당 모든 type 묶어서 넣기
  for (const date of recentDates) {
    for (const type of QUIZ_TYPES) {
      urls.push({
        loc: `${BASE_URL}/quiz/${type}/${date}`,
        lastmod: date,
      });
    }
  }

  // 각 타입별 기본 URL은 가장 앞에 한번만 삽입
  const todayStr = recentDates[0];
  for (const type of QUIZ_TYPES) {
    urls.unshift({
      loc: `${BASE_URL}/quiz/${type}`,
      lastmod: todayStr,
    });
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, lastmod }) => `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`
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
