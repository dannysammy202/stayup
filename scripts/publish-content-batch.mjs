/**
 * Publish one authored editorial batch into Say More's built-in files.
 *
 * Run: node scripts/publish-content-batch.mjs content/inbox/your-batch.json
 * Input: { topic, mood, audience, prompts: [{text,format,relatedThemes?}, ...] }
 *
 * This intentionally DOES NOT generate text. It only validates and packages original
 * copy written separately. Review remains pending until actual human sign-off.
 */
import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { validateCuratedLibrary } from './validate-curated-library.mjs';

const FORMAT=new Set(['Question','Hot take','Scenario','Quick choice','Story starter','Observation','Casual observation']);
const normalize=s=>String(s).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const slug=s=>s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const fail=message=>{throw new Error('Say More batch rejected: '+message)};
const stopWords=new Set('this that with from more would what when which your their people someone friend friends some have been they them there before about than after just also something think ever tell into could where while another around really those who even'.split(' '));
const tokens=s=>new Set(normalize(s).split(' ').filter(x=>x.length>=4&&!stopWords.has(x)));
const overlap=(a,b)=>{let common=0;for(const t of a)if(b.has(t))common++;return common/Math.max(1,Math.min(a.size,b.size))};

export function prepareContentBatch(input, manifest, existing){
 if(!input||typeof input!=='object'||Array.isArray(input)||!Array.isArray(input.prompts))
  fail('Input must contain an array of individually written prompts.');
 const cell=manifest.combinations.find(c=>c.topic===input.topic&&c.mood===input.mood&&c.audience===input.audience);
 if(!cell||!cell.eligible)fail('Selected combination is excluded or unknown.');
 if(input.prompts.length<1||input.prompts.length>Math.min(100,500-cell.published))
  fail('Batch must contain 1-100 starters and must not exceed the 500-starter cap.');
 const existingText=new Set(existing.map(p=>normalize(p.text))),existingIds=new Set(existing.map(p=>p.id));
 const localText=new Set(),candidates=[];
 const similar=existing.filter(p=>p.topic===input.topic&&p.moods?.[0]===input.mood&&p.audiences?.[0]===input.audience).map(p=>({id:p.id,tokens:tokens(p.text)}));
 for(let i=0;i<input.prompts.length;i++){
   const row=input.prompts[i],text=row?.text?.trim();
   if(!text||text.length<25||text.length>260||!FORMAT.has(row.format))
    fail('Prompt '+(i+1)+' is empty, too long, too short or has an invalid format.');
   if(/\b(lorem ipsum|sample prompt|placeholder|insert question|question \d+)\b/i.test(text))
    fail('Placeholder detected at row '+(i+1));
   const norm=normalize(text);
   if(existingText.has(norm)||localText.has(norm))fail('Duplicate prompt text at row '+(i+1));
   localText.add(norm);
   const tk=tokens(text);
   for(const earlier of similar){
     if(tk.size>=4&&earlier.tokens.size>=4&&overlap(tk,earlier.tokens)>=0.80)
      candidates.push({row:i+1,similarTo:earlier.id,reason:'High lexical overlap; editorial review required'});
   }
   similar.push({id:'incoming-'+(i+1),tokens:tk});
   const id='SM-'+String(manifest.publishedCount+i+1).padStart(6,'0');
   if(existingIds.has(id))fail('ID would be reused '+id);
 }
 if(candidates.length)fail('High-overlap candidates found: '+JSON.stringify(candidates.slice(0,12)));
 const from=manifest.publishedCount+1,to=from+input.prompts.length-1;
 const filename=[slug(input.topic),slug(input.mood),slug(input.audience),from,to].join('-')+'.json';
 const records=input.prompts.map((row,i)=>({
   id:'SM-'+String(from+i).padStart(6,'0'),
   text:row.text.trim(),topic:input.topic,format:row.format,
   moods:[input.mood],audiences:[input.audience],
   angles:[],adult:false,editorialStatus:'screened_pending_editorial_review',
   source:'published-library',
   relatedThemes:Array.isArray(row.relatedThemes)?row.relatedThemes.filter(s=>typeof s==='string'&&s.trim()).slice(0,4):[],
   reviewMethod:'Individually written editorial candidate; automatic structure and lexical screening passed; human approval and semantic review pending',
   humanReviewed:false
 }));
 return {records,filename,cell,from,to,topic:input.topic,mood:input.mood,audience:input.audience};
}

