import type { GetServerSideProps } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://f1grandstand.com";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const urls = [
    { loc: `${BASE}/`, changefreq: "hourly", priority: "1.0" },
    { loc: `${BASE}/news`, changefreq: "hourly", priority: "0.9" },
    { loc: `${BASE}/videos`, changefreq: "daily", priority: "0.8" },
    { loc: `${BASE}/news-sitemap.xml`, changefreq: "hourly", priority: "0.7" },
    { loc: `${BASE}/sitemaps/videos.xml`, changefreq: "daily", priority: "0.7" },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.write(xml);
  res.end();
  return { props: {} };
};

export default function RootSitemap() { return null; }
