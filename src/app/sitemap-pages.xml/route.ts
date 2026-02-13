export const runtime = "edge";

const BASE_URL = "https://quizbells.com";

// 정적 페이지 목록
const staticPages = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/privacy", priority: "0.8", changefreq: "monthly" },
  { path: "/faq", priority: "0.8", changefreq: "monthly" },
  { path: "/terms", priority: "0.8", changefreq: "monthly" },
  { path: "/tips", priority: "0.8", changefreq: "weekly" },
  { path: "/posts", priority: "0.8", changefreq: "weekly" },
  { path: "/quiz", priority: "0.8", changefreq: "daily" },
];

export async function GET() {
  const lastmod = new Date().toISOString().split("T")[0];

  const urls: {
    loc: string;
    lastmod: string;
    priority: string;
    changefreq: string;
  }[] = [];

  for (const page of staticPages) {
    urls.push({
      loc: `${BASE_URL}${page.path}`,
      lastmod,
      changefreq: page.changefreq,
      priority: page.priority,
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
