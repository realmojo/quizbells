// src/app/api/sitemap.xml/route.ts
import { quizItems } from "@/utils/utils";
import { supabaseAdmin } from "@/lib/supabase";

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

  // W3C Datetime 포맷: YYYY-MM-DDTHH:mm:ss (한국 시간대)
  return `${year}-${month}-${day}T00:00:00`;
}

// 날짜 문자열(YYYY-MM-DD)을 W3C Datetime 포맷으로 변환
function toW3CDatetime(dateString: string): string {
  // YYYY-MM-DD 형식의 날짜를 W3C Datetime 포맷으로 변환
  return `${dateString}T00:00:00`;
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
  const todayDateOnly = todayDate.split("T")[0]; // YYYY-MM-DD 형식

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
      lastmod: "2025-12-05T00:00:00", // W3C Datetime 포맷
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

  // 각 타입별 today 경로는 실제 updated 시간을 조회하여 설정
  if (supabaseAdmin) {
    try {
      // 오늘 날짜의 모든 타입 데이터를 한 번에 조회 (updated 필드 포함)
      const { data: todayQuizData, error } = await supabaseAdmin
        .from("quizbells_answer")
        .select("type, updated")
        .eq("answerDate", todayDateOnly)
        .in("type", QUIZ_TYPES)
        .order("updated", { ascending: true });

      console.log("todayQuizData", todayQuizData);

      if (error) {
        console.error("Sitemap updated 시간 조회 오류:", error);
      }

      // 타입별로 updated 시간 매핑
      const updatedMap = new Map<string, string>();
      if (todayQuizData && todayQuizData.length > 0) {
        todayQuizData.forEach((item: any) => {
          if (item.updated) {
            const existing = updatedMap.get(item.type);
            // 더 최신 시간이면 업데이트
            if (!existing || new Date(item.updated) > new Date(existing)) {
              updatedMap.set(item.type, item.updated);
            }
          }
        });
      }

      console.log("updatedMap", updatedMap);

      // 각 타입별 today 경로 추가
      for (const type of QUIZ_TYPES) {
        const updatedTime = updatedMap.get(type);
        let lastmod: string;

        if (updatedTime) {
          try {
            // updatedTime이 이미 한국 시간이므로, 이를 올바르게 W3C Datetime 포맷으로 변환
            const updatedDate = new Date(updatedTime);

            // updatedTime이 한국 시간이므로, UTC로 변환하지 않고 그대로 사용
            // 한국 시간대(UTC+9)에서 직접 추출
            const year = updatedDate.getFullYear();
            const month = String(updatedDate.getMonth() + 1).padStart(2, "0");
            const day = String(updatedDate.getDate()).padStart(2, "0");

            // 한국 시간으로 해석된 시간 추출
            // updatedTime이 한국 시간 문자열이면 getHours()는 한국 시간을 반환
            const hours = String(updatedDate.getHours()).padStart(2, "0");
            const minutes = String(updatedDate.getMinutes()).padStart(2, "0");
            const seconds = String(updatedDate.getSeconds()).padStart(2, "0");

            // W3C Datetime 포맷: 한국 시간대로 명시
            lastmod = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
            console.log(`${type} : ${lastmod}`);
          } catch (e) {
            console.error(`타입 ${type}의 updated 시간 파싱 오류:`, e);
            lastmod = todayDate; // 파싱 실패 시 오늘 날짜 사용
          }
        } else {
          lastmod = todayDate; // updated가 없으면 오늘 날짜 사용
        }

        urls.push({
          loc: `${BASE_URL}/quiz/${type}/today`,
          lastmod: lastmod,
          priority: "1.0", // 최고 우선순위
          changefreq: "hourly", // /today 경로는 hourly로 변경
        });
      }
    } catch (error) {
      console.error("Sitemap today 경로 생성 오류:", error);
      // 오류 발생 시 기본값 사용
      for (const type of QUIZ_TYPES) {
        urls.push({
          loc: `${BASE_URL}/quiz/${type}/today`,
          lastmod: todayDate,
          priority: "1.0",
          changefreq: "hourly",
        });
      }
    }
  } else {
    // Supabase가 없으면 기본값 사용
    for (const type of QUIZ_TYPES) {
      urls.push({
        loc: `${BASE_URL}/quiz/${type}/today`,
        lastmod: todayDate,
        priority: "1.0",
        changefreq: "hourly",
      });
    }
  }

  // 정렬: /today 경로가 먼저, 그 다음 /YYYY-MM-DD 경로
  // 각 그룹 내에서는 lastmod 기준 내림차순 정렬
  urls.sort((a, b) => {
    const isTodayA = a.loc.includes("/today");
    const isTodayB = b.loc.includes("/today");

    // /today 경로가 항상 앞에 오도록
    if (isTodayA && !isTodayB) return -1;
    if (!isTodayA && isTodayB) return 1;

    // 같은 그룹 내에서는 lastmod 기준 내림차순 (최신이 앞)
    const dateA = new Date(a.lastmod).getTime();
    const dateB = new Date(b.lastmod).getTime();
    return dateB - dateA;
  });

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
