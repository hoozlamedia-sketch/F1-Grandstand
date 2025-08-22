import Layout from "../components/Layout"
import type { GetStaticProps } from "next"

type Video = { id: string; title: string; publishedAt: string; live?: boolean }

type Props = { videos: Video[]; hasApiKey: boolean }

const CHANNEL_ID = "UCh31mRik5zu2JNIC-oUCBjg"
const YT_API_KEY = process.env.NEXT_PUBLIC_YT_API_KEY || ""

export default function Videos({ videos, hasApiKey }: Props) {
  return (
    <Layout title="Videos" description="Latest Formula 1 videos from the F1 Grandstand YouTube channel.">
      <section className="mx-auto max-w-6xl px-4 py-12 space-y-6">
        <h1 className="text-3xl font-extrabold" style={{ color: "#f5e9c8" }}>Latest F1 Videos</h1>
        {!hasApiKey && <p className="text-red-400">Missing YouTube API key. Set NEXT_PUBLIC_YT_API_KEY in Vercel.</p>}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((v) => (
            <article key={v.id} className="rounded-3xl overflow-hidden relative" style={{ backgroundColor: "#0f0f0f", border: "1px solid #2a2a2a" }}>
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${v.id}`}
                  title={v.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold leading-snug">{v.title}</h3>
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
  const apiKey = YT_API_KEY
  if (!apiKey) return { props: { videos: [], hasApiKey: false }, revalidate: 300 }

  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&order=date&maxResults=9&type=video&key=${apiKey}`
    )
    const data = await res.json()
    const videos: Video[] = (data.items || []).map((it: any) => ({
      id: it.id.videoId,
      title: it.snippet.title,
      publishedAt: it.snippet.publishedAt
    }))
    return { props: { videos, hasApiKey: true }, revalidate: 300 }
  } catch {
    return { props: { videos: [], hasApiKey: true }, revalidate: 300 }
  }
}
