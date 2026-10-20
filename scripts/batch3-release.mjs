// Say More Batch 3 release gate: Culture, Personal Experiences, Future & Ambitions.
// Mirrors the Batch 1 gate (scripts/batch1-release.mjs) so both batches follow one contract,
// but lives in its own files so Batch 2 work elsewhere is untouched.
import fs from 'node:fs';
import crypto from 'node:crypto';
export const TOPICS=['Culture','Personal Experiences','Future & Ambitions'];
export const TOPIC_CODES={'Culture':'cu','Personal Experiences':'pe','Future & Ambitions':'fa'};
export const MOODS=['Chill','Playful','Curious','Deep','Flirty','Bold'];
export const AUDIENCES=['Someone new','Friends','Partner'];
export const SOURCE='batch3-editorial';
export const PER_CELL=100;
export const TOTAL=TOPICS.length*MOODS.length*AUDIENCES.length*PER_CELL;
export const normalise=s=>s.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
export const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
export function validateBatch3(rows,{approved=false,priorTexts=[]}={}){
 const errors=[],counts={},ids=new Set(),texts=new Set(),prior=new Set(priorTexts.map(normalise));
 if(!Array.isArray(rows))throw Error('Batch must be an array');
 for(const [i,p] of rows.entries()){
  if(!p||typeof p!=='object'){errors.push('Invalid row '+i);continue;}
  if(typeof p.id!=='string'||!/^b3-(cu|pe|fa)-\d{4}$/.test(p.id)||ids.has(p.id))errors.push('Invalid or duplicate ID '+p.id);ids.add(p.id);
  if(typeof p.text!=='string'||p.text.trim().length<18||p.text.length>240)errors.push('Invalid text length '+p.id);
  else{
   const text=normalise(p.text);
   if(texts.has(text))errors.push('Duplicate text '+p.id);texts.add(text);
   if(prior.has(text))errors.push('Repeats an earlier batch '+p.id);
   if(/\b(lorem ipsum|placeholder|insert question|question number)\b/i.test(text))errors.push('Placeholder '+p.id);
   if(/—/.test(p.text))errors.push('Em dash '+p.id);
  }
  if(!TOPICS.includes(p.topic)||p.id?.slice(3,5)!==TOPIC_CODES[p.topic])errors.push('Invalid topic '+p.id);
  if(p.moods?.length!==1||!MOODS.includes(p.moods[0])||p.audiences?.length!==1||!AUDIENCES.includes(p.audiences[0]))errors.push('Invalid assignment '+p.id);
  if(!['Question','Scenario','Hot take','Quick choice','Story starter'].includes(p.format))errors.push('Invalid format '+p.id);
  if(p.adult!==false||p.source!==SOURCE)errors.push('Incorrect everyday source '+p.id);
  if(approved&&p.editorialStatus!=='approved')errors.push('Unapproved row '+p.id);
  const k=[p.topic,p.moods?.[0],p.audiences?.[0]].join('|');counts[k]=(counts[k]||0)+1;
 }
 for(const t of TOPICS)for(const m of MOODS)for(const a of AUDIENCES){const k=[t,m,a].join('|');if(counts[k]!==PER_CELL)errors.push(k+': '+(counts[k]||0)+'/'+PER_CELL);}
 if(rows.length!==TOTAL)errors.push('Total '+rows.length+'/'+TOTAL);
 if(errors.length)throw Error(errors.slice(0,100).join('\n'));
 return {total:rows.length,topics:Object.fromEntries(TOPICS.map(t=>[t,rows.filter(p=>p.topic===t).length])),cells:counts};
}
export function buildBatch3(){
 const rows=JSON.parse(fs.readFileSync('content/batch3.json','utf8'));
 const prior=JSON.parse(fs.readFileSync('content/batch1.json','utf8')).map(p=>p.text);
 const summary=validateBatch3(rows,{approved:true,priorTexts:prior});
 const evidence=JSON.parse(fs.readFileSync('content/batch3-editorial-review.json','utf8'));
 if(evidence.rows?.length!==TOTAL||evidence.status!=='passed'||evidence.humanReviewed!==false)throw Error('Complete Batch 3 editorial evidence required');
 const reviews=new Map(evidence.rows.map(r=>[r.id,r]));
 for(const p of rows){const r=reviews.get(p.id);if(!r||r.textHash!==hash(p.text)||r.decision!=='approve'||!r.authorReviewer||r.humanReviewed!==false)throw Error('Missing or stale review '+p.id);}
 const qa=JSON.parse(fs.readFileSync('content/batch3-qa.json','utf8'));
 if(qa.status!=='passed'||qa.contentSha256!==hash(JSON.stringify(rows))||qa.similarity?.unresolved!==0)throw Error('Complete Batch 3 QA gate required');
 fs.writeFileSync('public/batch3-data.js','window.SayMoreBatch3='+JSON.stringify(rows)+';\n');
 fs.writeFileSync('public/batch3-summary.json',JSON.stringify({...summary,sha256:hash(JSON.stringify(rows)),reviewerType:'Claude AI author self-review',independentReview:evidence.independentReview,humanReviewed:false},null,2)+'\n');
 return summary;
}
if(process.argv[1]&&import.meta.url===new URL(process.argv[1],'file:').href)console.log(buildBatch3());
