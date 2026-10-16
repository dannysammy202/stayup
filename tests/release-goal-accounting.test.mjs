import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareContentBatch} from '../scripts/publish-content-batch.mjs';

test('completed active quota keeps historical physical goal accounting without accepting unrequested expansion',()=>{
 const m=JSON.parse(readFileSync('public/library-data/manifest.json','utf8'));
 assert.equal(m.releaseGoalPublishedCount,139100);
 assert.equal(m.remainingToReleaseGoal,139100-m.publishedCount);
 assert.equal(m.publishedCount,44450);
 assert.equal(m.activePolicy.activeCount,34800);
 assert.equal(m.activePolicy.remainingToTarget,0);
 assert.equal(m.combinations.filter(c=>c.eligible&&c.active===50).length,696);
 const slot=m.combinations.find(c=>c.eligible&&c.published===50);
 assert.ok(slot);
 assert.throws(()=>prepareContentBatch({topic:slot.topic,mood:slot.mood,audience:slot.audience,prompts:[{text:'A newly requested conversation starter after every active quota is complete.',format:'Question'}]},m,[]),/current combination target/);
});
