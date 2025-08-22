import React, { ReactNode } from "react";
import Head from "next/head";
import Link from "next/link";
import { Search } from "lucide-react";type LayoutProps = {
  children: ReactNode;
  title?: string;
  description?: string;
};function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm font-semibold hover:underline underline-offset-4"
      style={{ color: "#f5e9c8" }}
    >
      {children}
    </Link>
  );
}export default function Layout({ children, title, description }: LayoutProps) {
  const pageTitle = title ? `${title} | F1 Grandstand` : "F1 Grandstand";
  const pageDesc =
    description ||
    "Daily Formula 1 news, driver market rumours, race analysis, and videos — F1 Grandstand.";  const siteUrl = "https://www.f1grandstand.com";  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta name="robots" content="index,follow" />
        <meta name="theme-color" content="#0c0c0c" />
        <meta property="og:site_name" content="F1 Grandstand" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta
          property="og:image"
          content={`${siteUrl}/F1-GRANDSTAND-LOGO-NEW.png`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta
          name="twitter:image"
          content={`${siteUrl}/F1-GRANDSTAND-LOGO-NEW.png`}
        />
      </Head>      {/* Header / Navigation */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          {/* Logo + Title (title shows even if image missing) */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/F1-GRANDSTAND-LOGO-NEW.png"
              alt="F1 Grandstand"
              className="h-8 w-auto hidden sm:block"
            />
            <span
              className="font-black tracking-tight text-lg"
              style={{ color: "#f5e9c8" }}
            >
              F1 <span style={{ color: "#d4b36c" }}>Grandstand</span>
            </span>
          </Link>          {/* Primary nav */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink href="/news">News</NavLink>
            <NavLink href="/videos">Videos</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/sitemap.xml">Sitemap</NavLink>
          </nav>          {/* Site-restricted Search (Google) */}
          <form
            className="hidden md:flex items-center gap-2"
            role="search"
            action="https://www.google.com/search"
            method="GET"
          >
            <input type="hidden" name="sitesearch" value="f1grandstand.com" />
            <input
              name="q"
              placeholder="Search F1 news…"
              className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-sm outline-none focus:border-[#d4b36c]"
              aria-label="Search F1 Grandstand"
            />
            <button
              type="submit"
              className="rounded-xl px-3 py-1.5 text-sm font-semibold inline-flex items-center gap-1"
              style={{ backgroundColor: "#d4b36c", color: "#0c0c0c" }}
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </form>
        </div>
      </header>      {/* Main */}
      <main className="min-h-screen bg-black text-white">{children}</main>      {/* Footer */}
      <footer className="border-t border-neutral-800 bg-black">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-neutral-400 flex flex-wrap items-center justify-between gap-3">
          <p>
            © {new Date().getFullYear()} F1 Grandstand — Formula 1 news & videos.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:underline">
              About
            </Link>
            <a
              href="https://www.youtube.com/@F1Grandstand"
              target="_blank"
              rel="noopener"
              className="hover:underline"
            >
              YouTube
            </a>
            <Link href="/sitemap.xml" className="hover:underline">
              Sitemap
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}