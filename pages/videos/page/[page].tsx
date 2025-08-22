import type { GetServerSideProps } from "next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import {
  getUploadsPlaylistId,
  fetchUploadsPage,
  getVideoDetails,
  searchChannelVideos,
  fetchChannelRSS,
  type YTVideo,
} from "../../../lib/youtube"

const PER_PAGE = 18
const CHANNEL_ID = process.env.YT_CHANNEL_ID || "UCh31mRik5zu2JNIC-oUCBjg"
const API_KEY = process.env.NEXT_PUBLIC_YT_API_KEY || undefined

type Props = {
  page: number
  videos: YTVideo[]
  hasNext: boolean
  q?: string | null
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const p = Math.max(1, parseInt(String(ctx.params?.page || "1"), 10) || 1)
  const q = (ctx.query?.q ? String(ctx.query.q) : "").trim() || null

  // SEARCH MODE – API required; if it fails fallback to RSS + filter
  if (q) {
    try {
      const results = await searchChannelVideos(q, PER_PAGE, CHANNEL_ID, API_KEY)
      return { props: { page: 1, videos: results, hasNext: false, q } }
    } catch {
      // RSS fallback search (recent items only)
      const rss = await fetchChannelRSS(CHANNEL_ID)
      const filtered = rss.filter(v => v.title.toLowerCase().includes(q.toLowerCase())).slice(0, PER_PAGE)
      return { props: { page: 1, videos: filtered, hasNext: false, q } }
    }
  }

  // PAGINATION over uploads – try API first
  try {
    const uploads = await getUploadsPlaylistId(CHANNEL_ID, API_KEY)
    const startIndex = (p - 1) * PER_PAGE

    let cursor = 0
    let token: string | undefined
    let collected: YTVideo[] = []
    let lastPageNext: string | undefined

    while (collected.length < PER_PAGE) {
      const page = await fetchUploadsPage(uploads, 50, token, API_KEY)
      token = page.nextPageToken
      lastPageNext = token
      for (const v of page.items) {
        if (cursor >= startIndex && collected.length < PER_PAGE) {
          collected.push(v)
        }
        cursor++
        if (collected.length >= PER_PAGE) break
      }
      if (!token) break
    }

    // If we finished exactly at a boundary and still have next token, there's a next page
    const hasNext = Boolean(lastPageNext && collected.length === PER_PAGE)

    // details batch (views/duration); be tolerant
    let merged = collected
    try {
      const ids = collected.map(v => v.id).filter(Boolean)
      const details = await getVideoDetails(ids, API_KEY)
      merged = collected.map(v => ({ ...v, ...details[v.id] }))
    } catch { /* ignore */ }

    // if user asks beyond available pages (no items and p>1), redirect to page 1
    if (!merged.length && p > 1) {
      return { redirect: { destination: "/videos/page/1", permanent: false } }
    }

    return { props: { page: p, videos: merged, hasNext } }
  } catch {
    // RSS FALLBACK pagination (recent ~15 only)
    const rss = await fetchChannelRSS(CHANNEL_ID)
    const start = (p - 1) * PER_PAGE
    const slice = rss.slice(start, start + PER_PAGE)
    const hasNext = rss.length > start + PER_PAGE
    if (!slice.length && p > 1) {
      return { redirect: { destination: "/videos/page/1", permanent: false } }
    }
    return { props: { page: p, videos: slice, hasNext } }
  }
}

export default function VideosPage({ page, videos, hasNext, q }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState(q || "")

  return (
    <>
      <Head>
        <title>{q ? `Search “${q}” | F1 Grandstand Videos` : `Videos – Page ${page} | F1 Grandstand`}</title>
        <meta
          name="description"
          content={
            q
              ? `Search results for “${q}” across F1 Grandstand uploads.`
              : `Browse F1 Grandstand YouTube uploads – page ${page}.`
          }
        />
      </Head>

      <div className="min-h-screen bg-black text-white">
        <header className="border-b border-neutral-800 sticky top-0 bg-black/80 backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center gap-3 justify-between">
            <Link href="/" className="text-[#f5e9c8] font-extrabold text-lg">F1 Grandstand</Link>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const qs = new URLSearchParams()
                if (query.trim()) qs.set("q", query.trim())
                router.push(`/videos/page/1?${qs.toString()}`)
              }}
              className="flex items-center gap-2"
            >
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search videos…"
                className="px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 focus:outline-none"
              />
              <button className="px-4 py-2 rounded-lg border border-[#f5e9c8]/30 hover:bg-[#f5e9c8]/10">
                Search
              </button>
            </form>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">
          {q && <p className="text-neutral-400 mb-4">Showing results for “{q}”.</p>}

          {/* Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((v) => (
              <Link
                key={v.id}
                href={`https://www.youtube.com/watch?v=${v.id}`}
                target="_blank"
                className="group relative rounded-xl overflow-hidden border border-neutral-800 hover:border-neutral-600 transition"
              >
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  className="w-full aspect-video object-cover"
                  loading="lazy"
                />
                {/* Softer overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition" />
                {/* Gold play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-[#f5e9c8]/90 group-hover:bg-[#f5e9c8] grid place-items-center shadow-md">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M8 5v14l11-7L8 5z" fill="black"/>
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                  <h3 className="text-sm font-semibold">{v.title}</h3>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination (Prev/Next by hasNext) */}
          {!q && (
            <nav className="flex items-center justify-between mt-8">
              <Link
                href={`/videos/page/${Math.max(1, page - 1)}`}
                className={`px-4 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-900 ${page === 1 ? "pointer-events-none opacity-40" : ""}`}
              >
                ← Prev
              </Link>
              <div />
              <Link
                href={`/videos/page/${page + 1}`}
                className={`px-4 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-900 ${!hasNext ? "pointer-events-none opacity-40" : ""}`}
              >
                Next →
              </Link>
            </nav>
          )}
        </main>
      </div>
    </>
  )
}
