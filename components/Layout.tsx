import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

export type LayoutProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  canonical?: string;
};

export default function Layout({ children, title, description, canonical }: LayoutProps) {
  const router = useRouter();
  const isHome = router.pathname === "/";
  const onVideos = router.pathname === "/videos" || router.pathname.startsWith("/videos/page");

  const pageTitle = title ? `${title} | F1 Grandstand — F1 News` : "F1 Grandstand — F1 News";
  const pageDesc =
    description ??
    "F1 Grandstand: fast, accurate F1 News, daily live YouTube broadcasts, headlines and analysis.";
  const computedCanonical = canonical ?? `https://f1grandstand.com${router.asPath.split("?")[0]}`;

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "F1 Grandstand",
    url: "https://f1grandstand.com",
    logo: "https://f1grandstand.com/logo.png",
    sameAs: ["https://www.youtube.com/@F1Grandstand"]
  };

  // image error fallback handler
  const onLogoError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const el = e.currentTarget;
    if (el.src.endsWith("/logo.svg")) return;
    el.src = "/logo.svg";
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={computedCanonical} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:site_name" content="F1 Grandstand" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </Head>

      <header className="sticky top-0 z-40 border-b border-neutral-800/60 bg-black/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-3" aria-label="F1 Grandstand — Home">
            {/* Plain img allows reliable client-side onError fallback */}
            <img
              src="/logo.png"
              onError={onLogoError}
              width={32}
              height={32}
              alt="F1 Grandstand logo"
              style={{ borderRadius: 6 }}
            />
            <span className="text-lg font-extrabold tracking-tight" style={{ color: "#f5e9c8" }}>
              F1 Grandstand
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link className="text-neutral-300 hover:text-[#d4b46a]" href="/">Home</Link>
            <Link className="text-neutral-300 hover:text-[#d4b46a]" href="/#news">News</Link>
            <Link className="text-neutral-300 hover:text-[#d4b46a]" href="/videos">Videos</Link>
            <Link className="text-neutral-300 hover:text-[#d4b46a]" href="/about">About</Link>
            <Link className="text-neutral-300 hover:text-[#d4b46a]" href="/sitemaps">Sitemap</Link>
          </nav>
        </div>

        {/* Videos-only search bar; header search elsewhere removed */}
        {onVideos && (
          <div className="border-t border-neutral-800/60 bg-neutral-950/70">
            <div className="mx-auto max-w-6xl px-4 py-3">
              <form action="/videos" method="GET" className="flex items-center gap-2">
                <input
                  name="q"
                  placeholder="Search F1 videos…"
                  className="h-10 w-full rounded-xl border border-neutral-800 bg-neutral-900/80 px-3 text-sm text-neutral-100 placeholder-neutral-500 outline-none focus:border-[#d4b46a]"
                />
                <button type="submit" className="h-10 rounded-xl bg-[#d4b46a] px-4 text-sm font-semibold text-black transition hover:brightness-110">
                  Search
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Home-only CTA strip */}
        {isHome && (
          <div className="border-t border-neutral-800/60 bg-neutral-950/60">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
              <p className="text-sm text-neutral-300">
                Daily live <strong>F1 News</strong> on YouTube — breaking headlines & analysis.
              </p>
              <a
                href="https://www.youtube.com/@F1Grandstand"
                target="_blank" rel="noopener noreferrer"
                className="rounded-xl bg-[#d4b46a] px-4 py-2 text-sm font-semibold text-black shadow hover:brightness-110"
              >
                Visit Channel
              </a>
            </div>
          </div>
        )}
      </header>

      <main className="min-h-[60vh] bg-black text-neutral-100">
        <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
      </main>

      <footer className="border-t border-neutral-800/60 bg-neutral-950">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-neutral-400">
          © {new Date().getFullYear()} F1 Grandstand — F1 News
        </div>
      </footer>
    </>
  );
}
