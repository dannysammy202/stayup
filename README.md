# Say More — Conversation Companion

This repository replaces the previous StayUp application while keeping the existing `dannysammy202/stayup` repository and its Vercel connection.

## Features

Approved responsive Say More homepage; 19 topics; six moods; optional audience filtering; searchable curated library; feed and Focus mode; More Angles; Save, Hide, History, Surprise Me; optional Gemini-generated prompts; separate curated 18+ mode; PWA shell.

## Running

Node 22 or later. Run `npm start` to serve the app locally on port 4173. Run `npm test` for tests and `npm run build` for a static Vercel-ready `dist/` folder. No dependencies to install.

## Production

Vercel builds the static app into `dist/` and serves the `api/ai/generate.js` and `api/health.js` functions. Set `GEMINI_API_KEY` in the Vercel project environment to enable AI. Never commit secrets. Google Gemini IDs: `gemini-3.6-flash` for prompts and surprise, `gemini-3.8-flash` for more angles.

Curated browsing remains available without Gemini. Adults-only prompts stay out of Gemini generation. Adult age confirmation and in-memory quotas are MVP safeguards, not verified age assurance or a distributed production rate limit. Complete age eligibility controls, persistent usage protection, editorial review, 200-prompt library and live Gemini API testing before wider public launch.
