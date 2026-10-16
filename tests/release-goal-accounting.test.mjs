import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,cpSync,mkdirSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {publishContentBatch} from '../scripts/publish-content-batch.mjs';

test('successive publications update the physical release goal before catalogue validation',()=>{
 const root=mkdtempSync(join(tmpdir(),'saymore-release-goal-'));
 try{
  mkdirSync(join(root,'public'),{recursive:true});
  cpSync('public/library-data',join(root,'public/library-data'),{recursive:true});
  mkdirSync(join(root,'content'),{recursive:true});
  cpSync('content/reviews',join(root,'content/reviews'),{recursive:true});
  const manifestPath=join(root,'public/library-data/manifest.json');
  const before=JSON.parse(readFileSync(manifestPath));
  const slot=before.combinations.find(c=>c.eligible&&c.published<49);
  const texts=[
   'A conversation between a lighthouse keeper and a costume designer reveals unexpected ways of noticing details. What might they discuss?',
   'Which inscription would you place inside a time capsule intended for the next people to live on your street?'
  ];
  for(let i=0;i<texts.length;i++){
   const file=join(root,'batch.json');
   writeFileSync(file,JSON.stringify({topic:slot.topic,mood:slot.mood,audience:slot.audience,prompts:[{text:texts[i],format:'Question'}]}));
   publishContentBatch(file,root);
   const after=JSON.parse(readFileSync(manifestPath));
   assert.equal(after.publishedCount,before.publishedCount+i+1);
   assert.equal(after.remainingToReleaseGoal,139100-after.publishedCount);
   assert.equal(after.activePolicy.activeCount,before.activePolicy.activeCount+i+1);
   assert.equal(after.activePolicy.remainingToTarget,before.activePolicy.remainingToTarget-i-1);
  }
 }finally{rmSync(root,{recursive:true,force:true});}
});
