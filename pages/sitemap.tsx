import Layout from "../components/Layout";
import Link from "next/link";

export default function Sitemap() {
  return (
    <Layout title="Sitemap" description="Sitemap — F1 Grandstand: F1 News & Videos.">
      <section className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="mb-6 text-3xl font-extrabold text-[#f5e9c8]">Sitemap</h1>
        <ul className="space-y-3 text-neutral-300">
          <li><Link className="hover:text-[#d4b46a]" href="/">Home</Link></li>
          <li><Link className="hover:text-[#d4b46a]" href="/#news">News</Link></li>
          <li><Link className="hover:text-[#d4b46a]" href="/videos">Videos</Link></li>
          <li><Link className="hover:text-[#d4b46a]" href="/about">About</Link></li>
          <li><a className="hover:text-[#d4b46a]" href="/sitemap.xml">sitemap.xml</a></li>
          <li><a className="hover:text-[#d4b46a]" href="/robots.txt">robots.txt</a></li>
        </ul>
      </section>
    </Layout>
  );
}
