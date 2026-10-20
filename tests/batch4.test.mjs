import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {validateBatch4,TOPICS,MOODS,AUDIENCES,hash,normalise,isHeld} from '../scripts/batch4-release.mjs';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const rows=read('content/batch4.json'),batch1=read('content/batch1.json'),batch3=read('content/batch3.json');
const html=fs.readFileSync('public/index.html','utf8');
const source=html.slice(html.indexOf('function inPool(){'),html.indexOf('function sorted(list)'));
const state={hidden:[],adult:false,topic:'All topics',mood:'All moods',audience:'Anyone',query:''};
const adult={id:'adult',text:'An adults-only prompt.',adult:true,source:'editorial-original',topic:'Life',moods:['Bold'],audiences:['Partner'],editorialStatus:'approved'};
const ctx=vm.createContext({PROMPTS:[...batch1,...batch3,...rows,adult],batchReady:true,batch3Ready:true,batch4Ready:true,state});vm.runInContext(source,ctx);

test('Batch 4 has exactly 5,400 unique records in 54 balanced cells, including the approved Faith x Flirty cells',()=>{
 const r=validateBatch4(rows,{approved:true,priorTexts:[...batch1,...batch3].map(p=>p.text)});
 assert.equal(r.total,5400);assert.equal(Object.keys(r.cells).length,54);
 assert.deepEqual(r.topics,{'Random & Hypothetical':1800,'Faith & Spirituality':1800,'Music':1800});
 assert.equal(rows.filter(p=>p.topic==='Faith & Spirituality'&&p.moods[0]==='Flirty').length,300);
});
test('no Batch 4 text repeats Batch 1 or Batch 3',()=>{
 const prior=new Set([...batch1,...batch3].map(p=>normalise(p.text)));
 assert.equal(rows.filter(p=>prior.has(normalise(p.text))).length,0);
});
test('every live Batch 4 cell returns exactly 100 and held cells return none',()=>{
 for(const topic of TOPICS)for(const mood of MOODS)for(const audience of AUDIENCES){
  Object.assign(state,{topic,mood,audience});assert.equal(ctx.filtered().length,isHeld(topic,mood)?0:100,[topic,mood,audience].join('/'));
 }
 Object.assign(state,{topic:'All topics',mood:'All moods',audience:'Anyone'});
});
test('Batches 1, 3 and 4 compose without double counting',()=>{
 assert.equal(ctx.filtered().length,16200);
 state.topic='Faith & Spirituality';assert.equal(ctx.filtered().length,1800);state.topic='Music';assert.equal(ctx.filtered().length,1800);state.topic='All topics';
 state.mood='Flirty';assert.equal(ctx.filtered().length,2700);state.mood='All moods';
});
test('Batch 4 fails closed and leaves earlier batches untouched when not ready',()=>{
 ctx.batch4Ready=false;assert.equal(ctx.filtered().length,10800);assert.ok(ctx.inPool().every(p=>p.source!=='batch4-editorial'));ctx.batch4Ready=true;
});
test('adult mode never shows Batch 4 everyday content',()=>{
 state.adult=true;assert.deepEqual(Array.from(ctx.inPool(),p=>p.id),['adult']);state.adult=false;
});
test('every Batch 4 text matches its evidence, labelled honestly',()=>{
 const review=read('content/batch4-editorial-review.json');
 assert.equal(review.status,'passed');assert.equal(review.humanReviewed,false);assert.equal(review.independentReview,'pending');
 const map=new Map(review.rows.map(r=>[r.id,r]));assert.equal(map.size,5400);
 for(const p of rows){const r=map.get(p.id);assert.equal(r.textHash,hash(p.text));assert.equal(r.decision,'approve');assert.equal(r.humanReviewed,false);assert.equal(r.independentReviewer,null);}
});
test('QA fingerprint matches and every similarity candidate is resolved',()=>{
 const qa=read('content/batch4-qa.json');
 assert.equal(qa.status,'passed');assert.equal(qa.contentSha256,hash(JSON.stringify(rows)));
 assert.equal(qa.similarity.unresolved,0);assert.equal(qa.similarity.candidates,qa.similarity.decisions.length);
 assert.deepEqual(qa.heldCells,[]);
});
test('the app and offline cache load Batch 4 after Batch 3',()=>{
 assert.match(html,/<script src="\/batch3-data.js"><\/script><script src="\/batch4-data.js"><\/script>/);
 const sw=fs.readFileSync('public/sw.js','utf8');assert.match(sw,/'\/batch4-data.js'/);assert.match(sw,/const networkFirst=.*batch4-data/);
});
