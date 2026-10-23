import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const html=readFileSync('public/index.html','utf8');
const rows=JSON.parse(readFileSync('content/batch1.json','utf8'));
const from=html.indexOf('function totalTopic(topic){'),to=html.indexOf('function menuItem(',from);
const context=vm.createContext({batchReady:true,state:{adult:false},inPool:()=>rows});
vm.runInContext(html.slice(from,to),context);
test('topic cards reflect the complete everyday catalogue',()=>{
 for(const topic of ['Relationships','Friendships','Life']){assert.equal(context.totalTopic(topic),1800);assert.match(context.topicCountLabel(topic),/1,800 conversation starters/);}
 assert.equal(context.totalTopic('Music'),0);assert.match(context.topicCountLabel('Music'),/No prompts in this release/);
});
test('failed batch loading does not display legacy content counts',()=>{context.batchReady=false;assert.match(context.topicCountLabel('Relationships'),/Library unavailable/);context.batchReady=true;});
test('PWA includes the complete batch offline and checks fresh content online',()=>{
 const sw=readFileSync('public/sw.js','utf8');assert.match(sw,/saymore-approved-reference-v31/);assert.match(sw,/'\/batch1-data.js'/);assert.match(sw,/const networkFirst=.*batch1-data/);assert.match(sw,/fetch\(request,\{cache:'no-store'\}\)/);
 const version=JSON.parse(readFileSync('public/version.json','utf8')).version;assert.ok(readFileSync('public/update-check.js','utf8').includes(version));assert.match(html,/update-check.js/);
});
