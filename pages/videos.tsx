import Layout from "../components/Layout"
import type { GetStaticProps } from "next"

type Video = { id: string; title: string; publishedAt: string; live?: boolean }

type Props = {
  channelId: string
  videos: Video[]
  hasApiKey: boolean
}

const CHANNEL_ID = "UCh31mRik5zu2JNIC-oUCBjg"
const YT_API_KEY = process.env.NEXT_PUBLIC_YT_API_KEY || ""

export default function Videos({ channelId, videos, hasApiKey }: Props) {
  return (
    <Layout title="Videos" description="Latest Formula 1 videos from the F1 Grandstand YouTube channel.">
      <section className="mx-auto max-w-6xl px-4 py-12 space-y-6">
        <h1 className="text-3xl font-extrabold" style={{ color: "#f5e9c8" }}>Latest F1 Videos</h1>

        {!hasApiKey && (
          <p className="text-red-400">
            Missing YouTube API key. Set <code>NEXT_PUBLIC_YT_API_KEY</code> in your Vercel Project Settings → Environment Variables.
          </p>
        )}

        {hasApiKey && videos.length === 0 && (
          <p className="text-neutral-400">No videos found right now. Please try again shortly.</p>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {videos.map(v => (
            <article key={v.id} className="rounded-3xl overflow-hidden relative" style={{ backgroundColor: "#0f0f0f", border: "1px solid #2a2a2a" }}>
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
  const channelId = CHANNEL_ID
  const apiKey = YT_API_KEY
  const hasApiKey = !!apiKey

  if (!hasApiKey) {
    return { props: { channelId, videos: [], hasApiKey }, revalidate: 300 }
  }

  try {
    const sUrl = new URL("https://www.googleapis.com/youtube/v3/search")
    sUrl.searchParams.set("part", "snippet")
    sUrl.searchParams.set("channelId", channelId)
    sUrl.searchParams.set("order", "date")
    sUrl.searchParams.set("maxResults", "9")
    sUrl.searchParams.set("type", "video")
    sUrl.searchParams.set("key", apiKey)
    const sRes = await fetch(sUrl.toString())
    if (!sRes.ok) throw new Error("Search failed")
    const sData = await sRes.json()
    const items = sData.items || []
    const ids = items.map((it: any) => it?.id?.videoId).filter(Boolean).join(",")

    let liveMap: Record<string, boolean> = {}
    if (ids) {
      const vRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${ids}&key=${apiKey}`)
      if (vRes.ok) {
        const vData = await vRes.json()
        vData.items?.forEach((v: any) => {
          if (v?.snippet?.liveBroadcastContent === "live") liveMap[v.id] = true
        })
      }
    }

    const videos: Video[] = (items || []).map((it: any) => ({
      id: it.id.videoId,
      title: it.snippet.title,
      publishedAt: it.snippet.publishedAt,
      live: !!liveMap[it.id.videoId]
    }))

    return { props: { channelId, videos, hasApiKey }, revalidate: 300 }
  } catch {
    return { props: { channelId, videos: [], hasApiKey }, revalidate: 300 }
  }
}