export function publishContentBatch(file,root='.'){
 const initial=validateCuratedLibrary(root);
 const manifestFile=join(root,'public/library-data/manifest.json');
 const manifest=JSON.parse(readFileSync(manifestFile,'utf8'));
 const input=JSON.parse(readFileSync(file,'utf8'));
 const all=manifest.publishedFiles.flatMap(path=>JSON.parse(readFileSync(join(root,'public/library-data',path),'utf8')));
 const batch=prepareContentBatch(input,manifest,all);
 const output=join(root,'public/library-data',batch.filename);
 if(existsSync(output))fail('A shard already exists at '+output);
 const {topic,mood,audience,records,from,to}=batch;
 const cell=manifest.combinations.find(c=>c.topic===topic&&c.mood===mood&&c.audience===audience);
 const collection=manifest.publishedCollections.find(c=>c.topic===topic&&c.mood===mood&&c.audience===audience);
 if(collection){
   collection.loadedCount+=records.length;collection.shards.push(batch.filename);
 }else{
   manifest.publishedCollections.push({topic,mood,audience,loadedCount:records.length,shards:[batch.filename]});
 }
 cell.published+=records.length;
 manifest.publishedCount+=records.length;
 manifest.aiAuthoredScreenedCount+=records.length;
 manifest.publishedFiles.push(batch.filename);
 manifest.editorialStatus='in_progress';
 manifest.lastContentBatch=topic+' / '+mood+' / '+audience+': '+cell.published+' of 500';
 manifest.editorialNote=manifest.publishedCount+' starters available as built-in files: '+manifest.humanReviewedCount+' previously reviewed, '+manifest.aiAuthoredScreenedCount+' machine-screened drafts awaiting individual editorial review. '+(manifest.targetCount-manifest.publishedCount)+' slots remain unwritten.';
 manifest.qualityGate={
   ...(manifest.qualityGate||{}),
   exactDuplicateCheck:'validated_'+manifest.publishedCount,
   uniqueIds:'validated_'+manifest.publishedCount,
   topicMoodAudienceCheck:'validated_'+manifest.publishedCount,
   humanReviewOfNewEntries:'pending_'+manifest.aiAuthoredScreenedCount,
   embeddingSemanticReview:'not_run'
 };
 const mdPath=join(root,'content',topic,mood,audience.replace(/[^a-zA-Z0-9 -]/g,'').replace(/\s+/g,'-')+'.md');
 const previous=existsSync(mdPath)?readFileSync(mdPath,'utf8'):'';
 const head=previous||'# Say More · '+topic+' / '+mood+' / '+audience+'\n\nTarget: 500. Entries remain editorial drafts until human approval.\n';
 const listing=records.map((p,i)=>'\n'+(cell.published-records.length+i+1)+'. '+p.text+'  \n   _'+p.id+' · '+p.format+' · pending editorial review_').join('');
 mkdirSync(dirname(mdPath),{recursive:true});
 writeFileSync(output,JSON.stringify(records));
 writeFileSync(manifestFile,JSON.stringify(manifest));
 writeFileSync(mdPath,head+'\n'+listing+'\n');
 const validated=validateCuratedLibrary(root);
 if(validated.published!==initial.published+records.length)fail('Post-publication count mismatch');
 return {file:output,markdown:mdPath,created:records.length,reviewed:0,
  published:validated.published,remaining:validated.remaining,
  slot:topic+' / '+mood+' / '+audience,slotProgress:cell.published};
}
if(process.argv[1]?.endsWith('publish-content-batch.mjs')){
 const source=process.argv[2];
 if(!source)fail('Specify the path to a batch JSON file.');
 console.log(JSON.stringify(publishContentBatch(source),null,2));
}
