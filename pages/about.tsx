export default function About() {
  return (
    <section className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <h1 className="text-3xl font-extrabold" style={{ color: "#f5e9c8" }}>About F1 Grandstand</h1>

      <p className="text-neutral-300">
        F1 Grandstand exists to be the fastest, clearest source of <strong>F1 News</strong>.
        We publish breaking headlines, context and technical insight — plus daily live video news
        shows so fans never miss a story.
      </p>

      <h2 className="text-xl font-bold text-[#f5e9c8]">Daily Live F1 News on YouTube</h2>
      <p className="text-neutral-300">
        On our YouTube channel <strong>@F1Grandstand</strong> we run daily live news broadcasts,
        paddock reaction, qualifying and Grand Prix debriefs, and short explainers that cut through
        the noise.
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
        <li>Breaking <strong>F1 News</strong>, team statements and driver quotes</li>
        <li>Practice, qualifying and race analysis with strategy context</li>
        <li>Tech updates, penalties and FIA rulings explained</li>
        <li>Long-form features, opinion and video explainers</li>
      </ul>
    </section>
  );
}
