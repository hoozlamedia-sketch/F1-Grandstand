import Layout from '../components/Layout'
import Head from 'next/head'
import Link from 'next/link'
import { Play, Newspaper, Clock } from 'lucide-react'
import type { GetStaticProps } from 'next'
import { fetchAllNews, NewsItem } from '../lib/rss'
import React, { useEffect, useState } from 'react'

type SEOVideo = {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  publishedAt?: string;
  live?: boolean;
  liveStart?: string;
}

type Props = { 
  news: NewsItem[]; 
  featured?: { 
    id: string; 
    title: string; 
    description?: string; 
    thumbnail?: string; 
    publishedAt?: string; 
    live?: boolean;
    liveStart?: string;
  };
  videosSeo: SEOVideo[];
}

const CHANNEL_ID = "UCh31mRik5zu2JNIC-oUCBjg"
const YT_API_KEY = process.env.NEXT_PUBLIC_YT_API_KEY || "AIzaSyCytjJ7EwAlPZ8FId1YJsEbz6cYv3VL7_E"

export default function Home({ news, featured, videosSeo }: Props) {
  return (
    <Layout>
      {/* JSON-LD: ItemList for the 9 videos on the page */}
      <Head>
        {Array.isArray(videosSeo) && videosSeo.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ItemList",
                "itemListElement": videosSeo.map((v, i) => ({
                  "@type": "ListItem",
                  "position": i + 1,
                  "item": {
                    "@type": "VideoObject",
                    "name": v.title,
                    "description": v.description || v.title,
                    "thumbnailUrl": v.thumbnail ? [v.thumbnail] : undefined,
                    "uploadDate": v.publishedAt,
                    "embedUrl": `https://www.youtube.com/embed/${v.id}`,
                    "url": `https://www.youtube.com/watch?v=${v.id}`,
                    "publisher": {
                      "@type": "Organization",
                      "name": "F1 Grandstand",
                      "logo": {
                        "@type": "ImageObject",
                        "url": "https://www.f1grandstand.com/F1-GRANDSTAND-LOGO-NEW.png"
                      }
                    },
                    "liveBroadcast": v.live ? {
                      "@type": "BroadcastEvent",
                      "isLiveBroadcast": true,
                      "startDate": v.liveStart || v.publishedAt
                    } : undefined
                  }
                }))
              })
            }}
          />
        )}
      </Head>

      {/* JSON-LD: Featured video (latest) */}
      <Head>
        {featured && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "VideoObject",
                "name": featured.title,
                "description": featured.description || featured.title,
                "thumbnailUrl": featured.thumbnail ? [featured.thumbnail] : undefined,
                "uploadDate": featured.publishedAt,
                "embedUrl": featured.id ? `https://www.youtube.com/embed/${featured.id}` : undefined,
                "url": featured.id ? `https://www.f1grandstand.com/videos/${featured.id}` : undefined,
                "publisher": {
                  "@type": "Organization",
                  "name": "F1 Grandstand",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://www.f1grandstand.com/F1-GRANDSTAND-LOGO-NEW.png"
                  }
                },
                "liveBroadcast": featured.live ? {
                  "@type": "BroadcastEvent",
                  "isLiveBroadcast": true,
                  "startDate": featured.liveStart || featured.publishedAt
                } : undefined
              })
            }}
          />
        )}
      </Head>

      <header className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(80% 60% at 50% 0%, rgba(212,179,108,.2), transparent 60%)' }}
        />
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-16 grid md:grid-cols-2 gap-8 items-center">
          {/* Left: latest video (mobile + desktop) */}
          <div className="order-2 md:order-1">
            {featured?.live && (
              <div className="mb-2 inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full bg-red-600 text-white shadow">
                🔴 LIVE NOW
              </div>
            )}
            <div className="aspect-video rounded-3xl overflow-hidden ring-2 shadow-lg" style={{ borderColor: '#d4b36c' }}>
              {featured?.id ? (
                <iframe
                  title={featured?.title || 'Latest video'}
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${featured?.id}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full grid place-items-center text-neutral-400 text-sm">
                  Video unavailable right now
                </div>
              )}
            </div>
            {featured?.title && (
              <div className="mt-3">
                <p className="text-sm text-neutral-400 line-clamp-2">
                  <span className="font-semibold" style={{ color: '#f5e9c8' }}>Latest:</span> {featured.title}
                </p>
                {featured?.live && (
                  <a
                    href={`https://www.youtube.com/watch?v=${featured.id}`}
                    target="_blank"
                    rel="noopener"
                    className="mt-2 inline-block rounded-2xl px-4 py-2 text-sm font-semibold bg-red-600 text-white shadow hover:bg-red-700"
                  >
                    💬 Join Live Chat
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Right: brand + CTA */}
          <div className="order-1 md:order-2">
            <span
              className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: 'linear-gradient(90deg, #d4b36c, #c9a76d)', color: '#0c0c0c' }}
            >
              Formula 1 News
            </span>
            <h1 className="text-4xl md:text-6xl font-black leading-tight mt-3" style={{ color: '#f5e9c8' }}>
              Daily F1 News, Rumours & <span style={{ color: '#d4b36c' }}>Real Talk</span>
            </h1>
            <p className="mt-4 text-neutral-300 text-lg max-w-prose">
              F1 Grandstand delivers breaking Formula 1 news, driver market moves, and sharp analysis — plus fresh videos every week.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#videos"
                className="rounded-2xl px-5 py-3 transition inline-flex items-center gap-2 shadow"
                style={{ backgroundColor: '#181818', border: '1px solid #2a2a2a' }}
              >
                <Play className="w-5 h-5" /> Watch Latest Videos
              </a>
              <a
                href="#news"
                className="rounded-2xl px-5 py-3 transition inline-flex items-center gap-2 shadow"
                style={{ backgroundColor: '#d4b36c', color: '#0c0c0c' }}
              >
                <Newspaper className="w-5 h-5" /> Read F1 News
              </a>
            </div>
            <div className="mt-6 rounded-2xl overflow-hidden ring-1" style={{ borderColor: '#2a2a2a' }}>
              <img src="/F1 GRANDSTAND BANNER NEW.png" alt="F1 Grandstand banner" className="w-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      <section id="videos" className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold" style={{ color: '#f5e9c8' }}>Latest Videos</h2>
          <a
            href="https://www.youtube.com/@F1Grandstand"
            target="_blank"
            className="inline-flex items-center gap-2"
            style={{ color: '#d4b36c' }}
          >
            Visit Channel
          </a>
        </div>
        <VideoGrid channelId={CHANNEL_ID} apiKey={YT_API_KEY} />
      </section>

      <section id="news" className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6" style={{ color: '#f5e9c8' }}>Latest F1 News</h2>
        <NewsGrid items={news.slice(0, 12)} />
        <div className="mt-8 text-center">
          <Link
            href="/news"
            className="inline-block rounded-2xl px-5 py-3"
            style={{ backgroundColor: '#181818', border: '1px solid #2a2a2a' }}
          >
            More F1 news →
          </Link>
        </div>
      </section>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const news = await fetchAllNews(60)
  const channelId = CHANNEL_ID
  const apiKey = process.env.NEXT_PUBLIC_YT_API_KEY || YT_API_KEY

  let featured:
    | {
        id: string
        title: string
        description?: string
        thumbnail?: string
        publishedAt?: string
        live?: boolean
        liveStart?: string
      }
    | undefined = undefined

  let gridVideos: Array<{
    id: string
    title: string
    description?: string
    thumbnail?: string
    publishedAt?: string
    live?: boolean
    startTime?: string
  }> = []

  try {
    // Fetch latest 9 videos
    const sUrl = new URL('https://www.googleapis.com/youtube/v3/search')
    sUrl.searchParams.set('part', 'snippet')
    sUrl.searchParams.set('channelId', channelId)
    sUrl.searchParams.set('order', 'date')
    sUrl.searchParams.set('maxResults', '9')
    sUrl.searchParams.set('type', 'video')
    sUrl.searchParams.set('key', apiKey as string)
    const sRes = await fetch(sUrl.toString())
    if (sRes.ok) {
      const sData = await sRes.json()
      const items = sData.items || []
      const ids = items.map((it: any) => it.id.videoId).join(',')

      // Fetch details for live info and best thumbnails
      let detailsById: Record<string, any> = {}
      if (ids) {
        const vRes = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails&id=${ids}&key=${apiKey}`
        )
        if (vRes.ok) {
          const vData = await vRes.json()
          for (const v of vData.items || []) {
            detailsById[v.id] = v
          }
        }
      }

      gridVideos = items.map((it: any) => {
        const id = it.id.videoId
        const sn = it.snippet
        const det = detailsById[id]?.snippet || sn
        const live = det?.liveBroadcastContent === 'live'
        const thumbs = det?.thumbnails || sn?.thumbnails || {}
        const thumb =
          thumbs.maxres?.url ||
          thumbs.standard?.url ||
          thumbs.high?.url ||
          thumbs.medium?.url ||
          thumbs.default?.url ||
          ''
        return {
          id,
          title: sn.title,
          description: sn.description,
          thumbnail: thumb,
          publishedAt: sn.publishedAt,
          live,
          startTime:
            detailsById[id]?.liveStreamingDetails?.actualStartTime ||
            detailsById[id]?.liveStreamingDetails?.scheduledStartTime ||
            undefined
        }
      })

      // featured = first (newest) item
      const f = gridVideos[0]
      if (f) {
        featured = {
          id: f.id,
          title: f.title,
          description: f.description ?? null,
          thumbnail: f.thumbnail ?? null,
          publishedAt: f.publishedAt ?? null,
          live: !!f.live,
          liveStart: f.startTime ?? null
        }
      } else {
        featured = null as any
      }
    }
  } catch {
    // swallow errors — page will still render with news
  }

  // Build JSON-LD array for the 9 videos
  const publisher = {
    "@type": "Organization",
    "name": "F1 Grandstand",
    "url": "https://www.f1grandstand.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.f1grandstand.com/F1-GRANDSTAND-LOGO-NEW.png"
    }
  }

  const videoSchemas: SEOVideo[] = gridVideos.map(v => ({
    id: v.id,
    title: v.title,
    description: v.description,
    thumbnail: v.thumbnail,
    publishedAt: v.publishedAt,
    live: v.live,
    liveStart: v.startTime
  }))

  return { props: { news, featured: featured ?? null, videosSeo: videoSchemas }, revalidate: 300 }
}

// --- Components ---
type Video = { id: string; title: string; publishedAt: string; live?: boolean }

function VideoGrid({ channelId, apiKey }: { channelId: string; apiKey: string }) {
  const [videos, setVideos] = useState<Video[]>([])
  const [error, setError] = useState<string>('')

  useEffect(() => {
    async function run() {
      try {
        const url = new URL('https://www.googleapis.com/youtube/v3/search')
        url.searchParams.set('part', 'snippet')
        url.searchParams.set('channelId', channelId)
        url.searchParams.set('order', 'date')
        url.searchParams.set('maxResults', '9')
        url.searchParams.set('type', 'video')
        url.searchParams.set('key', apiKey)
        const res = await fetch(url.toString())
        if (!res.ok) throw new Error('Failed to fetch videos')
        const data = await res.json()

        // Get live flags for these 9
        const ids = (data.items || []).map((it: any) => it.id.videoId).join(',')
        let liveMap: Record<string, boolean> = {}
        if (ids) {
          const vres = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${ids}&key=${apiKey}`
          )
          if (vres.ok) {
            const vd = await vres.json()
            vd.items?.forEach((v: any) => {
              if (v?.snippet?.liveBroadcastContent === 'live') liveMap[v.id] = true
            })
          }
        }

        const list = (data.items || []).map((it: any) => ({
          id: it.id.videoId,
          title: it.snippet.title,
          publishedAt: it.snippet.publishedAt,
          live: liveMap[it.id.videoId] || false
        }))
        setVideos(list)
      } catch (e: any) {
        setError(e.message || String(e))
      }
    }
    run()
  }, [channelId, apiKey])

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {videos.map(v => (
        <article
          key={v.id}
          className="rounded-3xl overflow-hidden relative"
          style={{ backgroundColor: '#0f0f0f', border: '1px solid #2a2a2a' }}
        >
          <div className="aspect-video relative">
            <iframe
              title={v.title}
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${v.id}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
            {v.live && (
              <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                LIVE
              </span>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold leading-snug line-clamp-2">{v.title}</h3>
            <p className="text-xs text-neutral-400 mt-1 inline-flex items-center gap-1">
              <Clock className="w-3 h-3" /> {new Date(v.publishedAt).toLocaleDateString()}
            </p>
          </div>
        </article>
      ))}
    </div>
  )
}

function NewsGrid({ items }: { items: NewsItem[] }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((n, idx) => (
        <article
          key={idx}
          className="p-5 rounded-3xl"
          style={{ backgroundColor: '#0f0f0f', border: '1px solid #2a2a2a' }}
        >
          <a href={n.link} target="_blank" className="block">
            <h3
              className="font-semibold text-lg leading-snug hover:underline line-clamp-2"
              style={{ color: '#f5e9c8' }}
            >
              {n.title}
            </h3>
          </a>
          <p className="text-xs text-neutral-400 mt-1">
            {formatDate(n.isoDate)} • {n.source}
          </p>
          {n.excerpt && <p className="text-sm text-neutral-300 mt-3">{n.excerpt}…</p>}
          <a
            className="text-sm inline-block mt-3"
            style={{ color: '#d4b36c' }}
            href={n.link}
            target="_blank"
            rel="noopener"
          >
            Read more →
          </a>
        </article>
      ))}
    </div>
  )
}

function formatDate(d?: string) {
  if (!d) return ''
  try {
    return new Date(d).toLocaleString()
  } catch {
    return ''
  }
}