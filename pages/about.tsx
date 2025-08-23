import Layout from "../components/Layout";
import Link from "next/link";

export default function About() {
  return (
    <Layout
      title="About F1 Grandstand — Daily F1 News"
      description="About F1 Grandstand: daily F1 News, live broadcasts, race analysis and videos. Follow our YouTube channel for breaking Formula 1 updates."
      canonical="/about"
    >
      <section className="mx-auto max-w-3xl space-y-6 px-4 py-10">
        <h1 className="text-3xl font-extrabold" style={{ color: "#f5e9c8" }}>About F1 Grandstand</h1>

        <p className="text-neutral-300">
          F1 Grandstand is built to rank #1 for <strong>F1 News</strong> by delivering fast, accurate
          updates and video coverage every day. We track breaking stories, team statements, driver quotes
          and race-weekend insights across the paddock.
        </p>

        <h2 className="text-xl font-bold text-[#f5e9c8]">Daily Live F1 News on YouTube</h2>
        <p className="text-neutral-300">
          Join our YouTube channel <strong>@F1Grandstand</strong> for daily live news broadcasts, rapid
          reaction to qualifying and the Grand Prix, and short explainers that clarify the biggest topics
          in Formula 1.
        </p>

        <div>
          <a
            href="https://www.youtube.com/@F1Grandstand"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#d4b46a] px-4 py-2 font-semibold text-black transition hover:brightness-110 focus:outline-none"
          >
            Visit Channel
          </a>
        </div>

        <h2 className="text-xl font-bold text-[#f5e9c8]">What we cover</h2>
        <ul className="list-inside list-disc space-y-2 text-neutral-300">
          <li>Breaking <strong>F1 News</strong> and team updates</li>
          <li>Driver market, penalties, and sporting rulings</li>
          <li>Practice, qualifying and race analysis</li>
          <li>Technical changes, upgrades and strategy</li>
          <li>Long-form features and reaction videos</li>
        </ul>
      </section>
    </Layout>
  );
}
