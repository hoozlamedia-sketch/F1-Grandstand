import EditorialNote from "../../../components/EditorialNote";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import Layout from "../../../components/Layout";
import {
  getUploadsPlaylistId,
  fetchUploadsPage,
  getVideoDetails,
  searchChannelVideos,
  fetchChannelRSS,
  type YTVideo,
} from "../../../lib/youtube";

const PER_PAGE = 18;
const CHANNEL_ID = process.env.YT_CHANNEL_ID || "UCh31mRik5zu2JNIC-oUCBjg";
const API_KEY =
  process.env.YT_API_KEY || process.env.NEXT_PUBLIC_YT_API_KEY || undefined;

type Props = {
  page: number;
  videos: YTVideo[];
  hasNext: boolean;
  q?: string | null;
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const p = Math.max(1, parseInt(String(ctx.params?.page || "1"), 10) || 1);
  const q = (ctx.query?.q ? String(ctx.query.q) : "").trim() || null;

  // SEARCH MODE – API required; fallback to RSS filter
  if (q) {
    try {
      const results = await searchChannelVideos(q, PER_PAGE, CHANNEL_ID, API_KEY);
      const safe = (results || []).filter(v => v && v.id);
      return { props: { page: 1, videos: safe, hasNext: false, q } };
    } catch {
      const rss = await fetchChannelRSS(CHANNEL_ID);
      const filtered = rss
        .filter((v) => v.title.toLowerCase().includes(q.toLowerCase()))
        .slice(0, PER_PAGE);
      return { props: { page: 1, videos: filtered, hasNext: false, q } };
    }
  }

  // PAGINATION over uploads – API first
  try {
    const uploads = await getUploadsPlaylistId(CHANNEL_ID, API_KEY);
    const startIndex = (p - 1) * PER_PAGE;

    let cursor = 0;
    let token: string | undefined;
    let collected: YTVideo[] = [];
    let lastPageNext: string | undefined;

    while (collected.length < PER_PAGE) {
      const page = await fetchUploadsPage(uploads, 50, token, API_KEY);
      token = page.nextPageToken;
      lastPageNext = token;
      for (const v of page.items) {
        if (cursor >= startIndex && collected.length < PER_PAGE) {
          collected.push(v);
        }
        cursor++;
        if (collected.length >= PER_PAGE) break;
      }
      if (!token) break;
    }

    const hasNext = Boolean(lastPageNext && collected.length === PER_PAGE);

    // Optional details (views/duration)
    let merged = collected;
    try {
      const ids = collected.map((v) => v.id).filter(Boolean);
      const details = await getVideoDetails(ids, API_KEY);
      merged = collected.map((v) => ({ ...v, ...details[v.id] }));
    } catch { /* ignore */ }

    if (!merged.length && p > 1) {
      return { redirect: { destination: "/videos/page/1", permanent: false } };
    }

    return { props: { page: p, videos: merged, hasNext } };
  } catch {
    // RSS fallback (recent ~15)
    const rss = await fetchChannelRSS(CHANNEL_ID);
    const start = (p - 1) * PER_PAGE;
    const slice = rss.slice(start, start + PER_PAGE);
    const hasNext = rss.length > start + PER_PAGE;
    if (!slice.length && p > 1) {
      return { redirect: { destination: "/videos/page/1", permanent: false } };
    }
    return { props: { page: p, videos: slice, hasNext } };
  }
};

