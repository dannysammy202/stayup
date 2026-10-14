import { createHash } from 'node:crypto';

const MODELS={prompts:'gemini-3.6-flash',surprise:'gemini-3.6-flash',angles:'gemini-3.8-flash'};
const TOPICS=['Relationships','Friendships','Life','Childhood','Family','Money','Culture','Personal Experiences','Future & Ambitions','Random & Hypothetical','Faith & Spirituality','Music','Entertainment','Work & Career','School & Education','Dating','Pop Culture','Would You Rather','Controversial Opinions'];
const MOODS=['Chill','Playful','Curious','Deep','Flirty','Bold'];
const AUDIENCES=['Anyone','Someone new','Friends','Crush / Talking stage','Partner','Family','Group'];
const FORMATS=['Question','Hot take','Scenario','Story starter','Quick choice','Random observation'];
const limits=new Map(),cache=new Map(),DAY=86400000;
const LIMIT=Math.max(1,Math.min(30,Number(process.env.AI_DAILY_LIMIT||6)));
const short=v=>typeof v==='string'?v.trim().replace(/\s+/g,' ').slice(0,300):'';
const fail=(message,status=400)=>Object.assign(new Error(message),{status});
const tokens=s=>new Set(s.toLowerCase().replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(w=>w.length>3&&!['what','would','someone','people','think','your','about','with','them','have','ever','when','does','that','which'].includes(w)));
export function similarity(a,b){const x=tokens(a),y=tokens(b);return [...x].filter(w=>y.has(w)).length/Math.max(1,Math.min(x.size,y.size))}
function input(body){
 if(!body||typeof body!=='object'||Array.isArray(body))throw fail('Invalid request');
 if(!MODELS[body.task])throw fail('Unknown AI task');
 if(body.adult)throw fail('AI generation is unavailable in 18+ mode. Curated prompts remain accessible.',403);
 if(body.ageConfirmed!==true)throw fail('You must confirm you are 18 or older before using optional AI features.',403);
 const topic=TOPICS.includes(body.topic)?body.topic:'Any',mood=MOODS.includes(body.mood)?body.mood:'Any';
 const audience=AUDIENCES.includes(body.audience)?body.audience:'Anyone';
 const prompt=short(body.prompt);
 if(body.task==='angles'&&prompt.length<12)throw fail('Select a prompt first');
 return {task:body.task,topic,mood,audience,prompt,recent:Array.isArray(body.recent)?body.recent.slice(0,12).map(short).filter(Boolean):[]};
}
function schema(task){
 if(task==='angles')return {type:'OBJECT',properties:{angles:{type:'ARRAY',minItems:2,maxItems:3,items:{type:'STRING'}}},required:['angles']};
 return {type:'OBJECT',properties:{prompts:{type:'ARRAY',minItems:3,maxItems:3,items:{type:'OBJECT',properties:{text:{type:'STRING'},topic:{type:'STRING'},format:{type:'STRING'},moods:{type:'ARRAY',items:{type:'STRING'}},audiences:{type:'ARRAY',items:{type:'STRING'}},angles:{type:'ARRAY',items:{type:'STRING'}}},required:['text','topic','format','moods','audiences','angles']}}},required:['prompts']};
}
function clean(parsed,x){
 if(x.task==='angles'){
   const angles=[];for(const v of Array.isArray(parsed.angles)?parsed.angles:[]){const s=short(v);if(s.length>=14&&s.length<=220&&similarity(x.prompt,s)<.88&&!angles.some(z=>similarity(z,s)>.72))angles.push(s)}
   if(angles.length<2)throw fail('AI returned too few distinct angles. Please try again.',502);
   return {angles:angles.slice(0,3)};
 }
 const prompts=[];
 for(const row of Array.isArray(parsed.prompts)?parsed.prompts:[]){
   if(!row||typeof row!=='object')continue;
   const text=short(row.text);
   if(text.length<28||text.length>260)continue;
   if([...x.recent,...prompts.map(p=>p.text)].some(v=>similarity(v,text)>.71))continue;
   const topic=TOPICS.includes(row.topic)?row.topic:(x.topic==='Any'?'Life':x.topic);
   if(x.topic!=='Any'&&topic!==x.topic)continue;
   const moods=Array.isArray(row.moods)?row.moods.filter(v=>MOODS.includes(v)):[];
   const audiences=Array.isArray(row.audiences)?row.audiences.filter(v=>AUDIENCES.includes(v)):[];
   const angles=(Array.isArray(row.angles)?row.angles:[]).map(short).filter(v=>v.length>14&&v.length<=220).slice(0,2);
   prompts.push({text,topic,format:FORMATS.includes(row.format)?row.format:'Question',moods:moods.length?moods:(x.mood==='Any'?['Curious']:[x.mood]),audiences:audiences.length?audiences:['Anyone'],angles,adult:false});
 }
 if(prompts.length<2)throw fail('AI returned too few original prompts. Please try again.',502);
 return {prompts:prompts.slice(0,3)};
}
async function generate(x){
 const key=process.env.GEMINI_API_KEY;
 if(!key)throw fail('AI is not configured. Set GEMINI_API_KEY on the server.',503);
 const rules='Write natural, distinct conversation ideas for Say More. No generic icebreakers or interview scripts. Avoid near-duplicates, stereotypes, hate, harassment, coercion, abuse, private information and explicit sexual descriptions. Do not include sexual content involving minors. Make conversation topics relatable internationally, sometimes relevant to Nigerian life without forced slang.';
 const instruction=rules+' Mood: '+x.mood+'. Topic: '+x.topic+'. Audience: '+x.audience+'. Recent prompts to avoid: '+JSON.stringify(x.recent)+'. '+(x.task==='angles'?'Original prompt: '+x.prompt+'. Give three different related follow-up angles, not paraphrases.':'Give three conversation starters varying formats, each with two distinct angles. Use ONLY these topic values: '+TOPICS.join(', ')+'. Use ONLY these formats: '+FORMATS.join(', ')+'.');
 const ctrl=new AbortController();const timeout=setTimeout(()=>ctrl.abort(),19000);
 try{
  const res=await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+MODELS[x.task]+':generateContent',{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':key},signal:ctrl.signal,body:JSON.stringify({contents:[{parts:[{text:instruction}]}],generationConfig:{responseMimeType:'application/json',responseSchema:schema(x.task),maxOutputTokens:x.task==='angles'?850:1900,temperature:.9}})});
  if(!res.ok){if(res.status===429)throw fail('The AI provider is busy. Please try again shortly.',429);if(res.status===401||res.status===403)throw fail('AI provider authentication or access failed.',503);throw fail('The AI provider could not complete this request.',502)}
  const data=await res.json();const output=(data.candidates?.[0]?.content?.parts||[]).map(p=>p.text||'').join('');
  if(!output)throw fail('The AI provider returned no usable content.',502);
  try{return JSON.parse(output)}catch{throw fail('The AI provider returned invalid content.',502)}
 }finally{clearTimeout(timeout)}
}
function visitor(req){return createHash('sha256').update(req.socket?.remoteAddress||'unknown').digest('hex').slice(0,22)}
function json(res,code,data){res.statusCode=code;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.end(JSON.stringify(data))}
export default async function handler(req,res){
 try{
  if(req.method!=='POST')return json(res,405,{error:'Method not allowed'});
  let body=req.body;
  if(body===undefined){const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>10000)throw fail('Request is too large',413);chunks.push(chunk)}try{body=JSON.parse(Buffer.concat(chunks).toString('utf8'))}catch{throw fail('Invalid JSON')}}
  if(typeof body==='string'){try{body=JSON.parse(body)}catch{throw fail('Invalid JSON')}}
  if(JSON.stringify(body).length>10000)throw fail('Request is too large',413);
  const x=input(body),now=Date.now(),id=visitor(req);
  const old=limits.get(id),usage=!old||now-old.since>DAY?{since:now,last:0,used:0}:old;
  limits.set(id,usage);
  if(usage.used>=LIMIT)return json(res,429,{error:'Daily AI limit reached. Curated prompts remain available.'});
  if(usage.last&&now-usage.last<3000)return json(res,429,{error:'Please wait a few seconds between AI requests.'});
  const cacheId=createHash('sha256').update(JSON.stringify(x)).digest('hex'),cached=cache.get(cacheId);
  if(cached&&cached.expires>now)return json(res,200,{...cached.value,source:'cache',remaining:LIMIT-usage.used});
  usage.used++;usage.last=now;
  const result=clean(await generate(x),x);
  cache.set(cacheId,{value:result,expires:now+1800000});
  if(cache.size>300)cache.delete(cache.keys().next().value);
  return json(res,200,{...result,source:'gemini',model:MODELS[x.task],remaining:LIMIT-usage.used});
 }catch(e){const status=e.name==='AbortError'?504:e.status||500;if(status>=500)console.error('[saymore]',status,e.message);return json(res,status,{error:e.name==='AbortError'?'The AI response timed out. Please try again.':status<500||status===502||status===503?e.message:'Unexpected server error'})}
}
