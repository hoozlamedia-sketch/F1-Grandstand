import React from "react";

type Kind = "video" | "article";

interface EditorialNoteProps {
  kind: Kind;
  title?: string;
  source?: string;
  publishedAt?: string;
}

function timeAgo(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const diff = Math.max(0, Date.now() - d.getTime());
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export default function EditorialNote({ kind, title, source, publishedAt }: EditorialNoteProps) {
  const isVideo = kind === "video";
  const label = isVideo ? "video" : "story";
  const ago = timeAgo(publishedAt);
  return (
    <p className="text-xs text-neutral-400 mt-1">
      Quick take: This {label}
      {title ? ` “${title}”` : ""}{source ? ` from ${source}` : ""}{ago ? ` landed ${ago}` : ""}.
      It’s included on F1 Grandstand to help fans keep up with the daily F1 news cycle.
    </p>
  );
}
