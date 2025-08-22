type Env = {
  YT_API_KEY?: string
  NEXT_PUBLIC_YT_API_KEY?: string
}

export type YTVideo = {
  id: string
  title: string
  description?: string
  thumbnail?: string
  publishedAt?: string
}

/** Prefer server-side key; fall back to NEXT_PUBLIC. */
export function getKey(env: Env = process.env as Env): string {
  const k = env.YT_API_KEY || env.NEXT_PUBLIC_YT_API_KEY
  if (!k) throw new Error('YouTube API key missing. Set YT_API_KEY (preferred) or NEXT_PUBLIC_YT_API_KEY.')
  return k
}

/** Get the channel's "uploads" playlistId (required to list all uploads). */
export async function getUploadsPlaylistId(channelId: string, apiKey?: string): Promise<string> {
  const key = apiKey || getKey()
  const url = new URL('https://www.googleapis.com/youtube/v3/channels')
  url.searchParams.set('part', 'contentDetails')
  url.searchParams.set('id', channelId)
  url.searchParams.set('key', key)

  const res = await fetch(url.toString())
  if (!res.ok) {
    const t = await res.text().catch(() => '')
    throw new Error(`YouTube channels error ${res.status}: ${t}`)
  }
  const data = await res.json()
  const uploads = data?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
  if (!uploads) throw new Error('Uploads playlist not found for channel.')
  return uploads
}

/** Fetch one page (up to 50) of uploads from a playlist. */
export async function fetchUploadsPage(
  playlistId: string,
  apiKey?: string,
  pageToken?: string
): Promise<{ items: YTVideo[]; nextPageToken?: string }> {
  const key = apiKey || getKey()
  const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems')
  url.searchParams.set('part', 'snippet,contentDetails')
  url.searchParams.set('playlistId', playlistId)
  url.searchParams.set('maxResults', '50')
  url.searchParams.set('key', key)
  if (pageToken) url.searchParams.set('pageToken', pageToken)

  const res = await fetch(url.toString())
  if (!res.ok) {
    const t = await res.text().catch(() => '')
    throw new Error(`YouTube playlistItems error ${res.status}: ${t}`)
  }
  const data = await res.json()
  const items: YTVideo[] = (data.items || []).map((it: any) => {
    const sn = it.snippet || {}
    const thumbs = sn.thumbnails || {}
    const thumb =
      thumbs.maxres?.url ||
      thumbs.standard?.url ||
      thumbs.high?.url ||
      thumbs.medium?.url ||
      thumbs.default?.url ||
      undefined
    return {
      id: it.contentDetails?.videoId || sn.resourceId?.videoId,
      title: sn.title,
      description: sn.description,
      thumbnail: thumb,
      publishedAt: sn.publishedAt
    }
  }).filter(v => !!v.id && !!v.title)

  return { items, nextPageToken: data.nextPageToken }
}

/** Base64URL encode/decode tokens so they are safe in URLs. */
export function encToken(token?: string): string | undefined {
  if (!token) return undefined
  const b64 = Buffer.from(token, 'utf8').toString('base64')
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}
export function decToken(safe?: string): string | undefined {
  if (!safe) return undefined
  let b64 = safe.replace(/-/g, '+').replace(/_/g, '/')
  while (b64.length % 4) b64 += '='
  return Buffer.from(b64, 'base64').toString('utf8')
}
