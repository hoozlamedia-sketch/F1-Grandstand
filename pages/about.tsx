import Layout from "../components/Layout";

export default function About() {
  return (
    <Layout
      title="About F1 Grandstand"
      description="Who we are, what we cover, and how to follow F1 Grandstand for daily Formula 1 news and videos."
    >
      <section className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-3xl font-extrabold" style={{ color: "#f5e9c8" }}>
          About F1 Grandstand
        </h1>
        <p className="text-neutral-300">
          F1 Grandstand is your daily source for Formula 1 news, race analysis, transfer rumours and live reaction. 
          Subscribe on YouTube for the latest videos and join our community for real talk on the world of F1.
        </p>
      </section>
    </Layout>
  );
}
