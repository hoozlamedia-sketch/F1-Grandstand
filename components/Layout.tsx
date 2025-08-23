import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";

type LayoutProps = {
  children: ReactNode;
  title?: string;
  description?: string;
};

export default function Layout({ children, title, description }: LayoutProps) {
  const router = useRouter();
  const pageTitle = title ? `${title} | F1 Grandstand` : "F1 Grandstand";
  const pageDesc =
    description ||
    "Daily Formula 1 news, videos, analysis, rumours, and race updates from F1 Grandstand.";
  const gold = "#f5e9c8";

  // show text fallback if logo file not found
  const [logoOk, setLogoOk] = useState(true);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
      </Head>

      <header className="sticky top-0 z-40 border-b border-neutral-900 bg-black/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 min-w-0">
            {logoOk ? (
              <span className="relative block h-6 w-6">
                {/* Put /logo.svg or /logo.png into /public for a real logo */}
                <Image
                  src="/logo.svg"
                  alt="F1 Grandstand"
                  fill
                  onError={() => setLogoOk(false)}
                />
              </span>
            ) : (
              <span
                aria-hidden
                className="inline-block h-6 w-6 rounded-md border border-neutral-700 bg-neutral-900"
              />
            )}
            <span className="font-semibold truncate" style={{ color: gold }}>
              F1 Grandstand
            </span>
          </Link>

          <nav className="ml-4 hidden sm:flex items-center gap-4">
            <Link href="/" className="hover:opacity-80">Home</Link>
            <Link href="/#news" className="hover:opacity-80">News</Link>
            <Link href="/videos" className="hover:opacity-80">Videos</Link>
          </nav>

          <div className="ml-auto w-full max-w-md">
            {/* Internal site search -> /search?q=... */}
            <form role="search" action="/search" method="get" className="relative">
              <input
                type="search"
                name="q"
                defaultValue={typeof router.query.q === "string" ? router.query.q : ""}
                placeholder="Search F1 news & videos..."
                className="w-full rounded-xl bg-neutral-950 border border-neutral-800 px-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#f5e9c8]"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg text-xs border border-[#f5e9c8]/40 hover:bg-[#f5e9c8]/10"
                style={{ color: gold }}
                aria-label="Search"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="min-h-screen bg-black text-white">
        <main>{children}</main>
      </div>
    </>
  );
}
