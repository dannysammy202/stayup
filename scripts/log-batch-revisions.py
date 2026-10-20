"""Build a Batch 3 revision log from (cell, line-or-old-text, new-text, reason) tuples.
The log records the exact old text so apply-batch3-revisions.mjs can verify it before changing anything.
Usage: python3 scripts/log-batch-revisions.py <batch-dir> <pass-name> <tuples.json>
"""
import json, sys
from pathlib import Path
root, name, src = sys.argv[1].rstrip('/'), sys.argv[2], sys.argv[3]
REVIEWER = 'Claude Opus 5.5 (author self-review)'
out = []
for cell, where, new, reason in json.loads(Path(src).read_text()):
    lines = [l for l in Path(f'{root}/{cell}.txt').read_text().splitlines() if l.strip()]
    if isinstance(where, int):
        idx = where - 1
    else:
        hits = [i for i, l in enumerate(lines) if l[2:].strip() == where]
        if len(hits) != 1:
            raise SystemExit(f'{cell}: expected one match for {where!r}, found {len(hits)}')
        idx = hits[0]
    cur = lines[idx]
    if new[1:2] != ' ' or new[0] not in 'QSHCT':
        new = cur[0] + ' ' + new
    out.append({'ref': f'{cell}:{idx + 1}', 'old': cur[2:].strip(), 'new': new, 'reason': reason, 'reviewer': REVIEWER})
Path(f'{root}/revisions/{name}.json').write_text(json.dumps(
    {'pass': name, 'method': 'Similarity candidates and stem repetition read individually; same-premise or formulaic lines rewritten',
     'revisions': out}, ensure_ascii=False, indent=1) + '\n')
print(len(out), 'revisions logged')
