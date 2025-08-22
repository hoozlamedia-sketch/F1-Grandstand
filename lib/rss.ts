export type NewsItem = {
  title: string
  link: string
  isoDate?: string
  source: string
  excerpt?: string
}

const UA = 'Mozilla/5.0 (compatible; F1GrandstandBot/1.0; +https://www.f1grandstand.com)'

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'user-agent': UA,
        accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml; charset=utf-8',
      },
      cache: 'no-store',
      // Don't follow forever on weird redirects
      redirect: 'follow',
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
  const out: NewsItem[] = []
  const items = xml.split(/<item[\s>]/i).slice(1)
  for (const raw of items) {
    const seg = raw.split(/<\/item>/i)[0]
    const title = (seg.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '')
      .replace(/<!\[CDATA\[|\]\]>/g, '')
      .trim()
    let link = (seg.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1] || '').trim()
    const pub =
      (seg.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1] || '').trim()
    const desc = (seg.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1] || '')
      .replace(/<!\[CDATA\[|\]\]>/g, '')
      .trim()
    if (!/^https?:\/\//i.test(link)) {
      // Some feeds put link as <link href="..."/>
      link = (seg.match(/<link[^>]*href="([^"]+)"/i)?.[1] || link).trim()
    }
    if (title && link) {
      out.push({
        title,
        link,
        isoDate: pub ? new Date(pub).toISOString() : undefined,
        source,
        excerpt: stripTags(desc).slice(0, 220),
      })
    }
  }
  return out
}

function parseAtom(xml: string, source: string): NewsItem[] {
  const out: NewsItem[] = []
  const entries = xml.split(/<entry[\s>]/i).slice(1)
  for (const raw of entries) {
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
        '').trim()
    if (title && link) {
      out.push({
        title,
        link,
        isoDate: pub ? new Date(pub).toISOString() : undefined,
        source,
      })
    }
  }
  return out
}

function unwrapGoogleNewsLink(u: string): string {
  try {
    const url = new URL(u)
    const orig = url.searchParams.get('url') || url.searchParams.get('ved') // url= preferred; ved often present
    return url.searchParams.get('url') || u
  } catch {
    return u
  }
}

async function fetchPlanetF1(): Promise<NewsItem[]> {
  // Try canonical feed
  const primary = await fetchText('https://www.planetf1.com/feed/')
  if (primary) {
    const rs = parseRSS(primary, 'PlanetF1')
    if (rs.length) return rs
  }
  // Fallback via Google News site feed
  const gn = await fetchText(
    'https://news.google.com/rss/search?q=site:planetf1.com&hl=en-GB&gl=GB&ceid=GB:en'
  )
  if (!gn) return []
  return parseRSS(gn, 'PlanetF1').map(i => ({ ...i, link: unwrapGoogleNewsLink(i.link) }))
}

async function fetchRN365(): Promise<NewsItem[]> {
  const candidates = [
    'https://www.racingnews365.com/rss',
    'https://racingnews365.com/rss',
    'https://racingnews365.com/en/rss.xml',
  ]
  for (const u of candidates) {
    const xml = await fetchText(u)
    if (!xml) continue
    const parsed = /<feed[\s>]/i.test(xml)
      ? parseAtom(xml, 'RacingNews365')
      : parseRSS(xml, 'RacingNews365')
    if (parsed.length) return parsed
  }
  const gn = await fetchText(
    'https://news.google.com/rss/search?q=site:racingnews365.com&hl=en-GB&gl=GB&ceid=GB:en'
  )
  if (!gn) return []
  return parseRSS(gn, 'RacingNews365').map(i => ({ ...i, link: unwrapGoogleNewsLink(i.link) }))
}

export async function fetchAllNews(limit = 40): Promise<NewsItem[]> {
  const [p1, p2] = await Promise.all([fetchPlanetF1(), fetchRN365()])
  const merged = [...p1, ...p2].filter(i =>
    /planetf1\.com|racingnews365\.com/i.test(i.link)
  )
  merged.sort(
    (a, b) =>
      new Date(b.isoDate || 0).getTime() - new Date(a.isoDate || 0).getTime()
  )
  return merged.slice(0, limit)
}
