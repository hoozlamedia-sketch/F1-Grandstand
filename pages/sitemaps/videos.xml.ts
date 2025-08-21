import type { GetServerSideProps } from 'next'
const DOMAIN = 'https://www.f1grandstand.com'

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const chunks = [1] // add 2,3,... if you create more chunks later
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${chunks.map(n => `<sitemap><loc>${DOMAIN}/sitemaps/videos-${n}.xml</loc></sitemap>`).join('\n')}
</sitemapindex>`
  res.setHeader('Content-Type', 'text/xml')
  res.write(xml)
  res.end()
  return { props: {} }
}
export default function VideosSitemapIndex() { return null }
