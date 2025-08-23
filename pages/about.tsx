import Layout from "@/components/Layout";
import Head from "next/head";

export default function About() {
  const canonical = (process.env.NEXT_PUBLIC_SITE_URL || "https://f1-grandstand.vercel.app") + "/about";

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "F1 Grandstand",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://f1-grandstand.vercel.app",
    sameAs: ["https://www.youtube.com/@F1Grandstand"],
    description:
      "F1 Grandstand delivers daily live F1 news broadcasts, breaking stories, and video analysis for Formula 1 fans.",
    logo: (process.env.NEXT_PUBLIC_SITE_URL || "https://f1-grandstand.vercel.app") + "/f1-grandstand-logo.svg",
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "About F1 Grandstand",
    url: canonical,
    description:
      "Learn about F1 Grandstand — daily live F1 news broadcasts, race-weekend coverage, transfer talk, and in-depth video analysis.",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: (process.env.NEXT_PUBLIC_SITE_URL || "https://f1-grandstand.vercel.app") + "/" },
        { "@type": "ListItem", position: 2, name: "About", item: canonical },
      ],
    },
  };

  return (
    <Layout
      title="About | F1 News, Live Broadcasts & Videos"
      description="About F1 Grandstand: daily live F1 news broadcasts with video analysis, team and driver updates, and race-weekend coverage."
      canonical={canonical}
    >
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
        />
      </Head>

      <section className="mx-auto max-w-3xl px-4 py-10 space-y-6">
        <h1 className="text-3xl font-extrabold" style={{ color: '#f5e9c8' }}>
          About F1 Grandstand — F1 News You Can Trust
        </h1>

        <p className="text-neutral-300">
          <strong>F1 Grandstand</strong> delivers <strong>daily live F1 news broadcasts</strong>, rapid updates,
          and in-depth analysis across the Formula 1 paddock. From Ferrari and Red Bull to Mercedes and McLaren,
          we break the biggest stories and explain what they mean for qualifying, race strategy, and the championship.
        </p>

        <h2 className="text-2xl font-bold text-neutral-100">Our YouTube Channel</h2>
        <p className="text-neutral-300">
          Join the conversation on our official YouTube channel{" "}
          <a href="https://www.youtube.com/@F1Grandstand" target="_blank" rel="noopener" className="underline decoration-amber-300/60 hover:decoration-amber-300">
            @F1Grandstand
          </a>
          . We host live shows, news roundups, and reaction videos every week — optimized for fans who want the latest{" "}
          <strong>F1 News</strong> without the fluff.
        </p>

        <h2 className="text-2xl font-bold text-neutral-100">What We Cover</h2>
        <ul className="list-disc pl-6 text-neutral-300 space-y-2">
          <li><strong>Breaking F1 News</strong> and transfer talk</li>
          <li><strong>Race-weekend previews</strong> and qualifying analysis</li>
          <li><strong>Post-race breakdowns</strong>, driver ratings, and technical insights</li>
          <li><strong>Team and driver updates</strong> from Ferrari, Red Bull, Mercedes, McLaren and more</li>
          <li><strong>Video explainers</strong> on rules, tyres, and strategy calls</li>
        </ul>

        <div className="pt-4">
          <a
            href="https://www.youtube.com/@F1Grandstand"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 rounded-xl border border-amber-300/40 bg-amber-400/10 px-4 py-2 font-semibold text-amber-300 hover:bg-amber-400/20 hover:border-amber-300/70 transition"
          >
            Visit F1 Grandstand on YouTube <span aria-hidden="true">↗</span>
          </a>
        </div>

        <h2 className="text-2xl font-bold text-neutral-100">Why Fans Choose Us for F1 News</h2>
        <p className="text-neutral-300">
          We keep things fast, accurate, and fan-focused. Our goal is simple: be your #1 source for{" "}
          <strong>F1 News</strong> and video analysis — every day, all season.
        </p>
      </section>
    </Layout>
  );
}
