# Omiflow — Outreach Pipeline

Full-stack Next.js app for generating personalised cold emails with live demo links at scale.

## Architecture

- **Frontend**: Next.js 14 App Router, React, Tailwind CSS
- **Backend**: Next.js API routes (Node.js, runs server-side)
- **All API calls are server-side** — no CORS issues, keys are never exposed to the browser

## Setup

### 1. Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push this repo to GitHub
2. Import into Vercel
3. Add environment variables (see below)
4. Deploy

### 2. Environment Variables

Set these in Vercel → Project Settings → Environment Variables:

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ | Claude API key from console.anthropic.com |
| `NETLIFY_TOKEN` | ✅ | Personal access token from netlify.com → User Settings → Access tokens |
| `NEXT_PUBLIC_VAPI_PUBLIC_KEY` | AI Voicemail only | Vapi public key from dashboard |
| `NEXT_PUBLIC_VAPI_ASSISTANT_ID` | AI Voicemail only | Vapi assistant UUID |

### 3. Local Development

```bash
npm install
cp .env.example .env.local
# Fill in your keys in .env.local
npm run dev
```

Open http://localhost:3000

## Usage

1. **Upload** — Choose Website Design or AI Voicemail campaign, upload Outscraper CSV/XLSX
2. **Clean** — Reviews duplicates and invalid emails removed automatically
3. **Generate** — Claude visits each site, writes 4 emails, deploys demo to Netlify, injects live URL
4. **Review** — Preview emails and live demos, approve or reject each lead
5. **Export** — Quality check runs, download CSV for Instantly upload

## Vercel Plan Note

Each lead takes 15–40 seconds to generate (web search + email writing + Netlify deploy).
Vercel Hobby plan allows 60s function timeout. For batches over ~10 leads, upgrade to Pro (300s timeout) or set `maxDuration = 300` in the API route.
