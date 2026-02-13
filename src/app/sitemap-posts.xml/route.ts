import { supabaseAdmin } from "@/lib/supabase";
import { tips } from "@/app/tips/tipsData";

export const runtime = "edge";

const BASE_URL = "https://quizbells.com";

export async function GET() {
  const urls: {
    loc: string;
    lastmod: string;
    priority: string;
    changefreq: string;
  }[] = [];

  // 게시글 (/posts/{id})
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

  // 금융 팁 (/tips/{id})
  for (const tip of tips) {
    urls.push({
      loc: `${BASE_URL}/tips/${tip.id}`,
      lastmod: tip.date,
      priority: "0.8",
      changefreq: "monthly",
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
