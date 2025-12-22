export const runtime = 'edge';

const staticPages = [
  "/",
  "/about",
  "/privacy",
  "/faq",
  "/terms",
  "/tips",
  "/quiz",
];

export async function GET() {
  const lastmod = "2025-06-28"; // 또는 new Date().toISOString().split('T')[0]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${staticPages
  .map(
    (path) => `
  <url>
    <loc>https://quizbells.com${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${path === "/" || path.startsWith("/quiz") ? "daily" : "monthly"}</changefreq>
    <priority>${path === "/" ? "1.0" : "0.8"}</priority>
  </url>`
  )
  .join("")}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
