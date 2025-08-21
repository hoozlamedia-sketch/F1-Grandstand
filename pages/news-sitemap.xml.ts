import type { GetServerSideProps } from 'next'
import { fetchAllNews } from '../lib/rss'

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const items = await fetchAllNews(50)
  const now = new Date().toISOString()
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items.map(i => `<url>
  <loc>${i.link}</loc>
  <lastmod>${i.isoDate || now}</lastmod>
  <changefreq>hourly</changefreq>
  <priority>0.7</priority>
</url>`).join('\n')}
</urlset>`
  res.setHeader('Content-Type', 'text/xml')
  res.write(xml)
  res.end()
  return { props: {} }
}
export default function NewsSiteMap() { return null }
