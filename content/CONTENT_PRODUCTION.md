# Say More — autonomous editorial production

## Confirmed target

- 19 topics × 6 moods × 7 audiences = 798 possible selections.
- Exclude the **102** unsuitable combinations recorded in `public/library-data/manifest.json`. Do not quietly revise this policy.
- Publish **500 genuinely different, naturally worded starters** per eligible combination, across **696 combinations**, for a target of **348,000**.
- The 18+ library is **separate** and outside this quota.
- All published content must be bundled in the repository and loaded locally by `public/curated-shards.js`. There is no import flow for app users.
- The approved interface and **Iconsax Linear** are frozen. Gemini is an explicit, optional action; the default feed contains only repository content.

## Production state and source of truth

Never use a previous conversation summary as the inventory. Read `public/library-data/manifest.json` **fresh for each run**. It contains every slot's `eligible`, `target`, and `published`, plus shard locations, published totals and editorial statuses. Run `npm run content:validate` to check actual files against the manifest.

For editorial honesty, distinguish:

- **approved:** independently reviewed entry with recorded review evidence (currently only the first 100 legacy-reviewed entries).
- **screened_pending_editorial_review:** original AI-assisted candidate; structural and lexical checks pass, but individual human review and comprehensive meaning-level similarity assessment remain pending.
- **unwritten:** neither approved nor screened; must never be counted as published.

Do not use old 100,000-record prototype drafts to fill quotas indiscriminately. Their previous quality report flagged semantic repetition and inadequate individual review.

## Batch authoring

Work on the oldest partially completed eligible combination first, unless a deliberate topic-diversity decision makes another selection more useful.

1. Author **100 varied conversation starters** for one exact (topic, mood, audience). Each sentence must have a distinct conversational premise rather than superficial word changes. Create naturally flowing questions, hot takes, scenarios, quick choices, story starters and observations.
2. Ensure that every scenario matches the audience and mood. A Chill/Partner starter must sound unlike a Playful/Friends prompt. Never force romance on group, family, underage or otherwise unsuitable contexts.
3. Write the batch as a JSON file with `{topic,mood,audience,prompts:[{text,format,relatedThemes}]}`. Text fields are individually authored; do not generate all 100 with random phrase interpolation.
4. Check for exact duplication, topic-mood-audience mismatch, awkward sentences, social inappropriateness and conceptual rewording. Rework rejected entries.
5. Run `npm run content:validate` on the existing library.
6. Run `npm run content:publish -- content/inbox/BATCH_NAME.json` locally. This appends built-in JSON, the manifest and source Markdown, and reruns corpus validation. **The editor must review any flagged lexical overlaps before publishing.**
7. Run `npm test` and `npm run build`. Commit changes to a content branch, open a PR, check GitHub Actions, merge green changes and ensure the connected Vercel production deployment updates. Verify the published commit. Never report deployment as complete from a GitHub merge alone.
8. Save the next incomplete slot in the manifest automatically. Do not rely on the user saying "continue."

## Quality gates and limits

- Preserve globally unique, stable `SM-000001` to `SM-348000` identifiers and unique **normalised text**.
- The publisher rejects placeholder texts and batches over 100; all accepted entries remain `screened_pending_editorial_review` until real review.
- Evaluate high word overlap and similar underlying stories; automated lexical overlap checking cannot guarantee semantic originality. Clearly state any incomplete review.
- Check a spread of formats across each new combination, not 500 repeated questions or forced scenarios.
- The publication stage must not read, print, copy or commit `GEMINI_API_KEY` or other credentials.
- Never trigger mass Gemini API calls, paid computing or external billing without a clear budget agreement. Optional in-app Gemini remains under the existing server-side controls.
- Every run should publish only a batch it can properly inspect and test. Never manufacture progress by templating the remaining 346,500 items.

## User-facing progress

The user specifically requested uninterrupted continuation rather than typing "continue." Where recurring execution is available, keep producing and publishing approved-to-publish batches automatically. Notify at meaningful milestones (for example 5,000, 10,000, 25,000 or final completion), not on each hourly check. If a real blocker arises, state it instead of claiming success.

**Completion requires the manifest to show `publishedCount: 348000`, 696 fully populated collections, 102 excluded combinations at zero, passing source and app checks, and all files present and deployed.** Content count is distinct from individual human review, which must be reported separately.
