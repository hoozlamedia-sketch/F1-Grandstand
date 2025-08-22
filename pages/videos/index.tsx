import Head from "next/head"
import Link from "next/link"

export default function VideosIndex() {
  return (
    <>
      <Head>
        <title>F1 Grandstand Videos | Latest Formula 1 Uploads</title>
        <meta
          name="description"
          content="Watch every F1 Grandstand YouTube upload. Browse the full archive, paginate through all videos, or search by driver, team, or race."
        />
      </Head>
      <div className="min-h-screen bg-black text-white">
        <header className="border-b border-neutral-800 sticky top-0 bg-black/80 backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#f5e9c8]">F1 Grandstand – Videos</h1>
            <Link
              href="/videos/page/1"
              className="px-4 py-2 rounded-lg border border-[#f5e9c8]/30 hover:bg-[#f5e9c8]/10"
            >
              Browse All
            </Link>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-10">
          <p className="text-neutral-300">
            Head to page 1 to browse every upload, with pagination and search.
          </p>
          <div className="mt-6">
            <Link
              href="/videos/page/1"
              className="inline-block px-5 py-3 rounded-xl bg-[#f5e9c8] text-black font-semibold hover:opacity-90"
            >
              Go to Videos
            </Link>
          </div>
        </main>
      </div>
    </>
  )
}
