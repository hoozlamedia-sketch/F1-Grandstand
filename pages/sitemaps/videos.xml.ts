import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({ res, req }) => {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.f1grandstand.com";

  // For now, point to a single page (videos-1.xml). You can increase pages later.
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${base}/sitemaps/videos-1.xml</loc></sitemap>
</sitemapindex>`;

  res.setHeader("Content-Type", "application/xml");
  res.write(xml);
  res.end();
  return { props: {} };
};

export default function VideosSitemapIndex() { return null; }
