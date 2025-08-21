import type { GetServerSideProps } from 'next'

const DOMAIN = 'https://www.f1grandstand.com'

function generateSiteMap(urls: string[]) {
  const now = new Date().toISOString()
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `<url>
  <loc>${DOMAIN}${u}</loc>
  <lastmod>${now}</lastmod>
  <changefreq>hourly</changefreq>
  <priority>${u === '/' ? '1.0' : '0.8'}</priority>
</url>`).join('\n')}
</urlset>`
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const urls = ['/', '/news', '/videos', '/about', '/contact', '/privacy']
  const xml = generateSiteMap(urls)
  res.setHeader('Content-Type', 'text/xml')
  res.write(xml)
  res.end()
  return { props: {} }
}

export default function SiteMap() { return null }
