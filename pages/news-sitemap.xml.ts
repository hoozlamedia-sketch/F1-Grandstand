import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchAllNews } from '../lib/rss'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = 'https://www.f1grandstand.com'
  const items = await fetchAllNews(100)
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${items.map(it => `  <url>
    <loc>${it.link}</loc>
    <news:news>
      <news:publication>
        <news:name>F1 Grandstand</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${it.isoDate || ''}</news:publication_date>
      <news:title>${(it.title || '').replace(/&/g,'&amp;')}</news:title>
    </news:news>
  </url>`).join('\n')}
</urlset>`
  res.setHeader('Content-Type', 'text/xml')
  res.write(xml)
  res.end()
}
