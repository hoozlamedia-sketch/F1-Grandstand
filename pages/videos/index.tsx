import Head from "next/head";
import Link from "next/link";
import { getUploadsPlaylistId, fetchUploadsPage, encToken, decToken, type YTVideo } from "../../lib/youtube";

const CHANNEL_ID = "UCh31mRik5zu2JNIC-oUCBjg"; // F1 Grandstand

type Props = {
  videos: YTVideo[];
  nextToken?: string | null;
  usedFallback?: boolean;
};

function formatDate(d?: string) {
  if (!d) return "";
  try { return new Date(d).toLocaleDateString(); } catch { return ""; }
}

// RSS fallback parser without String.prototype.matchAll (works on older targets)
function parseYouTubeFeed(xml: string): YTVideo[] {
  const videos: YTVideo[] = [];
  const entryRe = /<entry>([\s\S]*?)<\/entry>/g;
  let entryMatch: RegExpExecArray | null;
  while ((entryMatch = entryRe.exec(xml))) {
    const e = entryMatch[1];
    const id = (/<yt:videoId>([^<]+)<\/yt:videoId>/.exec(e) || [])[1];
    const title = (/<title>([^<]+)<\/title>/.exec(e) || [])[1];
    const publishedAt = (/<published>([^<]+)<\/published>/.exec(e) || [])[1];
    // pick best thumb
    let thumb: string | null = null;
    const thumbRe = /<media:thumbnail[^>]*url="([^"]+)"/g;
    let t: RegExpExecArray | null;
    while ((t = thumbRe.exec(e))) {
      thumb = t[1]; // last one usually largest
    }
    if (id && title) {
      videos.push({
        id,
        title,
        publishedAt,
        description: "",
        thumbnail: thumb || null,
      });
    }
  }
  return videos;
}

export async function getServerSideProps(ctx: any) {
  const page = typeof ctx.query.page === "string" ? ctx.query.page : "";
  const pageToken = decToken(page);

  // Try official API first (full pagination)
  try {
    const uploads = await getUploadsPlaylistId(CHANNEL_ID);
    const { items, nextPageToken } = await fetchUploadsPage(uploads, pageToken || undefined, 50);
    return {
      props: {
        videos: items,
        nextToken: nextPageToken ? encToken(nextPageToken) : null,
        usedFallback: false,
      } as Props,
    };
  } catch (_e) {
    // Fallback to RSS (last ~15 videos)
    try {
      const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`);
      const xml = await res.text();
      const items = parseYouTubeFeed(xml);
      return {
        props: { videos: items, nextToken: null, usedFallback: true } as Props,
      };
    } catch {
      return { props: { videos: [], nextToken: null, usedFallback: true } as Props };
    }
  }
}

export default function VideosPage({ videos, nextToken, usedFallback }: Props) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>All F1 Grandstand Videos</title>
        <meta name="description" content="Watch every F1 Grandstand upload: news, analysis and fan talk. Fresh Formula 1 videos organized and updated." />
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold" style={{ color: "#f5e9c8" }}>
            All F1 Grandstand Videos
          </h1>
          {usedFallback && (
            <p className="text-sm text-neutral-400 mt-2">
              Showing latest ~15 via RSS fallback. API quota reached or key restricted.
            </p>
          )}
        </header>

        {videos.length === 0 ? (
          <p className="text-neutral-400">No videos found.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((v) => (
              <article
                key={v.id}
                className="rounded-3xl overflow-hidden"
                style={{ backgroundColor: "#0f0f0f", border: "1px solid #2a2a2a" }}
              >
                <a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener" className="block">
                  <div className="aspect-video relative">
                    {v.thumbnail ? (
                      <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-neutral-400">No thumbnail</div>
                    )}
                  </div>
                </a>
                <div className="p-4">
                  <h2 className="font-semibold leading-snug line-clamp-2">{v.title}</h2>
                  <p className="text-xs text-neutral-400 mt-1">{formatDate(v.publishedAt)}</p>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination: only shows Next when using API (RSS has no paging) */}
        {!usedFallback && (
          <div className="mt-8 flex justify-center">
            {nextToken ? (
              <Link
                href={`/videos?page=${encodeURIComponent(nextToken)}`}
                className="rounded-2xl px-5 py-3"
                style={{ backgroundColor: "#181818", border: "1px solid #2a2a2a" }}
              >
                Next Page →
              </Link>
            ) : (
              <span className="text-neutral-500 text-sm">End of uploads</span>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
