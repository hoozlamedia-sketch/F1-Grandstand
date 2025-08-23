import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";

export type LayoutProps = {
  children: ReactNode;
  title?: string;
  description?: string;
};

const SITE_NAME = "F1 Grandstand";
const BASE_URL = "https://f1-grandstand.vercel.app";

function defaultMeta(pathname: string) {
  switch (pathname) {
    case "/videos":
    case "/videos/":
      return {
        title: "F1 News Videos | Daily Formula 1 Highlights – F1 Grandstand",
        description:
          "Watch the latest F1 News videos from F1 Grandstand – daily race highlights, podcasts, driver analysis and live Formula 1 updates.",
      };
    case "/news":
    case "/news/":
      return {
        title: "F1 News Articles | Formula 1 Breaking News – F1 Grandstand",
        description:
          "Latest F1 News articles – breaking Formula 1 updates, race results, team insights and paddock stories from F1 Grandstand.",
      };
    case "/about":
      return {
        title: "About F1 Grandstand | Daily Live F1 News",
        description:
          "F1 Grandstand delivers daily live F1 News broadcasts, race analysis and Formula 1 coverage across YouTube and the web.",
      };
    case "/sitemaps":
      return {
        title: "F1 News Sitemap | F1 Grandstand",
        description:
          "Sitemap for F1 Grandstand – discover F1 News pages, videos and daily Formula 1 updates.",
      };
    default:
      return {
        title: "F1 News | Daily Formula 1 Updates & Live Broadcasts – F1 Grandstand",
        description:
          "F1 News from F1 Grandstand – daily Formula 1 updates, live shows, breaking news, race analysis and videos.",
      };
  }
}

export default function Layout({ children, title, description }: LayoutProps) {
  const router = useRouter();
  const meta = defaultMeta(router.pathname);
  const pageTitle = title || meta.title;
  const pageDesc = description || meta.description;
  const canonical = `${BASE_URL}${router.asPath.split("?")[0]}`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <link rel="canonical" href={canonical} />
      </Head>

      <header className="border-b border-neutral-800 bg-black/80 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-3" aria-label="F1 Grandstand — Home">
            {/* Use <img> so we can gracefully fallback between png/svg without Next/Image config */}
            <img
              src="/logo.png"
              alt="F1 Grandstand"
              width={40}
              height={40}
              onError={(e: any) => { e.currentTarget.src = "/logo.svg"; }}
              style={{ borderRadius: "8px" }}
            />
            <span className="text-lg font-extrabold tracking-wide" style={{ color: "#f5e9c8" }}>
              F1 Grandstand
            </span>
          </Link>

          <nav className="flex items-center gap-5">
            <Link href="/" className="text-sm text-neutral-200 hover:text-white">Home</Link>
            <Link href="/#news" className="text-sm text-neutral-200 hover:text-white">News</Link>
            <Link href="/videos" className="text-sm text-neutral-200 hover:text-white">Videos</Link>
            <Link href="/about" className="text-sm text-neutral-200 hover:text-white">About</Link>
            <Link href="/sitemaps" className="text-sm text-neutral-200 hover:text-white">Sitemaps</Link>
          </nav>
        </div>
      </header>

      <main className="min-h-screen bg-black text-white">
        {children}
      </main>

      <footer className="border-t border-neutral-800 bg-black/80">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-neutral-400">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. Daily <strong>F1 News</strong> and Formula 1 videos.
          </p>
        </div>
      </footer>
    </>
  );
}
