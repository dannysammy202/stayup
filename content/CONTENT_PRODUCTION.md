# Say More — editorial production policy

## Initial coverage

- 19 topics × 6 moods × 7 audiences = 798 theoretical combinations.
- Preserve 102 unsuitable exclusions and zero entries in their slots.
- Target 200 individually written, natural starters across each of 696 eligible combinations: **139,200 initial required slots**.
- Do not delete nine previously completed 500-entry combinations. All 4,500 existing starters remain live and 2,700 historic extras remain available.
- At 4,500 total starters the initial coverage is 1,800/139,200, leaving 137,400 required slots. Meeting the remaining 687 combination goals yields 141,900 actual starters, rather than 139,200.
- Additional content above 200 for any combination is a later, explicit expansion. Increase its target deliberately before publishing more. Existing 500-entry collections carry `legacyExpanded: true` to preserve historic overages.
- Adults-only content remains separate and outside the general quota. Do not change approved UI, Iconsax Linear, local curated feed, or optional user-requested Gemini.

## Read source of truth on every run

Read `public/library-data/manifest.json`, not earlier conversation counts. Its fields mean:
- `publishedCount`: all available starter records.
- `targetCount`: sum of current eligible combination goals, initially 139,200.
- `coverageCount`: sum of min(published,target) over eligible combinations.
- `remainingToTarget`: sum of max(0,target-published). Initial coverage finishes at zero.
- `legacyExpanded`: historic 500-entry collection preserved above the new target. No additional publication unless its target rises.

Never mark unwritten capacity as published. Maintain stable `SM-` IDs, unique normalised text and matching physical shards. Run `npm run content:validate` against every update.

## Editorial quality

- `approved`: individual human editorial review supported by evidence. The historical reviewed pool contains 100 entries.
- `screened_pending_editorial_review`: individually authored and structurally/lexically screened candidates, still awaiting human approval and semantic-similarity assessment.
- `unwritten`: no record and no published count.
- Diversify questions, hot takes, scenarios, quick choices, story starters and observations. Match topic, mood and audience, avoiding inappropriate romance contexts.
- Reject duplicates, placeholders, cosmetic permutations and inappropriate content. High lexical overlap requires revision. Screening does not prove full semantic originality.
- Never reuse the old 100,000 synthetic draft as if it were approved. No unapproved paid mass generation or secrets in Git.

## Continuous workflow

1. Check main and the live Vercel production commit and manifest. If production lags, deploy and verify main before writing more content.
2. Select the oldest partially filled eligible combination with `published<target`, or begin another appropriate topic for coverage.
3. Write up to 100 varied, natural conversation starters in a JSON batch of `{topic,mood,audience,prompts:[{text,format,relatedThemes}]}`. Never exceed remaining slot capacity.
4. Commit new authored batches under `content/inbox/` on a content branch. The publisher adds built-in JSON shards, source Markdown and updates `publishedCount`, `coverageCount` and `remainingToTarget`.
5. Run `npm run content:validate`, `npm test` and `npm run build`. Fix rejected batches. Only merge checks-passing branches.
6. Deploy the resulting main SHA and verify the deployed production commit and published manifest. Continue in the next hourly execution without asking for 'continue'.
7. Report at verified coverage milestones or genuine non-transient blockers, never each hourly batch. Preserve human-review status separately.

Initial coverage is complete only when all 696 eligible combinations meet at least their 200-entry target, exclusions remain empty, `remainingToTarget===0`, checks pass and Vercel serves the confirmed main commit. The actual physical published count will exceed 139,200 because historic overages remain. Future expansions use newly agreed quotas.

## Renewed publication assignment, 15 October 2026

The user accepted the current 10,100 published starters and instructed autonomous completion to **139,100 total published starters**. This is a physical publication milestone, separate from the original 139,200-slot coverage matrix. Preserve that matrix and its exclusions rather than falsifying its arithmetic. Preserve all nine legacy overages.

Continue topic by topic from the first eligible combination with remaining publication capacity. Existing screened entries remain available and retain their original editorial status. Human approval provenance remains separate and does not block the renewed publication assignment.

For new entries, complete individual AI editorial assessment and whole-library similarity candidate retrieval before publication. Save a per-prompt text hash, distinct conversational angle, quality decisions, reviewer type and retrieval evidence under content/reviews/. The reviewed publisher checks the current catalogue fingerprint, evidence completeness and unchanged copy. Never label an AI review as human review. AI-reviewed entries keep humanReviewed:false, retain the established public editorial status, and carry a separate aiEditorialReview record. No bulk status upgrade is permitted.

Use `node scripts/publish-reviewed-batch.mjs <batch> <individual-review> <retrieval-evidence>`. No batch exceeds 100 new entries. Do not author the next batch until GitHub main matches a READY production deployment and the public manifest and new shard match the release files. The publication checkpoint and human approval checkpoint serve different purposes.
