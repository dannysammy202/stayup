import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const context={window:{}};
for(const f of ['conversation-experiences.js','conversation-expansion.js','conversation-bridges.js']) {
 runInNewContext(readFileSync('public/'+f,'utf8'),context);
}
const starters=[...context.window.SayMoreExperience.pilot,...context.window.SayMoreExpansion.pilot];
const bridges=context.window.SayMoreBridges;
const canon=s=>s.toLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
test('every conversation-first starter has its own optional conversational observation',()=>{
 const ids=new Set(starters.map(p=>p.id));
 assert.equal(ids.size,49);
 assert.equal(Object.keys(bridges).length,49);
 assert.deepEqual(Object.keys(bridges).sort(),[...ids].sort());
 const unique=new Set();
 for(const p of starters){
  const line=bridges[p.id];
  assert.ok(line&&line.length>=50&&line.length<=205,p.id);
  assert.ok(!line.includes('?'),'A bridge should not just be another question: '+p.id);
  const key=canon(line);
  assert.ok(!unique.has(key),'Repeated bridge: '+p.id);
  unique.add(key);
  assert.notEqual(key,canon(p.text),'Bridge merely repeats prompt: '+p.id);
  for(const angle of p.angles)assert.notEqual(key,canon(angle),'Bridge duplicates an angle: '+p.id);
 }
});
test('bridge asset is loaded and cached for offline PWA users',()=>{
 const html=readFileSync('public/index.html','utf8');
 const sw=readFileSync('public/sw.js','utf8');
 assert.match(html,/conversation-bridges\.js/);
 assert.match(sw,/conversation-bridges\.js/);
 assert.match(html,/const BRIDGES=window\.SayMoreBridges\|\|\{\}/);
 assert.match(html,/data-action="copyBridge"/);
});
