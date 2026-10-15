"""Retrieve whole-library similarity candidates for individual editorial adjudication.
Requires NumPy and scikit-learn. Retrieval scores do not establish originality.
"""
import json,sys,pathlib,hashlib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.preprocessing import normalize
from sklearn.metrics.pairwise import cosine_similarity
root=pathlib.Path(__file__).resolve().parents[1]
source=pathlib.Path(sys.argv[1]); batch=json.loads(source.read_text())
manifest_path=root/'public/library-data/manifest.json'; manifest=json.loads(manifest_path.read_text())
old=[p for f in manifest['publishedFiles'] for p in json.loads((root/'public/library-data'/f).read_text())]
texts=[p['text'] for p in old]+[p['text'] for p in batch['prompts']]
n=len(old)
v=TfidfVectorizer(ngram_range=(1,2),stop_words='english',sublinear_tf=True)
x=v.fit_transform(texts)
lex=cosine_similarity(x[n:],x)
lsa=normalize(TruncatedSVD(n_components=min(128,x.shape[0]-2,x.shape[1]-2),random_state=17).fit_transform(x))
latent=cosine_similarity(lsa[n:],lsa)
rows=[]
for i,p in enumerate(batch['prompts']):
 ids=set(); candidates=[]
 for method,scores in [('tfidf',lex[i]),('lsa',latent[i])]:
  scores=scores.copy();scores[n+i]=-1
  for j in np.argsort(scores)[-3:][::-1]:
   j=int(j)
   if j in ids:continue
   ids.add(j)
   q=old[j] if j<n else batch['prompts'][j-n]
   candidates.append({'id':q.get('id','incoming-'+str(j-n+1)),'text':q['text'],'method':method,'score':round(float(scores[j]),4)})
 rows.append({'row':i+1,'text':p['text'],'textSha256':hashlib.sha256(p['text'].encode()).hexdigest(),'candidates':candidates})
report={'input':str(source),'baselineManifestSha256':hashlib.sha256(manifest_path.read_bytes()).hexdigest(),'existingRecords':n,'incomingRecords':len(batch['prompts']),'methods':['whole-library exact normalisation','word unigram/bigram TF-IDF retrieval','128-dimensional LSA retrieval'],'limitation':'Latent semantic analysis is candidate retrieval, not a neural embedding uniqueness guarantee. Individual editorial judgement remains required.','rows':rows}
out=root/'content/reviews'/(source.stem+'-candidates.json');out.parent.mkdir(exist_ok=True);out.write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'report':str(out),'flags':[{'row':r['row'],'text':r['text'],'candidates':[c for c in r['candidates'] if (c['method']=='tfidf' and c['score']>=.40) or (c['method']=='lsa' and c['score']>=.85)]} for r in rows if any((c['method']=='tfidf' and c['score']>=.40) or (c['method']=='lsa' and c['score']>=.85) for c in r['candidates'])]},indent=2))
