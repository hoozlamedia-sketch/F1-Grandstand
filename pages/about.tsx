import Layout from '../components/Layout'

export default function About() {
  return (
    <Layout
      title="About F1 Grandstand"
      description="Who we are, what we cover, and how to follow F1 Grandstand for daily Formula 1 news and videos."
    >
      <section className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-3xl font-extrabold" style={{ color: '#f5e9c8' }}>
          About F1 Grandstand
        </h1>
        <p className="text-neutral-300">
          F1 Grandstand brings you daily Formula 1 news, transfer rumors, and sharp video analysis.
          Follow along for everything from race strategy breakdowns to paddock gossip.
        </p>
        <p className="text-neutral-300">
          Subscribe on YouTube and check the site for the latest F1 headlines from trusted sources.
        </p>
      </section>
    </Layout>
  )
}
