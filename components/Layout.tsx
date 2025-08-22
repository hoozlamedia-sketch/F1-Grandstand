import { ReactNode, useState } from "react";
import Head from "next/head";
import Link from "next/link";

type LayoutProps = {
  children: ReactNode;
  title?: string;
  description?: string;
};

export default function Layout({ children, title, description }: LayoutProps) {
  const pageTitle = title ? `${title} | F1 Grandstand` : "F1 Grandstand – Daily F1 News & Videos";
  const pageDesc =
    description ||
    "F1 Grandstand brings daily Formula 1 news, driver market updates, race analysis, and new videos.";

  const [q, setQ] = useState("");

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta name="theme-color" content="#d4b36c" />
        <meta property="og:site_name" content="F1 Grandstand" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <link rel="icon" href="/favicon.ico" />
        {/* Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "F1 Grandstand",
              "url": "https://www.f1grandstand.com",
              "logo": "https://www.f1grandstand.com/F1-GRANDSTAND-LOGO-NEW.png",
            }),
          }}
        />
      </Head>

      <header className="sticky top-0 z-50 border-b border-neutral-800 bg-black/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/F1 GRANDSTAND LOGO NEW.png"
              alt="F1 Grandstand"
              className="h-8 w-auto hidden sm:block"
            />
            <span className="text-lg font-extrabold tracking-wide" style={{color:"#f5e9c8"}}>
              F1 Grandstand
            </span>
          </Link>

          <nav className="ml-auto hidden md:flex items-center gap-6">
            <Link href="/" className="hover:text-[#d4b36c]">Home</Link>
            <Link href="/news" className="hover:text-[#d4b36c]">News</Link>
            <Link href="/videos" className="hover:text-[#d4b36c]">Videos</Link>
          </nav>

          <form
            action="/search"
            method="GET"
            className="ml-4 flex-1 max-w-xs hidden sm:flex"
            onSubmit={(e)=>{ if(!q.trim()){ e.preventDefault(); } }}
          >
            <input
              name="q"
              value={q}
              onChange={(e)=>setQ(e.target.value)}
              placeholder="Search F1 news & videos…"
              className="w-full rounded-xl bg-[#111] border border-neutral-800 px-3 py-2 text-sm outline-none focus:border-[#d4b36c]"
            />
          </form>
        </div>
      </header>

      <main className="min-h-[60vh] bg-black text-white">{children}</main>

      <footer className="border-t border-neutral-900 py-8 text-center text-sm text-neutral-400">
        © {new Date().getFullYear()} F1 Grandstand — Daily Formula 1 news & videos.
      </footer>
    </>
  );
}
