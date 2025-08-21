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
          F1 Grandstand brings you the latest Formula 1 news, transfer rumours, live reactions,
          and no-nonsense analysis — plus fresh YouTube videos every week. We cover the driver
          market, team politics, technical storylines, and the big weekend talking points.
        </p>
        <p className="text-neutral-300">
          Subscribe on YouTube (<a className="underline" href="https://www.youtube.com/@F1Grandstand" target="_blank" rel="noopener">F1 Grandstand</a>)
          and follow along for daily updates.
        </p>
      </section>
    </Layout>
  )
}
