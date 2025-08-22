import Head from "next/head";

export async function getServerSideProps({ params }: any) {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${params.id}&key=${process.env.NEXT_PUBLIC_YT_API_KEY}`
  );
  const data = await res.json();
  const video = data.items ? data.items[0] : null;
  return { props: { video } };
}

export default function VideoPage({ video }: any) {
  if (!video) return <div>Video not found.</div>;

  const { snippet } = video;
  return (
    <>
      <Head>
        <title>{snippet?.title} | F1 Grandstand</title>
        <meta name="description" content={snippet?.description?.slice(0, 150) || "F1 video"} />
      </Head>
      <main className="max-w-4xl mx-auto px-4 py-10 text-neutral-200">
        <h1 className="text-3xl font-bold mb-4" style={{ color: "#f5e9c8" }}>
          {snippet?.title}
        </h1>
        <div className="relative w-full aspect-video mb-6">
          <iframe
            className="w-full h-full rounded-2xl"
            src={`https://www.youtube.com/embed/${video.id}`}
            title={snippet?.title}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
        <p className="whitespace-pre-line">{snippet?.description}</p>
      </main>
    </>
  );
}
