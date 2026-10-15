import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {validateCuratedLibrary} from './validate-curated-library.mjs';

export function createProductionLedger(manifest,records,{sourceCommitSha,verification,origins={}}){
 const key=c=>JSON.stringify([c.topic,c.mood,c.audience]);
 const groups=new Map();
 for(const p of records){
  const k=key({topic:p.topic,mood:p.moods[0],audience:p.audiences[0]});
  if(!groups.has(k))groups.set(k,[]);
  groups.get(k).push(p);
 }
 const combinations=manifest.combinations.map((c,index)=>{
  const entries=groups.get(key(c))||[];
  const approved=entries.filter(p=>p.editorialStatus==='approved').length;
  const pending=entries.filter(p=>p.editorialStatus==='screened_pending_editorial_review').length;
  const collection=manifest.publishedCollections.find(x=>key(x)===key(c));
  const files=collection?.shards||[];
  const checked=files.map(f=>verification.files.find(x=>x.path==='library-data/'+f));
  return {order:index+1,topic:c.topic,mood:c.mood,audience:c.audience,eligible:c.eligible,
   exclusion:c.exclusion||null,target:c.target,publishedCount:entries.length,approvedCount:approved,
   pendingEditorialCount:pending,remainingApproved:Math.max(0,c.target-approved),
   remainingToWrite:Math.max(0,c.target-entries.length),legacyExpanded:!!c.legacyExpanded,
   editorialStatus:!c.eligible?'excluded':approved>=c.target?'approved_target_met':pending?'review_required':'unwritten',
   firstPendingId:entries.find(p=>p.editorialStatus!=='approved')?.id||null,
   sourceCommitSha,shards:files.map(f=>({path:f,lastContentCommitSha:origins[f]||null})),
   aiEditorialReviewedCount:entries.filter(p=>p.aiEditorialReview?.decision==='pass').length,
   production:{verifiedAt:verification.verifiedAt,commitSha:verification.productionCommitSha,
    deploymentId:verification.deploymentId,
    status:files.length&&checked.every(x=>x?.matches)?'verified_public_files':files.length?'awaiting_release_verification':!c.eligible?'excluded_no_shards':'unwritten_no_shards'}};
 });
 const approvedCoverage=combinations.reduce((n,c)=>n+Math.min(c.approvedCount,c.target),0);
 const pending=combinations.filter(c=>c.eligible&&c.remainingApproved>0);
 const next=pending[0];
 const nextPublication=combinations.find(c=>c.eligible&&c.remainingToWrite>0);
 return {version:1,createdAt:verification.verifiedAt,sourceCommitSha,
  targetApprovedCoverage:manifest.targetCount,publishedCount:records.length,
  approvedCount:records.filter(p=>p.editorialStatus==='approved').length,
  pendingEditorialCount:records.filter(p=>p.editorialStatus==='screened_pending_editorial_review').length,
  aiEditorialReviewedCount:records.filter(p=>p.aiEditorialReview?.decision==='pass').length,
  releaseGoalPublishedCount:manifest.releaseGoalPublishedCount||139100,
  remainingToReleaseGoal:Math.max(0,(manifest.releaseGoalPublishedCount||139100)-records.length),
  approvedCoverage,remainingApproved:manifest.targetCount-approvedCoverage,
  publishedCoverage:manifest.coverageCount,remainingToWrite:manifest.remainingToTarget,
  eligibleCombinations:696,excludedCombinations:102,
  combinationsAtPublishedTarget:combinations.filter(c=>c.eligible&&c.publishedCount>=c.target).length,
  combinationsAtApprovedTarget:combinations.filter(c=>c.eligible&&c.approvedCount>=c.target).length,
  legacyCollections:combinations.filter(c=>c.legacyExpanded).map(c=>({topic:c.topic,mood:c.mood,audience:c.audience,published:c.publishedCount})),
  productionVerification:verification,
  checkpoint:{topic:next?.topic,mood:next?.mood,audience:next?.audience,
   action:next?.pendingEditorialCount?'review_existing_entries_before_generation':'author_up_to_100_then_review',
   firstPendingId:next?.firstPendingId,batchLimit:100,
   firstUnwrittenCombination:combinations.find(c=>c.eligible&&c.remainingToWrite>0),
   status:'human_review_remains_separate_not_a_publication_blocker',
   reason:'User renewed autonomous publication instruction on 15 October 2026. AI editorial reviews preserve humanReviewed:false and do not relabel screened entries as human approved.'},
  publicationCheckpoint:nextPublication?{topic:nextPublication.topic,mood:nextPublication.mood,audience:nextPublication.audience,
   published:nextPublication.publishedCount,remainingInCombination:nextPublication.remainingToWrite,nextBatchMaximum:Math.min(100,nextPublication.remainingToWrite,Math.max(0,139100-records.length))}:null,
  semanticReview:{status:'incomplete',candidateReport:'content/production/similarity-candidates.json',
   method:'Global TF-IDF lexical candidate screening, not a complete semantic assessment'},
  combinations};
}

export function auditProduction(root='.'){
 validateCuratedLibrary(root);
 const dir=resolve(root,'content/production');
 const manifest=JSON.parse(readFileSync(resolve(root,'public/library-data/manifest.json'),'utf8'));
 const verification=JSON.parse(readFileSync(resolve(dir,'release-verification.json'),'utf8'));
 const sourceCommitSha=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
 if(verification.githubMainSha!==verification.productionCommitSha||!verification.allFilesMatch||verification.productionState!=='READY')throw new Error('Production verification must pass first');
 const records=manifest.publishedFiles.flatMap(f=>JSON.parse(readFileSync(resolve(root,'public/library-data',f),'utf8')));
 const origins=Object.fromEntries(manifest.publishedFiles.map(f=>[f,execFileSync('git',['log','-1','--format=%H','--','public/library-data/'+f],{cwd:root,encoding:'utf8'}).trim()]));
 const ledger=createProductionLedger(manifest,records,{sourceCommitSha,verification,origins});
 ledger.manifestSha256=createHash('sha256').update(readFileSync(resolve(root,'public/library-data/manifest.json'))).digest('hex');
 mkdirSync(dir,{recursive:true});
 writeFileSync(resolve(dir,'progress-ledger.json'),JSON.stringify(ledger,null,2)+'\n');
 const fields=['order','topic','mood','audience','eligible','target','publishedCount','approvedCount','pendingEditorialCount','remainingApproved','remainingToWrite','editorialStatus','legacyExpanded','sourceCommitSha'];
 const quote=x=>'"'+String(x??'').replaceAll('"','""')+'"';
 writeFileSync(resolve(dir,'progress-ledger.csv'),fields.join(',')+'\n'+ledger.combinations.map(c=>fields.map(f=>quote(c[f])).join(',')).join('\n')+'\n');
 return ledger;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const l=auditProduction();
 console.log(JSON.stringify({published:l.publishedCount,approved:l.approvedCount,remainingApproved:l.remainingApproved,remainingToWrite:l.remainingToWrite,checkpoint:l.checkpoint},null,2));
}
