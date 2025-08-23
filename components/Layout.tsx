import Head from "next/head";
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  title?: string;
  description?: string;
  canonical?: string;
  noIndex?: boolean;
};

export default function Layout({
  children,
  title,
  description,
  canonical,
  noIndex,
}: Props) {
  const site = "F1 Grandstand";
  const fullTitle = title ? `${title} | ${site}` : `${site} — Daily F1 News & Videos`;
  const desc =
    description ??
    "F1 Grandstand brings daily F1 news, live updates, race analysis and videos. Your one-stop F1 News hub.";

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={desc} />
        <meta name="keywords" content="F1 News, Formula 1 news, F1 videos, Formula One, Grand Prix, qualifying, results" />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="website" />
        {canonical && <link rel="canonical" href={canonical} />}
        {noIndex && <meta name="robots" content="noindex,nofollow" />}
      </Head>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-neutral-800 bg-black/80 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            {/* Tries new PNG -> fallback PNG -> fallback SVG */}
            <img
              src="/F1-GRANDSTAND-LOGO-NEW.png"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                img.onerror = null;
                img.src = "/logo.png";
                setTimeout(() => {
                  if (!img.complete || img.naturalWidth === 0) img.src = "/logo.svg";
                }, 50);
              }}
              alt="F1 Grandstand logo"
              width={34}
              height={34}
              className="h-8 w-8 rounded-full ring-1 ring-[#d4b46a]/40"
            />
            <span className="text-sm font-bold tracking-wide text-[#f5e9c8]">F1 Grandstand</span>
          </Link>

          {/* Simple nav (no search in header) */}
          <nav className="flex items-center gap-5 text-sm">
            <Link className="text-neutral-300 hover:text-[#d4b46a] transition" href="/">Home</Link>
            <Link className="text-neutral-300 hover:text-[#d4b46a] transition" href="/#news">News</Link>
            <Link className="text-neutral-300 hover:text-[#d4b46a] transition" href="/videos">Videos</Link>
            <Link className="text-neutral-300 hover:text-[#d4b46a] transition" href="/about">About</Link>
            <Link className="text-neutral-300 hover:text-[#d4b46a] transition" href="/sitemap">Sitemap</Link>
          </nav>
        </div>
      </header>

      <main className="min-h-screen bg-black text-neutral-100">{children}</main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 bg-neutral-950">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-neutral-400">
          © {new Date().getFullYear()} F1 Grandstand — Daily F1 News & Videos
        </div>
      </footer>
    </>
  );
}
