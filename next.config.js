/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Do NOT set output: 'export' — we need SSR for XML routes.
  images: { unoptimized: true },
};

module.exports = nextConfig;
