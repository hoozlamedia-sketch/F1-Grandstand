import type { GetServerSideProps } from 'next'

/**
 * Serve robots.txt as a plain text SSR response so Next.js doesn't try to prerender it.
 * Keep this ultra-simple and fast; it's hit by crawlers a lot.
 */
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://f1-grandstand.vercel.app'

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.write(
`User-agent: *
Allow: /

Sitemap: ${base}/sitemap.xml
`
  )
  res.end()
  return { props: {} }
}

// This component never renders; response is written in getServerSideProps.
export default function Robots() { return null }
