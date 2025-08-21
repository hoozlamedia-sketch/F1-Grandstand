import Layout from '../components/Layout'
import type { GetServerSideProps } from 'next'
import Link from 'next/link'
import { fetchAllNews, NewsItem } from '../lib/rss'

type Props = {
  items: NewsItem[]
  page: number
  total: number
  perPage: number
}

export default function NewsPage({ items, page, total, perPage }: Props) {
  const lastPage = Math.ceil(total / perPage)
  return (
    <Layout title="F1 News">
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold mb-6" style={{ color: '#f5e9c8' }}>F1 News</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((n, idx) => (
            <article key={idx} className="p-5 rounded-3xl" style={{ backgroundColor: '#0f0f0f', border: '1px solid #2a2a2a' }}>
              <a href={n.link} target="_blank" className="block">
                <h3 className="font-semibold text-lg leading-snug hover:underline line-clamp-2" style={{ color: '#f5e9c8' }}>{n.title}</h3>
              </a>
              <p className="text-xs text-neutral-400 mt-1">{formatDate(n.isoDate)} • {n.source}</p>
              {n.excerpt && <p className="text-sm text-neutral-300 mt-3">{n.excerpt}…</p>}
              <a className="text-sm inline-block mt-3" style={{ color: '#d4b36c' }} href={n.link} target="_blank" rel="noopener">Read more →</a>
            </article>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3 mt-10">
          {page > 1 && <Link href={`/news?page=${page-1}`} className="px-4 py-2 rounded-xl" style={{ backgroundColor: '#181818', border: '1px solid #2a2a2a' }}>← Prev</Link>}
          <span className="text-neutral-400 text-sm">Page {page} of {lastPage}</span>
          {page < lastPage && <Link href={`/news?page=${page+1}`} className="px-4 py-2 rounded-xl" style={{ backgroundColor: '#181818', border: '1px solid #2a2a2a' }}>Next →</Link>}
        </div>
      </section>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const perPage = 12
  const page = Number(ctx.query.page || 1)
  const all = await fetchAllNews(120)
  const total = all.length
  const start = (page - 1) * perPage
  const items = all.slice(start, start + perPage)
  return { props: { items, page, total, perPage } }
}

function formatDate(d?: string) {
  if (!d) return ''
  try { return new Date(d).toLocaleString() } catch { return '' }
}
