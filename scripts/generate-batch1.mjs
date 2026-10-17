#!/usr/bin/env node
/* Generate the complete Say More Batch 1, with checkpointing and editorial gates.
   GEMINI_API_KEY=... node scripts/generate-batch1.mjs
   Never publish partial output. */
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
const topics=['Relationships','Friendships','Life'];
const moods=['Chill','Playful','Curious','Deep','Flirty','Bold'];
const audiences=['Someone new','Friends','Partner'];
const target=100, chunkSize=20, filename='content/batch1-generated.json';
const key=process.env.GEMINI_API_KEY||process.env.GOOGLE_API_KEY;
if(!key){console.error('Missing GEMINI_API_KEY or GOOGLE_API_KEY; nothing generated.');process.exit(2);}
const model=process.env.GEMINI_MODEL||'gemini-2.5-flash';
let rows=[];try{rows=JSON.parse(await fs.readFile(filename,'utf8'));}catch{}
const norm=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const used=new Set(rows.map(r=>norm(r.text)));
async function persist(){await fs.mkdir('content',{recursive:true});await fs.writeFile(filename,JSON.stringify(rows,null,2)+'\n');}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function generate(topic,mood,audience,existing,n){
 const instructions=`You are an exceptional human conversation editor writing for a real-world conversation companion app.
Write EXACTLY ${n} ORIGINAL, natural conversation starters for:
TOPIC: ${topic}
MOOD: ${mood==='Flirty'?'Flirt':mood}
AUDIENCE: ${audience}
Audience guidance: Someone new = approachable and not presumptively intimate; Friends = warm, shared-experience-friendly; Partner = established romantic relationship, not explicit.
Each question must be substantively different in subject, not a rewording. Mix concrete memories, everyday experiences, genuine curiosity, dilemmas, playful scenarios, unexpected observations and thoughtful opinions as appropriate to mood. No forced 'what if' repetition, no formulaic 'would you rather' sequences, no therapy-speak, no intrusive assumptions, no adult sexual content, no generic icebreakers. Questions should sound like things people really say aloud. Prefer specific detail and varied syntax. Avoid these previously written questions: ${JSON.stringify(existing.slice(-125))}.
Return only JSON object {"questions":["..."]} with exactly ${n} strings, each 18-220 characters.`;
 const url='https://generativelanguage.googleapis.com/v1beta/models/'+encodeURIComponent(model)+':generateContent';
 for(let attempt=0;attempt<6;attempt++){
  try{
   const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),90000);
   let response;try{response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':key},body:JSON.stringify({contents:[{parts:[{text:instructions}]}],generationConfig:{responseMimeType:'application/json',temperature:0.95}}),signal:controller.signal});}finally{clearTimeout(timer);}
   const payload=await response.json();
   if(!response.ok)throw Error('API '+response.status+': '+JSON.stringify(payload).slice(0,350));
   const raw=payload.candidates?.[0]?.content?.parts?.map(x=>x.text||'').join('')||'';
   const parsed=JSON.parse(raw);if(!Array.isArray(parsed.questions))throw Error('Response missing questions');
   return parsed.questions;
  }catch(e){if(attempt===5)throw e;await sleep(Math.min(60000,2500*2**attempt));}
 }
}
for(const topic of topics)for(const mood of moods)for(const audience of audiences){
 const cell=()=>rows.filter(r=>r.topic===topic&&r.moods?.[0]===mood&&r.audiences?.[0]===audience);
 let stalled=0;
 while(cell().length<target){
  const current=cell(),needed=Math.min(chunkSize,target-current.length);
  const candidates=await generate(topic,mood,audience,current.map(r=>r.text),needed+5);
  let accepted=0;
  for(const q of candidates){
   if(accepted>=needed)break;
   if(typeof q!=='string'||q.length<18||q.length>220||!/[?]$/.test(q.trim()))continue;
   const text=q.trim(),normal=norm(text);
   if(used.has(normal))continue;
   used.add(normal);rows.push({id:'b1-'+crypto.randomUUID(),topic,format:'Question',moods:[mood],audiences:[audience],text,angles:[],adult:false,source:'editorial-original',editorialStatus:'generated_pending_editorial_review'});accepted++;
  }
  await persist();console.log(topic,mood,audience,cell().length+'/'+target,'total',rows.length);
  if(!accepted){if(++stalled>=5)throw Error('Stalled generating '+topic+'/'+mood+'/'+audience);}else stalled=0;
 }
}
console.log('Generated all 5400 draft questions. Editorial review and validation required before publication.');
