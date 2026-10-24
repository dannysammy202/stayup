import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const sandbox={window:{}};
for(const name of ['conversation-experiences.js','conversation-expansion.js','conversation-next-starters.js','conversation-next-games.js','conversation-moments.js','play-moments.js','editorial-d1.js','editorial-d2.js','games-d1.js','games-d2.js']){
 runInNewContext(readFileSync('public/'+name,'utf8'),sandbox);
}
const w=sandbox.window;
const current=[...w.SayMoreEditorialD1,...w.SayMoreEditorialD2];
const games=[...w.SayMoreGamesD1,...w.SayMoreGamesD2];
const past=[...w.SayMoreExperience.pilot,...w.SayMoreExpansion.pilot,...w.SayMoreNextStarters,...w.SayMoreConversationMoments];
const pastGames=[...w.SayMoreExperience.games,...w.SayMoreExpansion.games,...w.SayMoreNextGames,...w.SayMorePlayMoments];
const norm=s=>s.toLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const countBy=(items,key)=>Object.fromEntries([...new Set(items.map(item=>item[key]))].map(value=>[value,items.filter(item=>item[key]===value).length]));
const topics=new Set(w.SayMoreExperience.themes.flatMap(t=>t.topics));

test('54 editorial conversations add exactly three to each of the 18 subjects',()=>{
 assert.equal(current.length,54);
 assert.equal(past.length+current.length,163);
 for(const topic of topics)assert.equal(current.filter(p=>p.topic===topic).length,3,topic);
 assert.equal(new Set(current.map(p=>p.top¶»§q«^