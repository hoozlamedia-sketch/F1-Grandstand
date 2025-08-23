import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
  title?: string;
  description?: string;
};

export default function Layout({
  children,
  title,
  description,
}: LayoutProps) {
  const router = useRouter();
  const isHome = router.pathname === "/";
  const onVideos =
    router.pathname === "/videos" ||
    router.pathname.startsWith("/videos/page");

  const pageTitle = title
    ? `${title} | F1 Grandstand — F1 News`
    : "F1 Grandstand — F1 News";
  const pageDesc =
    description ??
    "F1 Grandstand delivers fast, accurate Formula 1 news, daily live updates and analysis. Watch our @F1Grandstand YouTube broadcasts and read the latest F1 headlines.";

  const canon = `https://f1grandstand.com${router.asPath.split("?")[0]}`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={canon} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="F1 Grandstand" />
        <meta property="twitter:card" content="summary_large_image" />
        {/* JSON-LD: WebSite with SearchAction (targets Videos search) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "F1 Grandstand",
              url: "https://f1grandstand.com",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://f1grandstand.com/videos?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </Head>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-neutral-800/60 bg-black/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            {/* If you add /public/logo.png later, just change to /logo.png. */}
            <Image
              src="/logo.svg"
              alt="F1 Grandstand — F1 News"
              width={32}
              height={32}
              priority
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
            <Link className="text-neutral-300 hover:text-[#d4b46a]" href="/sitemap">Sitemap</Link>
          </nav>

          {/* No header search by request */}
        </div>

        {/* Videos-only search bar under the header */}
        {onVideos && (
          <div className="border-t border-neutral-800/60 bg-neutral-950/70">
            <div className="mx-auto max-w-6xl px-4 py-3">
              <form action="/videos" method="GET" className="flex items-center gap-2">
                <input
                  name="q"
                  defaultValue={(typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("q") ?? "" : "")}
                  placeholder="Search F1 videos…"
                  className="h-10 w-full rounded-xl border border-neutral-800 bg-neutral-900/80 px-3 text-sm text-neutral-100 placeholder-neutral-500 outline-none focus:border-[#d4b46a]"
                />
                <button
                  type="submit"
                  className="h-10 rounded-xl bg-[#d4b46a] px-4 text-sm font-semibold text-black transition hover:brightness-110"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Home-only hero CTA row */}
        {isHome && (
          <div className="border-t border-neutral-800/60 bg-neutral-950/60">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
              <p className="text-sm text-neutral-300">
                Daily live <strong>F1 News</strong> on YouTube — analysis, reaction & headlines.
              </p>
              <a
                href="https://www.youtube.com/@F1Grandstand"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#d4b46a] px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110"
              >
                Visit Channel
              </a>
            </div>
          </div>
        )}
      </header>

      <div className="min-h-screen bg-black text-white">
        <main>{children}</main>
        <footer className="border-t border-neutral-800/60 bg-neutral-950/60">
          <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-neutral-400">
            © {new Date().getFullYear()} F1 Grandstand — Fast, accurate <strong>F1 News</strong>.
          </div>
        </footer>
      </div>
    </>
  );
}
