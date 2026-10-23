# Say More — Conversation Companion

## Content Quality Overhaul — development-preview behaviour

The default Start Something feed now displays **only the 49 newer curated conversation pathways** while the 16,200 older published prompts are available in a separate opt-in legacy collection for further editorial improvement. This is a discovery-layer gate, **not a deletion or a claim that all 49 have independent human approval**. People can explicitly select **Explore earlier library** to browse the older batch catalogue. Previously saved entries and history remain directly accessible, including earlier IDs; the separate 18+ experience is unchanged.

Keep Talking now presents four identifiable ways to take a curated conversation: tell a story, go deeper, consider a different perspective or change direction. Filtered Surprise Me no longer ignores empty filters and reveals unrelated prompts. This prevents the app from silently switching a Family- or Flirty-specific request to a different audience.

Run `npm run content:quality-audit` to inspect 16,200 earlier records for exact duplicates, short entries, missing follow-ups, repeated beginnings and mechanical stems. This emits triage candidates and format distribution by release batch. **A heuristic flag is not a rejection and passing is not a human editorial approval.** No records are automatically altered, deleted or relabelled by the audit. Follow `content/CONVERSATION_EDITORIAL_STANDARD.md` for individual editorial decisions before allowing more content into the default discovery library.

---
## Conversation-first development preview

This release adds a quality-first experience for people who want to start conversations, sustain them naturally and play open-ended games without rounds or scores. Merge to production is permitted once release checks pass.

- **Start Something:** Six broad themes, five optional vibes, six relationship contexts (plus an unfiltered default) and Text/Call/In person. The 18 older conversation topics remain internal searchable metadata, rather than 18 top-level category choices.
- **Keep Talking:** 49 curated pilot starters (12 initial + 37 additional) with **four distinct editorial follow-up directions per starter**; the 16,200 previously released batch starters remain intact and can still appear after the pilot content.
- **Play Something:** 106 curated cards (10 initial + 96 additional) across six casual game types: Would You Rather, Hot Takes, Never Have I Ever, What Would You Do?, This or That and Story Chain. The existing large Truth or Dare library remains separate and untouched.
- **Natural controls:** Games do not impose numbered rounds, scoring, winner flows or restarts. Select another card or change games whenever you like. Some new cards are written for a particular audience or for texting vs calling.
- **Assets and validation:** `public/conversation-experiences.js` and `public/conversation-expansion.js` are cached offline. New test coverage checks the content expansion, audience suitability, uniqueness and game flows. See `content/CONVERSATION_EDITORIAL_STANDARD.md`.

The experience contains AI-assisted text and is **not claimed to be independently human-reviewed**. Release criteria are product-owner approval, AI/editorial quality checks, technical CI and browser QA; physical device checks are recommended follow-up validation, not a mandatory external approval step.

---

## Current release: Batch 1

The active everyday library contains 5,400 directly authored conversation starters: Relationships, Friendships and Life each have 1,800. Each topic has three audiences and six moods, with exactly 100 entries in every combination. The interface displays Flirt while retaining the Flirty identifier.

`content/batch1.json` is the active source. Individual author and independent ChatGPT AI review evidence lives in `content/batch1-editorial-review.json`; `humanReviewed:false` distinguishes AI review. The content QA report records the complete allocation, exact uniqueness checks and semantic-similarity adjudications. `npm run build` refuses incomplete content, missing reviews or a stale QA fingerprint before producing the bundled asset.

Everyday browsing uses only this approved source. Earlier collections remain available solely to resolve saved/history IDs. Adults-only conversations, Truth or Dare, Iconsax and optional user-requested AI remain separate. The PWA caches the complete batch and preserves the refresh notice.

Validation: `npm test`, `npm run build`, and the mobile/desktop checks in `scripts/batch1-browser-check.mjs`. The material below documents historical catalogue policies and does not activate those collections.


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
