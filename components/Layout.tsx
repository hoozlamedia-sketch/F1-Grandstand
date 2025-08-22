import { ReactNode } from "react";
import Head from "next/head";
import Link from "next/link";

type LayoutProps = {
  children: ReactNode;
  title?: string;
  description?: string;
};

export default function Layout({ children, title, description }: LayoutProps) {
  const pageTitle = title ? `${title} | F1 Grandstand` : "F1 Grandstand";
  const pageDesc =
    description ||
    "Daily Formula 1 news, videos, analysis, rumours, and race updates from F1 Grandstand.";

  // Prefer local logo; fall back to hosted if local missing
  const logoSrc = "/F1-GRANDSTAND-LOGO-NEW.png";
  const hostedLogo = "https://www.f1grandstand.com/F1-GRANDSTAND-LOGO-NEW.png";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-neutral-800/80 bg-black/70 backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <img
                src={logoSrc}
                alt="F1 Grandstand"
                className="h-7 w-auto"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = hostedLogo; }}
              />
            </Link>
            <nav className="flex items-center gap-4 sm:gap-6 text-sm">
              <Link href="/#videos" className="hover:underline">Videos</Link>
              <Link href="/#news" className="hover:underline">News</Link>
              <Link href="/about" className="hover:underline">About</Link>
            </nav>
          </div>
        </header>

        {/* Main */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="mt-16 border-t border-neutral-900 text-neutral-400 text-sm">
          <div className="max-w-6xl mx-auto px-4 py-8">
            © {new Date().getFullYear()} F1 Grandstand
          </div>
        </footer>
      </div>
    </>
  );
}
