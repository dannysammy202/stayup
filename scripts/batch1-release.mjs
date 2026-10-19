import fs from 'node:fs';
import crypto from 'node:crypto';
export const TOPICS=['Relationships','Friendships','Life'];
export const MOODS=['Chill','Playful','Curious','Deep','Flirty','Bold'];
export const AUDIENCES=['Someone new','Friends','Partner'];
export const normalise=s=>s.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
export const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
export function validateBatch(rows,{approved=false}={}){
 const errors=[],counts={},ids=new Set(),texts=new Set();
 if(!Array.isArray(rows))throw Error('Batch must be an array');
 for(const [i,p] of rows.entries()){
  if(!p||typeof p!=='object'){errors.push('Invalid row '+i);continue;}
  if(typeof p.id!=='string'||!/^b1-[a-z]{2}-[\w-]+$/.test(p.id)||ids.has(p.id))errors.push('Invalid or duplicate ID '+p.id);ids.add(p.id);
  if(typeof p.text!=='string'||p.text.trim().length<18||p.text.length>240)errors.push('Invalid text length '+p.id);
  else{const text=normalise(p.text);if(texts.has(text))errors.push('Duplicate text '+p.id);texts.add(text);if(/\b(lorem ipsum|placeholder|insert question|question number)\b/i.test(text))errors.push('Placeholder '+p.id);}
  if(!TOPICS.includes(p.topic)||p.moods?.length!==1||!MOODS.includes(p.moods[0])||p.audiences?.length!==1||!AUDIENCES.includes(p.audiences[0]))errors.push('Invalid assignment '+p.id);
  if(p.adult!==false||p.source!=='batch1-editorial')errors.push('Incorrect everyday source '+p.id);
  if(approved&&p.editorialStatus!=='approved')errors.push('Unapproved row '+p.id);
  const k=[p.topic,p.moods?.[0],p.audiences?.[0]].join('|');counts[k]=(counts[k]||0)+1;
 }
 for(const t of TOPICS)for(const m of MOODS)for(const a of AUDIENCES){const k=[t,m,a].join('|');if(counts[k]!==100)errors.push(k+': '+(counts[k]||0)+'/100');}
 if(rows.length!==5400)errors.push('Total '+rows.length+'/5400');
 if(errors.length)throw Error(errors.slice(0,100).join('\n'));
 return {total:rows.length,topics:Object.fromEntries(TOPICS.map(t=>[t,rows.filter(p=>p.topic===t).length])),cells:counts};
}
export function buildBatch(){
 const rows=JSON.parse(fs.readFileSync('content/batch1.json','utf8'));
 const summary=validateBatch(rows,{approved:true});
 const evidence=JSON.parse(fs.readFileSync('content/batch1-editorial-review.json','utf8'));
 if(evidence.rows?.length!==5400||evidence.status!=='passed')throw Error('Complete editorial evidence required');
 const reviews=new Map(evidence.rows.map(r=>[r.id,r]));
 for(const p of rows){const r=reviews.get(p.id);if(!r||r.textHash!==hash(p.text)||r.decision!=='approve'||!r.authorReviewer||!r.independentReviewer)throw Error('Missing or stale review '+p.id);}
 const qa=JSON.parse(fs.readFileSync('content/batch1-qa.json','utf8'));
 if(qa.status!=='passed'||qa.contentSha256!==hash(JSON.stringify(rows)))throw Error('Complete QA gate required');
 fs.writeFileSync('public/batch1-data.js','window.SayMoreBatch1='+JSON.stringify(rows)+';\n');
 fs.writeFileSync('public/batch1-summary.json',JSON.stringify({...summary,sha256:hash(JSON.stringify(rows)),reviewerType:'ChatGPT AI',humanReviewed:false},null,2)+'\n');
 return summary;
}
if(process.argv[1]&&import.meta.url===new URL(process.argv[1],'file:').href)console.log(buildBatch());
