import { quizItems } from "@/utils/utils";
import { supabaseAdmin } from "@/lib/supabase";
import { tips } from "@/app/tips/tipsData";

export const runtime = "edge";

const BASE_URL = "https://quizbells.com";
const QUIZ_TYPES = quizItems.map((item) => item.type);

// 한국 시간 기준 오늘 날짜 반환
function getKoreaTodayDate(): string {
  const now = new Date();
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const koreaTime = new Date(utcTime + 9 * 60 * 60 * 1000);

  const year = koreaTime.getFullYear();
  const month = String(koreaTime.getMonth() + 1).padStart(2, "0");
  const day = String(koreaTime.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// W3C Datetime 형식으로 변환 (구글 권장 포맷)
function toW3CDatetime(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+09:00`;
}

// 최근 30일 + 내일까지 날짜 리스트 생성
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

// 정적 페이지 목록
const staticPages = [
  "/",
  "/about",
  "/privacy",
  "/faq",
  "/terms",
  "/tips",
  "/posts",
  "/quiz",
];

export async function GET() {
  const today = getKoreaTodayDate();
  const lastmod = new Date().toISOString().split("T")[0];

  const urls: {
    loc: string;
    lastmod: string;
    priority: string;
    changefreq: string;
  }[] = [];

  // ── 1. 정적 페이지 ──
  for (const path of staticPages) {
    urls.push({
      loc: `${BASE_URL}${path}`,
      lastmod,
      changefreq: path === "/" || path.startsWith("/quiz") ? "daily" : "monthly",
      priority: path === "/" ? "1.0" : "0.8",
    });
  }

  // ── 2. 퀴즈 today 경로 (Supabase에서 최신 업데이트 시간 조회) ──
  if (supabaseAdmin) {
    try {
      const { data: todayQuizData, error } = await supabaseAdmin
        .from("quizbells_answer")
        .select("type, updated")
        .eq("answerDate", today)
        .in("type", QUIZ_TYPES)
        .order("updated", { ascending: true });

      if (error) {
        console.error("Sitemap updated 시간 조회 오류:", error);
      }

      // 타입별 가장 최신 업데이트 시간 매핑
      const updatedMap = new Map<string, string>();
      if (todayQuizData && todayQuizData.length > 0) {
        todayQuizData.forEach((item: any) => {
          if (item.updated) {
            const existing = updatedMap.get(item.type);
            if (!existing || new Date(item.updated) > new Date(existing)) {
              updatedMap.set(item.type, item.updated);
            }
          }
        });
      }

      for (const type of QUIZ_TYPES) {
        const updatedTime = updatedMap.get(type);
        let todayLastmod: string;

        if (updatedTime) {
          try {
            todayLastmod = toW3CDatetime(new Date(updatedTime));
          } catch (e) {
            console.error(`타입 ${type}의 updated 시간 파싱 오류:`, e);
            todayLastmod = today;
          }
        } else {
          todayLastmod = today;
        }

        urls.push({
          loc: `${BASE_URL}/quiz/${type}/today`,
          lastmod: todayLastmod,
          priority: "1.0",
          changefreq: "hourly",
        });
      }
    } catch (error) {
      console.error("Sitemap today 경로 생성 오류:", error);
      // Supabase 오류 시 기본값으로 fallback
      for (const type of QUIZ_TYPES) {
        urls.push({
          loc: `${BASE_URL}/quiz/${type}/today`,
          lastmod: today,
          priority: "1.0",
          changefreq: "hourly",
        });
      }
    }
  } else {
    // supabaseAdmin 없을 때 fallback
    for (const type of QUIZ_TYPES) {
      urls.push({
        loc: `${BASE_URL}/quiz/${type}/today`,
        lastmod: today,
        priority: "1.0",
        changefreq: "hourly",
      });
    }
  }

  // ── 3. 게시글 (/posts/{id}) ──
  if (supabaseAdmin) {
    try {
      const { data: postsData } = await supabaseAdmin
        .from("quizbells_posts")
        .select("id, date")
        .order("date", { ascending: false });

      if (postsData) {
        for (const post of postsData) {
          urls.push({
            loc: `${BASE_URL}/posts/${post.id}`,
            lastmod: post.date,
            priority: "0.8",
            changefreq: "weekly",
          });
        }
      }
    } catch (error) {
      console.error("Sitemap posts 조회 오류:", error);
    }
  }

  // ── 3-B. 금융 팁 (/tips/{id}) ──
  for (const tip of tips) {
    urls.push({
      loc: `${BASE_URL}/tips/${tip.id}`,
      lastmod: tip.date,
      priority: "0.8",
      changefreq: "monthly",
    });
  }

  // ── 4. 날짜별 퀴즈 페이지 (/quiz/{type}/{date}) ──
  const recentDates = generateDatesLastMonth();
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

  // XML 생성
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
