# Say More — Conversation Companion

Say More continues in `dannysammy202/stayup`. Approved responsive Explore, Topics, Focus, Saved, History and Settings screens use Iconsax Linear. The library spans 19 topics, six moods and seven audiences, with optional filters, saved/history support, a separate opt-in adults-only area and user-requested optional Gemini. Curated content, not Gemini, supplies the default feed.

## First-pass target: 200 per eligible combination

Of 798 theoretical topic/mood/audience combinations, 102 remain excluded. The 696 eligible combinations each require **200 original conversation starters** initially, giving **139,200 required slots**. This is a minimum-coverage target, not a limit on how many records may remain from earlier production.

There are **4,500 existing published starters** across nine 500-entry collections. Keep every entry in those collections. The first 100 carry historical human-review status and 4,400 remain screened candidates pending individual review. With 200 slots per combination counted towards initial coverage, **1,800 of 139,200 required slots are covered**, leaving **137,400**. Publishing 200 in each of the other 687 combinations yields **141,900 physical entries** because the previous 2,700 over-target entries remain intact.

Future expansion is deliberate: increase an individual combination's target beyond 200 before publishing further entries into it. Historical 500-entry combinations carry `legacyExpanded: true` and are excluded from additional publication until their targets change. The up-to-date source of truth is `public/library-data/manifest.json`.

The manifest separates `publishedCount` (all real entries), `coverageCount` (up to the current target per combination), `remainingToTarget` (the still-unfilled slots) and `targetCount` (the sum of combination targets). Never calculate unfinished slots by subtracting physical published count from the target.

## Workflow and delivery

The curated catalogue ships as local JSON shards under `public/library-data/`. The client loads a maximum of eight relevant shards at a time, supporting incremental browsing and stable saved/history IDs. No user import or runtime Gemini generation fills the curated catalogue.

Prepare the complete remaining library in staging, topic by topic, without a 100-entry cap or a deployment after each collection. Preserve individual editorial evidence and global uniqueness checks. Run catalogue validation, tests, build and the complete-release readiness gate, then publish one final GitHub/Vercel release and verify production. The user's latest physical publication goal is 139,100. The original coverage matrix remains separately recorded.

Keep screened entries marked `screened_pending_editorial_review` until they receive individual human review. Never bulk reuse the old 100,000-draft source or generate superficial text permutations.

Node 22+: `npm start`, `npm test`, `npm run content:validate`, `npm run build`. Set `GEMINI_API_KEY` server-side for optional AI, and do not include it in the curated pipeline. See `content/CONTENT_PRODUCTION.md`.
