# F1 Grandstand — Next.js (SEO + Live News + YouTube)

**Domain:** https://www.f1grandstand.com  
**Channel ID:** UCh31mRik5zu2JNIC-oUCBjg  
**YouTube API Key:** baked in pages/index.tsx (you can move to env)

## Quick start
```
npm install
npm run dev
```

## Build
```
npm run build
npm start
```

## Deploy on Vercel
1. Create a new Vercel project and import this folder (GitHub or drag-drop).  
2. Framework Preset: Next.js. Deploy.  
3. In 123‑Reg DNS:  
   - CNAME `www` → `cname.vercel-dns.com`  
   - A `@` → `76.76.21.21`  
4. In Vercel → Settings → Domains → add `f1grandstand.com` and `www.f1grandstand.com`.

## News feeds
Server-side RSS aggregation (SEO-friendly) using `rss-parser` with ISR/SSR:
- Formula1.com — https://www.formula1.com/rss/latest
- BBC Sport F1 — http://feeds.bbci.co.uk/sport/formula1/rss.xml
- Motorsport.com — https://www.motorsport.com/rss/f1/news/
- PlanetF1 — https://www.planetf1.com/feed
- RacingNews365 — https://racingnews365.com/rss
- Express Sport F1 — https://www.express.co.uk/posts/rss/77/formula1

Homepage uses ISR (revalidate: 600s). `/news` is paginated SSR.

## YouTube
Latest uploads fetched client-side. Channel locked:
- CHANNEL_ID = "UCh31mRik5zu2JNIC-oUCBjg"

For security, restrict your API key to HTTP referrers:
- f1grandstand.com/*
- www.f1grandstand.com/*

Move key to env by adding `.env.local`:
```
NEXT_PUBLIC_YT_API_KEY=YOUR_KEY
```
and update code to use `process.env.NEXT_PUBLIC_YT_API_KEY`.

## SEO Setup
- `public/robots.txt` included
- Dynamic `sitemap.xml` at `/sitemap.xml`
- JSON-LD for Organization + NewsArticle on homepage
- OpenGraph/Twitter meta via Layout

## Google Analytics & Search Console
Set these environment variables in Vercel → Project → Settings → Environment Variables:
- `NEXT_PUBLIC_GA_ID` = GA4 Measurement ID (e.g., G-XXXXXXX)
- `NEXT_PUBLIC_GSC_VERIFICATION` = Search Console verification token

Then redeploy. GA and verification tag are injected automatically.
