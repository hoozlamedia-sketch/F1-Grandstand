import type { GetServerSideProps } from "next";

const urls = ["/", "/videos", "/about", "/sitemap"];

export const getServerSideProps: GetServerSideProps = async ({ res, req }) => {
  const proto = (req.headers["x-forwarded-proto"] as string) || "https";
  const host = req.headers.host || "f1-grandstand.vercel.app";
  const base = `${proto}://${host}`;
  const now = new Date().toISOString();

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `<url>
  <loc>${base}${u}</loc>
  <lastmod>${now}</lastmod>
  <changefreq>hourly</changefreq>
  <priority>${u === "/" ? "1.0" : "0.7"}</priority>
</url>`
  )
  .join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.write(body);
  res.end();
  return { props: {} };
};

export default function SiteMap() { return null; }
