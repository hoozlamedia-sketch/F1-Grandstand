// components/OrgJsonLd.tsx
import Head from "next/head";

export default function OrgJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "F1 Grandstand",
    "url": "https://www.f1grandstand.com",
    "logo": "https://www.f1grandstand.com/F1-GRANDSTAND-LOGO-NEW.png",
    "sameAs": [
      "https://www.youtube.com/@F1Grandstand"
    ]
  };
  return (
    <Head>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </Head>
  );
}
