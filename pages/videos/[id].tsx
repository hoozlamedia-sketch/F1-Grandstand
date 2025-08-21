import Head from 'next/head'
import Layout from '../../components/Layout'
import type { GetServerSideProps } from 'next'

type Props = {
  id: string
  title: string
  publishedAt: string
  description?: string
  thumbnail: string
  duration?: string
}

const API_KEY = process.env.NEXT_PUBLIC_YT_API_KEY || "AIzaSyCytjJ7EwAlPZ8FId1YJsEbz6cYv3VL7_E"

function summarize(desc?: string, maxSentences: number = 3, maxLen: number = 300) {
  if (!desc) return ''
  // Normalize whitespace
  let text = desc.replace(/\s+/g, ' ').trim()
  // Split by sentence enders
  const sentences = text.split(/(?<=[.!?])\s+/).slice(0, maxSentences)
  let summary = sentences.join(' ')
  if (summary.length > maxLen) summary = summary.slice(0, maxLen - 1) + '…'
  return summary
}

export default function VideoPage({ id, title, publishedAt, description, thumbnail, duration }: Props) {
  const url = `https://www.f1grandstand.com/videos/${id}`
  const youtubeUrl = `https://www.youtube.com/watch?v=${id}`
  const summary = summarize(description)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": title,
    "datePublished": publishedAt,
    "url": url,
    "mainEntityOfPage": url,
    "publisher": {
      "@type": "Organization",
      "name": "F1 Grandstand",
      "logo": { "@type": "ImageObject", "url": "https://www.f1grandstand.com/F1-GRANDSTAND-LOGO-NEW.png" }
    },
    "articleBody": summary || description || title,
    "video": {
      "@type": "VideoObject",
      "name": title,
      "thumbnailUrl": [thumbnail],
      "uploadDate": publishedAt,
      "embedUrl": `https://www.youtube.com/embed/${id}`,
      "description": summary || description || title,
      "duration": duration
    }
  }

  return (
    <Layout title={title} description={summary || description || title}>
      <Head>
        {/* Per-video OG/Twitter meta for rich shares */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={summary || description || title} />
        <meta property="og:image" content={thumbnail} />
        <meta property="og:url" content={url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={summary || description || title} />
        <meta name="twitter:image" content={thumbnail} />
      </Head>

      <section className="max-w-3xl mx-auto px-4 py-10">
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />
        <h1 className="text-3xl font-extrabold mb-3" style={{ color: '#f5e9c8' }}>{title}</h1>
        <p className="text-xs text-neutral-400 mb-4">{new Date(publishedAt).toLocaleString()} {duration ? `• ${duration}` : ''}</p>
        <div className="rounded-3xl overflow-hidden ring-2 mb-4" style={{ borderColor: '#d4b36c' }}>
          <iframe
            title={title}
            className="w-full aspect-video"
            src={`https://www.youtube.com/embed/${id}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        {summary && <p className="text-neutral-300">{summary}</p>}
      </section>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const id = ctx.params?.id as string
  try {
    const url = new URL('https://www.googleapis.com/youtube/v3/videos')
    url.searchParams.set('part', 'snippet,contentDetails')
    url.searchParams.set('id', id)
    url.searchParams.set('key', API_KEY as string)
    const res = await fetch(url.toString())
    const data = await res.json()
    const item = (data.items || [])[0]
    const snippet = item?.snippet || {}
    const details = item?.contentDetails || {}
    // Choose highest-quality available thumbnail
    const t = snippet?.thumbnails || {}
    const thumb = t.maxres?.url || t.standard?.url || t.high?.url || t.medium?.url || t.default?.url || ''
    return {
      props: {
        id,
        title: snippet.title || 'Video',
        publishedAt: snippet.publishedAt || new Date().toISOString(),
        description: snippet.description || '',
        thumbnail: thumb,
        duration: details.duration || undefined
      }
    }
  } catch {
    return { notFound: true }
  }
}
