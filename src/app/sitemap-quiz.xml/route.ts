import { quizItems } from "@/utils/utils";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "edge";

const BASE_URL = "https://quizbells.com";
const QUIZ_TYPES = quizItems.map((item) => item.type);

function getKoreaDateString(): string {
  const now = new Date();
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const koreaTime = new Date(utcTime + 9 * 60 * 60 * 1000);

  const year = koreaTime.getFullYear();
  const month = String(koreaTime.getMonth() + 1).padStart(2, "0");
  const day = String(koreaTime.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}T00:00:00`;
}

export async function GET() {
  const todayDate = getKoreaDateString();
  const todayDateOnly = todayDate.split("T")[0];

  const urls: {
    loc: string;
    lastmod: string;
    priority: string;
    changefreq: string;
  }[] = [];

  if (supabaseAdmin) {
    try {
      const { data: todayQuizData, error } = await supabaseAdmin
        .from("quizbells_answer")
        .select("type, updated")
        .eq("answerDate", todayDateOnly)
        .in("type", QUIZ_TYPES)
        .order("updated", { ascending: true });

      if (error) {
        console.error("Sitemap updated 시간 조회 오류:", error);
      }

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
        let lastmod: string;

        if (updatedTime) {
          try {
            const updatedDate = new Date(updatedTime);
            const year = updatedDate.getFullYear();
            const month = String(updatedDate.getMonth() + 1).padStart(2, "0");
            const day = String(updatedDate.getDate()).padStart(2, "0");
            const hours = String(updatedDate.getHours()).padStart(2, "0");
            const minutes = String(updatedDate.getMinutes()).padStart(2, "0");
            const seconds = String(updatedDate.getSeconds()).padStart(2, "0");
            lastmod = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
          } catch (e) {
            console.error(`타입 ${type}의 updated 시간 파싱 오류:`, e);
            lastmod = todayDate;
          }
        } else {
          lastmod = todayDate;
        }

        urls.push({
          loc: `${BASE_URL}/quiz/${type}/today`,
          lastmod,
          priority: "1.0",
          changefreq: "hourly",
        });
      }
    } catch (error) {
      console.error("Sitemap today 경로 생성 오류:", error);
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
    for (const type of QUIZ_TYPES) {
      urls.push({
        loc: `${BASE_URL}/quiz/${type}/today`,
        lastmod: todayDate,
        priority: "1.0",
        changefreq: "hourly",
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
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
