import Parser from "rss-parser";
export async function getServerSideProps({ res, req }: any) {
  const parser = new Parser();
  const feeds = ["https://www.planetf1.com/feed", "https://racingnews365.com/rss"];
  const items: {link?:string}[] = [];
  for (const f of feeds) {
    try {
      const feed = await parser.parseURL(f);
      items.push(...(feed.items || []));
    } catch {}
  }
  const host = req?.headers?.host || "www.f1grandstand.com";
  const base = `https://${host}`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url><loc>${base}/news</loc></url>
    ${items.slice(0,100).map(i => i.link ? `<url><loc>${i.link}</loc></url>` : "").join("")}
  </urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.write(xml);
  res.end();
  return { props: {} };
}
export default function SiteMap() { return null; }
