import Head from "next/head";

export default function GlobalSearchJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://f1-grandstand.com",
    "name": "F1 Grandstand",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://f1-grandstand.com/search?q={query}",
      "query-input": "required name=query"
    }
  };
  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Head>
  );
}
