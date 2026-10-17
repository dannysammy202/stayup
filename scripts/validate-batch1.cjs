/* Say More Batch 1 release gate.
   Run: node scripts/validate-batch1.cjs [path-to-json]
   Only a complete, audience-appropriate 5,400-question set may pass.
*/
const fs=require('node:fs');
const path=require('node:path');
const TOPICS=['Relationships','Friendships','Life'];
const MOODS=['Chill','Playful','Curious','Deep','Flirty','Bold'];
const AUDIENCES=['Someone new','Friends','Partner'];
const TARGET=100;
const filename=process.argv[2]||'content/batch1.json';
if(!fs.existsSync(filename)){console.error('Batch 1 content file not found: '+filename);process.exit(1);}
let prompts;
try{prompts=JSON.parse(fs.readFileSync(filename,'utf8'));}catch(e){console.error('Invalid JSON: '+e.message);process.exit(1);}
if(!Array.isArray(prompts)){console.error('Expected JSON array');process.exit(1);}
const failures=[],cells=new Map(),ids=new Set(),texts=new Set();
const normalise=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
for(const [i,p] of prompts.entries()){
 if(!p||typeof p!=='object'){failures.push('Invalid record '+i);continue;}
 const {id,topic,moods,audiences,text,adult}=p;
 if(!id||ids.has(id))failures.push('Missing/duplicate id at '+i);else ids.add(id);
 if(typeof text!=='string'||text.trim().length<18||text.trim().length>240)failures.push('Invalid question length at '+i);
 const n=normalise(text);if(texts.has(n))failures.push('Duplicate question text at '+i);else texts.add(n);
 if(!TOPICS.includes(topic))failures.push('Wrong topic at '+i);
 if(!Array.isArray(moods)||moods.length!==1||!MOODS.includes(moods[0]))failures.push('Wrong mood at '+i);
 if(!Array.isArray(audiences)||audiences.length!==1||!AUDIENCES.includes(audiences[0]))failures.push('Wrong audience at '+i);
 if(adult!==false)failures.push('Everyday batch must set adult:false at '+i);
 if(TOPICS.includes(topic)&&moods?.length===1&&MOODS.includes(moods[0])&&audiences?.length===1&&AUDIENCES.includes(audiences[0])){
 const key=[topic,moods[0],audiences[0]].join(' | ');cells.set(key,(cells.get(key)||0)+1);
 }
}
for(const topic of TOPICS)for(const mood of MOODS)for(const audience of AUDIENCES){
 const key=[topic,mood,audience].join(' | '),n=cells.get(key)||0;
 if(n!==TARGET)failures.push(key+': '+n+'/'+TARGET);
}
if(prompts.length!==5400)failures.push('Total: '+prompts.length+'/5400');
if(failures.length){console.error('Batch 1 NOT READY. '+failures.length+' validation errors.');console.error(failures.slice(0,110).join('\n'));process.exit(1);}
console.log('Batch 1 STRUCTURE PASS: 5,400 distinct question texts, 100 per topic/mood/audience cell. Editorial review is still required.');
