import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {validateBatch3,TOPICS,MOODS,AUDIENCES,hash,normalise} from '../scripts/batch3-release.mjs';
const rows=JSON.parse(fs.readFileSync('content/batch3.json','utf8'));
const batch1=JSON.parse(fs.readFileSync('content/batch1.json','utf8'));
const html=fs.readFileSync('public/index.html','utf8');
const source=html.slice(html.indexOf('function inPool(){'),html.indexOf('function sorted(list)'));
const state={hidden:[],adult:false,topic:'All topics',mood:'All moods',audience:'Anyone',query:''};
const adult={id:'adult',text:'An adults-only prompt.',adult:true,source:'editorial-original',topic:'Life',moods:['Bold'],audiences:['Partner'],editorialStatus:'approved'};
const ctx=vm.createContext({PROMPTS:[...batch1,...rows,adult],batchReady:true,batch3Ready:true,state});vm.runInContext(source,ctx);

test('Batch 3 has exactly 5,400 unique records in 54 balanced cells',()=>{
 const r=validateBatch3(rows,{approved:true,priorTexts:batch1.map(p=>p.text)});
 assert.equal(r.total,5400);assert.equal(Object.keys(r.cells).length,54);
 for(const t of TOPICS)assert.equal(r.topics[t],1800);
});
test('no Batch 3 text repeats a released Batch 1 starter',()=>{
 const prior=new Set(batch1.map(p=>normalise(p.text)));
 assert.equal(rows.filter(p=>prior.has(normalise(p.text))).length,0);
});
test('every Batch 3 filter combination returns exactly 100 in the real app filter',()=>{
 for(const topic of TOPICS)for(const mood of MOODS)for(const audience of AUDIENCES){
  Object.assign(state,{topic,mood,audience});assert.equal(ctx.filtered().length,100,[topic,mood,audience].join('/'));
 }
 Object.assign(state,{topic:'All topics',mood:'All moods',audience:'Anyone'});
});
test('Batch 1 and Batch 3 compose without double counting',()=>{
 assert.equal(ctx.filtered().length,10800);
 for(const topic of ['Relationships','Friendships','Life',...TOPICS]){state.topic=topic;assert.equal(ctx.filtered().length,1800,topic);}
 state.topic='All topics';
 for(const mood of MOODS){state.mood=mood;assert.equal(ctx.filtered().length,1800,mood);}state.mood='All moods';
 for(const audience of AUDIENCES){state.audience=audience;assert.equal(ctx.filtered().length,3600,audience);}state.audience='Anyone';
});
test('Batch 3 fails closed and leaves Batch 1 untouched when it is not ready',()=>{
 ctx.batch3Ready=false;assert.equal(ctx.filtered().length,5400);assert.ok(ctx.inPool().every(p=>p.source==='batch1-editorial'));ctx.batch3Ready=true;
});
test('adult mode never shows Batch 3 everyday content',()=>{
 state.adult=true;assert.deepEqual(Array.from(ctx.inPool(),p=>p.id),['adult']);state.adult=false;
});
test('every Batch 3 text matches its editorial evidence, which is labelled honestly',()=>{
 const review=JSON.parse(fs.readFileSync('content/batch3-editorial-review.json','utf8'));
 assert.equal(review.status,'passed');assert.equal(review.humanReviewed,false);assert.equal(review.independentReview,'pending');
 const map=new Map(review.rows.map(r=>[r.id,r]));assert.equal(map.size,5400);
 for(const p of rows){const r=map.get(p.id);assert.equal(r.textHash,hash(p.text));assert.equal(r.decision,'approve');assert.ok(r.authorReviewer);assert.equal(r.humanReviewed,false);assert.equal(r.independentReviewer,null);}
});
test('QA fingerprint matches content and every similarity candidate is resolved',()=>{
 const qa=JSON.parse(fs.readFileSync('content/batch3-qa.json','utf8'));
 assert.equal(qa.status,'passed');assert.equal(qa.contentSha256,hash(JSON.stringify(rows)));
 assert.equal(qa.similarity.unresolved,0);assert.equal(qa.similarity.candidates,qa.similarity.decisions.length);
 assert.ok(qa.similarity.decisions.every(d=>d.decision==='distinct'&&d.reason));
});
test('the app and offline cache load Batch 3 alongside Batch 1',()=>{
 assert.match(html,/<script src="\/batch1-data.js"><\/script><script src="\/batch3-data.js"><\/script>/);
 const sw=fs.readFileSync('public/sw.js','utf8');assert.match(sw,/'\/batch3-data.js'/);assert.match(sw,/const networkFirst=.*batch3-data/);
});
