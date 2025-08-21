import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllUploadVideoIds } from '../../lib/youtube'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = 'https://www.f1grandstand.com'
  const chunkSize = 1000
  let count = 0
  try {
    const ids = await getAllUploadVideoIds()
    count = ids.length
    const chunks = Math.max(1, Math.ceil(count / chunkSize))
    const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Array.from({length: chunks}).map((_,i)=>`  <sitemap><loc>${base}/sitemaps/videos-${i+1}.xml</loc></sitemap>`).join('\n')}
</sitemapindex>`
    res.setHeader('Content-Type', 'text/xml')
    res.write(body)
    res.end()
    return
  } catch (e) {
    const body = `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></sitemapindex>`
    res.setHeader('Content-Type', 'text/xml')
    res.write(body)
    res.end()
  }
}
