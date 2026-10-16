import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateCuratedLibrary} from './validate-curated-library.mjs';

export function checkFullReleaseCounts(manifest){
 const goal=139100;
 const ready=manifest.publishedCount===goal&&manifest.remainingToReleaseGoal===0;
 return {ready,goal,published:manifest.publishedCount,remaining:Math.max(0,goal-manifest.publishedCount),
  productionMode:'single_complete_release',reason:ready?'physical_release_count_met':'continue_offline_preparation'};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const report=validateCuratedLibrary();
 const manifest=JSON.parse(readFileSync('public/library-data/manifest.json'));
 const result=checkFullReleaseCounts(manifest);
 const records=manifest.publishedFiles.flatMap(path=>JSON.parse(readFileSync('public/library-data/'+path)));
 const unreviewedNew=records.filter(p=>Number(p.id.slice(3))>10100&&p.aiEditorialReview?.decision!=='pass');
 const ready=result.ready&&unreviewedNew.length===0;
 console.log(JSON.stringify({...result,ready,newRecordsMissingIndividualReview:unreviewedNew.length,validation:report},null,2));
 if(!ready)process.exitCode=2;
}
