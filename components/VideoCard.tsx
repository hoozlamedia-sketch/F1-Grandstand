import Link from "next/link";

export default function VideoCard({
  id, title, publishedAt
}: { id:string; title:string; publishedAt?:string }) {
  return (
    <article
      className="rounded-3xl overflow-hidden relative"
      style={{ backgroundColor: '#0f0f0f', border: '1px solid #2a2a2a' }}
    >
      <div className="aspect-video relative">
        {/* Lighter overlay */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        {/* Gold play button */}
        <Link
          href={`https://www.youtube.com/watch?v=${id}`}
          target="_blank"
          className="absolute inset-0 grid place-items-center"
          aria-label={`Play ${title}`}
        >
          <span className="inline-grid place-items-center rounded-full"
            style={{
              width: 64, height: 64,
              background: "radial-gradient(circle at 30% 30%, #e9d8a6, #d4b36c 60%, #b68c43)",
              boxShadow: "0 6px 18px rgba(212,179,108,.35)"
            }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#0c0c0c"><path d="M8 5v14l11-7z"/></svg>
          </span>
        </Link>

        {/* Thumbnail via YouTube embed preview image */}
        <img
          alt={title}
          className="w-full h-full object-cover"
          src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold leading-snug line-clamp-2">{title}</h3>
        {publishedAt && (
          <p className="text-xs text-neutral-400 mt-1">
            {new Date(publishedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </article>
  )
}
