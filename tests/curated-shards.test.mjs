import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const source = readFileSync('public/curated-shards.js', 'utf8');
const context = vm.createContext({});
vm.runInContext(source, context, {filename:'curated-shards.js'});
const selector = context.SayMoreCuratedShards;
const manifest = JSON.parse(readFileSync('public/library-data/manifest.json', 'utf8'));
const valid = {topic:'Relationships',mood:'Chill',audience:'Anyone'};

test('the 348,000-slot catalogue validates before loading content', () => {
  assert.equal(selector.assertManifest(manifest), true);
  assert.equal(manifest.publishedCollections.length, 3);
  assert.equal(manifest.publishedCollections.reduce((sum,x)=>sum+x.loadedCount,0), manifest.publishedCount);
  assert.equal(manifest.contentDelivery.externalUploadRequired, false);
});

test('selects content packs only for the requested topic, mood and audience', () => {
  const files = Array.from(selector.pathsForSelection(manifest,valid,new Set(),8));
  assert.deepEqual(files, Array.from(manifest.publishedCollections[0].shards));
  assert.equal(files.length, 5);
  const someoneNew=Array.from(selector.pathsForSelection(manifest,{...valid,audience:'Someone new'},new Set(),8));
  assert.deepEqual(someoneNew, Array.from(manifest.publishedCollections[1].shards));
  assert.equal(someoneNew.length,5);
  const friends=Array.from(selector.pathsForSelection(manifest,{...valid,audience:'Friends'},new Set(),8));
  assert.equal(friends.length,5);
  const absent=Array.from(selector.pathsForSelection(manifest,{topic:'Family',mood:'Flirty',audience:'Family'},new Set(),8));
  assert.deepEqual(absent,[]);
});

test('all-topic mode is bounded and advances past previously loaded packs', () => {
  const all={topic:'All topics',mood:'All moods',audience:'Anyone'};
  const allPaths=Array.from(selector.pathsForSelection(manifest,all,new Set(),8));
  assert.equal(allPaths.length,5);
  const next=Array.from(selector.pathsForSelection(manifest,all,new Set(allPaths),8));
  assert.deepEqual(next,[]);
  // A synthetic larger catalogue shows round-robin behaviour and an eight-file cap.
  const fake={publishedCollections:Array.from({length:20},(_,i)=>({topic:'Topic '+i,mood:'Chill',audience:'Anyone',shards:['t'+i+'/0.json','t'+i+'/1.json']}))};
  const first=Array.from(selector.pathsForSelection(fake,all,new Set(),8));
  assert.equal(first.length,8);
  assert.deepEqual(first,Array.from({length:8},(_,i)=>'t'+i+'/0.json'));
  const nextEight=Array.from(selector.pathsForSelection(fake,all,new Set(first),8));
  assert.equal(nextEight.length,8);
  assert.equal(new Set([...first,...nextEight]).size,16);
});

test('saved and seen items resolve to the correct local shard after reload', () => {
  const ids=['SM-000003','SM-000175','SM-000633','SM-001145'];
  const paths=Array.from(selector.pathsForIds(manifest,ids,new Set(),8));
  assert.ok(paths.includes('approved.json'));
  assert.ok(paths.includes('relationships-chill-anyone-101-200.json'));
  assert.ok(paths.includes('relationships-chill-someone-new-601-700.json'));
  assert.ok(paths.includes('relationships-chill-friends-1101-1500.json'));
  assert.equal(selector.pathsForIds(manifest,ids,new Set(paths),8).length,0);
});

test('all published chunk counts correspond to the manifest', () => {
  const indexed=new Set(manifest.publishedCollections.flatMap(c=>c.shards));
  assert.equal(indexed.size,manifest.publishedFiles.length);
  const count=manifest.publishedCollections.reduce((sum,c)=>{
    const actual=c.shards.reduce((n,path)=>n+JSON.parse(readFileSync('public/library-data/'+path,'utf8')).length,0);
    assert.equal(actual,c.loadedCount,c.audience);
    return sum+actual;
  },0);
  assert.equal(count,1500);
});

test('approved UI loads the selector and still retains Iconsax and Gemini', () => {
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
