# Say More — Nigerian-first release candidate
**Status: staged for editorial/device review. Do not merge or promote to production.**

The redesigned candidate is at `/rc/` in the existing Say More project. The original app at `/` remains unchanged, with the same classic app also preserved at `/classic/`.

## Integrated
- Ten permanent collections × 500 **draft** cards = 5,000.
- Eighteen searchable Nigerian-life subtopics with 200 indexed cards each (multiple tags are possible).
- Seven game content types × 300 **draft** cards = 2,100, with separate Truth/Dare tabs.
- The approved mobile-first layout, official local Iconsax icons, focus/swipe navigation, Saved and History.
- A scoped RC service worker with offline assets.
- A non-destructive legacy Saved/History compatibility layer. Classic storage is never overwritten, unmatched historical IDs stay in the classic app, and data can be exported. Reset only clears RC preferences.
- No simulated account sign-in and no demo-only 18+ unlock: those features are explicitly unavailable.

## Game editorial-correction audit
The original staging deck contained **690 verbatim repetitions** from regular conversation cards: 300 Truth, 300 Hot Takes and 90 Story Spark.
- `game-overrides.js` rewrote the first **30**.
- `game-overrides-remaining.js` now rewrites the remaining **660**, distributed throughout their game decks.
- **Effective runtime exact overlap is now zero** when both rewrite scripts load, based on normalized text comparison against the 5,000 regular conversation cards.
- Each of the seven game types still contains exactly 300 distinct game cards.
- Original copies remain in `games.js` and the historical `overlaps.csv` ledger for traceability; the browser loads both correction scripts after `games.js`.
- New originals are labelled `rewritten_game_candidate_pending_independent_review` until editorial approval. Zero matching strings is **not** proof that every game is distinct in meaning or feels natural.

## Remaining release gates
1. **Independent editorial approval** of the 7,100 cards, especially the 690 game rewrites. The audit spreadsheet `editorial-game-review.csv` lists previous copied wording and new 660 alternatives. Spot-test the whole catalogue with Nigerian users and reject awkward, repetitive or culturally mismatched ideas.
2. **Actual-device testing** (iOS Safari/PWA and Android Chrome/PWA), including offline launch, responsive layout, focus navigation, save persistence, touch gestures, accessibility and data-export reliability.
3. **Migration dry-run on existing-user devices.** The classic key must remain intact, unmatched older IDs must be recoverable, and reset must never wipe unrelated storage.
4. **Feature decision:** the current RC is local-only, with account sync and 18+ disabled. Either explicitly accept those omissions for first release, or implement authenticated cross-device data sync and real adult age assurance with isolation before advertising those features.
5. **Separate root cutover review** when all gates pass. Do not replace `public/index.html` or production root service-worker rules as part of the content staging PR. Keep `/classic/` for rollback.

## Automated checks
- `tests/nigerian-rc.test.mjs` verifies 5,000 unique conversation cards, 2,100 unique game cards (300 each), 18 subjects, zero effective cross-experience verbatim duplicates and required scripts.
- `tests/nigerian-rc-migration.test.mjs` checks non-destructive saved/history migration, protected legacy storage and scoped reset.
- GitHub CI and Vercel preview readiness must be green on the **latest head commit** before deployment approval.
