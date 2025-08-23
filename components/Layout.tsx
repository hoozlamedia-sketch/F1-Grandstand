import { ReactNode } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

type LayoutProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  canonical?: string;
};

export default function Layout({ children, title, description, canonical }: LayoutProps) {
  const siteName = "F1 Grandstand";
  const pageTitle = title ? `${title} | ${siteName}` : `${siteName} – F1 News, Results & Video`;
  const pageDesc =
    description ||
    "F1 Grandstand: fast, authoritative F1 News — race results, driver updates, team rumours, and videos.";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        {canonical && <link rel="canonical" href={canonical} />}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:type" content="website" />
        <meta name="theme-color" content="#d4b26f" />
      </Head>

      <header className="sticky top-0 z-50 border-b border-neutral-800/60 bg-black/70 backdrop-blur supports-[backdrop-filter]:bg-black/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
          <Link href="/" className="group inline-flex items-center gap-3" aria-label="Go to F1 Grandstand home">
            <span className="relative block h-7 w-7 overflow-hidden rounded-md ring-1 ring-neutral-700/60 bg-black">
              <Image
                src="/logo.svg"
                alt="F1 Grandstand logo"
                fill
                className="object-contain"
                sizes="28px"
                priority
              />
            </span>
            <span className="text-lg font-semibold tracking-wide text-[#f5e9c8] group-hover:opacity-90">
              F1 Grandstand
            </span>
          </Link>

          <nav aria-label="Primary">
            <ul className="flex items-center gap-6 text-sm font-medium">
              <li><Link className="text-neutral-200 hover:text-[#f5e9c8] transition-colors" href="/">Home</Link></li>
              <li><Link className="text-neutral-200 hover:text-[#f5e9c8] transition-colors" href="/#news">News</Link></li>
              <li><Link className="text-neutral-200 hover:text-[#f5e9c8] transition-colors" href="/videos">Videos</Link></li>
              <li><Link className="text-neutral-200 hover:text-[#f5e9c8] transition-colors" href="/about">About</Link></li>
              <li><Link className="text-neutral-200 hover:text-[#f5e9c8] transition-colors" href="/sitemaps">Sitemaps</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="min-h-screen bg-black text-white">
        <main className="mx-auto max-w-6xl px-4">{children}</main>
      </div>

      <footer className="border-t border-neutral-800/60 bg-black">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-neutral-400">
          © {new Date().getFullYear()} F1 Grandstand — Daily Formula 1 news & videos.
        </div>
      </footer>
    </>
  );
}
