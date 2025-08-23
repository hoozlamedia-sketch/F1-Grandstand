import EditorialNote from "../components/EditorialNote";import Layout from "../components/Layout"
import EditorialNote from "@/components/EditorialNote";
import type { GetStaticProps } from "next"
import Link from "next/link"
import { fetchAllNews, NewsItem } from "../lib/rss"

type Props = { items: NewsItem[] }

export default function News({ items }: Props) {
  return (
    <Layout title="F1 News" description="Latest Formula 1 news from PlanetF1 and RacingNews365.">
      <section className="mx-auto max-w-6xl px-4 py-12 space-y-6">
        <h1 className="text-3xl font-extrabold" style={{ color: "#f5e9c8" }}>Latest F1 News</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((n, idx) => (
            <article key={idx} className="p-5 rounded-3xl" style={{ backgroundColor: "#0f0f0f", border: "1px solid #2a2a2a" }}>
              <a href={n.link} target="_blank" rel="noopener">
                <h3 className="font-semibold text-lg leading-snug hover:underline" style={{ color: "#f5e9c8" }}>
                  {n.title}
                </h3>
            <EditorialNote kind="article" title={n.title} source={n.source} publishedAt={n.isoDate} />
              </a>
              <p className="text-xs text-neutral-400 mt-1">
                {n.source} • {n.isoDate ? new Date(n.isoDate).toLocaleDateString() : ""}
              </p>
              {n.excerpt && <p className="text-sm text-neutral-300 mt-3">{n.excerpt}…</p>}
            </article>
          ))}
        </div>
      </section>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const items = await fetchAllNews(30)
  return { props: { items }, revalidate: 300 }
}
