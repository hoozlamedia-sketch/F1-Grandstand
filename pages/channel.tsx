import Layout from "../components/Layout";
import Head from "next/head";

export default function Channel() {
  const orgJson = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "F1 Grandstand",
    url: "https://www.f1grandstand.com",
    logo: "https://www.f1grandstand.com/F1-GRANDSTAND-LOGO-NEW.png",
    sameAs: ["https://www.youtube.com/@F1Grandstand"],
  };

  return (
    <Layout
      title="F1 Grandstand YouTube Channel"
      description="Explore the official F1 Grandstand YouTube channel. Daily Formula 1 news videos, analysis, and driver updates."
      canonical="https://www.f1grandstand.com/channel"
    >
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJson) }} />
      </Head>

      <section className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h1 className="text-3xl font-extrabold mb-6" style={{ color: "#f5e9c8" }}>
          F1 Grandstand YouTube Channel
        </h1>
        <p className="mb-6 text-neutral-300">
          Watch our latest F1 news videos, race analysis, and exclusive coverage on{" "}
          <a
            href="https://www.youtube.com/@F1Grandstand"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            style={{ color: "#f5e9c8" }}
          >
            our official YouTube channel
          </a>.
        </p>
        <iframe
          className="mx-auto rounded-xl shadow-lg"
          width="560"
          height="315"
          src="https://www.youtube.com/embed?listType=user_uploads&list=F1Grandstand"
          title="F1 Grandstand YouTube"
          allowFullScreen
        ></iframe>
      </section>
    </Layout>
  );
}
