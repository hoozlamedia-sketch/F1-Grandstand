import type { GetServerSideProps } from "next";
const CHANNEL_ID = "UCh31mRik5zu2JNIC-oUCBjg";
const API_KEY = process.env.YT_API_KEY || process.env.NEXT_PUBLIC_YT_API_KEY || "";
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  let items: Array<{ id: string; publishedAt?: string }> = [];
  if (API_KEY) {
    try {
      const qs = new URLSearchParams({
        part: "snippet",
        channelId: CHANNEL_ID,
        order: "date",
        maxResults: "50",
        type: "video",
        key: API_KEY,
      });
      const r = await fetch("https://www.googleapis.com/youtube/v3/search?" + qs.toString());
      const j = await r.json();
      items = (j.items || [])
        .filter((x: any) => x?.id?.videoId)
        .map((x: any) => ({ id: x.id.videoId, publishedAt: x.snippet?.publishedAt }));
    } catch {}
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items.map(v=>{
  const loc = `https://www.youtube.com/watch?v=${v.id}`;
  const lastmod = v.publishedAt ? new Date(v.publishedAt).toISOString() : "";
  return `  <url>
    <loc>${loc}</loc>${lastmod?`\n    <lastmod>${lastmod}</lastmod>`:""}
  </url>`;
}).join("\n")}
</urlset>`;
  res.setHeader("Content-Type","application/xml; charset=utf-8");
  res.write(xml); res.end();
  return { props: {} };
};
export default function VideoSitemap(){ return null; }
