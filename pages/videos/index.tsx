import Link from "next/link";

export async function getServerSideProps() {
  const res = await fetch(
    \`https://www.googleapis.com/youtube/v3/search?key=\${process.env.NEXT_PUBLIC_YT_API_KEY}&channelId=UC8cx2AAlaa1rGhAb0rXNH2Q&part=snippet,id&order=date&maxResults=50\`
  );
  const data = await res.json();
  const videos = data.items.map((v) => ({
    id: v.id.videoId,
    title: v.snippet.title,
    thumbnail: v.snippet.thumbnails.medium.url,
    publishedAt: v.snippet.publishedAt,
    description: v.snippet.description,
  }));
  return { props: { videos } };
}

export default function VideosPage({ videos }) {
  return (
    <main className="max-w-6xl mx-auto p-6 text-white">
      <h1 className="text-4xl font-bold mb-4">Formula 1 Videos</h1>
      <p className="mb-6 text-neutral-300">
        Watch the latest Formula 1 highlights, driver interviews, press
        conferences, and behind-the-scenes content. F1 Grandstand brings you
        exclusive YouTube coverage updated daily for fans who never want to miss
        a lap.
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="relative group">
            <Link href={\`/videos/\${video.id}\`}>
              <img
                src={video.thumbnail}
                alt={video.title}
                className="rounded-lg w-full"
              />
              {/* Transparent overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-30 transition" />
              {/* Gold play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-black"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6 4l12 6-12 6V4z" />
                  </svg>
                </div>
              </div>
            </Link>
            <h2 className="mt-2 font-semibold group-hover:text-yellow-400">
              {video.title}
            </h2>
            <p className="text-sm text-neutral-400">{video.publishedAt}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
