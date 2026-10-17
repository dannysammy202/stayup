// One-shot editorial production job. Never deploys an application or logs credentials.
import fs from 'node:fs';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
const key=process.env.GEMINI_API_KEY;
if(!key)throw Error('Generation credential unavailable in this build environment');
const model='gemini-3.6-flash';
const topics=['Relationships','Friendships','Life'], moods=['Chill','Playful','Curious','Deep','Flirty','Bold'], audiences=['Someone new','Friends','Partner'];
const rules=`Write original, concise, spoken-English conversation starters for Say More. Everyday library, no explicit sexual content. No therapy exercises, questionnaires, generic advice, robotic filler or artificial phrasing. Mix questions, stories, scenarios, opinions and quick choices. Every prompt needs a concrete, distinct conversational idea. Never produce cosmetic variations or change only the setting. Someone new means no assumed relationship or attraction, no invasive disclosures. Friends means established platonic friends; Flirty means playful conversation ABOUT crushes, charm and dating, never presume attraction between friends. Partner means an established romantic couple. Relationships concerns romantic connection and interpersonal dynamics. Friendships concerns platonic friendship, social circles and friendships within a couple's life. Life concerns everyday living, choices, experiences and outlook. Chill is light and relaxed; Playful is humorous; Curious explores how or why; Deep is reflective without demanding trauma; Flirty explores respectful romantic charm where appropriate; Bold is direct or debatable without coercion. Return only JSON.`;
async function ask(instruction){
 for(let attempt=0;attempt<5;attempt++){
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),180000);
  try{
   const res=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':key},body:JSON.stringify({contents:[{parts:[{text:rules+'\n'+instruction}]}],generationConfig:{responseMimeType:'application/json',temperature:0.85,maxOutputTokens:22000}}),signal:controller.signal});
   if(!res.ok){const status=res.status;const failure=await res.json().catch(()=>({}));if(status===429){const details=(failure.error?.details||[]).map(d=>({type:d['@type'],retryDelay:d.retryDelay,violations:d.violations?.map(v=>({quotaMetric:v.quotaMetric,quotaId:v.quotaId,quotaValue:v.quotaValue}))}));console.log('PROVIDER_QUOTA '+JSON.stringify(details));if(JSON.stringify(details).toLowerCase().includes('perday'))throw Error('Daily provider quota exhausted');}if(status===401||status===403)throw Error('Provider access unavailable '+status);throw Error('Provider HTTP '+status);}
   const json=await res.json();const raw=json.candidates?.[0]?.content?.parts?.filter(p=>!p.thought).map(p=>p.text||'').join('');return JSON.parse(raw);
  }catch(e){if(attempt===4||String(e.message).includes('access unavailable')||String(e.message).includes('Daily provider quota'))throw e;await new Promise(r=>setTimeout(r,Math.min(120000,65000*2**attempt)));}finally{clearTimeout(timer)}
 }
}
const normal=s=>s.toLowerCase().normalize('NFKC').replace(/[^a-z0-9]+/g,' ').trim();
const output=[], reviews=[],used=new Set();
const cells=topics.flatMap(topic=>moods.flatMap(mood=>audiences.map(audience=>({topic,mood,audience}))));
let nextCell=0;
async function worker(){
 while(nextCell<cells.length){
  const {topic,mood,audience}=cells[nextCell++];
   let accepted=[];const previous=output.map(p=>p.text);
   for(let round=0;round<5&&accepted.length<100;round++){
    const n=100-accepted.length;
    const draft=await ask(`Create ${n+10} starters for topic=${topic}, mood=${mood}, audience=${audience}. Vary syntax and content. Avoid ALL ideas already covered in these existing starters, even if you would word them differently: ${JSON.stringify([...previous,...accepted.map(p=>p.text)])}. Return {"prompts":[{"text":"18-220 characters","format":"Question|Scenario|Story starter|Hot take|Quick choice|Random observation","angle":"short unique conversational premise"}]}. A statement must invite a response. Keep the assigned mood visible in the premise. Do not assume marriage, children, wealth or a shared home for Partner.`);
    const candidates=(draft.prompts||[]).filter(p=>p&&typeof p.text==='string'&&p.text.length>=18&&p.text.length<=240&&!used.has(normal(p.text)));
    const review=await ask(`Act as a strict independent editor. Review EVERY candidate individually for natural spoken language, correct topic ${topic}, mood ${mood}, audience ${audience}, everyday safety, distinct premise, and likelihood of a real conversation. Reject formulaic, awkward, abstract or repetitive filler. Reject semantic repetitions within candidates or against existing ideas. Do not approve merely because text differs. Existing: ${JSON.stringify([...previous,...accepted.map(p=>p.text)])}. Candidates with zero-based indices: ${JSON.stringify(candidates)}. Return {"reviews":[{"index":0,"accept":true,"reason":"specific editorial assessment, not generic approval","angle":"specific conversational premise"}]}. Include every index once; reject instead of rewriting.`);
    const seen=new Set();
    for(const r of review.reviews||[]){
     if(accepted.length===100)break;
     if(seen.has(r.index))continue;seen.add(r.index);
     const p=candidates[r.index];
     if(!p||r.accept!==true||typeof r.reason!=='string'||r.reason.length<15||used.has(normal(p.text)))continue;
     const id='b1-'+crypto.createHash('sha256').update(topic+'|'+mood+'|'+audience+'|'+p.text).digest('hex').slice(0,20);
     const formats=['Question','Scenario','Story starter','Hot take','Quick choice','Random observation'];
     accepted.push({id,topic,moods:[mood],audiences:[audience],text:p.text.trim(),format:formats.includes(p.format)?p.format:'Question',angles:[],adult:false,source:'batch1-editorial',editorialStatus:'ai_reviewed_candidate'});
     used.add(normal(p.text));reviews.push({id,textHash:crypto.createHash('sha256').update(p.text.trim()).digest('hex'),reviewer:'AI',model,humanReviewed:false,reason:r.reason,angle:r.angle||p.angle});
    }
   }
   if(accepted.length!==100)throw Error(`Incomplete cell ${topic}/${mood}/${audience}: ${accepted.length}`);
   output.push(...accepted);
   const evidence=reviews.filter(r=>accepted.some(p=>p.id===r.id));
   const checkpoint=zlib.gzipSync(Buffer.from(JSON.stringify({prompts:accepted,reviews:evidence}))).toString('base64');
   const cellKey=[topic,mood,audience].join('/');
   for(let i=0;i<checkpoint.length;i+=6000)console.log('EDITORIAL_CELL '+JSON.stringify({cell:cellKey,index:i/6000,total:Math.ceil(checkpoint.length/6000),data:checkpoint.slice(i,i+6000)}));
   console.log('EDITORIAL_PROGRESS '+JSON.stringify({topic,mood,audience,total:output.length}));
 }
}
await Promise.all(Array.from({length:1},()=>worker()));
const result={prompts:output,reviews,model,generatedAt:new Date().toISOString()};
const buf=zlib.gzipSync(Buffer.from(JSON.stringify(result)));const encoded=buf.toString('base64');
console.log('EDITORIAL_EXPORT_BEGIN '+JSON.stringify({count:output.length,sha256:crypto.createHash('sha256').update(buf).digest('hex'),chunks:Math.ceil(encoded.length/6000)}));
for(let i=0;i<encoded.length;i+=6000)console.log('EDITORIAL_EXPORT_CHUNK '+String(i/6000).padStart(4,'0')+' '+encoded.slice(i,i+6000));
console.log('EDITORIAL_EXPORT_END');
// Deliberate hard stop: no deployment, aliases or production files may change.
throw Error('EDITORIAL_JOB_FINISHED_WITHOUT_DEPLOYMENT');
