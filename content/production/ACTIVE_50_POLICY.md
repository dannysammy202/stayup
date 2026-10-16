# Say More active library policy, 16 October 2026

The user replaced the earlier 200-per-combination production objective with an active cap of 50 original starters for each of the 696 eligible Topic x Mood x Audience combinations.

Active target: 34,800. Preserve all 102 exclusions and keep adults-only content separate. Each eligible combination has exactly 50 visible entries after content production is complete. Because excluded combinations vary by topic, topic totals vary while eligible combination totals remain uniform.

The 12,000-record catalogue is the source archive. Preserve each record, ID, text, review status, original shard, the nine historical 500-entry collections, and the audit trail. Do not delete or relabel surplus content. The active view uses up to 50 records per eligible combination. Existing user-saved archived IDs remain resolvable.

At the initial policy checkpoint, 47 combinations have at least 50 entries. Active: 2,350. Archived: 9,650. Remaining 649 empty eligible combinations need 32,450 new starters for 34,800 active entries. Screened/pending editorial review is not human approval. Select and replace active picks through editorial review if needed, without removing archive copies.

The existing manifest retains its original 200-target physical publication metadata for backward compatibility and provenance. The separately versioned activePolicy and activeIds/activeShards provide the user-facing quota, active counts, archive counts and gap. Do not present the historical 139,200 physical planning figure as the new target. Future content publication must limit each combination to its 50 active slots and regenerate the active index using `node scripts/apply-active-quota.mjs`.

After each release, run validation, tests and build, then verify Vercel READY production alias and matching main SHA. Never report staged content as live. Do not claim all 19 topics complete until every eligible combination has 50 entries.
