import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({ res, params }) => {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.f1grandstand.com";
  // In a future improvement, fetch YouTube video list for the requested page.
  // For now, output an empty (but valid) urlset so the route exists and doesn't break builds.

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.write(xml);
  res.end();
  return { props: {} };
};

export default function VideosSitemapPage() { return null; }
