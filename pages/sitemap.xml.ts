import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchAllNews } from '../lib/rss'
import { getAllUploadVideoIds } from '../lib/youtube'

function generateSiteMap(urls: string[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map((u) => `<url><loc>${u}</loc></url>`).join('\n  ')}
</urlset>`
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = 'https://www.f1grandstand.com'
  const urls: string[] = [`${base}/`, `${base}/news`, `${base}/videos`, `${base}/privacy`, `${base}/about`, `${base}/contact`]

  // Paginated news (estimate 10 pages)
  for (let p = 2; p <= 10; p++) urls.push(`${base}/news?page=${p}`)

  // Videos pagination
  try {
    const ids = await getAllUploadVideoIds()
    const perPage = 18
    const totalPages = Math.max(1, Math.ceil(ids.length / perPage))
    for (let p = 1; p <= totalPages; p++) urls.push(`${base}/videos/page/${p}`)
  } catch {}

  const sitemap = generateSiteMap(urls)
  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()
}
