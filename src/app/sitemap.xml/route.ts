export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://quizbells.com/sitemap-static.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://quizbells.com/sitemap-post.xml</loc>
  </sitemap>
</sitemapindex>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
