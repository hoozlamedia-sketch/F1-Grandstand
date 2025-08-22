import Parser from 'rss-parser';

export type NewsItem = {
  title: string;
  link: string;
  isoDate?: string;
  source: string;
  excerpt?: string;
};

type FeedSource =
  | { name: string; type: 'direct'; url: string }
  | { name: string; type: 'google'; query: string };

const parser = new Parser({
  headers: {
    'User-Agent': 'F1GrandstandBot/1.0 (+https://www.f1grandstand.com)'
  }
});

/**
 * HYBRID SOURCES
 * - Keep direct RSS for the ones you said work (Motorsport.com, F1 Oversteer).
 * - Use Google News RSS for the sites that don’t expose a stable RSS (PlanetF1, RacingNews365, The Race).
 */
const SOURCES: FeedSource[] = [
  // ✅ Direct (keep!)
  {
    name: 'Motorsport.com (F1)',
    type: 'direct',
    url: 'https://www.motorsport.com/rss/f1/news/'
  },
  {
    name: 'F1 Oversteer',
    type: 'direct',
    url: 'https://www.f1oversteer.com/feed'
  },

  // 🔁 Google News (stable fallback for sites without RSS)
  {
    name: 'PlanetF1',
    type: 'google',
    query: 'site:planetf1.com'
  },
  {
    name: 'RacingNews365',
    type: 'google',
    query: 'site:racingnews365.com'
  },
  {
    name: 'The Race (F1)',
    type: 'google',
    query: 'site:the-race.com "Formula 1" OR F1'
  }
];

// Build a Google News RSS URL
function googleNewsUrl(query: string) {
  const base = new URL('https://news.google.com/rss/search');
  base.searchParams.set('q', query);
  base.searchParams.set('hl', 'en-GB');
  base.searchParams.set('gl', 'GB');
  base.searchParams.set('ceid', 'GB:en');
  return base.toString();
}

// Try to unwrap Google News redirect links (?url=...)
function normalizeLink(link?: string): string {
  if (!link) return '';
  try {
    const u = new URL(link);
    // Some GN links look like https://news.google.com/articles/..?...&url=ENCODED
    const out = u.searchParams.get('url');
    if (out) return out;
    return link;
  } catch {
    return link;
  }
}

export async function fetchAllNews(maxTotal: number = 60): Promise<NewsItem[]> {
  const results = await Promise.allSettled(
    SOURCES.map(async (src) => {
      const feedUrl = src.type === 'direct' ? src.url : googleNewsUrl(src.query);
      const feed = await parser.parseURL(feedUrl);

      return (feed.items || []).map((it) => {
        const title = (it.title || '').trim();
        const link = normalizeLink(it.link || '');
        const excerpt =
          (it.contentSnippet || it.content || it.summary || '').toString().trim() || undefined;
        const isoDate = it.isoDate || (it.pubDate ? new Date(it.pubDate).toISOString() : undefined);

        return { title, link, isoDate, source: src.name, excerpt } as NewsItem;
      });
    })
  );

  // Flatten successful results
  const items: NewsItem[] = [];
  for (const r of results) {
    if (r.status === 'fulfilled') {
      items.push(...r.value.filter((x) => x.title && x.link));
    }
  }

  // Deduplicate by link
  const seen = new Set<string>();
  const deduped: NewsItem[] = [];
  for (const it of items) {
    const key = it.link;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(it);
    }
  }

  // Sort newest first
  deduped.sort((a, b) => {
    const da = a.isoDate ? Date.parse(a.isoDate) : 0;
    const db = b.isoDate ? Date.parse(b.isoDate) : 0;
    return db - da;
  });

  return deduped.slice(0, maxTotal);
}
