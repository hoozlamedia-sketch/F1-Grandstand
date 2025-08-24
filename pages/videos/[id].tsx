import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";

type Video = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt?: string;
};

type Props = { video: Video | null; id: string };

export async function getServerSideProps({ params }: { params: { id?: string } }) {
  const id = params?.id;
  if (!id) return { notFound: true };

  const KEY = process.env.YT_API_KEY || "";
  let video: Video | null = null;

  try {
    // Fetch video snippet (title/description/thumbnail)
    const resp = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${encodeURIComponent(id)}&key=${encodeURIComponent(KEY)}`
    );
    if (resp.ok) {
      const data = await resp.json();
      const item = data?.items?.[0]?.snippet;
      if (item) {
        video = {
          id,
          title: item.title || "F1 Grandstand video",
          description: item.description || "Latest Formula 1 news video",
          thumbnail:
            item.thumbnails?.maxres?.url ||
            item.thumbnails?.high?.url ||
            item.thumbnails?.medium?.url ||
            item.thumbnails?.default?.url ||
            "",
          publishedAt: item.publishedAt || null,
        };
      }
    }
  } catch {
    // fall through to minimal page with just the id
  }

  return { props: { video, id } as Props };
}

export default function VideoPage({ video, id }: Props) {
  const v = video || {
    id,
    title: "F1 Grandstand video",
    description: "Latest Formula 1 news video",
    thumbnail: "",
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: v.title,
    description: v.description,
    thumbnailUrl: v.thumbnail ? [v.thumbnail] : [],
    uploadDate: v.publishedAt || undefined,
    embedUrl: `https://www.youtube.com/embed/${v.id}`,
    contentUrl: `https://www.youtube.com/watch?v=${v.id}`,
    publisher: {
      "@type": "Organization",
      name: "F1 Grandstand",
      logo: {
        "@type": "ImageObject",
        url: "https://www.f1grandstand.com/F1-GRANDSTAND-LOGO-NEW.png",
      },
    },
  };

  return (
    <Layout
      title={`${v.title} | F1 Grandstand`}
      description={v.description}
      canonical={`https://www.f1grandstand.com/videos/${v.id}`}
    >
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <Link
          href="/videos"
          className="inline-block rounded-xl px-4 py-2 text-sm font-semibold mb-4"
          style={{ backgroundColor: "#181818", border: "1px solid #2a2a2a" }}
        >
          ← All Videos
        </Link>

        <h1 className="text-2xl font-extrabold mb-4" style={{ color: "#f5e9c8" }}>{v.title}</h1>

        <div className="aspect-video rounded-3xl overflow-hidden ring-2 shadow-lg" style={{ borderColor: "#d4b36c" }}>
          <iframe
            title={v.title}
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${v.id}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {v.description ? (
          <p className="mt-4 text-sm text-neutral-300 whitespace-pre-line">{v.description}</p>
        ) : null}
      </main>
    </Layout>
  );
}
