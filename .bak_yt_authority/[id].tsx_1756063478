import Head from "next/head";
import Link from "next/link";

export async function getServerSideProps({ params }: { params: { id: string } }) {
  const id = params?.id;
  if (!id) return { notFound: true };
  // Best-effort embed page without API calls (SEO-friendly canonical to YouTube)
  return { props: { id } };
}

export default function VideoPage({ id }: { id: string }) {
  const title = "Watch on F1 Grandstand";
  const desc = "F1 Grandstand video";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={`https://www.youtube.com/watch?v=${id}`} />
      </Head>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <Link
          href="/videos"
          className="inline-block rounded-xl px-4 py-2 text-sm font-semibold mb-4"
          style={{ backgroundColor: "#181818", border: "1px solid #2a2a2a" }}
        >
          ← All Videos
        </Link>

        <div
          className="aspect-video rounded-3xl overflow-hidden ring-2 shadow-lg"
          style={{ borderColor: "#d4b36c" }}
        >
          <iframe
            title="Video player"
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${id}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </main>
    </>
  );
}
