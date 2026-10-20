// Assemble Batch 4 from its authored source cells into content/batch4.json, plus editorial evidence and QA.
// Source: content/batch4-direct/<topic>/<mood>-<audience>.txt, one starter per line with a format code.
// Faith & Spirituality x Flirty cells are held and must not exist.
// Prerequisite: python3 scripts/audit-batch-similarity.py content/batch4-direct --prior content/batch1.json,content/batch3.json --json content/batch4-audit.json
// Every similarity candidate in that audit must have a decision in content/batch4-direct/similarity-adjudication.json.
import fs from 'node:fs';
import {TOPICS,TOPIC_CODES,MOODS,AUDIENCES,SOURCE,TOTAL,HELD,isHeld,validateBatch4,hash} from './batch4-release.mjs';
const DIR='content/batch4-direct/';
const TOPIC_DIRS={'Random & Hypothetical':'random-hypothetical','Faith & Spirituality':'faith-spirituality','Music':'music'};
const FORMATS={Q:'Question',S:'Scenario',H:'Hot take',C:'Quick choice',T:'Story starter'};
const AUTHOR='Claude Opus 5.5 (Anthropic), author';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const slug=s=>s.toLowerCase().replace(/[^a-z]+/g,'-');

// Revision logs: every logged replacement must be what now sits at its line, unless a later pass replaced it again.
const revisionFiles=fs.readdirSync(DIR+'revisions').filter(f=>f.endsWith('.json')).sort();
const revisionsByRef=new Map();let revisionCount=0;
for(const f of revisionFiles){for(const r of read(DIR+'revisions/'+f).revisions){revisionCount++;(revisionsByRef.get(r.ref)||revisionsByRef.set(r.ref,[]).get(r.ref)).push({pass:f.replace(/\.json$/,''),...r});}}

const rows=[],evidence=[];
for(const topic of TOPICS){
 let n=0;
 for(const mood of MOODS)for(const audience of AUDIENCES){
  const cell=TOPIC_DIRS[topic]+'/'+mood.toLowerCase()+'-'+slug(audience);
  if(isHeld(topic,mood)){if(fs.existsSync(DIR+cell+'.txt'))throw Error('Held cell must not be written: '+cell);continue;}
  const lines=fs.readFileSync(DIR+cell+'.txt','utf8').split('\n').filter(l=>l.trim());
  if(lines.length!==100)throw Error(cell+' has '+lines.length+' lines');
  lines.forEach((line,i)=>{
   const format=FORMATS[line[0]];if(!format||line[1]!==' ')throw Error('Bad format code '+cell+':'+(i+1));
   const text=line.slice(2).trim(),ref=cell+':'+(i+1),id='b4-'+TOPIC_CODES[topic]+'-'+String(++n).padStart(4,'0');
   const revs=revisionsByRef.get(ref)||[];
   if(revs.length&&revs.at(-1).new.slice(2).trim()!==text)throw Error('Revision log does not match current text at '+ref);
   rows.push({id,topic,format,moods:[mood],audiences:[audience],text,angles:[],adult:false,source:SOURCE,editorialStatus:'approved'});
   evidence.push({id,sourceRef:ref,textHash:hash(text),decision:'approve',authorReviewer:AUTHOR,
    authorReview:'Individually written for this topic, mood and audience, then re-read against its cell, the batch similarity screen and the stem-repetition check.',
    revisions:revs.map(r=>({pass:r.pass,previousText:r.old,reason:r.reason})),
    independentReviewer:null,independentReview:'pending',humanReviewed:false});
  });
 }
}
const prior=['content/batch1.json','content/batch3.json'].flatMap(f=>read(f).map(p=>p.text));
const summary=validateBatch4(rows,{approved:true,priorTexts:prior});

// Similarity: the audit must reflect exactly this content, and every candidate must be adjudicated.
const audit=read('content/batch4-audit.json');
if(audit.batchRows!==TOTAL)throw Error('Similarity audit is stale or incomplete');
const textAtRef=new Map(evidence.map((e,i)=>[e.sourceRef,rows[i].text]));
const adjudication=read(DIR+'similarity-adjudication.json');
const decided=new Map(adjudication.decisions.map(d=>[d.textHashA+'|'+d.textHashB,d]));
const decisions=[];
for(const c of audit.candidates){
 if(textAtRef.has(c.a)&&textAtRef.get(c.a)!==c.textA)throw Error('Similarity audit is stale at '+c.a);
 const d=decided.get(hash(c.textA)+'|'+hash(c.textB));
 if(!d||d.decision!=='distinct')throw Error('Unresolved similarity candidate '+c.a+' / '+c.b);
 decisions.push({a:c.a,b:c.b,score:c.score,crossBatch:c.crossBatch,decision:d.decision,reason:d.reason,reviewer:d.reviewer});
}
fs.writeFileSync('content/batch4.json',JSON.stringify(rows,null,2)+'\n');
fs.writeFileSync('content/batch4-editorial-review.json',JSON.stringify({status:'passed',
 reviewType:'Individual author self-review by Claude (Anthropic). Not human review, and not independent AI review.',
 independentReview:'pending',heldCells:[...HELD],humanReviewed:false,rows:evidence},null,2)+'\n');
const formats=Object.fromEntries(Object.values(FORMATS).map(f=>[f,rows.filter(r=>r.format===f).length]));
const removals=fs.existsSync(DIR+'removals.json')?read(DIR+'removals.json').removals:[];
fs.writeFileSync('content/batch4-qa.json',JSON.stringify({status:'passed',scope:'Batch 4 content release gates',heldCells:[...HELD],heldReason:'Flirty is excluded for Faith & Spirituality in the manifest eligibility rules; held pending the product owner decision.',removedBeforeRelease:removals.length,...summary,formats,
 contentSha256:hash(JSON.stringify(rows)),duplicateIds:0,duplicateQuestions:0,repeatsOfBatch1:0,repeatsOfBatch3:0,placeholders:0,emDashes:0,unreviewed:0,
 revisions:{logged:revisionCount,passes:revisionFiles.map(f=>f.replace(/\.json$/,''))},
 stemRule:'No four-word opening stem more than eight times in one cell, except the "Tell me about" story-starter frame.',
 similarity:{method:'Word/bigram TF-IDF nearest-neighbour retrieval over Batch 4 plus Batches 1 and 3 (same method and threshold as Batch 1), every candidate read and adjudicated; same-premise pairs were rewritten and logged under content/batch4-direct/revisions/',
  threshold:audit.threshold,candidates:decisions.length,unresolved:0,decisions},
 reviewerType:'Claude AI author self-review',independentReview:'pending',humanReviewed:false},null,2)+'\n');
console.log(JSON.stringify({total:summary.total,topics:summary.topics,cells:Object.keys(summary.cells).length,formats,revisions:revisionCount,similarityCandidates:decisions.length,unresolved:0}));
