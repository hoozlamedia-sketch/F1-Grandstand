import Layout from "../../components/Layout";
import Link from "next/link";

export default function Sitemaps() {
  const base = "https://f1-grandstand.vercel.app";
  return (
    <Layout
      title="Sitemaps"
      description="F1 Grandstand sitemaps to help search engines discover our F1 News and videos."
      canonical={`${base}/sitemaps`}
    >
      <section className="mx-auto max-w-3xl py-10 space-y-6">
        <h1 className="text-3xl font-extrabold" style={{ color: "#f5e9c8" }}>Sitemaps</h1>
        <p className="text-neutral-300">
          XML sitemaps for crawlers and a quick index for humans.
        </p>
        <ul className="list-disc pl-6 text-neutral-200 space-y-2">
          <li><a className="text-[#f5e9c8] hover:underline" href="/sitemap.xml">/sitemap.xml</a> (primary)</li>
          <li><a className="text-[#f5e9c8] hover:underline" href="/robots.txt">/robots.txt</a></li>
        </ul>

        <h2 className="text-xl font-bold text-neutral-100">Key Pages</h2>
        <ul className="list-disc pl-6 text-neutral-300 space-y-1">
          <li><Link className="text-[#f5e9c8] hover:underline" href="/">Home</Link></li>
          <li><Link className="text-[#f5e9c8] hover:underline" href="/#news">News</Link></li>
          <li><Link className="text-[#f5e9c8] hover:underline" href="/videos">Videos</Link></li>
          <li><Link className="text-[#f5e9c8] hover:underline" href="/about">About</Link></li>
        </ul>
      </section>
    </Layout>
  );
}
