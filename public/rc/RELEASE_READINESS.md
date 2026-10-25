# Say More — Nigerian-first release readiness

**Status: STAGING / DO NOT PROMOTE TO MAIN.**

The mobile-first redesigned candidate lives at `/rc/`, with 5,000 conversation drafts and 2,100 game drafts across seven types (300 per type), plus 18 Nigerian-life subtopics. The existing homepage `/` has not been modified.

## Release-safety work completed on PR #110
1. Preserved the original classic app verbatim at `/classic/`. Original storage `conversation-companion-proto-v4` remains the source of truth for old saved/history IDs.
2. Added `/rc/migration.js`: backs up the original local snapshot, merges any exact-ID matches into the new UI once, and reports unmatched old IDs with a link to `/classic/`. Does **not** overwrite/delete the classic key.
3. Added local-data export from Privacy settings. Reset removes only `saymore-ng-v2-*` preferences, retains the legacy backup and migration marker, and never uses `localStorage.clear()`.
4. Removed simulated sign-in/email collection. Explicitly state that account sync **does not exist** yet; saved/history are local-only.
5. Disabled the prototype's 18+ switch and DOB demo. No adult-only catalogue is reachable in this release candidate. Age verification and adult content isolation must be separately implemented before enabling that feature.
6. Added migration regression tests and expanded RC UI/content tests. The RC service worker includes both the migration and editorial correction scripts.
7. Rewrote 30 overlapping game entries into candidate game-specific Nigerian prompts, with independent editorial review **still pending**. Original source data is preserved for audit.

## Outstanding main release blockers
- **660 verbatim game/conversation overlaps remain** (previously 690) in the **effective runtime game catalogue**. Do not bulk mask the repetitions with formulaic word substitutions or count them as independently original. The historical `overlaps.csv` includes the original 690 entries as an audit ledger; 30 are overwritten at runtime by `game-overrides.js`.
- All 7,100 catalogue entries remain **working drafts**, not independently editorially signed off. QA on naturalness, repetition and contextual appropriateness is still required.
- Optional account sync is disabled, not implemented. The agreed cross-device feature should be built and tested with a real authentication/data service before advertised or enabled.
- The 18+ feature is disabled, not production-ready. Real age assurance and adult-content separation require security/privacy review before access.
- Physical iPhone Safari/Android PWA, offline installation, large-library performance, accessibility, and data migration on existing user devices need review.
- Production cutover still requires a dedicated change to `public/index.html`, root PWA, and redirect/rollback testing. The classic route must remain accessible.

## Safe release gates
1. Editorial pass with no verbatim cross-experience reuse beyond deliberate, documented exceptions and no mechanical filler.
2. User approval for shipping an explicitly local-only/no-18+ release, **or** implementation and testing of optional account sync and adult mode.
3. CI green for the candidate head commit and release browser QA including iPhone/Android checks.
4. Migration dry run: old Saved/History remain recoverable, backups export, rollback to `/classic/` works.
5. Only then promote root with a separate reviewed cutover commit. No automatic main merge based only on deployment READY.
