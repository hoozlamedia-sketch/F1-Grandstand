export type YTVideo = {
  id: string;
  title: string;
  publishedAt?: string;
  description?: string;
  thumbnail?: string | null;
};

const API_KEY = process.env.NEXT_PUBLIC_YT_API_KEY || "";

function assertKey() {
  if (!API_KEY) throw new Error("Missing NEXT_PUBLIC_YT_API_KEY");
}

export async function getUploadsPlaylistId(channelId: string): Promise<string> {
  assertKey();
  const url = new URL("https://www.googleapis.com/youtube/v3/channels");
  url.searchParams.set("part", "contentDetails");
  url.searchParams.set("id", channelId);
  url.searchParams.set("key", API_KEY);
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`YouTube channels error ${res.status}`);
  }
  const data = await res.json();
  const uploads = data?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploads) throw new Error("Uploads playlist not found");
  return uploads as string;
}

export async function fetchUploadsPage(
  playlistId: string,
  pageToken?: string | null,
  maxResults = 50
): Promise<{ items: YTVideo[]; nextPageToken?: string | null }> {
  assertKey();
  const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
  url.searchParams.set("part", "snippet,contentDetails");
  url.searchParams.set("playlistId", playlistId);
  url.searchParams.set("maxResults", String(Math.min(Math.max(maxResults, 1), 50)));
  if (pageToken) url.searchParams.set("pageToken", pageToken);
  url.searchParams.set("key", API_KEY);

  const res = await fetch(url.toString());
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`YouTube playlistItems error ${res.status} ${text}`);
  }
  const data = await res.json();

  const items: YTVideo[] = (data.items || [])
    .map((it: any) => {
      const sn = it.snippet || {};
      const thumbs = sn.thumbnails || {};
      const thumb =
        thumbs.maxres?.url ||
        thumbs.standard?.url ||
        thumbs.high?.url ||
        thumbs.medium?.url ||
        thumbs.default?.url ||
        null;
      return {
        id: sn.resourceId?.videoId || "",
        title: sn.title || "",
        description: sn.description || "",
        publishedAt: sn.publishedAt || "",
        thumbnail: thumb,
      };
    })
    .filter((v: YTVideo) => v.id);

  return { items, nextPageToken: data.nextPageToken || null };
}

export const encToken = (t?: string | null) =>
  t ? Buffer.from(t, "utf8").toString("base64url") : "";

export const decToken = (t?: string | null) => {
  try {
    return t ? Buffer.from(t, "base64url").toString("utf8") : "";
  } catch {
    return "";
  }
};
