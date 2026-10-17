import fs from 'node:fs';
import path from 'node:path';
const TOPICS=['Relationships','Friendships','Life','Childhood','Family','Money','Culture','Personal Experiences','Future & Ambitions','Random & Hypothetical','Faith & Spirituality','Music','Entertainment','Work & Career','School & Education','Dating','Pop Culture','Would You Rather','Controversial Opinions'];
const MOODS=['Chill','Playful','Curious','Deep','Flirty','Bold'];
const AUDIENCES=['Anyone','Someone new','Friends','Crush / Talking stage','Partner','Family','Group'];
const QUOTA=50,EXPECTED=TOPICS.length*MOODS.length*AUDIENCES.length*QUOTA;
const file=process.argv[2]||'content/fresh-library.json';
const output=process.argv[3]||'public/fresh-library.js';
function fail(message){console.error('Library rejected: '+message);process.exitCode=1;}
function normalise(s){return s.toLowerCase().normalize('NFKC').replace(/[^a-z0-9]+/g,' ').trim();}
if(!fs.existsSync(file)){fail('Missing input '+file+'. No existing published questions will be overwritten.');}
else{
 try{
  const data=JSON.parse(fs.readFileSync(file,'utf8'));
  if(!Array.isArray(data))throw Error('Input must be a JSON array');
  if(data.length!==EXPECTED)throw Error('Expected '+EXPECTED+' entries, got '+data.length);
  const counts=new Map(),texts=new Set(),ids=new Set(),errors=[];
  for(const [index,p] of data.entries()){
   const key=[p.topic,p.mood,p.audience].join(' / ');
   if(!TOPICS.includes(p.topic)||!MOODS.includes(p.mood)||!AUDIENCES.includes(p.audience))errors.push('Invalid category at '+index);
   counts.set(key,(counts.get(key)||0)+1);
   if(typeof p.text!=='string'||p.text.trim().length<18||p.text.trim().length>240)errors.push('Invalid question length at '+index);
   if(typeof p.text==='string'){
    const t=normalise(p.text);
    if(texts.has(t))errors.push('Duplicate question: '+p.text);
    texts.add(t);
    if(/\\b(?:placeholder|lorem ipsum|insert question|template question|question number)\\b/i.test(p.text))errors.push('Placeholder at '+index);
   }
   if(typeof p.id!=='string'||!p.id.trim()||ids.has(p.id))errors.push('Missing/duplicate ID at '+index);
   ids.add(p.id);
   if(!Array.isArray(p.angles)||!p.angles.length||typeof p.angles[0]!=='string'||p.angles[0].trim().length<12)errors.push('Missing meaningful follow-up at '+index);
  }
  for(const topic of TOPICS)for(const mood of MOODS)for(const audience of AUDIENCES){
   const key=[topic,mood,audience].join(' / ');
   if(counts.get(key)!==QUOTA)errors.push(key+' has '+(counts.get(key)||0)+' instead of '+QUOTA);
  }
  if(errors.length)throw Error(errors.slice(0,30).join('\\n')+(errors.length>30?'\\n...and '+(errors.length-30)+' more errors':''));
  const result=data.map(p=>({id:p.id,topic:p.topic,format:p.format||'Question',moods:[p.mood],audiences:[p.audience],text:p.text.trim(),angles:p.angles,adult:false,source:'fresh-library',editorialStatus:'approved'}));
  fs.mkdirSync(path.dirname(output),{recursive:true});
  fs.writeFileSync(output,'window.SayMoreFreshLibrary='+JSON.stringify(result)+';\\n');
  console.log('Validated '+EXPECTED+' unique questions across '+counts.size+' combinations. Output: '+output);
 }catch(e){fail(e.message);}
}
