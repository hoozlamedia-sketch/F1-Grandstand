import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({ res, req }) => {
  const proto = (req.headers["x-forwarded-proto"] as string) || "https";
  const host = req.headers.host || "f1-grandstand.vercel.app";
  const base = `${proto}://${host}`;

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.write(
`User-agent: *
Allow: /

Sitemap: ${base}/sitemap.xml
`
  );
  res.end();
  return { props: {} };
};

export default function Robots() { return null; }
