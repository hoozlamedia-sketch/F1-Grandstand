import Layout from "../../components/Layout";

export default function Sitemaps() {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://f1-grandstand.vercel.app";

  return (
    <Layout
      title="Sitemaps"
      description="F1 Grandstand sitemaps to help search engines discover our F1 News and videos."
    >
      <section className="mx-auto max-w-3xl py-10 space-y-6">
        <h1 className="text-3xl font-extrabold" style={{ color: "#f5e9c8" }}>
          Sitemaps
        </h1>

        <ul className="list-disc pl-6 space-y-2">
          <li>
            <a className="underline" href="/sitemap.xml">Primary XML sitemap</a>
          </li>
          <li>
            <a className="underline" href="/sitemap-pages.xml">Pages sitemap</a>
          </li>
          <li>
            <a className="underline" href="/sitemap-videos.xml">Videos sitemap</a>
          </li>
          <li>
            <a className="underline" href="/sitemap-news.xml">News sitemap</a>
          </li>
          <li>
            <a className="underline" href="/robots.txt">robots.txt</a>
          </li>
        </ul>

        <p className="text-sm text-neutral-400">Base URL: {base}</p>
      </section>
    </Layout>
  );
}
