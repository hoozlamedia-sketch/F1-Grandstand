import Head from "next/head";
import Link from "next/link";

const CHANNEL_ID = "UCh31mRik5zu2JNIC-oUCBjg";

type Video = {
  id: string;
  title: string;
  publishedAt?: string;
  thumbnail?: string;
};

export async function getServerSideProps() {
  // Fetch latest 50 videos from your channel (server-side)
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?key=${process.env.NEXT_PUBLIC_YT_API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=date&maxResults=50&type=video`
  );
  const data = await res.json();
  const items = Array.isArray(data?.items) ? data.items : [];

  const videos: Video[] = items.map((it: any) => ({
    id: it?.id?.videoId,
    title: it?.snippet?.title || "Untitled",
    publishedAt: it?.snippet?.publishedAt || "",
    thumbnail:
      it?.snippet?.thumbnails?.maxres?.url ||
      it?.snippet?.thumbnails?.high?.url ||
      it?.snippet?.thumbnails?.medium?.url ||
      it?.snippet?.thumbnails?.default?.url ||
      "",
  }));

  return { props: { videos } };
}

export default function VideosIndex({ videos }: { videos: Video[] }) {
  return (
    <>
      <Head>
        <title>All F1 Grandstand Videos | F1 Grandstand</title>
        <meta
          name="description"
          content="Watch every F1 Grandstand YouTube video: breaking Formula 1 news, driver market talk, race analysis, and paddock stories."
        />
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold" style={{ color: "#f5e9c8" }}>
            All Videos
          </h1>
          <p className="text-neutral-300 mt-2">
            Latest uploads from{" "}
            <a
              href="https://www.youtube.com/@F1Grandstand"
              target="_blank"
              rel="noreferrer"
              className="underline"
              style={{ color: "#d4b36c" }}
            >
              F1 Grandstand on YouTube
            </a>
            .
          </p>
        </header>

        {videos?.length ? (
          <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((v) => (
              <article
                key={v.id}
                className="rounded-2xl overflow-hidden"
                style={{ backgroundColor: "#0f0f0f", border: "1px solid #2a2a2a" }}
              >
                <Link href={`/videos/${v.id}`} className="block group">
                  <div className="relative aspect-video">
                    {v.thumbnail ? (
                      <img
                        src={v.thumbnail}
                        alt={v.title}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-neutral-500 text-sm">
                        No thumbnail
                      </div>
                    )}

                    {/* Gold play button overlay (minimal opacity glass to avoid dulling) */}
                    <span
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        background: "rgba(0,0,0,0.10)", /* very light */
                        pointerEvents: "none",
                      }}
                    >
                      <span
                        className="grid place-items-center rounded-full shadow-lg"
                        style={{
                          width: "64px",
                          height: "64px",
                          background: "#d4b36c",
                        }}
                      >
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M8 5v14l11-7-11-7z" fill="#0c0c0c" />
                        </svg>
                      </span>
                    </span>
                  </div>
                  <div className="p-4">
                    <h2 className="font-semibold leading-snug line-clamp-2">{v.title}</h2>
                    {v.publishedAt && (
                      <p className="text-xs text-neutral-400 mt-1">
                        {new Date(v.publishedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </Link>
              </article>
            ))}
          </section>
        ) : (
          <p className="text-neutral-400">No videos found.</p>
        )}
      </main>
    </>
  );
}
