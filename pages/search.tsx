import Head from "next/head";
import Link from "next/link";
import Layout from "@/components/Layout";
import { GetServerSideProps } from "next";
import { searchChannelVideos, type YTVideo } from "@/lib/youtube";

type NewsItem = { title: string; link: string; isoDate?: string; excerpt?: string; source: string };

type Props = {
  q: string;
  videos: YTVideo[];
  news: NewsItem[];
};

const CHANNEL_ID = process.env.YT_CHANNEL_ID || "UCh31mRik5zu2JNIC-oUCBjg";
const API_KEY = process.env.NEXT_PUBLIC_YT_API_KEY || "";

export const getServerSideProps: GetServerSideProps<Props> = async ({ query, req }) => {
  const q = String(query.q || "").trim();

  // fetch videos (YouTube API; safe limits)
  let videos: YTVideo[] = [];
  if (q && API_KEY) {
    try {
      videos = await searchChannelVideos(q, 18, CHANNEL_ID, API_KEY);
    } catch {}
  }

  // fetch news via our API (so we share the same logic everywhere)
  let news: NewsItem[] = [];
  if (q) {
    try {
      const base = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : `http://${req.headers.host}`;
      const r = await fetch(`${base}/api/search-news?q=${encodeURIComponent(q)}`);
      const data = await r.json();
      news = data.items || [];
    } catch {}
  }

  return { props: { q, videos, news } };
};

export default function SearchPage({ q, videos, news }: Props) {
  const gold = "#f5e9c8";
  return (
    <Layout title={`Search: ${q || ""}`} description={`Search results for "${q}" on F1 Grandstand`}>
      <Head>
        <meta name="robots" content="noindex,follow" />
      </Head>

      <section className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <h1 className="text-2xl font-bold" style={{ color: gold }}>
          Search results for “{q}”
        </h1>

        {/* VIDEOS */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Videos</h2>
            <Link href={`/videos?q=${encodeURIComponent(q)}`} className="text-sm hover:opacity-80" style={{ color: gold }}>
              See more
            </Link>
          </div>

          {videos.length === 0 ? (
            <p className="text-neutral-400 text-sm">No matching videos found.</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((v) => (
                <li key={v.id} className="group rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950">
                  <a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noreferrer" className="block">
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                        alt={v.title}
                        className="w-full aspect-video object-cover opacity-95 group-hover:opacity-100 transition"
                      />
                      <span
                        className="absolute inset-0 pointer-events-none"
                        style={{ background:
                          "radial-gradient(60% 60% at 50% 50%, rgba(0,0,0,0.0), rgba(0,0,0,0.35))" }}
                      />
                      <span
                        className="absolute left-2 top-2 text-[10px] px-2 py-0.5 rounded border border-neutral-700 bg-black/60"
                        style={{ color: gold }}
                      >
                        YouTube
                      </span>
                      <span
                        className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition"
                      >
                        <span
                          className="h-12 w-12 rounded-full border"
                          style={{ borderColor: gold, boxShadow: "0 0 0 2px rgba(245,233,200,0.25)" }}
                        >
                          {/* triangle play icon */}
                          <svg viewBox="0 0 100 100" className="h-full w-full fill-current" style={{ color: gold }}>
                            <polygon points="40,30 72,50 40,70"></polygon>
                          </svg>
                        </span>
                      </span>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-medium line-clamp-2">{v.title}</h3>
                      <p className="text-xs text-neutral-400 mt-1">{v.publishedAt?.slice(0,10)}</p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* NEWS */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">News</h2>
            <Link href={`/#news`} className="text-sm hover:opacity-80" style={{ color: gold }}>
              Go to News
            </Link>
          </div>

          {news.length === 0 ? (
            <p className="text-neutral-400 text-sm">No matching news found from our sources.</p>
          ) : (
            <ul className="space-y-3">
              {news.map((n, i) => (
                <li key={i} className="rounded-xl border border-neutral-800 p-3 bg-neutral-950">
                  <a href={n.link} target="_blank" rel="noreferrer" className="block hover:opacity-90">
                    <div className="text-sm text-neutral-400">{n.source}</div>
                    <h3 className="text-base font-medium mt-1">{n.title}</h3>
                    {n.excerpt && <p className="text-sm text-neutral-400 mt-1 line-clamp-2">{n.excerpt}</p>}
                    {n.isoDate && <p className="text-xs text-neutral-500 mt-1">{n.isoDate}</p>}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </Layout>
  );
}
