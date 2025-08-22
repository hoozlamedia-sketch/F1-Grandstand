import Head from "next/head";
import Link from "next/link";
import Layout from "../components/Layout";
import { GetServerSideProps } from "next";
import { searchChannelVideos, type YTVideo } from "../lib/youtube";

type NewsItem = {
  title: string;
  link: string;
  isoDate?: string;
  source: string;
};

type Props = {
  q: string;
  videos: YTVideo[];
  news: NewsItem[];
};

const FEEDS = [
  { url: "https://www.motorsport.com/rss/f1/news/", source: "Motorsport.com" },
  { url: "https://www.f1oversteer.com/feed/", source: "F1 OverSteer" },
];

async function fetchText(url: string): Promise<string> {
  try {
    const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 F1-Grandstand" } });
    if (!res.ok) return "";
    return await res.text();
  } catch {
    return "";
  }
}

// tolerant RSS <item> parser (no matchAll, no 's' flag)
function parseRssItems(xml: string, source: string): NewsItem[] {
  const out: NewsItem[] = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  let m: RegExpExecArray | null;
  while ((m = itemRe.exec(xml)) !== null) {
    const block = m[1];

    let title = "";
    const t1 = block.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/);
    const t2 = block.match(/<title>([^<]+)<\/title>/);
    if (t1 && t1[1]) title = t1[1].trim();
    else if (t2 && t2[1]) title = t2[1].trim();

    let link = "";
    const l1 = block.match(/<link>([^<]+)<\/link>/);
    const l2 = block.match(/<link><!\[CDATA\[([\s\S]*?)\]\]><\/link>/);
    if (l1 && l1[1]) link = l1[1].trim();
    else if (l2 && l2[1]) link = l2[1].trim();

    let isoDate: string | undefined = undefined;
    const d1 = block.match(/<pubDate>([^<]+)<\/pubDate>/);
    if (d1 && d1[1]) {
      const dt = new Date(d1[1]);
      if (!isNaN(+dt)) isoDate = dt.toISOString();
    }

    if (title && link) out.push({ title, link, isoDate, source });
  }
  return out;
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const qRaw = (ctx.query.q || "").toString().trim();
  const q = qRaw.slice(0, 100);

  // If no query, show nothing but the form
  if (!q) {
    return { props: { q: "", videos: [], news: [] } };
  }

  const API_KEY = process.env.NEXT_PUBLIC_YT_API_KEY || "";
  const CHANNEL_ID = process.env.YT_CHANNEL_ID || "UCh31mRik5zu2JNIC-oUCBjg";
  const PER_PAGE = 18; // number of videos to show on search page

  // Fetch videos (YouTube API)
  const videoPromise = searchChannelVideos(q, PER_PAGE, CHANNEL_ID, API_KEY)
    .then(v => v || [])
    .catch(() => []);

  // Fetch + parse news RSS from working sources, then filter by query
  const newsPromise = (async () => {
    const texts = await Promise.all(FEEDS.map(f => fetchText(f.url)));
    const allItems: NewsItem[] = [];
    for (let i = 0; i < texts.length; i++) {
      const txt = texts[i];
      const src = FEEDS[i].source;
      if (!txt) continue;
      const items = parseRssItems(txt, src);
      allItems.push(...items);
    }
    const qlc = q.toLowerCase();
    const filtered = allItems.filter(it =>
      (it.title || "").toLowerCase().includes(qlc)
    );
    // sort by date desc if present
    filtered.sort((a, b) => {
      const ta = a.isoDate ? +new Date(a.isoDate) : 0;
      const tb = b.isoDate ? +new Date(b.isoDate) : 0;
      return tb - ta;
    });
    return filtered.slice(0, 30);
  })();

  const [videos, news] = await Promise.all([videoPromise, newsPromise]);

  return {
    props: { q, videos, news },
  };
};

export default function Search({ q, videos, news }: Props) {
  const pageTitle = q ? `Search: ${q} | F1 Grandstand` : "Search | F1 Grandstand";
  const gold = "#f5e9c8";

  return (
    <Layout title={pageTitle} description={`Search F1 videos and news for: ${q}`}>
      <Head>
        <meta name="robots" content={q ? "index,follow" : "noindex"} />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        <h1 className="text-2xl md:text-3xl font-extrabold" style={{ color: gold }}>
          Search results for “{q || "…"}”
        </h1>

        {/* Quick search form on the page as well */}
        <form action="/search" method="get" className="flex items-center gap-2">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search F1 videos & news…"
            className="w-full max-w-lg px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 focus:outline-none focus:border-[#f5e9c8] text-white placeholder-neutral-500"
          />
          <button
            type="submit"
            className="px-3 py-2 rounded-lg border border-[#f5e9c8]/30 hover:bg-[#f5e9c8]/10 text-[#f5e9c8] font-medium"
          >
            Search
          </button>
        </form>

        {/* Videos */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Videos</h2>
            <Link
              href={`/videos/page/1?q=${encodeURIComponent(q)}`}
              className="text-sm underline text-neutral-300 hover:text-white"
            >
              See more
            </Link>
          </div>

          {videos.length === 0 ? (
            <p className="text-neutral-400">No videos found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {videos.map(v => (
                <a
                  key={v.id}
                  href={`https://www.youtube.com/watch?v=${v.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-xl overflow-hidden border border-neutral-800 hover:border-neutral-700 bg-neutral-950"
                >
                  <div className="aspect-video relative">
                    <img
                      src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                      alt={v.title}
                      className="w-full h-full object-cover opacity-95 group-hover:opacity-100 transition-opacity"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
                    <div
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-hidden="true"
                    >
                      <div
                        className="h-12 w-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: gold }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="black">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold line-clamp-2">{v.title}</h3>
                    {v.publishedAt && (
                      <p className="text-xs text-neutral-400 mt-1">
                        {new Date(v.publishedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>

        {/* News */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">News</h2>
            <a
              href="/#news"
              className="text-sm underline text-neutral-300 hover:text-white"
            >
              Latest news
            </a>
          </div>

          {news.length === 0 ? (
            <p className="text-neutral-400">No news articles found.</p>
          ) : (
            <ul className="space-y-3">
              {news.map((n, i) => (
                <li key={i} className="border border-neutral-800 hover:border-neutral-700 rounded-xl">
                  <a href={n.link} target="_blank" rel="noopener noreferrer" className="block p-4">
                    <div className="text-xs text-neutral-400">
                      {n.source}{n.isoDate ? ` · ${new Date(n.isoDate).toLocaleDateString()}` : ""}
                    </div>
                    <div className="text-sm md:text-base font-semibold mt-1">{n.title}</div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Layout>
  );
}
