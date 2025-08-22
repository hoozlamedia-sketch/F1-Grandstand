const YT_BASE = "https://www.googleapis.com/youtube/v3";

export type YTVideo = {
  id: string;
  title: string;
  publishedAt?: string;
  thumbnail?: string;
  description?: string;
};

export type PageResult = {
  videos: YTVideo[];
  nextPageToken?: string;
  prevPageToken?: string;
  pageSize: number;
};

async function getJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`YouTube API ${res.status}`);
  }
  return res.json();
}

// Get the channel's Uploads playlistId (special system playlist)
export async function getUploadsPlaylistId(channelId: string, apiKey: string): Promise<string> {
  const url = `${YT_BASE}/channels?part=contentDetails&id=${channelId}&key=${apiKey}`;
  const data = await getJson(url);
  const details = data?.items?.[0]?.contentDetails;
  const uploads = details?.relatedPlaylists?.uploads;
  if (!uploads) throw new Error("Uploads playlist not found for channel");
  return uploads;
}

// Fetch one page (50 items) of the uploads playlist
export async function fetchUploadsPage(
  uploadsPlaylistId: string,
  apiKey: string,
  pageToken?: string
): Promise<PageResult> {
  const params = new URLSearchParams({
    part: "snippet,contentDetails",
    playlistId: uploadsPlaylistId,
    maxResults: "50",
    key: apiKey,
  });
  if (pageToken) params.set("pageToken", pageToken);
  const url = `${YT_BASE}/playlistItems?${params.toString()}`;
  const data = await getJson(url);

  const videos: YTVideo[] = (data.items || []).map((it: any) => {
    const sn = it.snippet || {};
    const thumbs = sn.thumbnails || {};
    const bestThumb =
      thumbs.maxres?.url ||
      thumbs.standard?.url ||
      thumbs.high?.url ||
      thumbs.medium?.url ||
      thumbs.default?.url ||
      "";

    return {
      id: sn.resourceId?.videoId || "",
      title: sn.title || "",
      description: sn.description || "",
      publishedAt: sn.publishedAt || "",
      thumbnail: bestThumb,
    };
  }).filter(v => v.id && v.title);

  return {
    videos,
    nextPageToken: data.nextPageToken,
    prevPageToken: data.prevPageToken,
    pageSize: 50,
  };
}

// Safe encode/decode page tokens for query strings
export function encToken(t?: string) {
  if (!t) return undefined;
  return Buffer.from(t, "utf8").toString("base64url");
}
export function decToken(t?: string) {
  if (!t) return undefined;
  try { return Buffer.from(t, "base64url").toString("utf8"); } catch { return undefined; }
}
