import Layout from '../components/Layout'
import Link from 'next/link'

export default function About() {
  return (
    <Layout title="About F1 Grandstand" description="Who we are, what we cover, and how to follow F1 Grandstand for daily Formula 1 news and videos.">
      <section className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-3xl font-extrabold" style={{ color: '#f5e9c8' }}>About F1 Grandstand</h1>
        <p className="text-neutral-300">
          F1 Grandstand is a fan-first hub for <strong>Formula 1 news</strong>, race previews, driver market drama and team analysis — paired with regular videos on our YouTube channel.
          We break down the headlines, sift the rumours, and highlight the strategy stories that decide race day.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl" style={{ backgroundColor: '#0f0f0f', border: '1px solid #2a2a2a' }}>
            <h2 className="font-bold mb-2" style={{ color: '#f5e9c8' }}>What we cover</h2>
            <ul className="text-neutral-300 list-disc pl-5 space-y-1">
              <li>Daily F1 news &amp; race-week updates</li>
              <li>Driver transfers &amp; contract talk</li>
              <li>Team politics &amp; technical developments</li>
              <li>Grand Prix previews, reviews &amp; strategy</li>
            </ul>
          </div>
          <div className="p-5 rounded-2xl" style={{ backgroundColor: '#0f0f0f', border: '1px solid #2a2a2a' }}>
            <h2 className="font-bold mb-2" style={{ color: '#f5e9c8' }}>Watch &amp; follow</h2>
            <ul className="text-neutral-300 list-disc pl-5 space-y-1">
              <li>YouTube channel: <a href="https://www.youtube.com/@F1Grandstand" target="_blank" className="underline" style={{ color: '#d4b36c' }}>@F1Grandstand</a></li>
              <li>Latest videos on our <Link href="/videos" className="underline" style={{ color: '#d4b36c' }}>Videos</Link> page</li>
              <li>Fresh headlines on the <Link href="/news" className="underline" style={{ color: '#d4b36c' }}>News</Link> page</li>
            </ul>
          </div>
        </div>

        <div className="p-5 rounded-2xl" style={{ backgroundColor: '#0f0f0f', border: '1px solid #2a2a2a' }}>
          <h2 className="font-bold mb-2" style={{ color: '#f5e9c8' }}>Our approach</h2>
          <p className="text-neutral-300">
            We keep things clear, fast and fair. Sources are credited, hot takes are labelled as opinion, and complex topics are explained without the jargon.
            Whether you’re catching up between sessions or diving deep on a Tuesday, we’ve got you covered.
          </p>
        </div>

        <div className="p-5 rounded-2xl" style={{ backgroundColor: '#0f0f0f', border: '1px solid #2a2a2a' }}>
          <h2 className="font-bold mb-2" style={{ color: '#f5e9c8' }}>Contact</h2>
          <p className="text-neutral-300">
            For tips, corrections or partnerships: <a href="/contact" className="underline" style={{ color: '#d4b36c' }}>Contact us</a> or email <a href="mailto:f1grandstandtv@gmail.com" className="underline" style={{ color: '#d4b36c' }}>f1grandstandtv@gmail.com</a>
          </p>
        </div>
      </section>
    </Layout>
  )
}
