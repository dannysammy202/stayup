import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { inflateRawSync } from 'node:zlib';

const SOURCE='data/saymore-content-100000-draft.zip';
const OUTPUT='dist/library-data';
const TOPICS=new Set(['Relationships','Friendships','Life','Childhood','Family','Money','Culture','Personal Experiences','Future & Ambitions','Random & Hypothetical','Faith & Spirituality','Music','Entertainment','Work & Career','School & Education','Dating','Pop Culture','Would You Rather','Controversial Opinions']);
const MOODS=new Set(['Chill','Playful','Curious','Deep','Flirty','Bold']);
const AUDIENCES=new Set(['Anyone','Someone New','Friends','Crush / Talking Stage','Partner','Family','Group']);
const FORMATS={question:'Question',hot_take:'Hot take',scenario:'Scenario',quick_choice:'Quick choice',casual_observation:'Observation',personal_story:'Story starter'};

function unzipIndex(raw){
 let eocd=-1;
 for(let p=raw.length-22;p>=Math.max(0,raw.length-65557);p--)if(raw.readUInt32LE(p)===0x06054b50){eocd=p;break}
 if(eocd<0)throw new Error('Invalid Say More ZIP: missing central directory');
 const count=raw.readUInt16LE(eocd+10),directory=raw.readUInt32LE(eocd+16);
 let pos=directory;
 for(let i=0;i<count;i++){
  if(raw.readUInt32LE(pos)!==0x02014b50)throw new Error('Invalid ZIP central directory');
  const method=raw.readUInt16LE(pos+10),size=raw.readUInt32LE(pos+20),nameSize=raw.readUInt16LE(pos+28),extra=raw.readUInt16LE(pos+30),comment=raw.readUInt16LE(pos+32),localOffset=raw.readUInt32LE(pos+42);
  const name=raw.toString('utf8',pos+46,pos+46+nameSize);
  pos+=46+nameSize+extra+comment;
  if(!/(^|\/)master_index\.jsonl$/.test(name))continue;
  if(raw.readUInt32LE(localOffset)!==0x04034b50)throw new Error('Invalid ZIP local record');
  const start=localOffset+30+raw.readUInt16LE(localOffset+26)+raw.readUInt16LE(localOffset+28);
  const compressed=raw.subarray(start,start+size);
  if(method===0)return compressed.toString('utf8');
  if(method===8)return inflateRawSync(compressed).toString('utf8');
  throw new Error('Unsupported ZIP compression: '+method);
 }
 throw new Error('ZIP does not contain master_index.jsonl');
}
function record(p){
 if(!p||!/^SM-\d{6}$/.test(p.id)||!TOPICS.has(p.primary_topic)||!MOODS.has(p.mood)||!AUDIENCES.has(p.audience)||!FORMATS[p.format]||p.content_rating!=='general'||!['approved','generated_pending_editorial_review'].includes(p.editorial_status)||typeof p.text!=='string'||!p.text.trim())throw new Error('Invalid record: '+String(p?.id));
 return {id:p.id,topic:p.primary_topic,format:FORMATS[p.format],moods:[p.mood],audiences:[p.audience==='Someone New'?'Someone new':p.audience==='Crush / Talking Stage'?'Crush / Talking stage':p.audience],text:p.text.trim(),angles:[],adult:false,editorialStatus:p.editorial_status,source:'published-library'};
}
export async function buildContent(source=SOURCE,output=OUTPUT){
 try{await stat(source)}catch(error){if(error?.code==='ENOENT'){console.log('Say More library source absent. Existing starter catalogue remains active.');return null}throw error}
 const text=unzipIndex(await readFile(source));
 const approved=[],drafts=[],ids=new Set();
 for(const line of text.split(/\r?\n/)){
  if(!line.trim())continue;
  const p=record(JSON.parse(line));
  if(ids.has(p.id))throw new Error('Duplicate starter ID: '+p.id);
  ids.add(p.id);
  (p.editorialStatus==='approved'?approved:drafts).push(p);
 }
 if(ids.size!==100000||approved.length!==100||drafts.length!==99900)throw new Error('Say More corpus count or editorial status mismatch');
 await mkdir(join(output,'drafts'),{recursive:true});
 await writeFile(join(output,'approved.json'),JSON.stringify(approved));
 const shards=[];
 for(let i=0;i<drafts.length;i+=500){
  const file='drafts/'+String(i/500).padStart(3,'0')+'.json';
  await writeFile(join(output,file),JSON.stringify(drafts.slice(i,i+500)));
  shards.push(file);
 }
 const manifest={version:1,total:ids.size,approved:approved.length,draft:drafts.length,shards};
 await writeFile(join(output,'manifest.json'),JSON.stringify(manifest));
 console.log('Say More library built: 100,000 total, 100 approved, 99,900 drafts.');
 return manifest;
}
