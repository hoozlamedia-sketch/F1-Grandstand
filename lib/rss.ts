import Parser from 'rss-parser'

export type NewsItem = {
  title: string
  link: string
  isoDate?: string
  source: string
  excerpt?: string
}

/**
 * Some sites block default fetchers. Use a real browser UA + sane Accept.
 */
const COMMON_HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
  'Accept':
    'text/html,application/xhtml+xml,application/xml;q=0.9,application/rss+xml;q=0.9,*/*;q=0.8',
}

const parser = new Parser({
  headers: COMMON_HEADERS,
  timeout: 15000,
})

/**
 * Known sources. Prefer category RSS where possible.
 * If a site only provides a global feed, we filter to F1 URLs.
 */
const SOURCES: Array<
  | { type: 'rss'; name: string; url: string; keep?: (link: string, title?: string) => boolean }
  | {
      type: 'html'
      name: string
      url: string
      extract: (html: string) => Array<{ title: string; link: string; isoDate?: string; excerpt?: string }>
    }
> = [
  // PlanetF1 — WordPress RSS
  { type: 'rss', name: 'PlanetF1', url: 'https://www.planetf1.com/feed' },

  // RacingNews365 — RSS feed
  // If this ever changes, we still just skip this source gracefully.
  { type: 'rss', name: 'RacingNews365', url: 'https://racingnews365.com/feeds/news' },

  // The Race (F1 category RSS). If site changes, the fallback filter keeps only /formula-1/.
  {
    type: 'rss',
    name: 'The Race',
    url: 'https://www.the-race.com/formula-1/feed',
    keep: (link) => /the-race\.com\/.*\/formula-1\//i.test(link),
  },

  // Motorsport.com (F1 news RSS)
  { type: 'rss', name: 'Motorsport.com', url: 'https://www.motorsport.com/rss/f1/news/' },

  // F1Oversteer — WordPress RSS
  { type: 'rss', name: 'F1Oversteer', url: 'https://www.f1oversteer.com/feed' },

  // Formula1.com — no official RSS; scrape latest list page (best-effort).
  // We only extract links containing /en/latest/ and try to read titles from aria-label or link text.
  {
    type: 'html',
    name: 'Formula1.com',
    url: 'https://www.formula1.com/en/latest/all.html',
    extract: (html: string) => {
      const out: Array<{ title: string; link: string; isoDate?: string; excerpt?: string }> = []
      // very tolerant extraction to avoid tight coupling to classnames
      const linkRe = /<a\s+[^>]*href="([^"]+)"[^>]*?(?:aria-label="([^"]+)")?[^>]*>(.*?)<\/a>/gis
      const textRe = />([^<]+)</g
      let m: RegExpExecArray | null
      const seen = new Set<string>()
      while ((m = linkRe.exec(html))) {
        const href = m[1]
        if (!/\/en\/latest\//.test(href)) continue
        let title = (m[2] || '').trim()
        if (!title) {
          // try to get some inner text
          const inner = m[3] || ''
          let t: RegExpExecArray | null
          while ((t = textRe.exec(inner))) {
            const candidate = t[1].trim()
            if (candidate && candidate.length > 20) {
              title = candidate
              break
            }
          }
        }
        if (!title) continue
        const abs = href.startsWith('http') ? href : `https://www.formula1.com${href}`
        const key = abs.split('?')[0]
        if (seen.has(key)) continue
        seen.add(key)
        out.push({ title, link: abs })
        if (out.length >= 20) break
      }
      return out
    },
  },
]

function normalize(item: Partial<NewsItem> & { title?: string; link?: string; source?: string }): NewsItem | null {
  const title = (item.title || '').trim()
  const link = (item.link || '').trim()
  if (!title || !link) return null
  return {
    title,
    link,
    isoDate: item.isoDate,
    source: item.source || '',
    excerpt: item.excerpt?.trim(),
  }
}

async function fetchRSS(src: Extract<typeof SOURCES[number], { type: 'rss' }>): Promise<NewsItem[]> {
  try {
    const feed = await parser.parseURL(src.url)
    let items = (feed.items || []).map((it) =>
      normalize({
        title: it.title || '',
        link: (it.link || it.guid || '').toString(),
        isoDate: it.isoDate,
        source: src.name,
        excerpt: it.contentSnippet || it.content || '',
      }),
    )
    items = items.filter(Boolean) as NewsItem[]
    if (src.keep) items = items.filter((i) => src.keep!(i.link, i.title))
    return items
  } catch {
    return []
  }
}

async function fetchHTML(src: Extract<typeof SOURCES[number], { type: 'html' }>): Promise<NewsItem[]> {
  try {
    const res = await fetch(src.url, { headers: COMMON_HEADERS, cache: 'no-store' as any })
    if (!res.ok) return []
    const html = await res.text()
    const raw = src.extract(html)
    const items = raw
      .map((r) => normalize({ ...r, source: src.name }))
      .filter(Boolean) as NewsItem[]
    return items
  } catch {
    return []
  }
}

export async function fetchAllNews(limit = 60): Promise<NewsItem[]> {
  const results = await Promise.all(
    SOURCES.map((s) => (s.type === 'rss' ? fetchRSS(s) : fetchHTML(s))),
  )

  // Flatten, filter & dedupe by canonical link (strip utm/query)
  const seen = new Set<string>()
  const flat = results.flat().filter((i) => {
    const key = i.link.split('?')[0]
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  // Keep only items that look like F1 (extra safety for broad feeds)
  const f1ish = flat.filter(
    (i) =>
      /formula\s*1|f1\b/i.test(i.title) ||
      /f1|formula-1|grand-prix|grandprix|fia/i.test(i.link),
  )

  // Sort by date desc when available, otherwise keep order per source
  f1ish.sort((a, b) => {
    const da = a.isoDate ? Date.parse(a.isoDate) : 0
    const db = b.isoDate ? Date.parse(b.isoDate) : 0
    return db - da
  })

  return f1ish.slice(0, limit)
}
