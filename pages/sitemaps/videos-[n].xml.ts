import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllUploadVideoIds } from '../../lib/youtube'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = 'https://www.f1grandstand.com'
  const chunkSize = 1000
  const nParam = (req.query.n || '1') as string
  const n = Math.max(1, parseInt(nParam))
  try {
    const ids = await getAllUploadVideoIds()
    const start = (n - 1) * chunkSize
    const part = ids.slice(start, start + chunkSize)
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${part.map((id: string) => `  <url><loc>${base}/videos/${id}</loc></url>`).join('\n')}
</urlset>`
    res.setHeader('Content-Type', 'text/xml')
    res.write(xml)
    res.end()
  } catch (e) {
    res.status(404).end('Not found')
  }
}
