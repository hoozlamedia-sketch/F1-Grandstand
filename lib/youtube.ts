/**
 * YouTube helpers used by /videos and /videos/page/[page]
 * Works with API key when available; can be combined with RSS fallbacks elsewhere.
 */

export type YTVideo = {
  id: string;
  title: string;
  description?: string;
  publishedAt?: string;
  thumbnail?: string;
  live?: boolean;
  duration?: string;
  views?: number;
};

const YT_API_KEY = process.env.NEXT_PUBLIC_YT_API_KEY || "";

/** Resolve a channel's uploads playlist id (UUxxxxxxxx...) */
export async function getUploadsPlaylistId(channelId: string, apiKey = YT_API_KEY): Promise<string> {
  if (!apiKey) throw new Error("Missing YouTube API key");
  const url = new URL("https://www.googleapis.com/youtube/v3/channels");
  url.searchParams.set("part", "contentDetails");
  url.searchParams.set("id", channelId);
  url.searchParams.set("key", apiKey);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`channels failed: ${res.status}`);
  const data = await res.json();
  const pl = data?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!pl) throw new Error("uploads playlist not found");
  return pl as string;
}

/** Fetch one page from a playlistItems list */
export async function fetchUploadsPage(playlistId: string, pageToken = "", apiKey = YT_API_KEY) {
  if (!apiKey) throw new Error("Missing YouTube API key");
  const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
  url.searchParams.set("part", "snippet,contentDetails");
  url.searchParams.set("playlistId", playlistId);
  url.searchParams.set("maxResults", "50");
  if (pageToken) url.searchParams.set("pageToken", pageToken);
  url.searchParams.set("key", apiKey);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`playlistItems failed: ${res.status}`);
  return res.json() as Promise<{ items: any[]; nextPageToken?: string }>;
}

/**
 * NEW: collect *all* upload video IDs for a channel (paginated).
 * Limits to 1000 to avoid abuse/quotas; adjust if needed.
 */
export async function getAllUploadVideoIds(
  channelId: string,
  apiKey = YT_API_KEY,
  hardLimit = 1000
): Promise<string[]> {
  const uploads = await getUploadsPlaylistId(channelId, apiKey);
  const ids: string[] = [];
  let token = "";
  do {
    const page = await fetchUploadsPage(uploads, token, apiKey);
    for (const it of page.items || []) {
      const vid = it?.contentDetails?.videoId || it?.snippet?.resourceId?.videoId;
      if (vid) ids.push(vid);
      if (ids.length >= hardLimit) break;
    }
    token = page.nextPageToken || "";
  } while (token && ids.length < hardLimit);
  return ids;
}

/** Batch fetch details for up to 50 ids per call */
export async function getVideoDetails(ids: string[], apiKey = YT_API_KEY): Promise<YTVideo[]> {
  if (!apiKey) throw new Error("Missing YouTube API key");
  const out: YTVideo[] = [];
  for (let i = 0; i < ids.length; i += 50) {
    const chunk = ids.slice(i, i + 50);
    const url = new URL("https://www.googleapis.com/youtube/v3/videos");
    url.searchParams.set("part", "snippet,contentDetails,statistics");
    url.searchParams.set("id", chunk.join(","));
    url.searchParams.set("key", apiKey);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`videos failed: ${res.status}`);
    const data = await res.json();
    for (const v of data.items || []) {
      const sn = v.snippet || {};
      const thumbs = sn.thumbnails || {};
      const thumb =
        thumbs.maxres?.url ||
        thumbs.standard?.url ||
        thumbs.high?.url ||
        thumbs.medium?.url ||
        thumbs.default?.url ||
        "";
      out.push({
        id: v.id,
        title: sn.title || "",
        description: sn.description || "",
        publishedAt: sn.publishedAt || "",
        thumbnail: thumb,
        live: sn.liveBroadcastContent === "live",
        duration: v?.contentDetails?.duration,
        views: v?.statistics?.viewCount ? Number(v.statistics.viewCount) : undefined,
      });
    }
  }
  return out;
}

/** Optional: search channel videos (for /videos search UI) */
export async function searchChannelVideos(
  channelId: string,
  q: string,
  apiKey = YT_API_KEY,
  maxResults = 25
): Promise<YTVideo[]> {
  if (!apiKey) throw new Error("Missing YouTube API key");
  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("channelId", channelId);
  url.searchParams.set("q", q);
  url.searchParams.set("type", "video");
  url.searchParams.set("order", "date");
  url.searchParams.set("maxResults", String(Math.min(50, Math.max(1, maxResults))));
  url.searchParams.set("key", apiKey);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`search failed: ${res.status}`);
  const data = await res.json();
  return (data.items || []).map((it: any) => {
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
      id: it.id?.videoId,
      title: sn.title || "",
      description: sn.description || "",
      publishedAt: sn.publishedAt || "",
      thumbnail: thumb,
      live: sn.liveBroadcastContent === "live",
    } as YTVideo;
  });
}

/** Simple opaque token helpers (used by /videos index pagination UI) */
export function encToken(s: string): string {
  return Buffer.from(s, "utf8").toString("base64url");
}
export function decToken(s: string): string {
  try { return Buffer.from(s, "base64url").toString("utf8"); } catch { return ""; }
}
