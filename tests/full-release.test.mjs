import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {prepareContentBatch} from '../scripts/publish-content-batch.mjs';
import {validateEditorialEvidence} from '../scripts/publish-reviewed-batch.mjs';
import {checkFullReleaseCounts} from '../scripts/check-full-release.mjs';

test('preparation accepts 50 authored entries and rejects 51 for each new eligible combination',()=>{
 const manifest=JSON.parse(readFileSync('public/library-data/manifest.json'));
 const reference=manifest.combinations.find(c=>c.eligible&&c.published===50);
 const slot={...reference,published:0,active:0};
 const testManifest={...manifest,combinations:[slot]};
 const prompts=Array.from({length:50},(_,i)=>({text:'A distinctive editorial fixture '+i+' for testing removal of the old arbitrary processing limit.',format:'Question'}));
 // The fixture deliberately bypasses lexical similarity: short token sets exercise size accounting only.
 for(let i=0;i<prompts.length;i++)prompts[i].text='Unique '+String(i)+' abc def ghi jkl mno pqr stu vwx.';
 const prepared=prepareContentBatch({...slot,prompts},testManifest,[]);
 assert.equal(prepared.records.length,50);
 assert.throws(()=>prepareContentBatch({...slot,prompts:[...prompts,{text:'Unique 51 abc def ghi jkl mno pqr stu vwx.',format:'Question'}]},testManifest,[]),/current combination target/);
 const hash=s=>createHash('sha256').update(s).digest('hex');
 const batch={prompts};const bytes=Buffer.from('{}');
 const retrieval={baselineManifestSha256:hash(bytes),rows:prompts.map(p=>({textSha256:hash(p.text)}))};
 const review={reviewerType:'AI',humanReviewed:false,inputSha256:hash(JSON.stringify(batch)),retrievalSha256:hash(JSON.stringify(retrieval)),decisions:prompts.map((p,i)=>({row:i+1,decision:'pass',textSha256:hash(p.text),distinctAngle:'Fixture '+i+' verifies collection size acceptance.',natural:true,topicFit:true,moodFit:true,audienceFit:true,ageAppropriate:true,distinctConversationalAngle:true}))};
 assert.equal(validateEditorialEvidence(batch,review,retrieval,bytes),true);
});
test('an incomplete staged library never passes the complete-release gate',()=>{
 assert.equal(checkFullReleaseCounts({publishedCount:10300,remainingToReleaseGoal:128800}).ready,false);
 assert.equal(checkFullReleaseCounts({publishedCount:139100,remainingToReleaseGoal:0}).ready,true);
 assert.equal(checkFullReleaseCounts({publishedCount:139101,remainingToReleaseGoal:0}).ready,false);
});
