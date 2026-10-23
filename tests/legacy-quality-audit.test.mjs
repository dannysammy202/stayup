import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {assess,normalise,GENERIC_STEMS} from '../scripts/audit-legacy-quality.mjs';

test('quality audit identifies mechanical phrasing and exact duplicates without deleting any data',()=>{
 const rows=[
   {name:'sample',items:[
     {id:'a',text:'What is your view on weekends?',format:'Question',angles:[]},
     {id:'b',text:'What is your view on weekends?',format:'Question',angles:['Something else?']},
     {id:'c',text:'Which friend always brings the best stories to a gathering?',format:'Hot take',angles:['Who said it first?']}
   ]}
 ];
 const report=assess(rows);
 assert.equal(report.total,3);
 assert.ok(report.flaggedCount>=2);
 assert.equal(report.sources.sample.exactDuplicate,1);
 assert.equal(report.sources.sample.genericStem,2);
 assert.equal(report.sources.sample.missingAngles,1);
 assert.equal(rows[0].items.length,3,'Audit must not mutate or delete original records');
 assert.ok(GENERIC_STEMS.some(re=>re.test(rows[0].items[0].text)));
 assert.equal(normalise('An ordinary thought!'),'an ordinary thought');
});
test('triage covers all 16,200 released older records without claiming they were human-reviewed',()=>{
 const input=['batch1','batch3','batch4'].map(name=>({name,items:JSON.parse(readFileSync('content/'+name+'.json','utf8'))}));
 const report=assess(input);
 assert.equal(report.total,16200);
 assert.equal(report.method,'heuristic-triage-not-human-review');
 assert.equal(report.missingContinuations,16200);
 assert.ok(report.copyReviewCandidates<16200);
 assert.ok(report.copyReviewCandidates>=0);
 for(const name of ['batch1','batch3','batch4']){
   assert.equal(report.sources[name].total,5400);
   assert.equal(Object.values(report.sources[name].formats).reduce((sum,n)=>sum+n,0),5400);
 }
 assert.ok(report.flaggedCount>=0&&report.flaggedCount<=16200);
 assert.ok(report.sample.length<=40);
});
