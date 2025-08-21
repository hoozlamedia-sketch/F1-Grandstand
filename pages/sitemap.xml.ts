import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.f1grandstand.com";
  const urls = [
    "/",
    "/videos",
    "/news",
    "/about",
    "/contact",
  ]
    .map((p) => `<url><loc>${base}${p}</loc></url>`)
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.write(xml);
  res.end();
  return { props: {} };
};

export default function SiteMap() { return null; }
