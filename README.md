# Say More — Conversation Companion

Say More replaces the original StayUp interface in the existing `dannysammy202/stayup` repository.

## Product experience

- Approved responsive Explore, Topics, Focus, Saved, History and Settings screens.
- Iconsax Linear is the exclusive interface icon system.
- 19 topics, six moods, seven audiences with optional filters.
- Curated-first browsing, related angles, local history, favourites and hiding.
- A separate opt-in curated adults-only area.
- Optional Gemini 3.6 Flash (fresh prompts) and Gemini 3.8 Flash (More Angles), only when users request them. Gemini does not supply the default feed.

## Curated library: production reality

**Editorial quota:** 500 original, reviewed prompts for each socially appropriate topic/mood/audience combination.

19 × 6 × 7 = 798 theoretical combinations. The editorial policy excludes 102 unsuitable pairings, leaving **696 eligible combinations** and an eventual **348,000-starter target**.

The **Relationships / Chill / Anyone** and **Relationships / Chill / Someone new** collections each contain 500 built-in starters. A third collection, **Relationships / Chill / Friends**, has its first 100 of 500 starters. The initial 100 records retain prior editorial approval; the other 1,000 are AI-authored candidates that passed structural, exact-duplicate and lexical checks but await individual human review and complete semantic screening. The source Markdown is under `content/Relationships/Chill/`, and production chunks are under `public/library-data/`. Legacy sample prompts remain outside the 348,000-starter quota.

`public/library-data/manifest.json` tracks 798 theoretical combinations, 102 exclusions, quotas and publication status. Currently **1,100 built-in entries out of 348,000 planned** are accessible, with 100 previously reviewed records and 1,000 screened drafts. Two combinations have reached their structural quota of 500, and the third has 100 of 500. Never present these screened candidates as individually approved.

The app loads built-in prompts itself: no user ZIP upload, no runtime AI generation required. New batches must pass originality, quality, suitability and manifest-count checks before publication. The feed reveals 48 prompts at a time through a More conversation ideas control, so all matching entries remain accessible without rendering hundreds of cards at once. Preserve the editorial status of every record and show screened drafts with an In Review label. Never present unreviewed content as human-approved.

## Running and deployment

Node 22 or newer.

- `npm start` runs the local server on port 4173.
- `npm test` runs application and curated-library tests.
- `npm run build` assembles the static production site.
- Vercel serves the PWA and `api/ai/generate.js` plus `api/health.js`.

Set `GEMINI_API_KEY` for optional AI support. Do not commit secrets. Gemini stays outside the curated adults-only area. Full production age assurance and distributed usage limits still require completion before public launch.
