import { ReactNode } from "react";
import Head from "next/head";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function Layout({ children, title, description }: LayoutProps) {
  const pageTitle = title ? `${title} | F1 Grandstand` : "F1 Grandstand";
  const pageDesc =
    description ||
    "Daily Formula 1 news, videos, analysis, rumours, and race updates from F1 Grandstand.";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
      </Head>
      <div className="min-h-screen bg-black text-white">
        {children}
      </div>
    </>
  );
}
