import Layout from "../components/Layout"
import Link from "next/link"
import type { GetStaticProps } from "next"
import { fetchAllNews, NewsItem } from "../lib/rss"

type Props = { items: NewsItem[] }

export default function News({ items }: Props) {
  return (
    <Layout title="F1 News" description="Latest Formula 1 news from PlanetF1 and RacingNews365.">
      <section className="mx-auto max-w-6xl px-4 py-12 space-y-6">
        <h1 className="text-3xl font-extrabold" style={{ color: "#f5e9c8" }}>Latest F1 News</h1>
        {items.length === 0 && (
          <p className="text-neutral-400">No news could be fetched right now. Please try again shortly.</p>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((n, idx) => (
            <article key={idx} className="p-5 rounded-3xl" style={{ backgroundColor: "#0f0f0f", border: "1px solid #2a2a2a" }}>
              <a href={n.link} target="_blank" rel="noopener" className="block">
                <h3 className="font-semibold text-lg leading-snug hover:underline line-clamp-2" style={{ color: "#f5e9c8" }}>
                  {n.title}
                </h3>
              </a>
              <p className="text-xs text-neutral-400 mt-1">
                {formatDate(n.isoDate)} • {n.source}
              </p>
              {n.excerpt && <p className="text-sm text-neutral-300 mt-3">{n.excerpt}…</p>}
              <a className="text-sm inline-block mt-3" style={{ color: "#d4b36c" }} href={n.link} target="_blank" rel="noopener">
                Read more →
              </a>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    // Your lib/rss.ts should already be restricted to PlanetF1 + RacingNews365
    const items = await fetchAllNews(60)
    return { props: { items }, revalidate: 300 }
  } catch {
    return { props: { items: [] }, revalidate: 300 }
  }
}

function formatDate(d?: string) {
  if (!d) return ""
  try { return new Date(d).toLocaleString() } catch { return "" }
}
