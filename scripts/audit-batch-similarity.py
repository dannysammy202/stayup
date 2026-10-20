"""Batch lexical similarity screen (generalised from the Batch 3 audit).
Same method and threshold as Batch 1 (word/bigram TF-IDF, cosine >= 0.46), run over
Batch 3 source cells together with the released Batch 1 catalogue so cross-batch reuse is caught.
Usage: python3 scripts/audit-batch-similarity.py <source_dir> --prior content/batch1.json[,content/batch3.json] [--json out.json]
Lexical screening flags candidates only. It does not prove semantic originality.
"""
import json, sys, re
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors

argv = sys.argv[1:]
out = None
prior = ['content/batch1.json']
if '--prior' in argv:
    i = argv.index('--prior')
    prior = argv[i + 1].split(',')
    argv = argv[:i] + argv[i + 2:]
if '--json' in argv:
    i = argv.index('--json')
    out = argv[i + 1]
    argv = argv[:i] + argv[i + 2:]
src = Path(argv[0])
THRESHOLD = 0.46

rows = []
for d in sorted(p for p in src.iterdir() if p.is_dir()):
    for f in sorted(d.glob('*.txt')):
        for i, line in enumerate(l for l in f.read_text().splitlines() if l.strip()):
            rows.append({'ref': f'{d.name}/{f.stem}:{i + 1}', 'text': line[2:].strip(), 'batch': 0})
for pf in prior:
    for b in json.loads(Path(pf).read_text()):
        rows.append({'ref': b['id'], 'text': b['text'], 'batch': 1})

vec = TfidfVectorizer(strip_accents='unicode', stop_words='english', ngram_range=(1, 2), sublinear_tf=True)
x = vec.fit_transform([r['text'] for r in rows])
nn = NearestNeighbors(n_neighbors=8, metric='cosine', algorithm='brute').fit(x)
dist, idx = nn.kneighbors(x)
pairs, seen = [], set()
for i, (dd, jj) in enumerate(zip(dist, idx)):
    if rows[i]['batch'] != 0:
        continue
    for d, j in zip(dd, jj):
        if i == j:
            continue
        key = tuple(sorted((i, j)))
        if key in seen or 1 - d < THRESHOLD:
            continue
        seen.add(key)
        pairs.append({'a': rows[i]['ref'], 'b': rows[j]['ref'], 'score': round(1 - float(d), 4),
                      'textA': rows[i]['text'], 'textB': rows[j]['text'], 'crossBatch': rows[j]['batch'] != 0})
pairs.sort(key=lambda p: -p['score'])
if out:
    Path(out).write_text(json.dumps({'threshold': THRESHOLD, 'batchRows': sum(r['batch'] == 0 for r in rows), 'prior': prior,
                                     'candidates': pairs}, ensure_ascii=False, indent=2) + '\n')
for p in pairs:
    print(f"{p['score']:.3f} {'X' if p['crossBatch'] else ' '} {p['a']} | {p['textA']}\n          {p['b']} | {p['textB']}")
print('candidates', len(pairs), 'cross-batch', sum(p['crossBatch'] for p in pairs))
