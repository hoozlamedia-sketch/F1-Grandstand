export type YTVideo = {
  id: string
  title: string
  description?: string
  publishedAt?: string
  thumbnail?: string
  live?: boolean
}

const API_KEY = process.env.NEXT_PUBLIC_YT_API_KEY || "AIzaSyCytjJ7EwAlPZ8FId1YJsEbz6cYv3VL7_E"
const CHANNEL_ID = "UCh31mRik5zu2JNIC-oUCBjg"

async function fetchJson(url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return await res.json()
}

export async function getUploadsPlaylistId(channelId: string = CHANNEL_ID): Promise<string> {
  const url = new URL('https://www.googleapis.com/youtube/v3/channels')
  url.searchParams.set('part', 'contentDetails')
  url.searchParams.set('id', channelId)
  url.searchParams.set('key', API_KEY as string)
  const data = await fetchJson(url.toString())
  const uploads = data?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
  if (!uploads) throw new Error('No uploads playlist id')
  return uploads
}

export async function getAllUploadVideoIds(channelId: string = CHANNEL_ID): Promise<string[]> {
  const uploads = await getUploadsPlaylistId(channelId)
  const ids: string[] = []
  let pageToken = ''
  while (true) {
    const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems')
    url.searchParams.set('part', 'contentDetails')
    url.searchParams.set('playlistId', uploads)
    url.searchParams.set('maxResults', '50')
    if (pageToken) url.searchParams.set('pageToken', pageToken)
    url.searchParams.set('key', API_KEY as string)
    const data = await fetchJson(url.toString())
    for (const it of (data.items || [])) {
      const vid = it.contentDetails?.videoId
      if (vid) ids.push(vid)
    }
    pageToken = data.nextPageToken || ''
    if (!pageToken) break
  }
  return ids
}

export async function getVideoDetails(ids: string[]): Promise<YTVideo[]> {
  const videos: YTVideo[] = []
  for (let i = 0; i < ids.length; i += 50) {
    const chunk = ids.slice(i, i + 50)
    const url = new URL('https://www.googleapis.com/youtube/v3/videos')
    url.searchParams.set('part', 'snippet,liveStreamingDetails')
    url.searchParams.set('id', chunk.join(','))
    url.searchParams.set('key', API_KEY as string)
    const data = await fetchJson(url.toString())
    for (const v of (data.items || [])) {
      const s = v.snippet || {}
      const t = s.thumbnails || {}
      videos.push({
        id: v.id,
        title: s.title,
        description: s.description,
        publishedAt: s.publishedAt,
        thumbnail: t.maxres?.url || t.standard?.url || t.high?.url || t.medium?.url || t.default?.url,
        live: s.liveBroadcastContent === 'live'
      })
    }
  }
  // sort by publishedAt desc
  videos.sort((a,b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime())
  return videos
}

export async function searchChannelVideos(q: string, maxResults = 18, channelId: string = CHANNEL_ID): Promise<YTVideo[]> {
  const url = new URL('https://www.googleapis.com/youtube/v3/search')
  url.searchParams.set('part', 'snippet')
  url.searchParams.set('channelId', channelId)
  url.searchParams.set('order', 'date')
  url.searchParams.set('maxResults', String(maxResults))
  url.searchParams.set('type', 'video')
  url.searchParams.set('q', q)
  url.searchParams.set('key', API_KEY as string)
  const data = await fetchJson(url.toString())
  const ids = (data.items || []).map((it: any) => it.id?.videoId).filter(Boolean)
  return await getVideoDetails(ids)
}
