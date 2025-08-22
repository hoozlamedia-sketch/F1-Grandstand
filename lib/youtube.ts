export type YTVideo = {
  id: string;
  title: string;
  publishedAt?: string;
  thumbnail?: string;
};

const YT_KEY = process.env.NEXT_PUBLIC_YT_API_KEY || "";

/** Get the "uploads" playlist id for a channel (needed to page through ALL uploads). */
export async function getUploadsPlaylistId(channelId: string): Promise<string | null> {
  if (!YT_KEY) return null;
  const url = new URL("https://www.googleapis.com/youtube/v3/channels");
  url.searchParams.set("part", "contentDetails");
  url.searchParams.set("id", channelId);
  url.searchParams.set("key", YT_KEY);
  const res = await fetch(url.toString());
  if (!res.ok) return null;
  const data = await res.json();
  const items = data?.items || [];
  return items[0]?.contentDetails?.relatedPlaylists?.uploads || null;
}

/** Fetch one page of uploads from a playlist. */
export async function fetchUploadsPage(playlistId: string, pageToken?: string | null) {
  if (!YT_KEY) throw new Error("Missing NEXT_PUBLIC_YT_API_KEY");
  const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
  url.searchParams.set("part", "snippet,contentDetails");
  url.searchParams.set("playlistId", playlistId);
  url.searchParams.set("maxResults", "50"); // max allowed
  url.searchParams.set("key", YT_KEY);
  if (pageToken) url.searchParams.set("pageToken", pageToken);

  const res = await fetch(url.toString());
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`YouTube API error ${res.status}: ${t.slice(0,200)}`);
  }
  const json = await res.json();
  const vids: YTVideo[] = (json.items || []).map((it: any) => {
    const sn = it.snippet || {};
    const thumbs = sn.thumbnails || {};
    const thumb =
      thumbs.maxres?.url ||
      thumbs.standard?.url ||
      thumbs.high?.url ||
      thumbs.medium?.url ||
      thumbs.default?.url ||
      "";
    return {
      id: it.contentDetails?.videoId || sn.resourceId?.videoId || "",
      title: sn.title || "",
      publishedAt: sn.publishedAt || "",
      thumbnail: thumb || undefined,
    };
  });
  return {
    videos: vids,
    nextPageToken: json.nextPageToken || null,
    prevPageToken: json.prevPageToken || null,
  };
}

/** Encode/Decode tokens for the querystring (base64url). */
export function encToken(t?: string | null) {
  if (!t) return null;
  return Buffer.from(t, "utf8").toString("base64url");
}
export function decToken(t?: string | null) {
  if (!t) return null;
  try { return Buffer.from(t, "base64url").toString("utf8"); } catch { return null; }
}
