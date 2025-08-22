import { useRouter } from "next/router";
import Head from "next/head";

export async function getServerSideProps({ params }) {
  const res = await fetch(
    \`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=\${params.id}&key=\${process.env.NEXT_PUBLIC_YT_API_KEY}\`
  );
  const data = await res.json();
  const video = data.items[0];
  return { props: { video } };
}

export default function VideoPage({ video }) {
  const router = useRouter();
  if (!video) return <p className="text-white">Video not found</p>;
  const snippet = video.snippet;

  return (
    <>
      <Head>
        <title>{snippet.title} | F1 Grandstand</title>
        <meta name="description" content={snippet.description} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VideoObject",
              name: snippet.title,
              description: snippet.description,
              uploadDate: snippet.publishedAt,
              thumbnailUrl: snippet.thumbnails.medium.url,
              embedUrl: \`https://www.youtube.com/embed/\${video.id}\`,
              url: \`https://f1-grandstand.vercel.app\${router.asPath}\`,
            }),
          }}
        />
      </Head>
      <main className="max-w-4xl mx-auto p-6 text-white">
        <h1 className="text-3xl font-bold mb-4">{snippet.title}</h1>
        <div className="aspect-w-16 aspect-h-9 mb-4">
          <iframe
            className="w-full h-[400px]"
            src={\`https://www.youtube.com/embed/\${video.id}\`}
            title={snippet.title}
            allowFullScreen
          />
        </div>
        <p className="text-neutral-300">{snippet.description}</p>
      </main>
    </>
  );
}
