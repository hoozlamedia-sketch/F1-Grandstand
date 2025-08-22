import type { GetServerSideProps } from "next";
import Parser from "rss-parser";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const parser = new Parser();
  let items: Array<{ link?: string | null; isoDate?: string | null }> = [];

  try {
    const [pf1, rn365] = await Promise.all([
      parser.parseURL("https://www.planetf1.com/feed"),
      parser.parseURL("https://www.racingnews365.com/feed"),
    ]);
    items = [...(pf1.items || []), ...(rn365.items || [])].slice(0, 100);
  } catch {
    items = [];
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items
  .filter((i) => i.link)
  .map((i) => {
    const loc = i.link!.replace(/&/g, "&amp;");
    const lastmod = i.isoDate ? new Date(i.isoDate).toISOString() : "";
    return `  <url>
    <loc>${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}
  </url>`;
  })
  .join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.write(xml);
  res.end();
  return { props: {} };
};

export default function NewsSitemap() { return null; }
