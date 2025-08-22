export async function getServerSideProps({ res, req }: any) {
  const key = process.env.NEXT_PUBLIC_YT_API_KEY || "";
  const channelId = "UCh31mRik5zu2JNIC-oUCBjg";
  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part","snippet");
  url.searchParams.set("channelId",channelId);
  url.searchParams.set("order","date");
  url.searchParams.set("maxResults","50");
  url.searchParams.set("type","video");
  url.searchParams.set("key", key);

  const r = await fetch(url.toString()).then(r=>r.json()).catch(()=>({items:[]}));
  const host = req?.headers?.host || "www.f1grandstand.com";
  const base = `https://${host}`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url><loc>${base}/videos</loc></url>
    ${(r.items||[]).map((it:any)=>`<url><loc>https://www.youtube.com/watch?v=${it.id?.videoId}</loc></url>`).join("")}
  </urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.write(xml);
  res.end();
  return { props: {} };
}
export default function SiteMap() { return null; }
