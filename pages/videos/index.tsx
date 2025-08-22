import Head from "next/head";
import Link from "next/link";

const CHANNEL_ID = "UCh31mRik5zu2JNIC-oUCBjg";
const YT_KEY = process.env.NEXT_PUBLIC_YT_API_KEY as string;

type Video = {
  id: string;
  title: string;
  publishedAt?: string;
  thumbnail?: string;
};

type Props = {
  videos: Video[];
  nextPageToken?: string | null;
  prevPageToken?: string | null;
};

export async function getServerSideProps({ query }: { query: any }) {
  const pageToken = typeof query.pageToken === "string" ? query.pageToken : "";
  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("channelId", CHANNEL_ID);
  url.searchParams.set("order", "date");
  url.searchParams.set("type", "video");
  url.searchParams.set("maxResults", "24");
  url.searchParams.set("key", YT_KEY);
  if (pageToken) url.searchParams.set("pageToken", pageToken);

  let videos: Video[] = [];
  let nextPageToken: string | null = null;
  let prevPageToken: string | null = null;

  try {
    const res = await fetch(url.toString());
    if (res.ok) {
      const data = await res.json();
      nextPageToken = data.nextPageToken ?? null;
      prevPageToken = data.prevPageToken ?? null;
      videos =
        (data.items || []).map((it: any) => {
          const sn = it.snippet;
          const thumbs = sn?.thumbnails || {};
          const thumb =
            thumbs.maxres?.url ||
            thumbs.standard?.url ||
            thumbs.high?.url ||
            thumbs.medium?.url ||
            thumbs.default?.url ||
            "";
          return {
            id: it.id.videoId,
            title: sn.title,
            publishedAt: sn.publishedAt,
            thumbnail: thumb,
          } as Video;
        }) || [];
    }
  } catch {
    // fail silently; page will render empty state
  }

  return {
    props: {
      videos,
      nextPageToken,
      prevPageToken,
    } as Props,
  };
}

export default function AllVideos({ videos, nextPageToken, prevPageToken }: Props) {
  const title = "All F1 Grandstand Videos | F1 news, analysis & reaction";
  const desc =
    "Browse every F1 Grandstand video: driver market moves, race previews and debriefs, technical talk and real-talk analysis on Formula 1.";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href="https://www.f1grandstand.com/videos" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <header className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold" style={{ color: "#f5e9c8" }}>
              All Videos
            </h1>
            <p className="text-neutral-400 mt-1">
              Latest uploads from our YouTube channel, newest first.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-xl px-4 py-2 text-sm font-semibold"
            style={{ backgroundColor: "#181818", border: "1px solid #2a2a2a" }}
          >
            ← Back to Home
          </Link>
        </header>

        {videos.length === 0 ? (
          <p className="text-neutral-400">No videos found.</p>
        ) : (
          <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((v) => (
              <li key={v.id} className="group relative rounded-3xl overflow-hidden" style={{ border: "1px solid #2a2a2a", backgroundColor: "#0f0f0f" }}>
                <Link href={`/videos/${v.id}`} className="block relative">
                  {/* Thumbnail */}
                  <img
                    src={v.thumbnail || "/thumbnail-fallback.jpg"}
                    alt={v.title}
                    className="w-full h-auto block object-cover"
                  />

                  {/* Gentle gradient (very light so it doesn't dull thumbnails) */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition"
                    style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.35), rgba(0,0,0,0.0))" }}
                  />

                  {/* Gold play button */}
                  <span
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    aria-hidden="true"
                  >
                    <span
                      className="grid place-items-center rounded-full shadow-lg"
                      style={{
                        width: 68,
                        height: 68,
                        background: "radial-gradient(circle at 30% 30%, #f7e2a6, #d4b36c 60%, #ae8a45)",
                        boxShadow: "0 6px 18px rgba(212,179,108,.35)",
                      }}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M8 5v14l11-7L8 5z" fill="#0b0b0b"/>
                      </svg>
                    </span>
                  </span>
                </Link>
                <div className="p-4">
                  <h2 className="font-semibold leading-snug line-clamp-2">{v.title}</h2>
                  {v.publishedAt && (
                    <p className="text-xs text-neutral-400 mt-1">
                      {new Date(v.publishedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Pagination */}
        <nav className="flex items-center justify-between mt-8">
          <div>
            {prevPageToken && (
              <Link
                href={`/videos?pageToken=${encodeURIComponent(prevPageToken)}`}
                className="rounded-xl px-4 py-2 text-sm"
                style={{ backgroundColor: "#181818", border: "1px solid #2a2a2a" }}
              >
                ← Previous
              </Link>
            )}
          </div>
          <div>
            {nextPageToken && (
              <Link
                href={`/videos?pageToken=${encodeURIComponent(nextPageToken)}`}
                className="rounded-xl px-4 py-2 text-sm"
                style={{ backgroundColor: "#181818", border: "1px solid #2a2a2a" }}
              >
                Next →
              </Link>
            )}
          </div>
        </nav>
      </main>
    </>
  );
}
