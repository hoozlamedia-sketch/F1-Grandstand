import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const API_KEY = process.env.NEXT_PUBLIC_YT_API_KEY || "AIzaSyCytjJ7EwAlPZ8FId1YJsEbz6cYv3VL7_E"
const CHANNEL_ID = "UCh31mRik5zu2JNIC-oUCBjg"

type Result = {
  id: string
  title: string
  thumb: string
  publishedAt: string
}

function useDebouncedValue<T>(val: T, delay = 250) {
  const [v, setV] = useState(val)
  useEffect(() => {
    const t = setTimeout(() => setV(val), delay)
    return () => clearTimeout(t)
  }, [val, delay])
  return v
}

export default function GlobalSearch() {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Result[]>([])
  const debounced = useDebouncedValue(q, 300)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!boxRef.current) return
      if (!boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  useEffect(() => {
    async function run() {
      if (!debounced.trim()) { setResults([]); return }
      setLoading(true)
      try {
        const url = new URL('https://www.googleapis.com/youtube/v3/search')
        url.searchParams.set('part', 'snippet')
        url.searchParams.set('channelId', CHANNEL_ID)
        url.searchParams.set('maxResults', '10')
        url.searchParams.set('type', 'video')
        url.searchParams.set('order', 'date')
        url.searchParams.set('q', debounced)
        url.searchParams.set('key', API_KEY as string)
        const res = await fetch(url.toString())
        const data = await res.json()
        const list: Result[] = (data.items || []).map((it: any) => ({
          id: it.id.videoId,
          title: it.snippet.title,
          publishedAt: it.snippet.publishedAt,
          thumb: it.snippet.thumbnails?.default?.url || ''
        }))
        setResults(list)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [debounced])

  return (
    <div className="relative w-full max-w-md" ref={boxRef}>
      <input
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        placeholder="Search F1 Grandstand videos…"
        className="w-full rounded-xl px-3 py-2 text-sm outline-none"
        style={{ backgroundColor: '#111', border: '1px solid #2a2a2a', color: '#f2f2f2' }}
      />
      {open && (q.trim().length > 0) && (
        <div className="absolute left-0 right-0 mt-2 rounded-2xl overflow-hidden"
             style={{ backgroundColor: '#0f0f0f', border: '1px solid #2a2a2a', boxShadow: '0 10px 30px rgba(0,0,0,.35)' }}>
          {loading && <div className="p-3 text-sm text-neutral-400">Searching…</div>}
          {!loading && results.length === 0 && (
            <div className="p-3 text-sm text-neutral-400">No matches — showing latest on <Link href="/videos" className="underline" style={{ color: '#d4b36c' }}>Videos</Link>.</div>
          )}
          {!loading && results.map(r => (
            <Link key={r.id} href={`/videos/${r.id}`} className="flex items-center gap-3 p-3 hover:bg-black/40">
              <img src={r.thumb} alt="" className="w-14 h-9 object-cover rounded-md" />
              <div className="min-w-0">
                <div className="text-sm truncate" style={{ color: '#f5e9c8' }}>{r.title}</div>
                <div className="text-xs text-neutral-400">{new Date(r.publishedAt).toLocaleDateString()}</div>
              </div>
            </Link>
          ))}
          <div className="p-2 text-right">
            <Link href={`/videos`} className="text-xs underline" style={{ color: '#d4b36c' }}>See all videos →</Link>
          </div>
        </div>
      )}
    </div>
  )
}
