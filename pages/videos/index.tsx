import Layout from "../../components/Layout";
import VideoCard from "../../components/VideoCard";

type V = { id:string; title:string; publishedAt?:string };

export async function getServerSideProps() {
  const key = process.env.NEXT_PUBLIC_YT_API_KEY || "";
  const channelId = "UCh31mRik5zu2JNIC-oUCBjg";
  const maxPages = 3; // ~150 vids (3 x 50) — adjust if needed
  let pageToken = "";
  const vids: V[] = [];

  for (let p = 0; p < maxPages; p++) {
    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.set("part","snippet");
    url.searchParams.set("channelId",channelId);
    url.searchParams.set("order","date");
    url.searchParams.set("maxResults","50");
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    url.searchParams.set("type","video");
    url.searchParams.set("key", key);

    const res = await fetch(url.toString());
    if (!res.ok) break;
    const data = await res.json();
    (data.items||[]).forEach((it:any)=>{
      vids.push({
        id: it.id?.videoId,
        title: it.snippet?.title,
        publishedAt: it.snippet?.publishedAt
      });
    });
    pageToken = data.nextPageToken || "";
    if (!pageToken) break;
  }

  return { props: { videos: vids } };
}

export default function VideosPage({ videos }:{ videos: V[] }) {
  return (
    <Layout title="F1 Videos" description="Watch the latest F1 Grandstand videos: race analysis, driver market moves and tech talk.">
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-6" style={{color:"#f5e9c8"}}>All Videos</h1>
        {(!videos || videos.length===0) && <p className="text-neutral-400">No videos found.</p>}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map(v => <VideoCard key={v.id} id={v.id} title={v.title} publishedAt={v.publishedAt} />)}
        </div>
      </section>
    </Layout>
  );
}
