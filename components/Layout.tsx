import Head from 'next/head'
import Link from 'next/link'
import React, { ReactNode } from 'react'
import { Youtube } from 'lucide-react'
import GlobalSearch from './GlobalSearch'

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
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <img src="/F1-GRANDSTAND-LOGO-NEW.png" alt="F1 Grandstand" className="h-8 w-auto" />
          </Link>

          <nav className="ml-4 hidden md:flex items-center gap-4 text-sm">
            <Link href="/news" className="hover:underline">News</Link>
            <Link href="/videos" className="hover:underline">Videos</Link>
            <Link href="/about" className="hover:underline">About</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </nav>

          <div className="ml-auto w-full md:w-[360px]">
            <GlobalSearch />
          </div>

          <a
            href="https://www.youtube.com/@F1Grandstand"
            target="_blank" rel="noopener"
            className="hidden md:inline-flex items-center gap-2 text-sm ml-3 px-3 py-2 rounded-xl border border-neutral-800 hover:bg-neutral-900"
            aria-label="Visit YouTube Channel"
          >
            <Youtube className="w-4 h-4" /> YouTube
          </a>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-neutral-800 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-neutral-400">
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <p>© F1 Grandstand</p>
            <nav className="flex items-center gap-4">
              <Link href="/privacy" className="hover:underline">Privacy</Link>
              <a href="/sitemap.xml" className="hover:underline">Sitemap</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
