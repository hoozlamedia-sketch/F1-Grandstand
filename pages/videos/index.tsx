import Layout from "../../components/Layout";
import Head from "next/head";
import Link from "next/link";
import { getUploadsPlaylistId, fetchUploadsPage, encToken, decToken, type YTVideo } from "../../lib/youtube";

const CHANNEL_ID = "UCh31mRik5zu2JNIC-oUCBjg"; // F1 Grandstand

type Props = {
  videos: YTVideo[];
  next?: string | null;
  prev?: string | null;
  usedFallback?: boolean;
  errMsg?: string | null;
};

export default function VideosPage({ videos, next, prev, usedFallback, errMsg }: Props) {
  const pageTitle = "All F1 Grandstand Videos";
  const pageDesc = "Every upload from the F1 Grandstand YouTube channel, organized and paginated.";

  return (
    <Layout title={pageTitle} description={pageDesc}>
      <Head>
        <meta name="robots" content="index,follow" />
      </Head>

      <section className="max-w-6xl mx-auto px-4 py-10">
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-black" style={{color:"#f5e9c8"}}>All Videos</h1>
          <p className="text-neutral-300 mt-2">
            Browse the full archive of F1 Grandstand uploads. Newest first.
          </p>
          {usedFallback && (
            <p className="text-xs mt-2" style={{color:"#d4b36c"}}>
              Showing the latest ~15 via RSS due to YouTube API limits. Your site still won’t render empty.
            </p>
          )}
          {errMsg && (
            <p className="text-xs mt-2 text-red-400">
              {errMsg}
            </p>
          )}
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((v) => (
            <article
              key={v.id}
              className="rounded-3xl overflow-hidden relative"
              style={{ backgroundColor: "#0f0f0f", border: "1px solid #2a2a2a" }}
            >
              <div className="aspect-video relative group">
                <a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener" className="block w-full h-full">
                  {v.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-neutral-500 text-sm">
                      No thumbnail
                    </div>
                  )}
                  {/* Gold play hover */}
                  <span
                    className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition"
                    style={{ background: "rgba(0,0,0,0.15)" }}
                  >
                    <span
                      className="inline-grid place-items-center rounded-full shadow-lg"
                      style={{
                        width: 64, height: 64,
                        background: "linear-gradient(135deg,#d4b36c,#b89350)",
                        color: "#0c0c0c", fontWeight: 900, fontSize: 20
                      }}
                    >
                      ►
                    </span>
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

        {(prev || next) && (
          <nav className="mt-8 flex items-center justify-between">
            {prev ? (
              <Link
                href={`/videos?prev=${encodeURIComponent(prev)}`}
                className="rounded-2xl px-4 py-2"
                style={{ backgroundColor: "#181818", border: "1px solid #2a2a2a" }}
              >
                ← Previous Page
              </Link>
            ) : <span />}

            {next ? (
              <Link
                href={`/videos?next=${encodeURIComponent(next)}`}
                className="rounded-2xl px-4 py-2"
                style={{ backgroundColor: "#181818", border: "1px solid #2a2a2a" }}
              >
                Next Page →
              </Link>
            ) : <span />}
          </nav>
        )}
      </section>
    </Layout>
  );
}

export async function getServerSideProps(ctx: any) {
  const q = ctx.query || {};
  const nextToken = q.next ? String(q.next) : null;
  const prevToken = q.prev ? String(q.prev) : null;

  // Try full API pagination first
  try {
    const uploads = await getUploadsPlaylistId(CHANNEL_ID);
    if (!uploads) throw new Error("Missing uploads playlist or API key.");
    const pageToken = decToken(nextToken || prevToken);
    const page = await fetchUploadsPage(uploads, pageToken || undefined);
    return {
      props: {
        videos: page.videos,
        next: page.nextPageToken ? encToken(page.nextPageToken) : null,
        prev: page.prevPageToken ? encToken(page.prevPageToken) : null,
        usedFallback: false,
        errMsg: null,
      } as Props,
    };
  } catch (e: any) {
    // Fallback: public RSS (~15 latest)
    try {
      const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`);
      const xml = await res.text();

      // Parse without .matchAll or ES2018-only flags
      const entryRe = /<entry>([\s\S]*?)<\/entry>/g;
      const entries: string[] = [];
      let m: RegExpExecArray | null;
      while ((m = entryRe.exec(xml)) !== null) entries.push(m[1]);

      const vids: YTVideo[] = [];
      for (const e of entries) {
        const id = (e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/) || [])[1];
        const title = (e.match(/<title>([^<]+)<\/title>/) || [])[1];
        const publishedAt = (e.match(/<published>([^<]+)<\/published>/) || [])[1];
        const thumb = (e.match(/<media:thumbnail[^>]*url="([^"]+)"/) || [])[1];
        if (id && title) {
          vids.push({
            id, title,
            publishedAt: publishedAt || undefined,
            thumbnail: thumb || undefined,
          });
        }
      }

      return {
        props: {
          videos: vids,
          next: null, prev: null,
          usedFallback: true,
          errMsg: e?.message || null,
        } as Props,
      };
    } catch (err: any) {
      return {
        props: {
          videos: [],
          next: null, prev: null,
          usedFallback: true,
          errMsg: err?.message || e?.message || "Failed to load videos",
        } as Props,
      };
    }
  }
}
