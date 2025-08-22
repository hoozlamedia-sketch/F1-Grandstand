/**
 * YouTube helpers – channel uploads (all, paginated), search within channel, fetch details
 * Works server-side (Node fetch). Requires:
 *  - process.env.NEXT_PUBLIC_YT_API_KEY  (YouTube Data API v3 key)
 *  - process.env.YT_CHANNEL_ID          (channelId)
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

function requireEnv(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing required env var: ${name}`)
  return v
}

export async function getUploadsPlaylistId(channelId?: string, apiKey?: string): Promise<string> {
  const CHANNEL_ID = channelId || requireEnv("YT_CHANNEL_ID")
  const KEY = apiKey || requireEnv("NEXT_PUBLIC_YT_API_KEY")

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
export async function fetchUploadsPage(playlistId: string, maxResults: number = 50, pageToken?: string, apiKey?: string) {
  const KEY = apiKey || requireEnv("NEXT_PUBLIC_YT_API_KEY")
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
    const thumbs = sn.thumbnails || {}
    const thumb = thumbs.maxres?.url || thumbs.high?.url || thumbs.medium?.url || thumbs.default?.url || ""
    return {
      id,
      title: sn.title || "",
      thumbnail: thumb,
      publishedAt: sn.publishedAt
    } as YTVideo
  })

  return {
    items,
    nextPageToken: json.nextPageToken || undefined,
    prevPageToken: json.prevPageToken || undefined
  }
}

/** Get ALL upload video IDs (for counting/pagination) by walking pages */
export async function getAllUploadVideoIds(channelId?: string, apiKey?: string): Promise<string[]> {
  const uploads = await getUploadsPlaylistId(channelId, apiKey)
  let token: string | undefined
  const ids: string[] = []
  do {
    const page = await fetchUploadsPage(uploads, 50, token, apiKey)
    page.items.forEach(v => v.id && ids.push(v.id))
    token = page.nextPageToken
  } while (token)
  return ids
}

/** Fetch details (views, duration) for up to 50 ids */
export async function getVideoDetails(ids: string[], apiKey?: string): Promise<Record<string, Partial<YTVideo>>> {
  if (ids.length === 0) return {}
  const KEY = apiKey || requireEnv("NEXT_PUBLIC_YT_API_KEY")
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
  const CHANNEL_ID = channelId || requireEnv("YT_CHANNEL_ID")
  const KEY = apiKey || requireEnv("NEXT_PUBLIC_YT_API_KEY")

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
    const thumbs = sn.thumbnails || {}
    const thumb = thumbs.maxres?.url || thumbs.high?.url || thumbs.medium?.url || thumbs.default?.url || ""
    return {
      id,
      title: sn.title || "",
      thumbnail: thumb,
      publishedAt: sn.publishedAt
    } as YTVideo
  })
}
