import type { NextApiRequest, NextApiResponse } from "next";

const BASE_URL = "https://f1-grandstand.vercel.app";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const body = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.status(200).send(body);
}
