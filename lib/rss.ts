import Parser from 'rss-parser'
export type NewsItem = { title: string; link: string; isoDate?: string; source: string; excerpt?: string }
const FEEDS: { source: string; url: string }[] = [
  { source: 'Formula1.com', url: 'https://www.formula1.com/rss/latest' },
  { source: 'BBC Sport F1', url: 'http://feeds.bbci.co.uk/sport/formula1/rss.xml' },
  { source: 'Motorsport.com', url: 'https://www.motorsport.com/rss/f1/news/' },
  { source: 'PlanetF1', url: 'https://www.planetf1.com/feed' },
  { source: 'RacingNews365', url: 'https://racingnews365.com/rss' },
  { source: 'Express Sport F1', url: 'https://www.express.co.uk/posts/rss/77/formula1' },
]
const parser = new Parser({ timeout: 10000, headers: { 'User-Agent': 'F1GrandstandBot/1.0 (+https://www.f1grandstand.com)' } })
export async function fetchAllNews(limit = 50): Promise<NewsItem[]> {
  const results: NewsItem[] = []
  const promises = FEEDS.map(async (feed) => {
    try {
      const parsed = await parser.parseURL(feed.url)
      for (const it of parsed.items || []) {
        results.push({ title: (it.title || '').trim(), link: (it.link || '').trim(), isoDate: it.isoDate || it.pubDate, source: feed.source, excerpt: (it.contentSnippet || it.content || '').replace(/\s+/g,' ').slice(0,220) })
      }
    } catch {}
  })
  await Promise.all(promises)
  results.sort((a,b) => new Date(b.isoDate||0).getTime() - new Date(a.isoDate||0).getTime())
  return results.slice(0, limit)
}