/** Lite inline YouTube: matches Home page visuals, loads iframe only on click */
function LiteYouTubeInline({
  id,
  title,
  thumbnail,
}: {
  id: string;
  title: string;
  thumbnail?: string | null;
}) {
  const [playing, setPlaying] = useState(false);
  if (playing) {
    const src = `https://www.youtube.com/embed/${id}?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3`;
    return (
      <iframe
        title={title}
        className="w-full h-full"
        src={src}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }
  const thumb = thumbnail || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  return (
    <button
      onClick={() => setPlaying(true)}
      className="w-full h-full relative group"
      aria-label={`Play ${title}`}
    >
      <img src={thumb} alt={title} className="w-full h-full object-cover" />
      {/* lighter overlay: 15% -> 10% on hover */}
      <span className="absolute inset-0 bg-black/15 group-hover:bg-black/10 transition" />
      {/* gold play button (identical to Home) */}
      <span className="absolute inset-0 flex items-center justify-center">
        <span
          className="rounded-full p-4 md:p-5 shadow ring-1 ring-black/10"
          style={{ backgroundColor: "#d4b36c" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M8 5v14l11-7L8 5z" fill="#0c0c0c" />
          </svg>
        </span>
      </span>
    </button>
  );
}

export default function VideosPage({ page, videos, hasNext, q }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(q || "");
  const gold = "#f5e9c8";

  return (
    <Layout
      title={
        q
          ? `F1 News Videos — Search “${q}” | F1 Grandstand`
          : `F1 News Videos — Page ${page} | F1 Grandstand`
      }
      description={
        q
          ? `Search results for “${q}” across F1 Grandstand uploads.`
          : `Browse F1 Grandstand YouTube uploads – page ${page}.`
      }
    >
      <Head>
        <meta name="robots" content="index,follow" />
        {!q && page > 1 && <link rel="prev" href={`/videos/page/${page - 1}`} />}
        {!q && hasNext && <link rel="next" href={`/videos/page/${page + 1}`} />}
      </Head>

      {/* Top utility row: search */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const qs = new URLSearchParams();
            if (query.trim()) qs.set("q", query.trim());
            router.push(`/videos/page/1?${qs.toString()}`);
          }}
          className="flex items-center gap-2"
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search F1 Grandstand videos…"
            className="px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 focus:outline-none text-white placeholder-neutral-500"
          />
          <button className="px-4 py-2 rounded-lg border border-[#f5e9c8]/30 hover:bg-[#f5e9c8]/10 text-[#f5e9c8]">
            Search
          </button>
        </form>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1
          className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6"
          style={{ color: "#f5e9c8" }}
        >
          F1 News Videos
        </h1>
        {q && <p className="text-neutral-400 mb-4">Showing results for “{q}”.</p>}

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((v) => (
            <article
              key={v.id}
              className="group relative rounded-xl overflow-hidden border border-neutral-800 hover:border-neutral-600 transition"
            >
              <div className="w-full aspect-video">
                <LiteYouTubeInline id={v.id} title={v.title} thumbnail={v.thumbnail} />
              </div>

              {/* Title only on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition">
                <h3 className="text-sm font-semibold">{v.title}</h3>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination (Prev/Next using hasNext) — hidden during search */}
        {!q && (
          <nav
            className="flex items-center justify-between mt-8"
            aria-label="F1 Videos pagination"
          >
            {/* Older = larger page number (outlined gold) */}
            <div>
              {hasNext ? (
                <a
                  href={`/videos/page/${page + 1}`}
                  rel="next"
                  aria-label="Older F1 News Videos"
                  className="inline-block rounded border px-4 py-2 font-semibold transition"
                  style={{ borderColor: gold, color: gold }}
                >
                  ← Older F1 News Videos
                </a>
              ) : (
                <span
                  aria-disabled="true"
                  className="inline-block rounded border px-4 py-2 opacity-40 cursor-not-allowed"
                  style={{ borderColor: gold, color: gold }}
                >
                  ← Older F1 News Videos
                </span>
              )}
            </div>

            <div />

            {/* Newer = smaller page number (solid gold) */}
            <div>
              {page > 1 ? (
                <a
                  href={`/videos/page/${page - 1}`}
                  rel="prev"
                  aria-label="Newer F1 News Videos"
                  className="inline-block rounded px-4 py-2 font-semibold shadow transition"
                  style={{ backgroundColor: gold, color: "#0e0e0e" }}
                >
                  Newer F1 News Videos →
                </a>
              ) : (
                <span
                  aria-disabled="true"
                  className="inline-block rounded px-4 py-2 font-semibold shadow transition opacity-40 cursor-not-allowed"
                  style={{ backgroundColor: gold, color: "#0e0e0e" }}
                >
                  Newer F1 News Videos →
                </span>
              )}
            </div>
          </nav>
        )}
      </main>
    </Layout>
  );
}
