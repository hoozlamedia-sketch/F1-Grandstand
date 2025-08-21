import { ReactNode } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Search, Newspaper, PlayCircle, Info, Home as HomeIcon } from 'lucide-react'

type LayoutProps = {
  children: ReactNode
  title?: string
  description?: string
}

export default function Layout({ children, title, description }: LayoutProps) {
  const pageTitle = title ? `${title} | F1 Grandstand` : 'F1 Grandstand'
  const pageDesc =
    description ||
    'Daily Formula 1 news, videos, analysis, rumours, and race updates from F1 Grandstand.'

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
      </Head>

      <header className="sticky top-0 z-40 border-b border-neutral-800 bg-black/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/" className="font-extrabold tracking-tight" style={{ color: '#f5e9c8' }}>
            F1 Grandstand
          </Link>

          {/* Main menu */}
          <div className="flex items-center gap-5 text-sm">
            <Link href="/" className="inline-flex items-center gap-1 hover:underline">
              <HomeIcon className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link href="/#news" className="inline-flex items-center gap-1 hover:underline">
              <Newspaper className="h-4 w-4" />
              <span>News</span>
            </Link>
            <Link href="/#videos" className="inline-flex items-center gap-1 hover:underline">
              <PlayCircle className="h-4 w-4" />
              <span>Videos</span>
            </Link>
            <Link href="/about" className="inline-flex items-center gap-1 hover:underline">
              <Info className="h-4 w-4" />
              <span>About</span>
            </Link>

            {/* Search icon (simple link target for now) */}
            <Link href="/#news" className="ml-2 inline-flex items-center hover:opacity-80" aria-label="Search">
              <Search className="h-5 w-5" />
            </Link>
          </div>
        </nav>
      </header>

      <main className="min-h-screen bg-black text-white">{children}</main>

      <footer className="border-t border-neutral-800 bg-black/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 text-sm text-neutral-400">
          <span>© {new Date().getFullYear()} F1 Grandstand</span>
          <div className="flex gap-4">
            <Link href="/sitemap.xml" className="hover:underline">Sitemap</Link>
            <Link href="/news-sitemap.xml" className="hover:underline">News Sitemap</Link>
            <Link href="/sitemaps/videos.xml" className="hover:underline">Video Sitemap</Link>
          </div>
        </div>
      </footer>
    </>
  )
}
