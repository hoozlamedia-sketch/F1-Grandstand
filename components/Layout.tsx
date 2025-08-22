import { ReactNode, useMemo } from "react";
import Head from "next/head";

type LayoutProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  image?: string;      // social preview override
  url?: string;        // canonical override
};

export default function Layout({ children, title, description, image, url }: LayoutProps) {
  const siteName = "F1 Grandstand";
  const siteUrl  = "https://www.f1grandstand.com";
  const pageTitle = title ? `${title} | ${siteName}` : siteName;
  const pageDesc =
    description ||
    "F1 Grandstand: Daily Formula 1 news, rumours, driver market moves, race previews, results, and sharp analysis — plus the latest videos.";
  const ogImage = image || "/logo.png";
  const canonical = url || siteUrl;

  const orgJsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteName,
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "sameAs": [
      "https://www.youtube.com/@F1Grandstand",
      "https://twitter.com/F1Grandstand",
      "https://www.facebook.com/F1Grandstand"
    ]
  }), []);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={canonical} />

        {/* Favicon / app icons */}
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />

        {/* OpenGraph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={ogImage} />

        {/* Organization JSON-LD (logo helps Knowledge Panel + brand visibility) */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </Head>

      {/* Page wrapper */}
      <div className="min-h-screen bg-black text-white">
        {children}
      </div>
    </>
  );
}
