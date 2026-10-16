import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {applyActiveQuota} from '../scripts/apply-active-quota.mjs';

const manifest=JSON.parse(readFileSync('public/library-data/manifest.json','utf8'));
const scope=vm.createContext({});
vm.runInContext(readFileSync('public/curated-shards.js','utf8'),scope);
const selector=scope.SayMoreCuratedShards;

test('50-per-combination active library leaves all 12,000 physical records intact',()=>{
 assert.equal(manifest.activePolicy.targetPerCombination,50);
 assert.equal(manifest.activePolicy.targetCount,34800);
 const active=manifest.combinations.filter(c=>c.eligible).reduce((sum,c)=>sum+Math.min(50,c.published),0);
 assert.equal(manifest.activePolicy.activeCount,active);
 assert.equal(manifest.activePolicy.archivedCount,manifest.publishedCount-active);
 assert.equal(manifest.activePolicy.remainingToTarget,34800-active);
 assert.equal(manifest.publishedCount,manifest.activePolicy.activeCount+manifest.activePolicy.archivedCount);
 assert.equal(manifest.combinations.filter(c=>!c.eligible&&c.active!==0).length,0);
 assert.equal(selector.assertManifest(manifest),true);
});
test('selected 50 IDs correspond to actual chronological records and preserve archive',()=>{
 const seen=new Set();
 for(const c of manifest.publishedCollections){
  const physical=c.shards.flatMap(path=>JSON.parse(readFileSync('public/library-data/'+path,'utf8')));
  const expected=physical.slice(0,50).map(p=>p.id);
  assert.deepEqual(c.activeIds,expected,c.topic+' / '+c.mood+' / '+c.audience);
  assert.equal(c.archivedCount,physical.length-expected.length);
  assert.equal(c.activeCount,expected.length);
  for(const id of c.activeIds){assert.equal(seen.has(id),false);seen.add(id);}
  const selected={topic:c.topic,mood:c.mood,audience:c.audience};
  assert.deepEqual(Array.from(selector.activePathsForSelection(manifest,selected,new Set(),8)),c.activeShards);
 }
 assert.equal(seen.size,manifest.activePolicy.activeCount);
 assert.deepEqual(applyActiveQuota(structuredClone(manifest)).activePolicy,manifest.activePolicy);
});
test('everyday browsing excludes archive and demonstration content after the catalogue loads',()=>{
 const html=readFileSync('public/index.html','utf8');
 assert.match(html,/activePublishedIds\.has\(p\.id\)/);
 assert.match(html,/CURATED_SHARDS\.activePathsForSelection/);
 assert.match(html,/manifest\.activePolicy\.activeCount/);
});
