import type { GetServerSideProps } from "next";
import { fetchChannelRSS } from "../lib/youtube";

const CHANNEL_ID = process.env.YT_CHANNEL_ID || "UCh31mRik5zu2JNIC-oUCBjg";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const items = await fetchChannelRSS(String(CHANNEL_ID));
    const xml =
      [
        `<?xml version="1.0" encoding="UTF-8"?>`,
        `<rss version="2.0">`,
        `<channel>`,
        `<title>F1 Grandstand News Videos</title>`,
        `<link>https://www.f1grandstand.com/videos</link>`,
        `<description>Latest Formula 1 news videos from the F1 Grandstand YouTube channel</description>`,
        items
          .slice(0, 30)
          .map(
            (v) => `<item>
  <title><![CDATA[${v.title}]]></title>
  <link>https://www.youtube.com/watch?v=${v.id}</link>
  <guid>https://www.youtube.com/watch?v=${v.id}</guid>
  ${v.publishedAt ? `<pubDate>${new Date(v.publishedAt).toUTCString()}</pubDate>` : ""}
  <description><![CDATA[]]></description>
</item>`
          )
          .join(""),
        `</channel>`,
        `</rss>`
      ].join("");

    res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
    res.write(xml);
    res.end();
  } catch {
    res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
    res.write(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>F1 Grandstand Videos</title></channel></rss>`);
    res.end();
  }
  return { props: {} };
};

export default function VideosXml() {
  // Nothing to render; response was written in getServerSideProps
  return null;
}
