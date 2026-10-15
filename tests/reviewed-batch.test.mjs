import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {validateEditorialEvidence} from '../scripts/publish-reviewed-batch.mjs';
const hash=x=>createHash('sha256').update(x).digest('hex');
function fixture(){
 const batch={prompts:[{text:'Which relative asks questions you enjoy answering?'}]};
 const bytes=Buffer.from('{}');
 const retrieval={baselineManifestSha256:hash(bytes),rows:[{textSha256:hash(batch.prompts[0].text)}]};
 const review={reviewerType:'AI',humanReviewed:false,inputSha256:hash(JSON.stringify(batch)),retrievalSha256:hash(JSON.stringify(retrieval)),decisions:[{row:1,decision:'pass',textSha256:retrieval.rows[0].textSha256,distinctAngle:'Identifies a family member whose questions invite comfortable conversation.',natural:true,topicFit:true,moodFit:true,audienceFit:true,ageAppropriate:true,distinctConversationalAngle:true}]};
 return {batch,review,retrieval,bytes};
}
test('individual AI evidence preserves honest reviewer provenance',()=>{
 const f=fixture();assert.equal(validateEditorialEvidence(f.batch,f.review,f.retrieval,f.bytes),true);
 f.review.humanReviewed=true;assert.throws(()=>validateEditorialEvidence(f.batch,f.review,f.retrieval,f.bytes),/provenance/);
});
test('review rejects changed copy, stale baselines and incomplete quality decisions',()=>{
 let f=fixture();f.batch.prompts[0].text='Changed copy after editorial review';assert.throws(()=>validateEditorialEvidence(f.batch,f.review,f.retrieval,f.bytes),/changed batch/);
 f=fixture();assert.throws(()=>validateEditorialEvidence(f.batch,f.review,f.retrieval,Buffer.from('{"changed":true}')),/stale catalogue/);
 f=fixture();f.review.decisions[0].moodFit=false;assert.throws(()=>validateEditorialEvidence(f.batch,f.review,f.retrieval,f.bytes),/moodFit/);
});
