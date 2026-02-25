import { quizItems } from "@/utils/utils";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "edge";

const BASE_URL = "https://quizbells.com";
const QUIZ_TYPES = quizItems.map((item) => item.type);

// 최근 30일 날짜 리스트 생성 (오늘까지만, 내일 미래 날짜 제외)
function generateDatesLastMonth(): string[] {
  const dates: string[] = [];
  const now = new Date();
  // 한국 시간(UTC+9) 기준 오늘
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const today = new Date(utcTime + 9 * 60 * 60 * 1000);

  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 30);

  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split("T")[0]);
  }

  return dates.reverse();
}

// W3C Datetime 형식으로 변환
function toW3CDatetime(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+09:00`;
}

export async function GET() {
  const urls: {
    loc: string;
    lastmod: string;
    priority: string;
    changefreq: string;
  }[] = [];

  const recentDates = generateDatesLastMonth();

  // Supabase에서 각 날짜별 퀴즈의 업데이트 시간 조회
  let updatedMap = new Map<string, string>(); // key: "type-date", value: updated time

  if (supabaseAdmin) {
    try {
      const { data: quizData, error } = await supabaseAdmin
        .from("quizbells_answer")
        .select("type, answerDate, updated")
        .in("answerDate", recentDates)
        .in("type", QUIZ_TYPES)
        .order("updated", { ascending: false });

      if (!error && quizData && quizData.length > 0) {
        quizData.forEach((item: any) => {
          if (item.updated) {
            const key = `${item.type}-${item.answerDate}`;
            const existing = updatedMap.get(key);
            if (!existing || new Date(item.updated) > new Date(existing)) {
              updatedMap.set(key, item.updated);
            }
          }
        });
      }
    } catch (error) {
      console.error("Sitemap 날짜별 퀴즈 조회 오류:", error);
    }
  }

  // 날짜별 퀴즈 페이지 생성
  for (const date of recentDates) {
    for (const type of QUIZ_TYPES) {
      const key = `${type}-${date}`;
      const updatedTime = updatedMap.get(key);
      let lastmod: string;

      if (updatedTime) {
        try {
          lastmod = toW3CDatetime(new Date(updatedTime));
        } catch (e) {
          lastmod = date;
        }
      } else {
        lastmod = date;
      }

      urls.push({
        loc: `${BASE_URL}/quiz/${type}/${date}`,
        lastmod,
        priority: "0.7",
        changefreq: "daily",
      });
    }
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
