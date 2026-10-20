# Batch 3: Culture, Personal Experiences, Future & Ambitions

5,400 everyday starters, 1,800 per topic, 100 in each of the 54 topic × mood × audience cells, following the Batch 1 model (6 moods × Someone new, Friends, Partner).

## Review status

- **Author self-review by Claude (Anthropic).** Every starter was individually written, re-read against its cell, screened for similarity and stem repetition, and rewritten where needed.
- **Not human review. Not independent AI review.** `content/batch3-editorial-review.json` records `humanReviewed: false`, `independentReviewer: null` and `independentReview: "pending"`. Batch 1 had an independent AI reviewer for every row; Batch 3 does not yet.

## Pipeline

1. Source cells: `<topic>/<mood>-<audience>.txt`, one starter per line with a format code (`Q` Question, `S` Scenario, `H` Hot take, `C` Quick choice, `T` Story starter).
2. `node scripts/check-batch-cells.mjs content/batch3-direct`: counts, codes, length, em dashes, exact duplicates.
3. `python3 scripts/audit-batch3-similarity.py --json content/batch3-audit.json`: same TF-IDF method and 0.46 threshold as Batch 1, run over Batch 3 together with released Batch 1.
4. Same-premise candidates were rewritten. Each rewrite is logged, with the exact old text and a reason, in `revisions/NN-*.json` (applied in numeric order by `scripts/apply-batch3-revisions.mjs`). All 351 logged revisions are carried into the per-row evidence.
5. Every remaining candidate was read and judged distinct: `similarity-adjudication.json`.
6. `node scripts/assemble-batch3.mjs` writes `content/batch3.json`, `content/batch3-editorial-review.json` and `content/batch3-qa.json`, refusing stale audits, unresolved candidates or revision logs that don't match the text.
7. `npm run build` runs `scripts/batch3-release.mjs`, which emits `public/batch3-data.js` only if every gate passes.

## Configuration discrepancies flagged for the product owner

- `public/library-data/manifest.json` marks Flirty × Friends ineligible for these three topics. Batch 1, the deployed model, publishes 100 starters in every Flirty cell (including Friendships, which the manifest excludes entirely), treating Flirty × Friends as talking with friends about romance. Batch 3 follows Batch 1.
- The earlier 39,900 target isn't reproducible from the repository. The Batch 1 model gives 32,400 for the 18 visible topics (34,200 if the hidden Pop Culture topic were included). The manifest's old eligibility rules give 29,200 for three audiences, and its active policy states 34,800.
