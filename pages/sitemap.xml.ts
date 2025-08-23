import type { NextApiRequest, NextApiResponse } from "next";

const BASE_URL = "https://f1-grandstand.vercel.app";

function lastmodISO(d = new Date()) {
  return d.toISOString();
}

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const urls = [
    { loc: `${BASE_URL}/`,               priority: "1.0" },
    { loc: `${BASE_URL}/#news`,          priority: "0.9" },
    { loc: `${BASE_URL}/videos`,         priority: "0.9" },
    { loc: `${BASE_URL}/about`,          priority: "0.6" },
    { loc: `${BASE_URL}/sitemaps`,       priority: "0.4" },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `<url>
  <loc>${u.loc}</loc>
  <lastmod>${lastmodISO()}</lastmod>
  <changefreq>hourly</changefreq>
  <priority>${u.priority}</priority>
</url>`
  )
  .join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.status(200).send(xml);
}
