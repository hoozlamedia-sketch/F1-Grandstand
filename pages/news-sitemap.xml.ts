import Parser from "rss-parser";
export async function getServerSideProps({ res }) {
  const baseUrl = "https://f1-grandstand.vercel.app";
  const parser = new Parser();
  const feed = await parser.parseURL("https://www.planetf1.com/feed");
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${feed.items
      .slice(0, 50)
      .map(
        (item) => `<url>
        <loc>${baseUrl}/news/${encodeURIComponent(
          item.title.replace(/\\s+/g, "-").toLowerCase()
        )}</loc>
        <lastmod>${new Date(item.pubDate).toISOString()}</lastmod>
      </url>`
      )
      .join("")}
  </urlset>`;
  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();
  return { props: {} };
}
export default function NewsSiteMap() { return null; }
