// src/app/api/sitemap.xml/route.ts
import { quizItems } from "@/utils/utils";

export const runtime = "edge";

const BASE_URL = "https://quizbells.com";
const QUIZ_TYPES = quizItems.map((type) => type.type);

// 한국 시간(KST, UTC+9)으로 현재 날짜 가져오기 (W3C Datetime 포맷)
function getKoreaDateString(): string {
  const now = new Date();
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const koreaTime = new Date(utcTime + 9 * 60 * 60 * 1000); // UTC+9

  const year = koreaTime.getFullYear();
  const month = String(koreaTime.getMonth() + 1).padStart(2, "0");
  const day = String(koreaTime.getDate()).padStart(2, "0");

  // W3C Datetime 포맷: YYYY-MM-DDTHH:mm:ss+09:00 (한국 시간대)
  return `${year}-${month}-${day}T00:00:00+09:00`;
}

// 날짜 문자열(YYYY-MM-DD)을 W3C Datetime 포맷으로 변환
function toW3CDatetime(dateString: string): string {
  // YYYY-MM-DD 형식의 날짜를 W3C Datetime 포맷으로 변환
  return `${dateString}T00:00:00+09:00`;
}

// 최근 1개월(30일) + 내일까지 포함된 날짜 리스트 생성
function generateDatesLastMonth(): string[] {
  const dates: string[] = [];
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1); // 내일

  // 30일 전 날짜 계산
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 30);

  // 30일 전부터 내일까지의 날짜 생성
  for (let d = new Date(startDate); d <= tomorrow; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split("T")[0]); // YYYY-MM-DD
  }

  return dates.reverse(); // 최신 날짜가 앞에 오도록 역순 정렬
}

export async function GET() {
  const recentDates = generateDatesLastMonth(); // 최근 1개월(30일) + 내일 포함
  const todayDate = getKoreaDateString(); // 오늘 날짜 (항상 최신)
  const urls: {
    loc: string;
    lastmod: string;
    priority: string;
    changefreq: string;
  }[] = [];

  // ✅ DB에서 게시글 목록 추가 (posts/{id})
  for (const index of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    urls.push({
      loc: `${BASE_URL}/posts/${index}`,
      lastmod: "2025-12-05T00:00:00+09:00", // W3C Datetime 포맷
      priority: "0.7",
      changefreq: "weekly",
    });
  }

  // 날짜 기준 정렬 → 하루 날짜당 모든 type 묶어서 넣기
  for (const date of recentDates) {
    for (const type of QUIZ_TYPES) {
      urls.push({
        loc: `${BASE_URL}/quiz/${type}/${date}`,
        lastmod: toW3CDatetime(date), // W3C Datetime 포맷으로 변환
        priority: "0.7",
        changefreq: "daily",
      });
    }
  }

  // 각 타입별 today 경로는 항상 오늘 날짜로 설정하고 최고 우선순위 설정
  for (const type of QUIZ_TYPES) {
    urls.unshift({
      loc: `${BASE_URL}/quiz/${type}/today`,
      lastmod: todayDate, // 항상 오늘 날짜 (최신, W3C Datetime 포맷)
      priority: "1.0", // 최고 우선순위
      changefreq: "hourly", // /today 경로는 hourly로 변경
    });
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, lastmod, priority, changefreq }) => `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
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
