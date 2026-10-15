import test from 'node:test';
import assert from 'node:assert/strict';
import {createProductionLedger} from '../scripts/audit-production-ledger.mjs';

test('approval coverage counts approved records and preserves pending legacy overages',()=>{
 const cell={topic:'Relationships',mood:'Chill',audience:'Anyone',eligible:true,target:200,published:500,legacyExpanded:true};
 const excluded={topic:'Relationships',mood:'Flirty',audience:'Family',eligible:false,target:0,published:0,exclusion:'inappropriate_flirty_pairing'};
 const manifest={targetCount:200,coverageCount:200,remainingToTarget:0,combinations:[cell,excluded],publishedCollections:[{...cell,shards:['approved.json']}]};
 const records=Array.from({length:500},(_,i)=>({id:'SM-'+String(i+1).padStart(6,'0'),topic:cell.topic,moods:[cell.mood],audiences:[cell.audience],editorialStatus:i<100?'approved':'screened_pending_editorial_review'}));
 const result=createProductionLedger(manifest,records,{sourceCommitSha:'source',verification:{files:[{path:'library-data/approved.json',matches:true}],productionCommitSha:'live'}});
 assert.equal(result.approvedCoverage,100);
 assert.equal(result.remainingApproved,100);
 assert.equal(result.combinations[0].pendingEditorialCount,400);
 assert.equal(result.combinations[0].remainingToWrite,0);
 assert.equal(result.combinations[1].editorialStatus,'excluded');
 assert.equal(result.checkpoint.firstPendingId,'SM-000101');
 assert.equal(result.checkpoint.action,'review_existing_entries_before_generation');
});
