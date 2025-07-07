// src/app/api/sitemap.xml/route.ts
import { queryList } from "@/lib/db"; // ← DB 쿼리 함수 import 필요

const BASE_URL = "https://quizbells.com";

const QUIZ_TYPES = [
  "toss",
  "cashwalk",
  "shinhan",
  "okcashbag",
  "cashdoc",
  "kbstar",
  "bitbunny",
  "3o3",
  "doctornow",
  "mydoctor",
  "kakaobank",
  "kakaopay",
  "hanabank",
  "hpoint",
  "climate",
  "skstoa",
  "auction",
  "nh",
];

// 2025년 6월 1일부터 내일까지 포함된 날짜 리스트 생성
function generateDatesFromStartToTomorrow(
  start: string = "2025-06-01"
): string[] {
  const startDate = new Date(start);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1); // 내일

  const dates: string[] = [];

  for (let d = new Date(startDate); d <= tomorrow; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split("T")[0]); // YYYY-MM-DD
  }

  return dates.reverse();
}

export async function GET() {
  const recentDates = generateDatesFromStartToTomorrow(); // 6/1 ~ 내일 포함
  const urls: { loc: string; lastmod: string }[] = [];
  // ✅ DB에서 게시글 목록 추가 (posts/{id})
  try {
    const rows = await queryList(
      `SELECT id, regdated FROM quizbells_posts ORDER BY regdated DESC`
    );
    console.log("✅ 게시글 데이터 조회 성공:", rows);

    for (const post of rows) {
      urls.push({
        loc: `${BASE_URL}/posts/${post.id}`,
        lastmod: post.regdated.toISOString().split("T")[0],
      });
    }
    console.log("✅ 게시글 데이터 조회 성공:", rows);
  } catch (err) {
    console.error("❌ 게시글 데이터 조회 실패:", err);
  }

  // 날짜 기준 정렬 → 하루 날짜당 모든 type 묶어서 넣기
  for (const date of recentDates) {
    for (const type of QUIZ_TYPES) {
      urls.push({
        loc: `${BASE_URL}/quiz/${type}/${date}`,
        lastmod: date,
      });
    }
  }

  // 각 타입별 today 경로는 내일 날짜를 기준으로 삽입
  const tomorrowStr = recentDates[recentDates.length - 1]; // 가장 마지막 날짜가 내일
  for (const type of QUIZ_TYPES) {
    urls.unshift({
      loc: `${BASE_URL}/quiz/${type}/today`,
      lastmod: tomorrowStr,
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
