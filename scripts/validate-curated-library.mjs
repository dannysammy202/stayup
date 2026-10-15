import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const TOPICS = ['Relationships','Friendships','Life','Childhood','Family','Money','Culture','Personal Experiences','Future & Ambitions','Random & Hypothetical','Faith & Spirituality','Music','Entertainment','Work & Career','School & Education','Dating','Pop Culture','Would You Rather','Controversial Opinions'];
const MOODS = ['Chill','Playful','Curious','Deep','Flirty','Bold'];
const AUDIENCES = ['Anyone','Someone new','Friends','Crush / Talking stage','Partner','Family','Group'];
const FORMATS = new Set(['Question','Hot take','Scenario','Quick choice','Story starter','Casual observation','Observation']);
const RATINGS = new Set(['approved','screened_pending_editorial_review']);
const normalize = s => s.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
function assert(condition, detail) { if (!condition) throw new Error('Curated library validation failed: '+detail); }
const slotKey = (t,m,a) => JSON.stringify([t,m,a]);

export function validateCuratedLibrary(root='.') {
 const base=resolve(root);
 const manifest=JSON.parse(readFileSync(resolve(base,'public/library-data/manifest.json'),'utf8'));
 assert(manifest.version===2, 'manifest version must be 2');
 assert(manifest.targetPerCombination===500, 'target per combination must be 500');
 assert(manifest.targetCount===348000, 'target total must be 348,000');
 assert(manifest.theoreticalCombinations===798&&manifest.eligibleCombinations===696&&manifest.excludedCombinations===102,'matrix counts');
 assert(JSON.stringify(manifest.topics)===JSON.stringify(TOPICS), 'topic list mismatch');
 assert(JSON.stringify(manifest.moods)===JSON.stringify(MOODS), 'mood list mismatch');
 assert(JSON.stringify(manifest.audiences)===JSON.stringify(AUDIENCES), 'audience list mismatch');
 assert(Array.isArray(manifest.combinations)&&manifest.combinations.length===798,'manifest must contain 798 combinations');
 assert(Array.isArray(manifest.publishedCollections)&&Array.isArray(manifest.publishedFiles),'published collection index missing');
 const slots=new Map(),excluded=[];
 for(const cell of manifest.combinations){
   assert(TOPICS.includes(cell.topic)&&MOODS.includes(cell.mood)&&AUDIENCES.includes(cell.audience),'invalid combination values');
   const key=slotKey(cell.topic,cell.mood,cell.audience);
   assert(!slots.has(key),'duplicate combination '+key);
   assert(Number.isInteger(cell.published)&&cell.published>=0, 'invalid published count for '+key);
   assert(cell.eligible?cell.target===500&&cell.published<=500:cell.target===0&&cell.published===0,'invalid quota or excluded publication '+key);
   slots.set(key,cell);
   if(!cell.eligible)excluded.push(key);
 }
 assert(slots.size===798&&excluded.length===102,'exclusion coverage');
 assert(slots.size-excluded.length===696,'eligible coverage');
 let total=0,approved=0,screened=0;
 const ids=new Set(),texts=new Map(),paths=new Set(),seenSlots=new Set(),formats=new Set();
 const reviews={approved:0,screened_pending_editorial_review:0};
 for(const collection of manifest.publishedCollections){
   const key=slotKey(collection.topic,collection.mood,collection.audience);
   const slot=slots.get(key);
   assert(slot&&slot.eligible,'unapproved combination has published content '+key);
   assert(!seenSlots.has(key),'duplicate published combination '+key);
   seenSlots.add(key);
   assert(Number.isInteger(collection.loadedCount)&&collection.loadedCount>0&&collection.loadedCount<=500,'published collection count '+key);
   assert(slot.published===collection.loadedCount,'slot publication count mismatch '+key);
   assert(Array.isArray(collection.shards)&&collection.shards.length>0,'missing shards '+key);
   let entries=0;
   for(const file of collection.shards){
     assert(typeof file==='string'&&/^[a-z0-9/_-]+\.json$/i.test(file),'unsafe shard path');
     assert(!paths.has(file),'duplicate shard path '+file);
     paths.add(file);
     const chunk=JSON.parse(readFileSync(resolve(base,'public/library-data',file),'utf8'));
     assert(Array.isArray(chunk)&&chunk.length>0&&chunk.length<=500,'invalid shard data '+file);
     for(const p of chunk){
       assert(typeof p.id==='string'&&/^SM-\d{6}$/.test(p.id),'invalid starter ID '+file);
       assert(!ids.has(p.id),'duplicate ID '+p.id);
       ids.add(p.id);
       assert(typeof p.text==='string'&&p.text.trim().length>=25&&p.text.trim().length<=260,'invalid prompt text '+p.id);
       const normalized=normalize(p.text);
       assert(!texts.has(normalized),'duplicate text '+p.id+' and '+texts.get(normalized));
       texts.set(normalized,p.id);
       assert(p.topic===collection.topic,'wrong topic '+p.id);
       assert(Array.isArray(p.moods)&&p.moods.length===1&&p.moods[0]===collection.mood,'wrong mood '+p.id);
       assert(Array.isArray(p.audiences)&&p.audiences.length===1&&p.audiences[0]===collection.audience,'wrong audience '+p.id);
       assert(FORMATS.has(p.format),'invalid format '+p.id);
       formats.add(p.format);
       assert(p.adult===false,'adults-only content must not enter the general library '+p.id);
       assert(p.source==='published-library','invalid source '+p.id);
       assert(RATINGS.has(p.editorialStatus),'missing editorial status '+p.id);
       if(p.editorialStatus==='approved') {
         assert(p.humanReviewed===true || (p.id && Number(p.id.slice(3))<=100 && p.humanReviewed!==false),
           'unreviewed starter falsely marked as approved: '+p.id);
         approved++;
       } else {
         assert(p.humanReviewed===false,'pending starter marked reviewed '+p.id);
         assert(typeof p.reviewMethod==='string'&&p.reviewMethod.trim(),'pending starter missing provenance '+p.id);
         screened++;
       }
       reviews[p.editorialStatus]++;
       total++;entries++;
     }
   }
   assert(entries===collection.loadedCount,'actual files do not match published slot '+key);
 }
 assert(manifest.publishedCount===total,'manifest total '+manifest.publishedCount+' differs from files '+total);
 assert(manifest.humanReviewedCount===approved,'human-reviewed count mismatch');
 assert(manifest.aiAuthoredScreenedCount===screened,'pending editorial count mismatch');
 assert(approved+screened===total,'review count mismatch');
 assert(manifest.publishedFiles.length===paths.size,'publishedFiles length mismatch');
 assert(new Set(manifest.publishedFiles).size===paths.size&&manifest.publishedFiles.every(p=>paths.has(p)),'publishedFiles index mismatch');
 assert(manifest.combinations.reduce((sum,c)=>sum+c.published,0)===total,'matrix published count mismatch');
 assert(total<=348000,'published beyond scope');
 assert(formats.size>=Math.min(6,total), 'insufficient format diversity');
 return {target:348000,published:total,remaining:348000-total,eligible:696,excluded:102,files:paths.size,
   publishedCombinations:manifest.publishedCollections.length,fullyPopulated:manifest.combinations.filter(x=>x.published===500).length,
   approved,awaitingReview:screened,uniqueIds:ids.size,uniqueText: texts.size,formats:[...formats].sort()};
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const result=validateCuratedLibrary(process.cwd());
 process.stdout.write(JSON.stringify(result,null,2)+'\n');
}
