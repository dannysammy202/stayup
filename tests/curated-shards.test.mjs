import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const script=readFileSync('public/curated-shards.js','utf8');
const context=vm.createContext({});
vm.runInContext(script,context,{filename:'curated-shards.js'});
const selector=context.SayMoreCuratedShards;
const manifest=JSON.parse(readFileSync('public/library-data/manifest.json','utf8'));

test('validated shard index tracks 348k intended slots without filling unfinished combinations',()=>{
 assert.equal(selector.assertManifest(manifest),true);
 assert.equal(manifest.contentDelivery.externalUploadRequired,false);
 assert.equal(manifest.publishedCollections.reduce((n,c)=>n+c.loadedCount,0),manifest.publishedCount);
});

test('each published combination fetches only its own built-in shards',()=>{
 for(const collection of manifest.publishedCollections){
   const selected={topic:collection.topic,mood:collection.mood,audience:collection.audience};
   const got=Array.from(selector.pathsForSelection(manifest,selected,new Set(),8));
   assert.deepEqual(got,Array.from(collection.shards).slice(0,8),JSON.stringify(selected));
   assert.deepEqual(Array.from(selector.pathsForSelection(manifest,selected,new Set(got),8)),
     Array.from(collection.shards).slice(8,16),JSON.stringify(selected));
 }
 const excluded=manifest.combinations.find(c=>!c.eligible);
 assert.ok(excluded);
 assert.deepEqual(Array.from(selector.pathsForSelection(manifest,
   {topic:excluded.topic,mood:excluded.mood,audience:excluded.audience},new Set(),8)),[]);
});

test('all-topic discovery is bounded and round-robin across available collections',()=>{
 const query={topic:'All topics',mood:'All moods',audience:'Anyone'};
 const first=Array.from(selector.pathsForSelection(manifest,query,new Set(),8));
 assert.ok(first.length<=8);
 assert.equal(new Set(first).size,first.length);
 const fake={publishedCollections:Array.from({length:20},(_,i)=>({
   topic:'Topic '+i,mood:'Chill',audience:'Anyone',shards:['t'+i+'/0.json','t'+i+'/1.json']
 }))};
 const one=Array.from(selector.pathsForSelection(fake,query,new Set(),8));
 assert.deepEqual(one,Array.from({length:8},(_,i)=>'t'+i+'/0.json'));
 const two=Array.from(selector.pathsForSelection(fake,query,new Set(one),8));
 assert.equal(two.length,8);
 assert.equal(new Set([...one,...two]).size,16);
});

test('saved and viewed starter IDs resolve to their correct shipped file',()=>{
 for(const file of manifest.publishedFiles){
   const rows=JSON.parse(readFileSync('public/library-data/'+file,'utf8'));
   const id=rows[Math.floor(rows.length/2)].id;
   const paths=Array.from(selector.pathsForIds(manifest,[id],new Set(),8));
   assert.ok(paths.includes(file),'Missing content pack for '+id);
   assert.equal(selector.pathsForIds(manifest,[id],new Set(paths),8).length,0);
 }
});

test('published counts match physical content files',()=>{
 const indexed=new Set(manifest.publishedCollections.flatMap(c=>c.shards));
 assert.equal(indexed.size,manifest.publishedFiles.length);
 let count=0;
 for(const c of manifest.publishedCollections){
   const n=c.shards.reduce((sum,file)=>sum+JSON.parse(readFileSync('public/library-data/'+file,'utf8')).length,0);
   assert.equal(n,c.loadedCount,c.audience);
   count+=n;
 }
 assert.equal(count,manifest.publishedCount);
});

test('client stays on local assets and preserves Iconsax and Gemini',()=>{
 const html=readFileSync('public/index.html','utf8');
 assert.match(html,/src="\/curated-shards\.js"/);
 assert.match(html,/function schedulePublishedForView\(/);
 assert.match(html,/function loadNextPublishedFiles\(/);
 assert.match(html,/function remainingPublishedFiles\(/);
 assert.match(html,/src="\/iconsax\/part-5\.js"/);
 assert.match(html,/aiPrompts/);
 assert.match(html,/aiAngles/);
 assert.doesNotMatch(html,/Import ZIP/);
 const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
 assert.equal(scripts.length,1);
 assert.doesNotThrow(()=>new vm.Script(scripts[0][1],{filename:'say-more-app.js'}));
});
