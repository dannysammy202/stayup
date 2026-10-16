/** Fixed user milestone. This does not replace the full 139,100 release gate. */
import {readFileSync} from 'node:fs';
import {validateCuratedLibrary} from './validate-curated-library.mjs';
const result=validateCuratedLibrary('.');
const m=JSON.parse(readFileSync('public/library-data/manifest.json','utf8'));
if(m.publishedCount!==12000)throw new Error('The active milestone requires exactly 12,000 physical records.');
const records=m.publishedFiles.flatMap(f=>JSON.parse(readFileSync('public/library-data/'+f,'utf8')));
const newRecords=records.filter(p=>Number(p.id.slice(3))>10100);
if(newRecords.length!==1900||newRecords.some(p=>p.aiEditorialReview?.decision!=='pass'||p.humanReviewed!==false))throw new Error('Every added record requires individual AI review with honest provenance.');
if(m.targetCount!==139200||m.combinations.filter(c=>!c.eligible).length!==102)throw new Error('Original coverage matrix must remain intact.');
console.log(JSON.stringify({milestone:12000,status:'prepared_and_validated',newIndividuallyAiReviewed:newRecords.length,productionStatus:'requires_separate_live_verification',catalogue:result},null,2));
