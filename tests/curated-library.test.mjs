import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const manifest=JSON.parse(readFileSync('public/library-data/manifest.json','utf8'));
const chunks=manifest.publishedFiles.map(path=>JSON.parse(readFileSync('public/library-data/'+path,'utf8')));
const published=chunks.flat();
const html=readFileSync('public/index.html','utf8');
const norm=text=>text.toLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}]+/gu,' ').trim();

test('500 per suitable combination and exclusion rules remain intact',()=>{
 assert.equal(manifest.version,2);
 assert.equal(manifest.targetPerCombination,500);
 assert.equal(manifest.combinations.length,798);
 const included=manifest.combinations.filter(x=>x.eligible);
 assert.equal(included.length,696);
 assert.equal(manifest.excludedCombinations,102);
 assert.equal(included.reduce((sum,x)=>sum+x.target,0),348000);
 assert.equal(manifest.targetCount,348000);
 for(const x of included)assert.equal(x.target,500);
 for(const x of manifest.combinations.filter(x=>!x.eligible))assert.equal(x.target,0);
});

test('first collection contains 500 distinct, publication-ready records',()=>{
 assert.equal(manifest.publishedCount,500);
 assert.equal(manifest.publishedFiles.length,5);
 assert.equal(published.length,500);
 assert.equal(manifest.humanReviewedCount,100);
 assert.equal(manifest.aiAuthoredScreenedCount,400);
 const seenId=new Set(),seenText=new Set(),formats=new Set();
 for(let i=0;i<published.length;i++){
  const p=published[i];
  assert.equal(p.id,'SM-'+String(i+1).padStart(6,'0'));
  assert.equal(p.editorialStatus,'approved');
  assert.equal(p.source,'published-library');
  assert.equal(p.adult,false);
  assert.equal(p.topic,'Relationships');
  assert.deepEqual(p.moods,['Chill']);
  assert.deepEqual(p.audiences,['Anyone']);
  assert.ok(p.text.length>=25 && p.text.length<=260);
  assert.ok(!seenId.has(p.id),'Duplicate id: '+p.id);
  assert.ok(!seenText.has(norm(p.text)),'Duplicate text: '+p.id);
  if(i>=100){assert.equal(p.humanReviewed,false);assert.ok(p.reviewMethod.includes('AI-authored'));}
  seenId.add(p.id);seenText.add(norm(p.text));formats.add(p.format);
 }
 assert.ok(formats.size>=6);
 const slot=manifest.combinations.find(x=>x.topic==='Relationships'&&x.mood==='Chill'&&x.audience==='Anyone');
 assert.equal(slot.published,500);
 assert.equal(slot.target,500);
});

test('app exposes the complete collection without an arbitrary 72-starter limit',()=>{
 assert.match(html,/return matches;/);
 assert.doesNotMatch(html,/matches\.length<=72/);
 assert.match(html,/data-action="loadMore"/);
 assert.match(html,/state\.feedVisible\+=48/);
 assert.match(html,/rest\.slice\(0,state\.feedVisible\)/);
 assert.match(html,/loadPublishedLibrary\(\)/);
 assert.match(html,/quiet-ai-toggle/);
 assert.match(html,/aiPrompts/);
 assert.match(html,/aiAngles/);
 assert.doesNotMatch(html,/Import your 100,000|Preview unreviewed starters|window\.SayMoreLibrary|library-loader\.js/);
 const blocks=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
 assert.equal(blocks.length,1);
 assert.doesNotThrow(()=>new vm.Script(blocks[0][1]));
});

test('original Iconsax assets remain the interface icon source',()=>{
 assert.match(html,/SAYMORE_ICONSAX/);
 assert.match(html,/src="\/iconsax\/part-1\.js"/);
 assert.match(html,/src="\/iconsax\/part-5\.js"/);
});
