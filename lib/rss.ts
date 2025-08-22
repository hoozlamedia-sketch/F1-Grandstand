import Parser from "rss-parser"

export type NewsItem = {
  title: string
  link: string
  isoDate?: string
  excerpt?: string
  source: string
}

const parser = new Parser()

const FEEDS = [
  { url: "https://www.planetf1.com/feed", source: "PlanetF1" },
  { url: "https://www.racingnews365.com/rss", source: "RacingNews365" }
]

export async function fetchAllNews(limit = 30): Promise<NewsItem[]> {
  const all: NewsItem[] = []
  for (const feed of FEEDS) {
    try {
      const res = await parser.parseURL(feed.url)
      res.items.slice(0, limit).forEach((i) => {
        all.push({
          title: i.title || "",
          link: i.link || "#",
          isoDate: i.isoDate,
          excerpt: i.contentSnippet?.slice(0, 160),
          source: feed.source
        })
      })
    } catch (err) {
      console.error("Failed to fetch feed", feed.url, err)
    }
  }
  return all.sort((a, b) => (new Date(b.isoDate || 0).getTime() - new Date(a.isoDate || 0).getTime()))
}
