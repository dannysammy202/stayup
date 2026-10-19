import fs from 'node:fs';
import {validateBatch,hash} from './batch1-release.mjs';
const dir='content/batch1-direct/',names=['relationships-a','relationships-b','friendships-a','friendships-b','life-a','life-b'];
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const entries=x=>Array.isArray(x)?x:x.entries||x.rows||[];
const digest=r=>r.textHash||r.textHashSHA256||r.textSha256;
const byId=x=>new Map(entries(x).map(r=>[r.id,r]));
const globalPatches=byId(read(dir+'global-similarity-patches.json'));
const globalPeer=byId(read(dir+'global-similarity-patch-peer-review.json'));
const globalResolved=byId(read(dir+'global-similarity-patch-resolution.json'));
const rows=[],evidence=[];
const formats={question:'Question',scenario:'Scenario',hypothetical:'Scenario',opinion:'Hot take',personal_story:'Story starter','personal-story':'Story starter',choice:'Quick choice','quick-choice':'Quick choice',quick_choice:'Quick choice',Question:'Question'};
for(const name of names){
 const part=read(dir+name+'.json');if(part.length!==900)throw Error(name+' is incomplete');
 const authors=byId(read(dir+name+'-review.json')),peers=byId(read(dir+name+'-peer-review.json'));
 const resolutions=byId(read(dir+name+'-peer-resolution.json'));
 if(authors.size!==900||peers.size!==900)throw Error(name+' lacks full review coverage');
 for(const p of part){
  const textHash=hash(p.text),a=authors.get(p.id),peer=peers.get(p.id),g=globalPatches.get(p.id),gp=globalPeer.get(p.id),gr=globalResolved.get(p.id),resolution=resolutions.get(p.id);
  let authorReviewer=name+' ChatGPT AI',independentReviewer=peer?.reviewer,note=peer?.note||peer?.notes||peer?.issueNotes||'';
  if(gr){
   if(gr.decision!=='approve'||gr.textHash!==textHash)throw Error('Unresolved final replacement '+p.id);
   authorReviewer=gr.authorReviewer;independentReviewer=gr.independentReviewer;note=gr.reason;
  }else if(g){
   if(g.text!==p.text||gp?.decision!=='approve'||digest(gp)!==textHash)throw Error('Unreviewed global replacement '+p.id);
   authorReviewer='root ChatGPT AI';independentReviewer=gp.reviewer;note=gp.reason;
  }else{
   if(peer?.decision!=='approve'||digest(peer)!==textHash)throw Error('Missing/stale independent review '+p.id);
   if(digest(a)!==textHash){
    // The peer wrote these specific replacements; root read and accepted every resolved text.
    if(name!=='friendships-a'||resolution?.appliedText!==p.text||digest(resolution)!==textHash)throw Error('Missing/stale author review '+p.id);
    authorReviewer=resolution.reviewer;independentReviewer='root ChatGPT AI';note=resolution.reason+' Root independently read and accepted the exact replacement.';
   }else if(!['approve','retain','author_review_pass'].includes(a.decision))throw Error('Author did not approve '+p.id);
  }
  if(!authorReviewer||!independentReviewer||authorReviewer===independentReviewer)throw Error('Independent review required '+p.id);
  const format=formats[p.format];if(!format)throw Error('Unknown format '+p.format);
  rows.push({id:p.id,topic:p.topic,format,moods:p.moods,audiences:p.audiences,text:p.text,angles:[],adult:false,source:'batch1-editorial',editorialStatus:'approved'});
  evidence.push({id:p.id,textHash,decision:'approve',authorReviewer,independentReviewer,premise:p.text,reviewNote:note,humanReviewed:false});
 }
}
const summary=validateBatch(rows,{approved:true});
const lexical=read('content/batch1-audit.json');if(lexical.total!==5400||lexical.structuralIssues.length)throw Error('Structural audit incomplete');
const reviewed=read(dir+'global-similarity-review.json');
const finalPairs=[];
for(const pair of lexical.similarityCandidates){
 const r=reviewed.find(r=>r.a===pair.a&&r.b===pair.b&&r.textHashA===hash(pair.textA)&&r.textHashB===hash(pair.textB));
 if(!r||r.decision!=='distinct')throw Error('Unresolved similarity candidate '+pair.a+'/'+pair.b);
 finalPairs.push({...pair,decision:'distinct',reason:r.reason,reviewer:r.reviewer});
}
fs.writeFileSync('content/batch1.json',JSON.stringify(rows,null,2)+'\n');
fs.writeFileSync('content/batch1-editorial-review.json',JSON.stringify({status:'passed',reviewType:'Individual author and independent ChatGPT AI editorial review',humanReviewed:false,rows:evidence},null,2)+'\n');
fs.writeFileSync('content/batch1-qa.json',JSON.stringify({status:'passed',scope:'Complete content release gates',...summary,contentSha256:hash(JSON.stringify(rows)),duplicateIds:0,duplicateQuestions:0,placeholders:0,unreviewed:0,similarity:{method:'Whole-catalogue word/bigram TF-IDF nearest-neighbour retrieval followed by editorial assessment, plus independent full-part reviews',threshold:0.46,candidates:finalPairs.length,unresolved:0,decisions:finalPairs},reviewerType:'ChatGPT AI',humanReviewed:false},null,2)+'\n');
console.log(JSON.stringify({total:summary.total,topics:summary.topics,cells:Object.keys(summary.cells).length,similarityCandidates:finalPairs.length,unresolved:0}));
