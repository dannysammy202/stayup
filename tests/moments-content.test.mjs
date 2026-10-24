import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const ctx={window:{}};
for(const name of ['conversation-experiences.js','conversation-expansion.js','conversation-next-starters.js','conversation-next-games.js','conversation-moments.js','play-moments.js']){
 vm.runInNewContext(readFileSync('public/'+name,'utf8'),ctx);
}
const w=ctx.window;
const originals=[...w.SayMoreExperience.pilot,...w.SayMoreExpansion.pilot,...w.SayMoreNextStarters];
const newPrompts=w.SayMoreConversationMoments;
const all=[...originals,...newPrompts];
const oldGames=[...w.SayMoreExperience.games,...w.SayMoreExpansion.games,...w.SayMoreNextGames];
const newGames=w.SayMorePlayMoments;
const games=[...oldGames,...newGames];
const norm=t=>t.toLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}]+/gu,' ').trim();

test('36 new authored prompts cover all 18 subjects evenly and retain 4 natural directions each',()=>{
 assert.equal(newPrompts.length,36);
 assert.equal(all.length,109);
 const subjects=w.SayMoreExperience.themes.flatMap(x=>x.topics);
 assert.equal(subjects.length,18);
 for(const subject of subjects)assert.equal(newPrompts.filter(p=>p.topic===subject).length,2,subject);
 const ids=new Set(),texts=new Set(),angles=new Set();
 for(const p of all){
  assert.ok(!ids.has(p.id),'Duplicate prompt ID '+p.id);ids.add(p.id);
  const key=norm(p.text);
  assert.ok(!texts.has(key),'Duplicate prompt '+p.id);texts.add(key);
  as¶»§q«^