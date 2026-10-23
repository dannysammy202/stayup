import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const context={window:{}};
for(const asset of ['conversation-experiences.js','conversation-expansion.js','conversation-next-starters.js','conversation-next-games.js']){
 runInNewContext(readFileSync('public/'+asset,'utf8'),context);
}
const base=context.window.SayMoreExperience;
const expansion=context.window.SayMoreExpansion;
const additions=context.window.SayMoreNextStarters;
const games=context.window.SayMoreNextGames;
const normalise=t=>t.toLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const allStarters=[...base.pilot,...expansion.pilot,...additions];
const allGames=[...base.games,...expansion.games,...games];

test('next original conversation set spans all retained subjects and four useful angles',()=>{
 assert.equal(additions.length,24);
 assert.equal(allStarters.length,73);
 assert.equal(new Set(additions.map(p=>p.topic)).size,18);
 const topics=new Set(base.themes.flatMap(t=>t.topics));
 const ids=new Set(),openers=new Set(),angles=new Set();
 const oldIds=new Set([...base.pilot,...expansion.pilot].map(x=>x.id));
 for(const p of additions){
  assert.ok(topics.has(p.topic),'Unknown topic '+p.topic);
  assert.ok(!ids.has(p.id)&&!oldIds.has(p.id),'Repeated id '+p.id);ids.add(p.id);
  const key=normalise(p.text);assert.ok(!openers.has(key),'Repeated opener '+p.id);openers.add(key);
  assert.ok(p.text.length>=55&&p.text.length<=260,'Needs a complete, conversational hook: '+p.id);
  assert.equal(p.angles.length,4);
  assert.ok(p.angles.every(angle=>angle.length>26&&angle.length<175));
  assert.ok(p.angles.every(angle=>angle.endsWith('?')),'Angles should be easy to ask aloud: '+p.id);
  for(const a of p.angles){const k=normalise(a);assert.ok(!angles.has(k),'Copied follow-up: '+a);angles.add(k);}
  assert.ok(p.moods.length>=2);
  assert.ok(p.audiences.length>0&&p.audiences.every(a=>base.audiences.includes(a)));
  if(p.topic==='Dating')assert.ok(p.audiences.every(a=>['Partner','Crush / Talking stage'].includes(a)));
  if(p.audiences.includes('Family'))assert.ok(!p.moods.includes('Flirty'));
  assert.doesNotMatch(p.text,/what is your view on|tell us what you think|closest real.life story|thinking about your own experience/i);
 }
});
test('next game pack adds distinct playable cards, without rounds or irrelevant audience channels',()=>{
 assert.equal(games.length,42);
 assert.equal(allGames.length,148);
 const seenIds=new Set(),seenText=new Set();
 const validAudience=new Set(base.audiences);
 for(const g of allGames){
  assert.ok(!seenIds.has(g.id),'Duplicate game id: '+g.id);seenIds.add(g.id);
  const key=normalise(g.text);
  assert.ok(!seenText.has(key),'Duplicate game text: '+g.id);seenText.add(key);
 }
 const types=[...new Set(games.map(g=>g.type))];
 assert.equal(types.length,6);
 for(const type of types)assert.equal(games.filter(g=>g.type===type).length,7);
 let targeted=0,channelSpecific=0;
 for(const g of games){
  assert.ok(g.text.length>=45);
  assert.ok(g.audiences.length&&g.audiences.every(a=>validAudience.has(a)));
  assert.ok(g.mediums.length&&g.mediums.every(m=>['Text','Call','In person'].includes(m)));
  assert.doesNotMatch(g.text,/score|leaderboard|\bround \d+\b|restart/i);
  if(!g.audiences.includes('Anyone'))targeted++;
  if(g.mediums.length===1)channelSpecific++;
  if(g.audiences.includes('Family'))assert.doesNotMatch(g.text,/sext|nude/i);
 }
 assert.ok(targeted>=20,'Games should be suitable for different relationships, not just Anyone');
 assert.ok(channelSpecific>=5,'Several games must be written for a real communication channel');
});
test('content is additive, offline-cached and leaves the approved card design intact',()=>{
 const html=readFileSync('public/index.html','utf8');
 const sw=readFileSync('public/sw.js','utf8');
 assert.ok(html.indexOf('conversation-next-starters.js')<html.indexOf('<div id="app"></div><script>'));
 assert.ok(html.indexOf('conversation-next-games.js')<html.indexOf('<div id="app"></div><script>'));
 assert.ok(sw.includes("'/conversation-next-starters.js'"));
 assert.ok(sw.includes("'/conversation-next-games.js'"));
 assert.match(html,/class="cf-feed-row cf-home-idea"/);
 assert.match(html,/class="cf-focus-card"/);
});
