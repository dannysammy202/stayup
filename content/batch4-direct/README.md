# Batch 4: Random & Hypothetical, Faith & Spirituality, Music

Source cells: `<topic>/<mood>-<audience>.txt`, one starter per line, prefixed Q (Question), S (Scenario), H (Hot take), C (Quick choice) or T (Story starter).

- 51 live cells x 100 = 5,100 starters.
- Held: Faith & Spirituality x Flirty (3 cells, 300 starters) pending an owner decision. The assembler refuses to run if a held cell file exists.
- Revisions: `revisions/NN-*.json`, applied in numeric order (337 logged rewrites). Line removals before release: `removals.json`.
- Similarity: TF-IDF cosine >= 0.46 against Batches 1, 3 and 4; 971 candidates, every one read and either rewritten or adjudicated distinct in `similarity-adjudication.json`.

Rebuild: `node scripts/assemble-batch4.mjs && npm run build && npm test`.
Browser check: `PORT=4189 npm start`, then `node scripts/batch4-browser-check.mjs`.

Review status: author self-review by Claude Opus 5.5. Not human reviewed; independent review pending. Automated checks are not editorial approval.
