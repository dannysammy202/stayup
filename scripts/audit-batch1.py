"""Structural and lexical screening. Editorial evidence remains a separate gate."""
import json,sys,re,hashlib,collections
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors
source=Path(sys.argv[1] if len(sys.argv)>1 else 'content/batch1.json')
rows=json.loads(source.read_text()); issues=[]
normal=lambda x:re.sub(r'[^a-z0-9]+',' ',x.lower()).strip()
counts=collections.Counter((p['topic'],p['moods'][0],p['audiences'][0]) for p in rows)
expected={(t,m,a) for t in ['Relationships','Friendships','Life'] for m in ['Chill','Playful','Curious','Deep','Flirty','Bold'] for a in ['Someone new','Friends','Partner']}
if set(counts)!=expected or any(counts[x]!=100 for x in expected):issues.append('Incorrect cell allocations')
if len(rows)!=5400:issues.append('Incorrect total')
if len({p['id'] for p in rows})!=len(rows):issues.append('Duplicate IDs')
if len({normal(p['text']) for p in rows})!=len(rows):issues.append('Duplicate texts')
for p in rows:
 if p['adult'] is not False:issues.append('Adult entry '+p['id'])
 if not 18<=len(p['text'])<=240:issues.append('Length '+p['id'])
 if re.search(r'\b(lorem ipsum|placeholder|insert question|question number)\b',p['text'],re.I):issues.append('Placeholder '+p['id'])
vector=TfidfVectorizer(strip_accents='unicode',stop_words='english',ngram_range=(1,2),sublinear_tf=True)
x=vector.fit_transform([p['text'] for p in rows]);nn=NearestNeighbors(n_neighbors=6,metric='cosine',algorithm='brute',n_jobs=2).fit(x)
dist,idx=nn.kneighbors(x);pairs=[]
for i,(dd,jj) in enumerate(zip(dist,idx)):
 for d,j in zip(dd,jj):
  if i<j and 1-d>=.46:pairs.append({'a':rows[i]['id'],'b':rows[j]['id'],'score':round(1-float(d),4),'textA':rows[i]['text'],'textB':rows[j]['text']})
report={'total':len(rows),'topics':dict(collections.Counter(p['topic'] for p in rows)),'cells':[{'topic':t,'mood':m,'audience':a,'count':n} for (t,m,a),n in counts.items()],'structuralIssues':issues,'similarityCandidates':sorted(pairs,key=lambda z:-z['score']),'note':'Lexical screening flags candidates. It does not prove semantic uniqueness or editorial quality.'}
Path('content/batch1-audit.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'total':len(rows),'issues':issues,'similarityCandidates':len(pairs)}))
if issues:sys.exit(1)
