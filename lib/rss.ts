import Parser from "rss-parser";
export type NewsItem = {
  title: string;
  link: string;
  isoDate?: string;
  source: string;
  excerpt?: string;
};

const FEEDS = [
  { url: "https://www.planetf1.com/feed", source: "PlanetF1" },
  { url: "https://racingnews365.com/rss", source: "RacingNews365" },
];

export async function fetchAllNews(maxItems = 60): Promise<NewsItem[]> {
  const parser = new Parser();
  const lists = await Promise.all(
    FEEDS.map(async (f) => {
      try {
        const feed = await parser.parseURL(f.url);
        return (feed.items || []).map((i) => ({
          title: i.title || "",
          link: i.link || "",
          isoDate: i.isoDate,
          source: f.source,
          excerpt: (i.contentSnippet || i["content:encodedSnippet"] || i.content || "").slice(0, 220),
        }));
      } catch {
        return [] as NewsItem[];
      }
    })
  );

  // Merge & sort newest first
  const merged = lists.flat().filter(n => n.title && n.link);
  merged.sort((a,b) => (new Date(b.isoDate||0).getTime()) - (new Date(a.isoDate||0).getTime()));
  return merged.slice(0, maxItems);
}
