import type { NextApiRequest, NextApiResponse } from "next";

type NewsItem = { title: string; link: string; isoDate?: string; excerpt?: string; source: string };

const FEEDS = [
  { url: "https://www.motorsport.com/rss/f1/news/", source: "Motorsport.com" },
  { url: "https://f1oversteer.com/feed/", source: "F1Oversteer" },
];

function strip(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function parseRss(xml: string, source: string): NewsItem[] {
  const items: NewsItem[] = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  let m: RegExpExecArray | null;
  while ((m = itemRe.exec(xml))) {
    const block = m[1];
    const title = (block.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "").trim();
    const link = (block.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "").trim();
    const isoDate = (block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || "").trim();
    const excerptRaw =
      block.match(/<description>([\s\S]*?)<\/description>/)?.[1] ||
      block.match(/<content:encoded>([\s\S]*?)<\/content:encoded>/)?.[1] ||
      "";
    const excerpt = strip(excerptRaw).slice(0, 220);
    if (title && link) items.push({ title, link, isoDate, excerpt, source });
  }
  return items;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const q = String(req.query.q || "").trim().toLowerCase();
  if (!q) return res.status(200).json({ items: [] });

  try {
    const fetched = await Promise.allSettled(
      FEEDS.map(async (f) => {
        const r = await fetch(f.url, { headers: { "User-Agent": "F1-Grandstand/1.0 (+vercel)" } });
        const xml = await r.text();
        return parseRss(xml, f.source);
      })
    );

    const items = fetched
      .flatMap((r) => (r.status === "fulfilled" ? r.value : []))
      .filter((it) => (it.title + " " + (it.excerpt || "")).toLowerCase().includes(q))
      .slice(0, 20);

    res.status(200).json({ items });
  } catch (e: any) {
    res.status(200).json({ items: [] });
  }
}
