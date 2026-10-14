# Say More — Conversation Companion

This repository replaces the previous StayUp application while keeping the existing `dannysammy202/stayup` repository and its Vercel connection.

## Features

Approved responsive Say More homepage; 19 topics; six moods; optional audience filtering; searchable curated library; feed and Focus mode; More Angles; Save, Hide, History, Surprise Me; optional Gemini-generated prompts; separate curated 18+ mode; PWA shell.

## Running

Node 22 or later. Run `npm start` to serve the app locally on port 4173. Run `npm test` for tests and `npm run build` for a static Vercel-ready `dist/` folder. No dependencies to install.

## Production

Vercel builds the static app into `dist/` and serves the `api/ai/generate.js` and `api/health.js` functions. Set `GEMINI_API_KEY` in the Vercel project environment to enable AI. Never commit secrets. Google Gemini IDs: `gemini-3.6-flash` for prompts and surprise, `gemini-3.8-flash` for more angles.

Curated browsing remains available without Gemini. Adults-only prompts stay out of Gemini generation. Adult age confirmation and in-memory quotas are MVP safeguards, not verified age assurance or a distributed production rate limit. Complete age eligibility controls, persistent usage protection, editorial review, 200-prompt library and live Gemini API testing before wider public launch.


## 100,000-starter library

The content archive from 14 October 2026 has 100,000 records across 19 topics, six moods and seven audiences. It contains 100 previously approved starters and 99,900 machine-generated drafts still awaiting editorial review. Keep these statuses accurate: neither exact-string uniqueness nor complete allocation constitutes individual editorial approval.

### Deploy the shared library to the website

Place the uploaded archive at **`data/saymore-content-100000-draft.zip`** in this GitHub repository, then deploy the updated main branch. The build uses built-in Node.js ZIP/deflate APIs to read `master_index.jsonl`, validate 100,000 IDs, and write:

- `/library-data/manifest.json`, with total and review counts.
- `/library-data/approved.json`, holding 100 editorially approved starters.
- 200 `/library-data/drafts/*.json` shards holding the remaining 99,900 unreviewed drafts.

The app automatically loads approved starters for visitors. An optional Settings switch loads the draft shards for an editorial preview. Drafts never enter the standard feed without that explicit switch. Published content stays separate from the adults-only collection and optional Gemini generation.

### Device-only import

Settings > Your conversation library > Import ZIP also accepts the original ZIP or extracted `master_index.jsonl` file. The browser validates and stores all records in IndexedDB, including review statuses. ZIP imports require internet access to retrieve the client-side ZIP reader, and the archive contents do not leave the browser. A device-only import is not a website-wide deployment.

Filtering samples up to 72 cards from the matching library rather than rendering every result. Original starter IDs remain stable for Saved and History. An import does not delete saved preferences.
