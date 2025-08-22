import Layout from '../../../components/Layout'
import Link from 'next/link'
import type { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { getAllUploadVideoIds, getVideoDetails, YTVideo, searchChannelVideos } from '../../../lib/youtube'
const CHANNEL_ID = "UCh31mRik5zu2JNIC-oUCBjg";
const API_KEY = process.env.NEXT_PUBLIC_YT_API_KEY || "";

const PER_PAGE = 18

type Props = {
  page: number
  totalPages: number
  totalVideos: number
  videos: YTVideo[]
  offset: number
  q?: string
}

export default function VideosPage({ page, totalPages, totalVideos, videos, offset, q }: Props) {
  const baseUrl = 'https://www.f1grandstand.com'
  const list = videos.map((v, i) => ({
    "@type":"ListItem",
    "position": offset + i + 1,
    "url": `${baseUrl}/videos/${v.id}`,
    "item": {
      "@type":"VideoObject",
      "name": v.title,
      "description": v.description || v.title,
      "thumbnailUrl": [v.thumbnail],
      "uploadDate": v.publishedAt,
      "embedUrl": `https://www.youtube.com/embed/${v.id}`,
      "publisher": {"@type":"Organization","name":"F1 Grandstand"}
    },
    ...(v.live ? { "liveBroadcast": { "@type":"BroadcastEvent", "isLiveBroadcast": true, "startDate": v.publishedAt } } : {})
  }))

  return (
    <Layout title={`Videos — Page ${page}`} description="Browse all F1 Grandstand videos">
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({ "@context":"https://schema.org", "@type":"ItemList", itemListElement: list })}} />
      </Head>
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between gap-3 mb-6">
          <h1 className="text-3xl font-extrabold" style={{ color: '#f5e9c8' }}>All Videos</h1>
          <form method="get" action="/videos/page/1" className="flex gap-2">
            <input name="q" defaultValue={q || ''} placeholder="Search videos…" className="rounded-xl px-3 py-2 outline-none" style={{ backgroundColor: '#111', border: '1px solid #2a2a2a' }} />
            <button className="rounded-xl px-4 py-2" style={{ backgroundColor: '#d4b36c', color: '#0c0c0c' }}>Search</button>
          </form>
        </div>

        {q && <p className="text-sm text-neutral-400 mb-4">Showing results for “{q}”.</p>}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map(v => (
            <article key={v.id} className="rounded-3xl overflow-hidden relative" style={{ backgroundColor: '#0f0f0f', border: '1px solid #2a2a2a' }}>
              <a href={`/videos/${v.id}`}>
                <img src={v.thumbnail} alt={v.title} className="w-full aspect-video object-cover" />
                {v.live && <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">LIVE</span>}
              </a>
              <div className="p-4">
                <h3 className="font-semibold leading-snug line-clamp-2"><Link href={`/videos/${v.id}`}>{v.title}</Link></h3>
                <p className="text-xs text-neutral-400 mt-1">{new Date(v.publishedAt || '').toLocaleString()}</p>
              </div>
            </article>
          ))}
        </div>

        {!q && (
          <div className="flex items-center justify-center gap-3 mt-10">
            {page > 1 && <Link href={`/videos/page/${page-1}`} className="px-4 py-2 rounded-xl" style={{ backgroundColor: '#181818', border: '1px solid #2a2a2a' }}>← Prev</Link>}
            <span className="text-neutral-400 text-sm">Page {page} of {totalPages}</span>
            {page < totalPages && <Link href={`/videos/page/${page+1}`} className="px-4 py-2 rounded-xl" style={{ backgroundColor: '#181818', border: '1px solid #2a2a2a' }}>Next →</Link>}
          </div>
        )}
      </section>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Build first page to start; use fallback 'blocking' so new pages render on-demand
  return { paths: [{ params: { page: '1' } }], fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const pageParam = ctx.params?.page as string
  const page = Math.max(1, Number(pageParam || '1'))
  const q = (ctx.params as any)?.q || (ctx.previewData as any)?.q || (ctx as any).req?.url?.includes('?q=') ? decodeURIComponent(((ctx as any).req?.url || '').split('?q=')[1] || '') : undefined

  try {
    if (q) {
      // Search mode (no pagination, always page 1)
      const results = await searchChannelVideos(q, String(PER_PAGE), CHANNEL_ID, API_KEY)
      return { props: { page: 1, totalPages: 1, totalVideos: results.length, videos: results, offset: 0, q } }
    }

    const ids = await getAllUploadVideoIds(CHANNEL_ID, API_KEY)
    const totalVideos = ids.length
    const totalPages = Math.max(1, Math.ceil(totalVideos / PER_PAGE))
    const start = (page - 1) * PER_PAGE
    const pageIds = ids.slice(start, start + PER_PAGE)
    const videos = await getVideoDetails(pageIds)
    return { props: { page, totalPages, totalVideos, videos, offset: start }, revalidate: 300 }
  } catch (e) {
    return { notFound: true }
  }
}
