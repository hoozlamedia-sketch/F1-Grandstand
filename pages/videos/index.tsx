import Head from "next/head";
import Link from "next/link";
import type { GetServerSideProps } from "next";
import {
  getUploadsPlaylistId,
  fetchUploadsPage,
  getVideoDetails,
  encToken,
  decToken,
  type YTVideo,
} from "../../lib/youtube";

const CHANNEL_ID = "UCh31mRik5zu2JNIC-oUCBjg";

type Props = {
  videos: YTVideo[];
  next: string | null;     // base64url-encoded pageToken
  prev: string | null;     // (not available from API on first page; use null)
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  try {
    const t = typeof ctx.query.t === "string" ? decToken(ctx.query.t) : "";
    const uploads = await getUploadsPlaylistId(CHANNEL_ID);
    const page = await fetchUploadsPage(uploads, t);

    // Convert playlistItems -> list of ids
    const ids: string[] = (page.items || [])
      .map((it: any) => it?.contentDetails?.videoId || it?.snippet?.resourceId?.videoId)
      .filter(Boolean);

    // Fetch full details (title, thumbs, stats, etc.)
    const videos: YTVideo[] = ids.length ? await getVideoDetails(ids) : [];

    return {
      props: {
        videos,
        next: page.nextPageToken ? encToken(page.nextPageToken) : null,
        prev: null, // YouTube API doesn't give a prev token here; keep null
      },
    };
  } catch (e) {
    // Fail safe: render empty page rather than erroring
    return { props: { videos: [], next: null, prev: null } };
  }
};

export default function VideosPage({ videos, next }: Props) {
  return (
    <>
      <Head>
        <title>All Videos | F1 Grandstand</title>
        <meta
          name="description"
          content="Watch every F1 Grandstand YouTube upload: daily Formula 1 news, driver market rumours, analysis, race previews and more."
        />
      </Head>

      <div className="min-h-screen bg-black text-white">
        <header className="max-w-6xl mx-auto px-4 py-10">
          <h1 className="text-3xl md:text-4xl font-black" style={{ color: "#f5e9c8" }}>
            All F1 Grandstand Videos
          </h1>
          <p className="mt-2 text-neutral-300">
            Latest uploads from our YouTube channel — news breakdowns, paddock rumours and race analysis.
          </p>
        </header>

        <main className="max-w-6xl mx-auto px-4 pb-16">
          {!videos.length && (
            <p className="text-neutral-400">No videos found. Check your API key and channel uploads.</p>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((v) => (
              <article
                key={v.id}
                className="rounded-3xl overflow-hidden relative"
                style={{ backgroundColor: "#0f0f0f", border: "1px solid #2a2a2a" }}
              >
                <div className="aspect-video relative">
                  {/* Cleaner thumbnail without dark logo overlay */}
                  <img
                    src={v.thumbnail || `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                    alt={v.title}
                    className="w-full h-full object-cover"
                  />
                  <a
                    href={`https://www.youtube.com/watch?v=${v.id}`}
                    target="_blank"
                    rel="noopener"
                    aria-label={`Play ${v.title}`}
                    className="absolute inset-0 grid place-items-center"
                  >
                    <span
                      className="rounded-full p-4 shadow"
                      style={{ backgroundColor: "rgba(212,179,108,0.9)" }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M8 5v14l11-7L8 5z" fill="#0c0c0c"></path>
                      </svg>
                    </span>
                  </a>
                </div>
                <div className="p-4">
                  <h2 className="font-semibold leading-snug line-clamp-2">{v.title}</h2>
                  {v.publishedAt && (
                    <p className="text-xs text-neutral-400 mt-1">
                      {new Date(v.publishedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-between">
            {/* Prev intentionally disabled (YouTube page API lacks prev token reliably) */}
            <span className="opacity-50 cursor-not-allowed rounded-2xl px-4 py-2" style={{ border: "1px solid #2a2a2a" }}>
              ← Prev
            </span>

            {next ? (
              <Link
                href={`/videos?t=${encodeURIComponent(next)}`}
                className="rounded-2xl px-4 py-2 font-semibold"
                style={{ backgroundColor: "#181818", border: "1px solid #2a2a2a", color: "#d4b36c" }}
              >
                Next →
              </Link>
            ) : (
              <span className="opacity-50 rounded-2xl px-4 py-2" style={{ border: "1px solid #2a2a2a" }}>
                Next →
              </span>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
