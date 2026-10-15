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

The first Relationships / Chill / Anyone collection now contains **500 locally bundled starters**. Entries 1–100 retain the earlier editorial review. Entries 101–500 are newly authored and passed ID, exact-duplicate, high-overlap lexical, format, length and relevance checks. Independent human review and full semantic similarity screening remain outstanding. Read the editable file at `content/Relationships/Chill/Anyone.md`, or the five production JSON chunks under `public/library-data/`. Existing sample prompts for the other topics remain in the application and do not count towards this editorial quota.

`public/library-data/manifest.json` provides all 798 combinations, exclusions, targets, and published totals. The current total is **500 published entries out of 348,000 planned**, of which 100 retain prior human editorial review and 400 await independent human review. More entries will require actual editorial writing and review; the earlier 99,900 auto-generated drafts were not incorporated because they are not approved and repeat underlying scenarios.

The app loads built-in prompts itself: no user ZIP upload, no runtime AI generation required. New batches must pass originality, quality, suitability and manifest-count checks before publication. The feed reveals 48 prompts at a time through a More conversation ideas control, so all matching entries remain accessible without rendering hundreds of cards at once. Keep approved prompts separate from pending editorial drafts.

## Running and deployment

Node 22 or newer.

- `npm start` runs the local server on port 4173.
- `npm test` runs application and curated-library tests.
- `npm run build` assembles the static production site.
- Vercel serves the PWA and `api/ai/generate.js` plus `api/health.js`.

Set `GEMINI_API_KEY` for optional AI support. Do not commit secrets. Gemini stays outside the curated adults-only area. Full production age assurance and distributed usage limits still require completion before public launch.
