export async function getServerSideProps({ res }) {
  const baseUrl = "https://f1-grandstand.vercel.app";
  const data = await fetch(
    \`https://www.googleapis.com/youtube/v3/search?key=\${process.env.NEXT_PUBLIC_YT_API_KEY}&channelId=UC8cx2AAlaa1rGhAb0rXNH2Q&part=snippet,id&order=date&maxResults=50\`
  ).then(r => r.json());

  const sitemap = \`<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    \${data.items
      .map(
        (v) => \`<url>
        <loc>\${baseUrl}/videos/\${v.id.videoId}</loc>
        <lastmod>\${new Date(v.snippet.publishedAt).toISOString()}</lastmod>
      </url>\`
      )
      .join("")}
  </urlset>\`;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();
  return { props: {} };
}
export default function VideoSiteMap() { return null; }
