export async function getServerSideProps({ res, req }: any) {
  const host = req?.headers?.host || "www.f1grandstand.com";
  const base = `https://${host}`;
  const urls = [
    "", "news", "videos"
  ].map(p => `<url><loc>${base}/${p}</loc></url>`).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
  </urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.write(xml);
  res.end();
  return { props: {} };
}
export default function SiteMap() { return null; }
