import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  canonical?: string;
};

export default function Layout({ children, title, description, canonical }: LayoutProps) {
  const siteName = "F1 Grandstand";
  const pageTitle = title ? `${title} | ${siteName}` : `${siteName} | F1 News, Videos & Analysis`;
  const pageDesc =
    description ||
    "F1 News from F1 Grandstand: daily live Formula 1 updates, analysis, team and driver stories, and videos. Follow the latest from Ferrari, Red Bull, Mercedes, McLaren and more.";

  const canonicalUrl = canonical || process.env.NEXT_PUBLIC_SITE_URL || "https://f1-grandstand.vercel.app";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:site_name" content={siteName} />
        <meta name="theme-color" content="#0b0b0b" />
      </Head>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-neutral-800/70 bg-black/75 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/f1-grandstand-logo.svg"
              alt="F1 Grandstand logo"
              width={176}
              height={28}
              priority
              className="h-7 w-auto"
            />
            <span className="sr-only">F1 Grandstand</span>
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-xl px-3 py-2 text-sm font-semibold text-neutral-200 hover:text-white hover:bg-neutral-800/60 transition"
            >
              Home
            </Link>
            <Link
              href="/videos"
              className="rounded-xl px-3 py-2 text-sm font-semibold text-neutral-200 hover:text-white hover:bg-neutral-800/60 transition"
            >
              Videos
            </Link>
            <Link
              href="/about"
              className="rounded-xl px-3 py-2 text-sm font-semibold text-neutral-200 hover:text-white hover:bg-neutral-800/60 transition"
            >
              About
            </Link>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="min-h-screen bg-black text-neutral-100">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800/70 bg-black">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-neutral-400">
          © {new Date().getFullYear()} {siteName}. Daily F1 News & Videos.
        </div>
      </footer>
    </>
  );
}
