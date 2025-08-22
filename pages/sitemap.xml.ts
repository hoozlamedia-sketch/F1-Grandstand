export async function getServerSideProps({ res }) {
  const baseUrl = "https://f1-grandstand.vercel.app";

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
      <loc>${baseUrl}/news-sitemap.xml</loc>
    </sitemap>
    <sitemap>
      <loc>${baseUrl}/videos-sitemap.xml</loc>
    </sitemap>
  </sitemapindex>`;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();
  return { props: {} };
}
export default function SiteMap() { return null; }
