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

**Current inventory:** 1,600 built-in entries across four combinations. Relationships / Chill / Anyone, Someone new and Friends have 500 each. Relationships / Chill / Crush / Talking stage has its first 100 of 500. The first 100 starters have prior editorial review status; the remaining 1,500 are machine-screened candidates awaiting human editorial review and fuller semantic similarity screening. **346,400** additional slots remain unwritten and are not presented as complete.

### Built-in content delivery

The approved scope is 348,000 starters over 696 eligible combinations; the 102 exclusions remain in the published manifest. Original UI and Iconsax are unchanged. Google Gemini is strictly optional for fresh ideas and additional angles; it is not the default source.

All curated data is shipped inside the Say More repository and Vercel deployment under `public/library-data/`, with no user imports and no runtime Gemini generation. `manifest.json` contains the publication inventory and a `publishedCollections` index mapping each topic/mood/audience triple to its local JSON shards. The app loads a maximum of eight relevant shards per selection instead of fetching the entire eventual catalogue on startup. Further shards load through the existing More conversation ideas control. Saved and History views rehydrate their relevant files using stable IDs.

When publishing another editorial batch, add a local JSON content shard, update `publishedFiles`, `publishedCollections`, its slot's `published` count and the total/editorial counters in the manifest. Add matching Markdown source under `content/`. Run `npm test` before deployment: checks cover eligible combinations, duplicate IDs/text, quality metadata, discovery, Iconsax, JavaScript syntax and shard selection.

**Editorial honesty:** exact matching and lexical screening do not equal human acceptance or full semantic de-duplication. Keep the `screened_pending_editorial_review` status until an individual reviewer signs off. Do not populate quotas with templated variants or mark ungenerated entries as complete.

## Running and deployment

Node 22 or newer.

- `npm start` runs the local server on port 4173.
- `npm test` runs application and curated-library tests.
- `npm run build` assembles the static production site.
- Vercel serves the PWA and `api/ai/generate.js` plus `api/health.js`.

Set `GEMINI_API_KEY` for optional AI support. Do not commit secrets. Gemini stays outside the curated adults-only area. Full production age assurance and distributed usage limits still require completion before public launch.


## Continuous editorial production

New authored batches are committed to `content/inbox/` on a content branch. GitHub Actions runs `npm run content:publish` on each batch, validates the whole corpus, builds Say More, and commits generated local JSON, Markdown and manifest files back to that branch. Only validated branches are merged to `main` and deployed. No browser upload step or runtime Gemini call is used to populate the normal feed. See `content/CONTENT_PRODUCTION.md` for content quality, exclusions and editorial sign-off policy.
