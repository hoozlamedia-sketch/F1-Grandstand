import Head from 'next/head'
import Link from 'next/link'
import { Youtube } from 'lucide-react'
import SearchBar from './SearchBar'
import GlobalSearch from './GlobalSearch'
import React, { useEffect } from 'react'

export default function Layout({ title, description, children }: { title?: string, description?: string, children: React.ReactNode }) {
useEffect(() => {
  function onKey(e: KeyboardEvent) {
    const target = e.target as HTMLElement | null
    const tag = (target && target.tagName) || ''
    const inInput = tag === 'INPUT' || tag === 'TEXTAREA' || (target && target.isContentEditable)
    if (inInput) return
    if (e.key === '/' || e.key.toLowerCase() == 's') {
      const el = document.querySelector<HTMLInputElement>('#global-search-input, [data-global-search-input]')
      if (el) {
        e.preventDefault()
        el.focus()
        try { el.select() } catch {}
      }
    }
  }
  window.addEventListener('keydown', onKey)
  return () => window.removeEventListener('keydown', onKey)
}, [])

  const metaTitle = title ? `${title} | F1 Grandstand` : 'F1 Grandstand — Formula 1 News & Videos'
  const metaDesc = description || 'Daily Formula 1 news, rumours and analysis — plus fresh videos from the F1 Grandstand YouTube channel.'
  const ogImage = '/f1-grandstand-og-image.png'
  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDesc} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileImage" content="/mstile-150x150.png" />
        <meta name="msapplication-TileColor" content="#0a0a0a" />
      {/* Google Search Console Verification */}
{process.env.NEXT_PUBLIC_GSC_VERIFICATION && (
  <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GSC_VERIFICATION} />
)}

{/* Google Analytics 4 */}
{process.env.NEXT_PUBLIC_GA_ID && (
  <>
    <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}></script>
    <script
      dangerouslySetInnerHTML={{
        __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');`,
      }}
    />
  </>
)}

        {/* Bing Webmaster Tools Verification */}
  {process.env.NEXT_PUBLIC_BING_VERIFICATION && (
    <meta name="msvalidate.01" content={process.env.NEXT_PUBLIC_BING_VERIFICATION} />
  )}

</Head>
      <nav className="sticky top-0 z-40 backdrop-blur border-b border-subtle" style={{ backgroundColor: 'rgba(10,10,10,.7)'}}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <img src="/F1-GRANDSTAND-LOGO-NEW.png" alt="F1 Grandstand logo" className="h-9 w-9 rounded-full ring-1" style={{ borderColor: '#d4b36c' }} />
            <span className="font-black tracking-tight text-xl" style={{ color: '#f5e9c8' }}>F1 Grandstand</span>
          </Link>
          <div className="hidden md:block flex-1"><SearchBar /></div>

          <div className="flex-1 hidden md:block"><GlobalSearch /></div>
          <a href="https://www.youtube.com/@F1Grandstand" target="_blank" className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 transition shadow shrink-0" style={{ backgroundColor: '#e23d3d' }}>
            <Youtube className="w-5 h-5" /> <span className="font-semibold">Subscribe</span>
          </a>
          <div className="flex items-center gap-4">
    <Link href="/news" className="text-sm hover:underline" style={{ color: "#f5e9c8" }}>News</Link>
    <Link href="/videos" className="text-sm hover:underline" style={{ color: "#f5e9c8" }}>Videos</Link>
    <Link href="/about" className="text-sm hover:underline" style={{ color: "#f5e9c8" }}>About</Link>
  </div>
  <div className="flex items-center gap-4">
    <Link href="/news" className="text-sm hover:underline" style={{ color: "#f5e9c8" }}>News</Link>
    <Link href="/videos" className="text-sm hover:underline" style={{ color: "#f5e9c8" }}>Videos</Link>
    <Link href="/about" className="text-sm hover:underline" style={{ color: "#f5e9c8" }}>About</Link>
    <Link href="/contact" className="text-sm hover:underline" style={{ color: "#f5e9c8" }}>Contact</Link>
  </div>
</div>
      </nav>
      <div id="mobile-search-row" className="md:hidden px-4 py-2 border-b border-subtle"><SearchBar /></div>
      <div className="md:hidden px-4 py-3 border-b border-subtle"><GlobalSearch /></div>
      <main>{children}</main>
      <footer className="border-t border-subtle">
        <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8 items-start">
          <div>
            <div className="flex items-center gap-3">
              <img src="/F1-GRANDSTAND-LOGO-NEW.png" className="h-10 w-10 rounded-full ring-1" />
              <h4 className="font-bold text-lg" style={{ color: '#f5e9c8' }}>F1 Grandstand</h4>
            </div>
            <p className="text-neutral-400 text-sm mt-2 max-w-prose">Daily Formula 1 news, rumours, and analysis — with new videos on YouTube. Stay updated on driver market moves, team politics, and race strategy.</p>
            <a href="https://www.youtube.com/@F1Grandstand" target="_blank" className="inline-flex items-center gap-2 mt-3" style={{ color: '#d4b36c' }}>
              <span>Subscribe on YouTube</span>
            </a>
          </div>
          <div>
            <h4 className="font-bold text-lg" style={{ color: '#f5e9c8' }}>Newsletter</h4>
            <p className="text-neutral-400 text-sm mt-2">Get a weekly F1 news roundup and video highlights.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Thanks! We'll be in touch."); }} className="mt-3 flex items-center gap-2">
              <input required type="email" placeholder="you@email.com" className="flex-1 rounded-xl px-3 py-2 outline-none" style={{ backgroundColor: '#111', border: '1px solid #2a2a2a' }} />
              <button className="rounded-xl px-4 py-2 inline-flex items-center gap-2" style={{ backgroundColor: '#e23d3d' }}>Join</button>
            </form>
          </div>
          <div>
            <h4 className="font-bold text-lg" style={{ color: '#f5e9c8' }}>SEO — F1 News Topics</h4>
            <ul className="text-neutral-400 text-sm mt-2 space-y-1">
              <li>Formula 1 news today</li>
              <li>F1 driver market rumours</li>
              <li>Grand Prix strategy analysis</li>
              <li>Team principals & technical updates</li>
              <li>2026 regulations & power units</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs text-neutral-500 py-6">© {new Date().getFullYear()} F1 Grandstand. All rights reserved.</div>
      </footer>
    </>
  )
}
