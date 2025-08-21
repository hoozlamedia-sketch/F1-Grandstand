import Layout from '../components/Layout'
import { GetStaticProps } from 'next'
import React from 'react'

type Video = {
  id: string
  title: string
  description?: string
  thumbnail?: string
  publishedAt: string
  live?: boolean
}

type Props = { videos: Video[] }

const CHANNEL_ID = "UCh31mRik5zu2JNIC-oUCBjg"
const API_KEY = process.env.NEXT_PUBLIC_YT_API_KEY || ""

export default function VideosPage({ videos }: Props) {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": videos.map((v, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "VideoObject",
        "name": v.title,
        "description": v.description || v.title,
        "thumbnailUrl": v.thumbnail,
        "uploadDate": v.publishedAt,
        "embedUrl": `https://www.youtube.com/embed/${v.id}`,
        "url": `https://www.youtube.com/watch?v=${v.id}`,
        "publisher": {
          "@type": "Organization",
          "name": "F1 Grandstand",
          "logo": {
            "@type": "ImageObject",
            "url": "/F1-GRANDSTAND-LOGO-NEW.png"
          }
        },
        ...(v.live ? {
          "liveBroadcast": {
            "@type": "BroadcastEvent",
            "isLiveBroadcast": true,
            "startDate": v.publishedAt
          }
        } : {})
      }
    }))
  }

  return (
    <Layout>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      </head>
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8" style={{ color: '#f5e9c8' }}>All Videos</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map(v => (
            <article key={v.id} className="rounded-3xl overflow-hidden relative" style={{ backgroundColor: '#0f0f0f', border: '1px solid #2a2a2a' }}>
              <div className="aspect-video relative">
                <iframe title={v.title} className="w-full h-full" src={`https://www.youtube.com/embed/${v.id}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
                {v.live && (
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">LIVE</span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold leading-snug line-clamp-2">{v.title}</h3>
                <p className="text-xs text-neutral-400 mt-1">{new Date(v.publishedAt).toLocaleDateString()}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const videos: Video[] = []
  try {
    const url = new URL('https://www.googleapis.com/youtube/v3/search')
    url.searchParams.set('part', 'snippet')
    url.searchParams.set('channelId', CHANNEL_ID)
    url.searchParams.set('order', 'date')
    url.searchParams.set('maxResults', '18')
    url.searchParams.set('type', 'video')
    url.searchParams.set('key', API_KEY)
    const res = await fetch(url.toString())
    if (res.ok) {
      const data = await res.json()
      const ids = (data.items || []).map((it: any) => it.id.videoId).join(",")
      let liveMap: Record<string, boolean> = {}
      try {
        const vres = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${ids}&key=${API_KEY}`)
        if (vres.ok) {
          const vd = await vres.json()
          vd.items.forEach((v: any) => {
            if (v.snippet.liveBroadcastContent === "live") liveMap[v.id] = true
          })
        }
      } catch {}
      for (const it of data.items || []) {
        videos.push({
          id: it.id.videoId,
          title: it.snippet.title,
          description: it.snippet.description,
          thumbnail: it.snippet.thumbnails?.high?.url,
          publishedAt: it.snippet.publishedAt,
          live: liveMap[it.id.videoId] || false
        })
      }
    }
  } catch {}
  return { props: { videos }, revalidate: 300 }
}
