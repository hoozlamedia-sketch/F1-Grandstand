import Layout from "@/components/Layout";
const base = "https://f1grandstand.com";

export default function Sitemaps() {
  return (
    <Layout
      title="Sitemaps"
      description="F1 Grandstand sitemaps to help search engines discover our F1 News and videos."
      canonical={`${base}/sitemaps`}
    >
      <section className="mx-auto max-w-3xl py-10 space-y-6">
        <h1 className="text-3xl font-extrabold" style={{ color: "#f5e9c8" }}>Sitemaps</h1>
        <ul className="list-disc pl-6 space-y-2 text-neutral-300">
          <li><a className="text-[#d4b46a] hover:underline" href="/sitemap.xml">Main sitemap</a></li>
          <li><a className="text-[#d4b46a] hover:underline" href="/news-sitemap.xml">News sitemap</a></li>
          <li><a className="text-[#d4b46a] hover:underline" href="/videos-sitemap.xml">Videos sitemap</a></li>
          <li><a className="text-[#d4b46a] hover:underline" href="/rss.xml">Site RSS</a></li>
        </ul>
      </section>
    </Layout>
  );
}
