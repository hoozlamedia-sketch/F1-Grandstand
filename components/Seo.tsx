// components/Seo.tsx
import Head from "next/head";

type Props = {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
  extraJsonLd?: object | null; // optional JSON-LD to embed
};

export default function Seo({
  title = "F1 Grandstand",
  description = "Daily Formula 1 news and videos.",
  canonical,
  ogImage = "/og-default.jpg",
  noIndex = false,
  extraJsonLd = null
}: Props) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* OpenGraph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      {canonical && <meta property="og:url" content={canonical} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {noIndex && <meta name="robots" content="noindex,follow" />}

      {extraJsonLd && (
        <script
          type="application/ld+json"
          // @ts-ignore
          dangerouslySetInnerHTML={{ __html: JSON.stringify(extraJsonLd) }}
        />
      )}
    </Head>
  );
}
