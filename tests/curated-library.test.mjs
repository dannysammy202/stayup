import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const manifest=JSON.parse(readFileSync('public/library-data/manifest.json','utf8'));
const approved=JSON.parse(readFileSync('public/library-data/approved.json','utf8'));
const html=readFileSync('public/index.html','utf8');
const normalized=text=>text.toLowerCase().normalize('NFKC').replace(/[^\\p{L}\\p{N}]+/gu,' ').trim();

test('500-starter quota covers every socially suitable combination',()=>{
 assert.equal(manifest.version,2);
 assert.equal(manifest.targetPerCombination,500);
 assert.equal(manifest.combinations.length,19*6*7);
 const included=manifest.combinations.filter(x=>x.eligible);
 assert.equal(included.length,696);
 assert.equal(manifest.excludedCombinations,102);
 assert.equal(included.reduce((sum,x)=>sum+x.target,0),348000);
 assert.equal(manifest.targetCount,348000);
 for(const x of included)assert.equal(x.target,500);
 for(const x of manifest.combinations.filter(x=>!x.eligible))assert.equal(x.target,0);
});
test('only previously approved original content enters published library',()=>{
 assert.equal(approved.length,manifest.publishedCount);
 assert.equal(approved.length,100);
 assert.deepEqual(manifest.publishedFiles,['approved.json']);
 const seenId=new Set(),seenTexts=new Set();
 for(const p of approved){
   assert.equal(p.editorialStatus,'approved');
   assert.equal(p.source,'published-library');
   assert.equal(p.adult,false);
   assert.equal(p.topic,'Relationships');
   assert.deepEqual(p.moods,['Chill']);
   assert.deepEqual(p.audiences,['Anyone']);
   assert.ok(p.text.trim().length>=15);
   assert.ok(!seenId.has(p.id));
   assert.ok(!seenTexts.has(normalized(p.text)));
   seenId.add(p.id);seenTexts.add(normalized(p.text));
 }
 const slot=manifest.combinations.find(x=>x.topic==='Relationships'&&x.mood==='Chill'&&x.audience==='Anyone');
 assert.equal(slot.published,100);
 assert.equal(slot.target,500);
});
test('the application keeps Gemini optional and removes unfinished import flow',()=>{
 assert.match(html,/loadPublishedLibrary\(\)/);
 assert.match(html,/quiet-ai-toggle/);
 assert.match(html,/aiPrompts/);
 assert.match(html,/aiAngles/);
 assert.doesNotMatch(html,/Import your 100,000|Preview unreviewed starters|window.SayMoreLibrary|library-loader\.js/);
 const blocks=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
 assert.equal(blocks.length,1);
 assert.doesNotThrow(()=>new vm.Script(blocks[0][1]));
});
