import type { GetServerSideProps } from "next";
import { fetchAllNews } from "../lib/rss";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.f1grandstand.com";
  let items: Array<{ link: string; isoDate?: string }> = [];
  try {
    // Pull the latest 50 items from configured F1 sources (PlanetF1, RacingNews365 in lib/rss)
    items = await fetchAllNews(50);
  } catch {}

  const newsItems = (items || []).slice(0, 50).map((n) => {
    const pub = n.isoDate ? new Date(n.isoDate).toISOString() : new Date().toISOString();
    return `<url>
  <loc>${n.link}</loc>
  <news:news>
    <news:publication>
      <news:name>F1 Grandstand</news:name>
      <news:language>en</news:language>
    </news:publication>
    <news:publication_date>${pub}</news:publication_date>
    <news:title><![CDATA[F1 News]]></news:title>
  </news:news>
</url>`;
  }).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${newsItems}
</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.write(xml);
  res.end();
  return { props: {} };
};

export default function NewsSiteMap() { return null; }
