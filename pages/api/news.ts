import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchAllNews } from '../../lib/rss'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const items = await fetchAllNews(40)
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
    res.status(200).json({ items })
  } catch (e) {
    res.status(200).json({ items: [] })
  }
}
