export const runtime = "edge";

const BASE_URL = "https://quizbells.com";

export async function GET() {
  const lastmod = new Date().toISOString();

  const sitemaps = [
    { loc: `${BASE_URL}/sitemap-pages.xml`, lastmod },
    { loc: `${BASE_URL}/sitemap-quiz-today.xml`, lastmod },
    { loc: `${BASE_URL}/sitemap-quiz-dates.xml`, lastmod },
    { loc: `${BASE_URL}/sitemap-posts.xml`, lastmod },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map(
    ({ loc, lastmod }) => `  <sitemap>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`,
  )
  .join("\n")}
</sitemapindex>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
