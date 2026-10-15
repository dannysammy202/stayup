import json, pathlib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
root=pathlib.Path(__file__).resolve().parents[1]
m=json.loads((root/'public/library-data/manifest.json').read_text())
rows=[r for f in m['publishedFiles'] for r in json.loads((root/'public/library-data'/f).read_text())]
x=TfidfVectorizer(ngram_range=(1,2),stop_words='english',sublinear_tf=True).fit_transform([r['text'] for r in rows])
pairs=[]
for start in range(0,len(rows),200):
 scores=cosine_similarity(x[start:start+200],x,dense_output=False).tocoo()
 for i,j,v in zip(scores.row,scores.col,scores.data):
  a=start+int(i); b=int(j)
  if b>a and v>=.72:
   pairs.append({'left':rows[a]['id'],'right':rows[b]['id'],'score':round(float(v),4),'leftText':rows[a]['text'],'rightText':rows[b]['text'],'leftCombination':[rows[a]['topic'],*rows[a]['moods'],*rows[a]['audiences']],'rightCombination':[rows[b]['topic'],*rows[b]['moods'],*rows[b]['audiences']],'status':'requires_editorial_adjudication'})
pairs.sort(key=lambda p:-p['score'])
report={'method':'Global word unigram and bigram TF-IDF cosine similarity, English stop words, sublinear TF','threshold':.72,'recordsChecked':len(rows),'candidatePairs':len(pairs),'semanticEmbeddingReview':'not_run','limitation':'Lexical screening identifies candidates, not all semantic duplicates. It neither approves nor rejects records automatically.','pairs':pairs}
(root/'content/production').mkdir(exist_ok=True)
(root/'content/production/similarity-candidates.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'pairs':len(pairs),'top':pairs[:12]},indent=2))
