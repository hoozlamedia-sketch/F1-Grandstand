/**
 * YouTube helpers – channel uploads (paginated), search, details.
 * Called from SSR pages. Includes robust search with fallbacks.
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

/** Normalize query: strip smart quotes, collapse whitespace */
function normalizeQuery(q: string): string {
  return (q || "")
    .replace(/[“”„‟"«»]/g, '"')
    .replace(/[‘’‚‛'`´]/g, "'")
    .replace(/\s+/g, " ")
    .trim()
}

/** Get uploads playlist id. Requires apiKey and channelId. */
export async function getUploadsPlaylistId(channelId?: string, apiKey?: string): Promise<string> {
  const CHANNEL_ID = channelId || env("YT_CHANNEL_ID")
  const KEY = apiKey || env("YT_API_KEY") || env("YT_API_KEY") || env("NEXT_PUBLIC_YT_API_KEY")
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
  const KEY = apiKey || env("YT_API_KEY") || env("YT_API_KEY") || env("NEXT_PUBLIC_YT_API_KEY")
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
    const id = it.contentDetails?.videoId || it.snippet?.resourceId?.videoId || ""
    const sn = it.snippet || {}
    return {
      id,
      title: sn.title || "",
      thumbnail: pickThumb(sn) || "",
      publishedAt: sn.publishedAt
    } as YTVideo
  }).filter(v => v.id)

  return {
    items,
    nextPageToken: json.nextPageToken || undefined,
    prevPageToken: json.prevPageToken || undefined
  }
}

/** Fetch details (views, duration) for up to 50 ids */
export async function getVideoDetails(ids: string[], apiKey?: string): Promise<Record<string, Partial<YTVideo>>> {
  if (!ids?.length) return {}
  const KEY = apiKey || env("YT_API_KEY") || env("YT_API_KEY") || env("NEXT_PUBLIC_YT_API_KEY")
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

/**
 * Smart channel search:
 *  1) API search (order=relevance, safeSearch=none) with original q
 *  2) If empty, API search again with normalized q
 *  3) If still empty, RSS fallback: filter titles by q (case-insensitive)
 * Always filters out items without a valid video id.
 */
export async function searchChannelVideos(
  query: string,
  maxResults: number = 25,
  channelId?: string,
  apiKey?: string
): Promise<YTVideo[]> {
  const CHANNEL_ID = channelId || env("YT_CHANNEL_ID")
  const KEY = apiKey || env("YT_API_KEY") || env("YT_API_KEY") || env("NEXT_PUBLIC_YT_API_KEY")
  if (!CHANNEL_ID || !KEY) throw new Error("YT API missing: channelId or apiKey")

  async function apiSearch(q: string): Promise<YTVideo[]> {
    const url = new URL(API + "/search")
    url.searchParams.set("part", "snippet")
    url.searchParams.set("channelId", CHANNEL_ID)
    url.searchParams.set("q", q)
    url.searchParams.set("type", "video")
    url.searchParams.set("order", "relevance")
    url.searchParams.set("maxResults", String(Math.min(50, Math.max(1, maxResults))))
    url.searchParams.set("relevanceLanguage", "en")
    url.searchParams.set("safeSearch", "none")
    url.searchParams.set("key", KEY)

    const res = await fetch(url.toString())
    if (!res.ok) return []
    const json = await res.json()
    const arr = (json.items || []).map((it: any) => {
      const id = it?.id?.videoId || ""
      const sn = it?.snippet || {}
      return {
        id,
        title: sn.title || "",
        thumbnail: pickThumb(sn) || "",
        publishedAt: sn.publishedAt
      } as YTVideo
    })
    return arr.filter(v => v.id)
  }

  const q1 = query || ""
  const q2 = normalizeQuery(query || "")

  // Pass 1
  let results = await apiSearch(q1)
  if (results.length > 0) return results

  // Pass 2 (normalized)
  if (q2 !== q1) {
    results = await apiSearch(q2)
    if (results.length > 0) return results
  }

  // Pass 3 (RSS fallback by title)
  try {
    const rss = await fetchChannelRSS(CHANNEL_ID)
    const q = (q2 || q1).toLowerCase()
    const filtered = rss.filter(v => (v.title || "").toLowerCase().includes(q)).slice(0, maxResults)
    return filtered
  } catch {
    return []
  }
}

/** Minimal RSS fallback (recent ~15–20 items) */
export async function fetchChannelRSS(channelId: string): Promise<YTVideo[]> {
  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`RSS failed: ${res.status}`)
  const xml = await res.text()
  const entries = Array.from(xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)).map(m => m[1])
  const arr = entries.map((e) => {
    const id = (e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/) || [])[1] || ""
    const title = (e.match(/<title>([^<]+)<\/title>/) || [])[1] || ""
    const publishedAt = (e.match(/<published>([^<]+)<\/published>/) || [])[1]
    const thumb = id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : ""
    return { id, title, thumbnail: thumb, publishedAt } as YTVideo
  })
  return arr.filter(v => v.id && v.title)
}
