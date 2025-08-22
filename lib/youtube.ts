/**
 * YouTube helpers – channel uploads (paginated), search, details.
 * Will be called from SSR pages. We *don't* handle fallback here; callers can
 * decide to fall back to RSS if API fails/missing.
 */

export type YTVideo = {
  id: string
  title: string
  thumbnail: string
  publishedAt?: string
  description?: string
  views?: string
  duration?: string
}

const API = "https://www.googleapis.com/youtube/v3"

function env(name: string): string | undefined {
  const v = process.env[name]
  return v && String(v).trim() ? String(v).trim() : undefined
}

/** Build a nice thumb url from thumbnails object */
function pickThumb(sn: any): string {
  const t = sn?.thumbnails || {}
  return t.maxres?.url || t.high?.url || t.medium?.url || t.default?.url || ""
}

/** Get uploads playlist id. Requires apiKey and channelId. */
export async function getUploadsPlaylistId(channelId?: string, apiKey?: string): Promise<string> {
  const CHANNEL_ID = channelId || env("YT_CHANNEL_ID")
  const KEY = apiKey || env("NEXT_PUBLIC_YT_API_KEY")
  if (!CHANNEL_ID || !KEY) throw new Error("YT API missing: channelId or apiKey")

  const url = new URL(API + "/channels")
  url.searchParams.set("part", "contentDetails")
  url.searchParams.set("id", CHANNEL_ID)
  url.searchParams.set("key", KEY)

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`channels failed: ${res.status}`)
  const json = await res.json()
  const uploads = json?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
  if (!uploads) throw new Error("No uploads playlist found for channel")
  return uploads as string
}

/** Fetch ONE page of uploads from the uploads playlist */
export async function fetchUploadsPage(
  playlistId: string,
  maxResults: number = 50,
  pageToken?: string,
  apiKey?: string
) {
  const KEY = apiKey || env("NEXT_PUBLIC_YT_API_KEY")
  if (!KEY) throw new Error("YT API missing: apiKey")
  const url = new URL(API + "/playlistItems")
  url.searchParams.set("part", "snippet,contentDetails")
  url.searchParams.set("playlistId", playlistId)
  url.searchParams.set("maxResults", String(Math.min(50, Math.max(1, maxResults))))
  if (pageToken) url.searchParams.set("pageToken", pageToken)
  url.searchParams.set("key", KEY)

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`playlistItems failed: ${res.status}`)
  const json = await res.json()

  const items = (json.items || []).map((it: any) => {
    const id = it.contentDetails?.videoId || it.snippet?.resourceId?.videoId
    const sn = it.snippet || {}
    return {
      id,
      title: sn.title || "",
      thumbnail: pickThumb(sn),
      publishedAt: sn.publishedAt
    } as YTVideo
  })

  return {
    items,
    nextPageToken: json.nextPageToken || undefined,
    prevPageToken: json.prevPageToken || undefined
  }
}

/** Fetch details (views, duration) for up to 50 ids */
export async function getVideoDetails(ids: string[], apiKey?: string): Promise<Record<string, Partial<YTVideo>>> {
  if (!ids?.length) return {}
  const KEY = apiKey || env("NEXT_PUBLIC_YT_API_KEY")
  if (!KEY) return {}
  const url = new URL(API + "/videos")
  url.searchParams.set("part", "snippet,contentDetails,statistics")
  url.searchParams.set("id", ids.join(","))
  url.searchParams.set("key", KEY)

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`videos details failed: ${res.status}`)
  const json = await res.json()
  const out: Record<string, Partial<YTVideo>> = {}
  for (const it of json.items || []) {
    const id = it.id
    out[id] = {
      description: it.snippet?.description,
      views: it.statistics?.viewCount,
      duration: it.contentDetails?.duration
    }
  }
  return out
}

/** Search inside a channel, limited by maxResults (1..50) */
export async function searchChannelVideos(
  query: string,
  maxResults: number = 25,
  channelId?: string,
  apiKey?: string
): Promise<YTVideo[]> {
  const CHANNEL_ID = channelId || env("YT_CHANNEL_ID")
  const KEY = apiKey || env("NEXT_PUBLIC_YT_API_KEY")
  if (!CHANNEL_ID || !KEY) throw new Error("YT API missing: channelId or apiKey")
  const url = new URL(API + "/search")
  url.searchParams.set("part", "snippet")
  url.searchParams.set("channelId", CHANNEL_ID)
  url.searchParams.set("q", query)
  url.searchParams.set("type", "video")
  url.searchParams.set("order", "date")
  url.searchParams.set("maxResults", String(Math.min(50, Math.max(1, maxResults))))
  url.searchParams.set("key", KEY)

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`search failed: ${res.status}`)
  const json = await res.json()
  return (json.items || []).map((it: any) => {
    const id = it.id?.videoId
    const sn = it.snippet || {}
    return {
      id,
      title: sn.title || "",
      thumbnail: pickThumb(sn),
      publishedAt: sn.publishedAt
    } as YTVideo
  })
}

/** Minimal RSS fallback (recent ~15 items) */
export async function fetchChannelRSS(channelId: string): Promise<YTVideo[]> {
  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`RSS failed: ${res.status}`)
  const xml = await res.text()
  // naive parse
  const entries = Array.from(xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)).map(m => m[1])
  return entries.map((e) => {
    const id = (e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/) || [])[1] || ""
    const title = (e.match(/<title>([^<]+)<\/title>/) || [])[1] || ""
    const publishedAt = (e.match(/<published>([^<]+)<\/published>/) || [])[1]
    const thumb = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
    return { id, title, thumbnail: thumb, publishedAt } as YTVideo
  })
}
