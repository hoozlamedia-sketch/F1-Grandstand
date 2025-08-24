// components/NewsPager.tsx
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import React from "react";

const GOLD = "#f5e9c8";

type Props = {
  /** Total number of news items available (from getStaticProps) */
  total?: number;
  /** Page size used on the page (default 18) */
  pageSize?: number;
};

/**
 * Paging rules (page 1 = newest):
 * - "Newer F1 News Videos" => page - 1 (disabled on page 1)
 * - "Older F1 News Videos" => page + 1 (disabled on last page when known)
 * rel="prev" -> smaller page number (newer)
 * rel="next" -> larger page number (older)
 */
export default function NewsPager({ total, pageSize = 18 }: Props) {
  const router = useRouter();
  const pageRaw = Array.isArray(router.query.page)
    ? router.query.page[0]
    : (router.query.page as string | undefined);
  const page = Math.max(1, Number(pageRaw || 1));

  const maxPage = total && pageSize ? Math.max(1, Math.ceil(total / pageSize)) : undefined;

  const newerHref = page > 1 ? `/news?page=${page - 1}` : null; // smaller number
  const olderHref =
    maxPage !== undefined ? (page < maxPage ? `/news?page=${page + 1}` : null) : `/news?page=${page + 1}`;

  return (
    <>
      <Head>
        {newerHref && <link rel="prev" href={newerHref} />}
        {olderHref && <link rel="next" href={olderHref} />}
      </Head>

      <nav aria-label="F1 News pagination" className="mt-10 flex items-center justify-between gap-4">
        {/* Older (to larger page number) */}
        <div>
          {olderHref ? (
            <Link
              href={olderHref}
              rel="next"
              aria-label="Older F1 News Videos"
              className="inline-block rounded border px-4 py-2 font-semibold transition"
              style={{ borderColor: GOLD, color: GOLD }}
            >
              ← Older F1 News Videos
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className="inline-block rounded border px-4 py-2 opacity-40 cursor-not-allowed"
              style={{ borderColor: GOLD, color: GOLD }}
            >
              ← Older F1 News Videos
            </span>
          )}
        </div>

        {/* Newer (to smaller page number) */}
        <div>
          {newerHref ? (
            <Link
              href={newerHref}
              rel="prev"
              aria-label="Newer F1 News Videos"
              className="inline-block rounded px-4 py-2 font-semibold shadow transition"
              style={{ backgroundColor: GOLD, color: "#0e0e0e" }}
            >
              Newer F1 News Videos →
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className="inline-block rounded px-4 py-2 font-semibold shadow transition opacity-40 cursor-not-allowed"
              style={{ backgroundColor: GOLD, color: "#0e0e0e" }}
            >
              Newer F1 News Videos →
            </span>
          )}
        </div>
      </nav>
    </>
  );
}
