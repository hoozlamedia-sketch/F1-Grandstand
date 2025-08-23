import Layout from "../components/Layout";

export default function About() {
  return (
    <Layout
      title="About"
      description="About F1 Grandstand — an independent Formula 1 site focused on fast, accurate F1 News, race coverage and videos."
      canonical="https://f1-grandstand.vercel.app/about"
    >
      <section className="mx-auto max-w-3xl py-10 space-y-6">
        <h1 className="text-3xl font-extrabold" style={{ color: "#f5e9c8" }}>About F1 Grandstand</h1>
        <p className="text-neutral-300">
          F1 Grandstand is built for fans who want{" "}
          <strong>F1 News</strong> that’s fast, accurate and easy to scan. We
          aggregate trusted sources, add short context, and surface the latest
          headlines and videos that matter.
        </p>
        <p className="text-neutral-300">
          You’ll find breaking stories, paddock rumours, team statements, and
          technical analysis, plus a constantly updated stream of official and
          fan-favourite YouTube videos.
        </p>
        <h2 className="text-xl font-bold text-neutral-100">What we cover</h2>
        <ul className="list-disc pl-5 text-neutral-300 space-y-1">
          <li>Live and daily <strong>F1 News</strong></li>
          <li>Grand Prix schedules, results and reactions</li>
          <li>Driver market moves and contract updates</li>
          <li>Car development, regulations and strategy</li>
          <li>Curated Formula 1 video highlights</li>
        </ul>
        <p className="text-neutral-300">
          Want to get in touch or request coverage? Email us via the footer.
        </p>
      </section>
    </Layout>
  );
}
