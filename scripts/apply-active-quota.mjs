/**
 * Non-destructive 50-starter browsing quota.
 * The original published shards remain in the repository as an archive.
 * Re-run after each content publication before validating the catalogue.
 */
import {readFileSync,writeFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

export const ACTIVE_QUOTA=50;
export function applyActiveQuota(manifest,root='.') {
  if(!manifest||manifest.version!==2||manifest.eligibleCombinations!==696||
     manifest.excludedCombinations!==102)throw new Error('Unexpected Say More eligibility matrix');
  let active=0;
  for(const cell of manifest.combinations){
    cell.active=cell.eligible?Math.min(ACTIVE_QUOTA,cell.published):0;
    cell.archived=cell.eligible?Math.max(0,cell.published-ACTIVE_QUOTA):0;
  }
  for(const collection of manifest.publishedCollections){
    const ids=[],shards=[];
    for(const filename of collection.shards){
      if(ids.length>=ACTIVE_QUOTA)break;
      const records=JSON.parse(readFileSync(join(root,'public/library-data',filename),'utf8'));
      const chosen=records.slice(0,ACTIVE_QUOTA-ids.length);
      if(chosen.some(p=>p.topic!==collection.topic||p.moods?.[0]!==collection.mood||
        p.audiences?.[0]!==collection.audience||p.adult!==false||
        !/^SM-\d{6}$/.test(p.id)))throw new Error('Misclassified active starter in '+filename);
      if(chosen.length){ids.push(...chosen.map(p=>p.id));shards.push(filename);}
    }
    if(ids.length!==Math.min(ACTIVE_QUOTA,collection.loadedCount))throw new Error('Incomplete active selection');
    collection.activeIds=ids;
    collection.activeShards=shards;
    collection.activeCount=ids.length;
    collection.archivedCount=collection.loadedCount-ids.length;
    active+=ids.length;
  }
  const expected=manifest.combinations.reduce((n,c)=>n+c.active,0);
  if(active!==expected)throw new Error('Active count does not match combination matrix');
  manifest.activePolicy={
    version:1,targetPerCombination:ACTIVE_QUOTA,targetCount:696*ACTIVE_QUOTA,
    eligibleCombinations:696,excludedCombinations:102,activeCount:active,
    archivedCount:manifest.publishedCount-active,
    remainingToTarget:696*ACTIVE_QUOTA-active,
    archivalMethod:'Original physical shards retained; each eligible combination displays its earliest 50 entries in source order.',
    reviewNote:'Original editorial approval and pending-review labels remain unchanged.'
  };
  return manifest;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const root=process.argv[2]||'.',file=join(root,'public/library-data/manifest.json');
  const manifest=applyActiveQuota(JSON.parse(readFileSync(file,'utf8')),root);
  writeFileSync(file,JSON.stringify(manifest));
  console.log(JSON.stringify(manifest.activePolicy,null,2));
}
