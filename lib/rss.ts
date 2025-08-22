export type NewsItem = {
  title: string
  link: string
  isoDate?: string
  source: string
  excerpt?: string
}

const UA =
  'Mozilla/5.0 (compatible; F1GrandstandBot/1.0; +https://www.f1grandstand.com)'

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'user-agent': UA,
        accept:
          'application/rss+xml, application/atom+xml, application/xml, text/xml, text/html; charset=utf-8',
      },
      cache: 'no-store',
    })
    if (!res.ok) return null
    return await res.text()
  } catch {
    return null
  }
}

function stripTags(html?: string) {
  return (html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function parseRSS(xml: string, source: string): NewsItem[] {
  const items: NewsItem[] = []
  const blocks = xml.split(/<item[\s>]/i).slice(1)
  for (const raw of blocks) {
    const seg = raw.split(/<\/item>/i)[0]
    const title = (seg.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '')
      .replace(/<!\[CDATA\[|\]\]>/g, '')
      .trim()
    const link = (seg.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1] || '').trim()
    const pub =
      (seg.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1] || '').trim()
    const desc = (seg.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1] ||
      '')
      .replace(/<!\[CDATA\[|\]\]>/g, '')
      .trim()
    if (title && link) {
      items.push({
        title,
        link,
        isoDate: pub ? new Date(pub).toISOString() : undefined,
        source,
        excerpt: stripTags(desc).slice(0, 220),
      })
    }
  }
  return items
}

function parseAtom(xml: string, source: string): NewsItem[] {
  const items: NewsItem[] = []
  const blocks = xml.split(/<entry[\s>]/i).slice(1)
  for (const raw of blocks) {
    const seg = raw.split(/<\/entry>/i)[0]
    const title = (seg.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '')
      .replace(/<!\[CDATA\[|\]\]>/g, '')
      .trim()
    const link =
      (seg.match(/<link[^>]*href="([^"]+)"/i)?.[1] || '').trim() ||
      (seg.match(/<id[^>]*>([\s\S]*?)<\/id>/i)?.[1] || '').trim()
    const pub =
      (seg.match(/<updated[^>]*>([\s\S]*?)<\/updated>/i)?.[1] ||
        seg.match(/<published[^>]*>([\s\S]*?)<\/published>/i)?.[1] ||
        ''
      ).trim()
    if (title && link) {
      items.push({
        title,
        link,
        isoDate: pub ? new Date(pub).toISOString() : undefined,
        source,
      })
    }
  }
  return items
}

/** Try to unwrap a Google News link back to the publisher URL if present */
function unwrapGoogleNewsLink(u: string): string {
  try {
    const url = new URL(u)
    // Some GN links embed original as "url="
    const orig = url.searchParams.get('url')
    return orig || u
  } catch {
    return u
  }
}

export async function fetchAllNews(limit = 40): Promise<NewsItem[]> {
  const out: NewsItem[] = []

  // PlanetF1 primary RSS
  let planet: NewsItem[] = []
  const planetXml = await fetchText('https://www.planetf1.com/feed/')
  if (planetXml) planet = parseRSS(planetXml, 'PlanetF1')

  // PlanetF1 fallback: Google News site feed
  if (planet.length === 0) {
    const gn = await fetchText(
      'https://news.google.com/rss/search?q=site:planetf1.com&hl=en-GB&gl=GB&ceid=GB:en'
    )
    if (gn) {
      planet = parseRSS(gn, 'PlanetF1').map(i => ({
        ...i,
        link: unwrapGoogleNewsLink(i.link),
      }))
    }
  }
  out.push(...planet)

  // RacingNews365 primary + fallbacks
  let rn: NewsItem[] = []
  const rnCandidates = [
    'https://www.racingnews365.com/rss',
    'https://racingnews365.com/rss',
    'https://racingnews365.com/en/rss.xml',
  ]
  for (const u of rnCandidates) {
    const xml = await fetchText(u)
    if (!xml) continue
    rn = /<feed[\s>]/i.test(xml)
      ? parseAtom(xml, 'RacingNews365')
      : parseRSS(xml, 'RacingNews365')
    if (rn.length) break
  }
  if (rn.length === 0) {
    const gn = await fetchText(
      'https://news.google.com/rss/search?q=site:racingnews365.com&hl=en-GB&gl=GB&ceid=GB:en'
    )
    if (gn) {
      rn = parseRSS(gn, 'RacingNews365').map(i => ({
        ...i,
        link: unwrapGoogleNewsLink(i.link),
      }))
    }
  }
  out.push(...rn)

  // Strictly those two sources
  const filtered = out.filter(i =>
    /planetf1\.com|racingnews365\.com/i.test(i.link)
  )

  filtered.sort(
    (a, b) =>
      new Date(b.isoDate || 0).getTime() - new Date(a.isoDate || 0).getTime()
  )
  return filtered.slice(0, limit)
}
