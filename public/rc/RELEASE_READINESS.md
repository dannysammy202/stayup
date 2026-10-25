# Say More — Nigerian-first release candidate (not production)
The approved mobile-first UI and Nigerian-first content are staged at `/rc/` within the existing `dannysammy202/stayup` codebase.

## Included
- 5,000 draft conversation cards, 500 across each of 10 permanent collections.
- 18 Nigerian-life searchable subtopics, indexing 200 cards each (tags can overlap).
- 2,100 draft game cards: 300 Truth, 300 Dare, 300 each in Would You Rather, Never Have I Ever, Hot Takes, This or That, Story Spark.
- Six game experiences, Truth/Dare separated, Saved/History, Focus and local Iconsax SVGs.
- RC-scoped offline shell at `/rc/sw.js`. Existing production service worker is unchanged.
- RC state is namespaced `saymore-ng-v2-*`; the existing `conversation-companion-proto-v4` state is untouched.

## Blockers to main release
1. **690 verbatim cross-experience game overlaps** remain (300 Truth, 300 Hot Takes, 90 Story Spark). See `overlaps.csv`. These cannot be silently labelled original. Rewrite them with distinct game mechanics and editorial review.
2. All 7,100 cards are **editorial drafts**, not independently signed-off.
3. Legacy saved/history records remain in the classic app under `/`; they are **not migrated** into the RC. Production cutover needs a compatibility route or a safe migration.
4. Account/sync and 18+ gating in the approved prototype are demonstration UI, not tested production services. Verify or explicitly remove before main launch.
5. Validate offline/PWA on actual iOS Safari and Android Chrome; perform accessibility and performance checks.
6. Only after blockers clear should a separate PR replace `public/index.html`, update the production service worker/manifest, and retain the older app if needed for existing data.

## QA
- Local Chromium mobile viewport: onboarding, collections, Focus next/back, Saved, five standalone games, Truth/Dare isolation, no JS exceptions passed.
- App UI is served as a staged route, not yet promoted to root. Production remains unchanged.
