import type { GetServerSideProps } from "next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import {
  getUploadsPlaylistId,
  fetchUploadsPage,
  getAllUploadVideoIds,
  getVideoDetails,
  searchChannelVideos,
  type YTVideo,
} from "../../../lib/youtube"

const PER_PAGE = 18
const CHANNEL_ID = process.env.YT_CHANNEL_ID || "UCh31mRik5zu2JNIC-oUCBjg"
const API_KEY = process.env.NEXT_PUBLIC_YT_API_KEY || ""

type Props = {
  page: number
  totalPages: number
  totalVideos: number
  videos: YTVideo[]
  offset: number
  q?: string | null
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const p = parseInt(String(ctx.params?.page || "1"), 10) || 1
  const q = (ctx.query?.q ? String(ctx.query.q) : "").trim() || null

  // Search mode (no pagination)
  if (q) {
    const results = await searchChannelVideos(q, PER_PAGE, CHANNEL_ID, API_KEY)
    return {
      props: { page: 1, totalPages: 1, totalVideos: results.length, videos: results, offset: 0, q },
    }
  }

  // Normal pagination over uploads playlist
  const uploads = await getUploadsPlaylistId(CHANNEL_ID, API_KEY)
  // Collect exactly the page we need by advancing pages of 50
  const want = PER_PAGE
  const startIndex = (p - 1) * PER_PAGE
  let cursor = 0
  let token: string | undefined
  let collected: YTVideo[] = []

  while (collected.length < want) {
    const page = await fetchUploadsPage(uploads, 50, token, API_KEY)
    token = page.nextPageToken
    for (const v of page.items) {
      if (cursor >= startIndex && collected.length < want) {
        collected.push(v)
      }
      cursor++
      if (collected.length >= want) break
    }
    if (!token) break
  }

  // details (views/duration) – batch by 50
  const ids = collected.map(v => v.id).filter(Boolean)
  const details = await getVideoDetails(ids, API_KEY)
  const merged = collected.map(v => ({ ...v, ...details[v.id] }))

  // compute totals via id crawl (only once per request)
  const allIds = await getAllUploadVideoIds(CHANNEL_ID, API_KEY)
  const totalVideos = allIds.length
  const totalPages = Math.max(1, Math.ceil(totalVideos / PER_PAGE))

  if (p < 1 || p > totalPages) {
    return { redirect: { destination: "/videos/page/1", permanent: false } }
  }

  return {
    props: { page: p, totalPages, totalVideos, videos: merged, offset: startIndex },
  }
}

export default function VideosPage(props: Props) {
  const { page, totalPages, totalVideos, videos, q } = props
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
              : `Browse F1 Grandstand YouTube uploads – page ${page} of ${totalPages} (${totalVideos} total).`
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
          {q && (
            <p className="text-neutral-400 mb-4">Showing results for “{q}”.</p>
          )}

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

          {/* Pagination (only when not searching) */}
          {!q && totalPages > 1 && (
            <nav className="flex items-center justify-between mt-8">
              <Link
                href={`/videos/page/${Math.max(1, page - 1)}`}
                className={`px-4 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-900 ${page === 1 ? "pointer-events-none opacity-40" : ""}`}
              >
                ← Prev
              </Link>
              <p className="text-neutral-400">Page {page} of {totalPages}</p>
              <Link
                href={`/videos/page/${Math.min(totalPages, page + 1)}`}
                className={`px-4 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-900 ${page === totalPages ? "pointer-events-none opacity-40" : ""}`}
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
