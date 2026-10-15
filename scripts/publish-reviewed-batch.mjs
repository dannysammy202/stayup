import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {publishContentBatch} from './publish-content-batch.mjs';
const hash=x=>createHash('sha256').update(x).digest('hex');
export function validateEditorialEvidence(batch,review,retrieval,manifestBytes){
 const fail=s=>{throw new Error('Editorial evidence rejected: '+s)};
 if(batch.prompts.length<1||batch.prompts.length>100)fail('batch size');
 if(review.reviewerType!=='AI'||review.humanReviewed!==false)fail('reviewer provenance');
 if(review.inputSha256!==hash(JSON.stringify(batch)))fail('changed batch');
 if(retrieval.baselineManifestSha256!==hash(manifestBytes))fail('stale catalogue');
 if(review.retrievalSha256!==hash(JSON.stringify(retrieval)))fail('changed retrieval evidence');
 if(review.decisions?.length!==batch.prompts.length||retrieval.rows?.length!==batch.prompts.length)fail('incomplete individual review');
 const seen=new Set();
 for(let i=0;i<batch.prompts.length;i++){
  const d=review.decisions[i],r=retrieval.rows[i];
  if(d.row!==i+1||seen.has(d.row)||d.decision!=='pass')fail('unresolved decision at '+(i+1));
  seen.add(d.row);
  if(d.textSha256!==hash(batch.prompts[i].text)||r.textSha256!==d.textSha256)fail('text changed after review');
  if(!d.distinctAngle||d.distinctAngle.length<8)fail('missing individual rationale');
  for(const dimension of ['natural','topicFit','moodFit','audienceFit','ageAppropriate','distinctConversationalAngle'])if(d[dimension]!==true)fail('quality check missing: '+dimension);
 }
 return true;
}
export function publishReviewedBatch(inputFile,reviewFile,retrievalFile,root='.'){
 const manifestPath=resolve(root,'public/library-data/manifest.json');
 const bytes=readFileSync(manifestPath),manifest=JSON.parse(bytes);
 const batch=JSON.parse(readFileSync(inputFile)),review=JSON.parse(readFileSync(reviewFile)),retrieval=JSON.parse(readFileSync(retrievalFile));
 validateEditorialEvidence(batch,review,retrieval,bytes);
 if(retrieval.existingRecords!==manifest.publishedCount)throw new Error('Review did not cover current catalogue');
 const releaseGoal=manifest.releaseGoalPublishedCount||139100;
 if(manifest.publishedCount+batch.prompts.length>releaseGoal)throw new Error('Batch exceeds latest published release goal');
 const result=publishContentBatch(inputFile,root);
 const records=JSON.parse(readFileSync(result.file));
 records.forEach((p,i)=>{p.aiEditorialReview={decision:'pass',reviewerType:'AI',humanReviewed:false,
  reviewedAt:review.reviewedAt,distinctAngle:review.decisions[i].distinctAngle,
  evidence:reviewFile.replace(resolve(root)+'/',''),retrievalEvidence:retrievalFile.replace(resolve(root)+'/',''),
  textSha256:review.decisions[i].textSha256};});
 writeFileSync(result.file,JSON.stringify(records));
 const updated=JSON.parse(readFileSync(manifestPath));
 updated.releaseGoalPublishedCount=releaseGoal;
 updated.remainingToReleaseGoal=Math.max(0,releaseGoal-updated.publishedCount);
 updated.aiEditorialReviewedCount=(manifest.aiEditorialReviewedCount||0)+records.length;
 updated.latestReviewedBatch={topic:batch.topic,mood:batch.mood,audience:batch.audience,
  count:records.length,firstId:records[0].id,lastId:records.at(-1).id,reviewerType:'AI',humanReviewed:false};
 writeFileSync(manifestPath,JSON.stringify(updated));
 return {...result,aiEditorialReviewed:records.length,remainingToReleaseGoal:updated.remainingToReleaseGoal};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(JSON.stringify(publishReviewedBatch(...process.argv.slice(2)),null,2));
