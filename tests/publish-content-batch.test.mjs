import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { prepareContentBatch } from '../scripts/publish-content-batch.mjs';

const manifest=JSON.parse(readFileSync('public/library-data/manifest.json','utf8'));
const published=manifest.publishedFiles.flatMap(file=>JSON.parse(readFileSync('public/library-data/'+file,'utf8')));
const eligibleSlot=manifest.combinations.find(c=>c.eligible&&c.published<=48);
if(!eligibleSlot)throw new Error('No available eligible slot for content publisher test');
const pick={
 topic:eligibleSlot.topic,mood:eligibleSlot.mood,audience:eligibleSlot.audience,
 prompts:[
   {text:'What is a small, ordinary outing that would make an unexpectedly lovely afternoon together?',format:'Question',relatedThemes:['everyday dates']},
   {text:'A quiet afternoon discovering books and cafés would be more fun than an elaborate surprise.',format:'Hot take',relatedThemes:['shared experiences']}
 ]
};
test('publisher creates sequential stable IDs and a valid local shard for an eligible combination',()=>{
 const result=prepareContentBatch(pick,fixtureManifest,published);
 assert.equal(result.records.length,2);
 assert.equal(result.from,manifest.publishedCount+1);
 assert.equal(result.to,manifest.publishedCount+2);
 assert.equal(result.records[0].editorialStatus,'screened_pending_editorial_review');
 assert.equal(result.records[0].humanReviewed,false);
 assert.equal(result.records[0].adult,false);
 assert.deepEqual(result.records[0].audiences,[eligibleSlot.audience]);
 assert.equal(result.records[0].id,'SM-'+String(manifest.publishedCount+1).padStart(6,'0'));
 assert.ok(result.filename.endsWith('-'+result.from+'-'+result.to+'.json'));
});
test('publisher rejects excluded combinations without trying to reinterpret them',()=>{
 assert.throws(()=>prepareContentBatch({...pick,topic:'Family',mood:'Flirty',audience:'Family'},manifest,published),/excluded or unknown/);
});
test('publisher rejects duplicate ideas, weak placeholders and overlong batches',()=>{
 const old=published[0].text;
 assert.throws(()=>prepareContentBatch({...pick,prompts:[{text:old,format:'Question'}]},fixtureManifest,published),/Duplicate prompt/);
 assert.throws(()=>prepareContentBatch({...pick,prompts:[{text:'Placeholder question 5 - insert question here',format:'Question'}]},fixtureManifest,published),/Placeholder detected/);
 assert.throws(()=>prepareContentBatch({...pick,prompts:Array.from({length:201},(_,i)=>({text:'Could our next proper conversation revolve around a different film and its ending '+i+'?',format:'Question'}))},fixtureManifest,published),/Collection must contain/);
});
test('publisher does not mark machine-authored content as independently human approved',()=>{
 const result=prepareContentBatch(pick,fixtureManifest,published);
 assert.equal(result.records.every(p=>p.editorialStatus!=='approved'&&p.humanReviewed===false),true);
 assert.equal(result.records.every(p=>p.source==='published-library'),true);
 assert.equal(result.records.every(p=>/human approval/.test(p.reviewMethod)),true);
});


test('publisher halts at 50 and does not remove the historic 500-entry collections',()=>{
 const old=manifest.combinations.find(c=>c.legacyExpanded&&c.published===500);
 assert.ok(old);
 assert.throws(()=>prepareContentBatch({...pick,topic:old.topic,mood:old.mood,audience:old.audience},manifest,published),/current combination target/);
 const near={...manifest,combinations:manifest.combinations.map(c=>c===eligibleSlot?{...c,published:49}:c)};
 assert.throws(()=>prepareContentBatch(pick,near,published),/current combination target/);
});
