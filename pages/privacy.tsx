import Layout from '../components/Layout'

export default function Privacy() {
  return (
    <Layout title="Privacy & Cookies">
      <section className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold mb-4" style={{ color: '#f5e9c8' }}>Privacy & Cookies</h1>
        <p className="text-neutral-300 mb-4">We use cookies to improve your browsing experience and to analyze traffic (Google Analytics). By using this site, you agree to our use of cookies.</p>
        <h2 className="text-xl font-bold mt-6 mb-2" style={{ color: '#f5e9c8' }}>What we collect</h2>
        <p className="text-neutral-300 mb-2">Anonymous usage data (page views, device type, referrers) via Google Analytics 4. No personally identifiable information is collected by default.</p>
        <h2 className="text-xl font-bold mt-6 mb-2" style={{ color: '#f5e9c8' }}>Your choices</h2>
        <ul className="list-disc pl-6 text-neutral-300 space-y-2">
          <li>Click “Decline” on the cookie banner to disable analytics.</li>
          <li>Use your browser settings to block cookies.</li>
        </ul>
        <p className="text-neutral-400 mt-6">Contact: info@f1grandstand.com</p>
      </section>
    </Layout>
  )
}
