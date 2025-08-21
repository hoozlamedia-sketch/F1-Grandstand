import Parser from 'rss-parser'

export type NewsItem = {
  title: string
  link: string
  isoDate?: string
  source: string
  excerpt?: string
}

const parser: Parser = new (Parser as any)()

// F1-only sources
const FEEDS = [
  { url: 'https://www.planetf1.com/feed/', source: 'PlanetF1' },
  { url: 'https://racingnews365.com/rss',   source: 'RacingNews365' }
]

// (Optional) light keyword guard, though both feeds are F1-focused
const F1_REGEX = /\b(f1|formula 1|grand prix|fia|verstappen|hamilton|leclerc|norris|sainz|piastri|mercedes|ferrari|mclaren|red bull|aston martin|williams|sauber|haas|alpine)\b/i

export async function fetchAllNews(limit = 60): Promise<NewsItem[]> {
  let items: NewsItem[] = []
  for (const feed of FEEDS) {
    try {
      const data = await parser.parseURL(feed.url)
      const mapped = (data.items || []).map(it => {
        const title = it.title || ''
        const content = (it.contentSnippet || it.content || '')
        const passes = F1_REGEX.test(title) || F1_REGEX.test(content) || true
        if (!passes) return null
        return {
          title,
          link: it.link || '',
          isoDate: it.isoDate,
          source: feed.source,
          excerpt: content?.trim()?.slice(0, 240)
        } as NewsItem
      }).filter(Boolean) as NewsItem[]
      items.push(...mapped)
    } catch {
      // ignore individual feed errors
    }
  }
  // sort by newest first
  items.sort((a, b) => (new Date(b.isoDate || 0).getTime()) - (new Date(a.isoDate || 0).getTime()))
  // de-dup by link and cap
  const seen = new Set<string>()
  const unique: NewsItem[] = []
  for (const it of items) {
    if (!it.link || seen.has(it.link)) continue
    seen.add(it.link)
    unique.push(it)
    if (unique.length >= limit) break
  }
  return unique
}
