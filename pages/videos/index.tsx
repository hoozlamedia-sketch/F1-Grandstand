import Head from "next/head";
import Link from "next/link";
import { getUploadsPlaylistId, fetchUploadsPage, encToken, decToken, type YTVideo } from "@/lib/youtube";

// Channel config
const CHANNEL_ID = "UCh31mRik5zu2JNIC-oUCBjg"; // F1 Grandstand
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

type Props = {
  videos: YTVideo[];
  next?: string | null;
  prev?: string | null;
  usingRss?: boolean;
  error?: string | null;
};

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

// Minimal RSS parser fallback (last ~15 videos)
function parseYouTubeFeed(xml: string): YTVideo[] {
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(m => m[1]);
  const vids: YTVideo[] = [];
  for (const e of entries) {
    const id = (e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/) || [])[1];
    const title = (e.match(/<title>([^<]+)<\/title>/) || [])[1];
    const publishedAt = (e.match(/<published>([^<]+)<\/published>/) || [])[1];
    const thumbnail =
      (e.match(/<media:thumbnail[^>]*url="([^"]+)"/) || [])[1] ||
      (e.match(/<media:content[^>]*url="([^"]+)"/) || [])[1] || "";
    if (id && title) vids.push({ id, title, publishedAt, thumbnail });
  }
  return vids;
}

export async function getServerSideProps({ query }: { query: Record<string, string | string[] | undefined> }) {
  const tokenB64 = (Array.isArray(query.t) ? query.t[0] : query.t) || undefined;
  const token = decToken(tokenB64);

  let videos: YTVideo[] = [];
  let next: string | null = null;
  let prev: string | null = null;
  let usingRss = false;
  let error: string | null = null;

  // Prefer secure server-side key (NOT NEXT_PUBLIC)
  const key = process.env.YT_API_KEY;

  if (key) {
    try {
      const uploadsId = await getUploadsPlaylistId(CHANNEL_ID, key);
      const page = await fetchUploadsPage(uploadsId, key, token);
      videos = page.videos;
      next = page.nextPageToken ? encToken(page.nextPageToken) || null : null;
      prev = page.prevPageToken ? encToken(page.prevPageToken) || null : null;
    } catch (e: any) {
      // API failed (403/quota/etc). Fall back to RSS so page still works.
      error = e?.message || "YouTube API error";
    }
  } else {
    error = "Server API key (YT_API_KEY) not set — using RSS fallback.";
  }

  if (videos.length === 0) {
    try {
      const res = await fetch(RSS_URL, { headers: { Accept: "application/atom+xml" } });
      if (res.ok) {
        const xml = await res.text();
        videos = parseYouTubeFeed(xml);
        usingRss = true;
      } else {
        error = `YouTube RSS error ${res.status}`;
      }
    } catch {
      error = "Could not reach YouTube RSS feed.";
    }
  }

  return { props: { videos, next, prev, usingRss, error } as Props };
}

export default function AllVideos({ videos, next, prev, usingRss, error }: Props) {
  const title = "All F1 Grandstand Videos | F1 news, analysis & reaction";
  const desc =
    "Browse every F1 Grandstand upload: driver market moves, race analysis, tech talk and real-talk commentary on Formula 1.";

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
              {usingRss
                ? "Showing recent uploads (RSS fallback). Add a server key to enable full pagination."
                : "Newest first • 50 per page"}
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

        {error && (
          <p className="mb-4 text-sm" style={{ color: "#ff6b6b" }}>
            {error}
          </p>
        )}

        {videos.length === 0 ? (
          <p className="text-neutral-400">No videos found.</p>
        ) : (
          <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((v) => (
              <li
                key={v.id}
                className="group relative rounded-3xl overflow-hidden"
                style={{ border: "1px solid #2a2a2a", backgroundColor: "#0f0f0f" }}
              >
                <Link href={`/videos/${v.id}`} className="block relative">
                  <img
                    src={v.thumbnail || "/thumbnail-fallback.jpg"}
                    alt={v.title}
                    className="w-full h-auto block object-cover"
                    loading="lazy"
                  />
                  {/* Subtle hover overlay only (transparent) */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition"
                    style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.28), rgba(0,0,0,0))" }}
                  />
                  {/* Gold play button on hover */}
                  <span
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    aria-hidden="true"
                  >
                    <span
                      className="grid place-items-center rounded-full shadow-lg"
                      style={{
                        width: 68,
                        height: 68,
                        background:
                          "radial-gradient(circle at 30% 30%, #f7e2a6, #d4b36c 60%, #ae8a45)",
                        boxShadow: "0 6px 18px rgba(212,179,108,.35)",
                      }}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M8 5v14l11-7L8 5z" fill="#0b0b0b" />
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
        {!usingRss && (next || prev) && (
          <nav className="flex items-center justify-center gap-3 mt-8">
            <Link
              href={prev ? `/videos?t=${prev}` : "/videos"}
              className={classNames(
                "rounded-xl px-4 py-2 text-sm font-semibold",
                prev ? "" : "pointer-events-none opacity-40"
              )}
              style={{ backgroundColor: "#181818", border: "1px solid #2a2a2a" }}
              aria-disabled={!prev}
            >
              ← Newer
            </Link>
            <Link
              href={next ? `/videos?t=${next}` : "/videos"}
              className={classNames(
                "rounded-xl px-4 py-2 text-sm font-semibold",
                next ? "" : "pointer-events-none opacity-40"
              )}
              style={{ backgroundColor: "#181818", border: "1px solid #2a2a2a" }}
              aria-disabled={!next}
            >
              Older →
            </Link>
          </nav>
        )}

        {/* If RSS fallback, offer direct link for full archive */}
        {usingRss && (
          <div className="text-center mt-10">
            <a
              href="https://www.youtube.com/@F1Grandstand/videos"
              target="_blank"
              rel="noopener"
              className="inline-block rounded-xl px-4 py-2 text-sm font-semibold"
              style={{ backgroundColor: "#181818", border: "1px solid #2a2a2a", color: "#d4b36c" }}
            >
              See the full archive on YouTube →
            </a>
          </div>
        )}
      </main>
    </>
  );
}
