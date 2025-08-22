import Head from "next/head";
import Link from "next/link";

const YT_KEY = process.env.NEXT_PUBLIC_YT_API_KEY as string;

type Props = {
  id: string;
  title: string;
  description?: string | null;
  publishedAt?: string | null;
  thumbnail?: string | null;
};

export async function getServerSideProps({ params }: { params: any }) {
  const id = params?.id as string;
  let out: Props = { id, title: "Video" };

  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/videos");
    url.searchParams.set("part", "snippet,contentDetails,statistics");
    url.searchParams.set("id", id);
    url.searchParams.set("key", YT_KEY);
    const res = await fetch(url.toString());
    if (res.ok) {
      const data = await res.json();
      const v = data.items?.[0];
      const sn = v?.snippet;
      const thumbs = sn?.thumbnails || {};
      const thumb =
        thumbs.maxres?.url ||
        thumbs.standard?.url ||
        thumbs.high?.url ||
        thumbs.medium?.url ||
        thumbs.default?.url ||
        null;

      out = {
        id,
        title: sn?.title || "Video",
        description: sn?.description || null,
        publishedAt: sn?.publishedAt || null,
        thumbnail: thumb,
      };
    }
  } catch {}

  return { props: out };
}

export default function VideoPage({ id, title, description, publishedAt, thumbnail }: Props) {
  const pageTitle = `${title} | F1 Grandstand`;
  const desc =
    description?.slice(0, 160) ||
    "Watch this F1 Grandstand video for the latest Formula 1 news and analysis.";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={`https://www.f1grandstand.com/videos/${id}`} />
        <meta property="og:type" content="video.other" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={desc} />
        {thumbnail && <meta property="og:image" content={thumbnail} />}
      </Head>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <Link
          href="/videos"
          className="inline-block mb-4 rounded-xl px-4 py-2 text-sm"
          style={{ backgroundColor: "#181818", border: "1px solid #2a2a2a" }}
        >
          ← All Videos
        </Link>

        <div className="aspect-video rounded-3xl overflow-hidden ring-2 shadow-lg mb-4" style={{ borderColor: "#d4b36c" }}>
          <iframe
            title={title}
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${id}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold" style={{ color: "#f5e9c8" }}>
          {title}
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          {publishedAt ? new Date(publishedAt).toLocaleString() : ""}
        </p>
        {description && (
          <pre className="whitespace-pre-wrap text-sm text-neutral-300 mt-4">{description}</pre>
        )}
      </main>
    </>
  );
}
