import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext, Script} from 'node:vm';

const cwd=process.cwd();
const source=readFileSync(cwd+'/public/conversation-experiences.js','utf8');
const sandbox={window:{}};
runInNewContext(source,sandbox);
runInNewContext(readFileSync(cwd+'/public/conversation-expansion.js','utf8'),sandbox);
const experience=sandbox.window.SayMoreExperience;
const expansion=sandbox.window.SayMoreExpansion;
const allPrompts=[...experience.pilot,...expansion.pilot];
const allGames=[...experience.games,...expansion.games];
const normalise=text=>text.toLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}]+/gu,' ').trim();

test('conversation experience has the agreed simplified architecture',()=>{
 assert.equal(experience.themes.length,6);
 assert.deepEqual(Array.from(experience.vibes),['Mix It Up','Playful','Deep','Flirty','Hot Takes']);
 assert.equal(experience.audiences.length,7);
 assert.deepEqual(Array.from(experience.mediums),['Any format','Text','Call','In person']);
 assert.equal(new Set(experience.themes.map(t=>t.name)).size,6);
 const coverage=experience.themes.flatMap(t=>t.topics);
 assert.equal(new Set(coverage).size,coverage.length,'Subtopics must belong to only one theme');
});
test('pilot conversations support multiple natural continuation paths',()=>{
 const prompts=experience.pilot;
 assert.ok(prompts.length>=12);
 assert.equal(new Set(prompts.map(p=>p.id)).size,prompts.length);
 assert.equal(new Set(prompts.map(p=>p.text.toLowerCase())).size,prompts.length);
 const topics=new Set(experience.themes.flatMap(t=>t.topics));
 for(const prompt of prompts){
  assert.ok(topics.has(prompt.topic),'Unknown topic: '+prompt.topic);
  assert.ok(prompt.audiences.length>0);
  assert.ok(prompt.audiences.every(a=>experience.audiences.includes(a)));
  assert.ok(prompt.angles.length>=3,'Insufficient follow-ups: '+prompt.id);
  assert.equal(new Set(prompt.angles.map(a=>a.toLowerCase())).size,prompt.angles.length);
  if(prompt.topic==='Dating')assert.ok(!prompt.audiences.includes('Family'));
 }
});
test('game cards are unique and compatible with available communication formats',()=>{
 assert.ok(new Set(experience.games.map(g=>g.type)).size>=5);
 assert.equal(new Set(experience.games.map(g=>g.id)).size,experience.games.length);
 assert.equal(new Set(experience.games.map(g=>g.text.toLowerCase())).size,experience.games.length);
 for(const game of experience.games){
   assert.ok(game.mediums.every(m=>experience.mediums.includes(m)));
   assert.ok(game.text.length>20);
 }
});
test('main application inline JavaScript parses and loads the pilot before initial render',()=>{
 const html=readFileSync(cwd+'/public/index.html','utf8');
 assert.ok(html.includes('<script src="/conversation-experiences.js"></script>'));
 const marker='<div id="app"></div><script>';
 const start=html.indexOf(marker);
 const end=html.indexOf('</script><script src="/update-check.js"',start);
 assert.ok(start>=0&&end>start,'Application script markers');
 const js=html.slice(start+marker.length,end);
 assert.doesNotThrow(()=>new Script(js));
 assert.ok(js.includes('function playView(){'));
 assert.ok(js.includes('function matchingVibe(p){'));
 assert.ok(js.includes('function matchingTheme(p){'));
 assert.ok(js.includes('function playPool(type=playState.type){'));
 assert.ok(html.includes('<script src="/conversation-expansion.js"></script>'));
});
test('expanded curated conversations remain original across all published batches',()=>{
 assert.equal(allPrompts.length,49);
 assert.equal(expansion.pilot.length,37);
 assert.equal(new Set(allPrompts.map(p=>p.id)).size,allPrompts.length);
 const legacy=[];
 for(const file of ['batch1','batch3','batch4'])legacy.push(...JSON.parse(readFileSync(cwd+'/content/'+file+'.json','utf8')));
 const old=new Set(legacy.map(p=>normalise(p.text)));
 const keys=new Set(),angles=new Set(),topicCoverage=new Set();
 for(const p of allPrompts){
  const normalized=normalise(p.text);
  assert.ok(!keys.has(normalized),'Duplicate curated conversation: '+p.id);
  assert.ok(!old.has(normalized),'Already published verbatim: '+p.id);
  keys.add(normalized);
  topicCoverage.add(p.topic);
  assert.equal(p.angles.length,4,'Expected four distinct directions: '+p.id);
  assert.ok(p.angles.some(a=>/\?|!/.test(a)),'No conversational direction: '+p.id);
  for(const angle of p.angles){
   const key=normalise(angle);
   assert.notEqual(key,normalized,'Follow-up repeats the opening: '+p.id);
   assert.ok(key.length>15,'Follow-up too short: '+p.id);
   assert.ok(!angles.has(key),'Reused generic follow-up: '+angle);
   angles.add(key);
  }
  assert.ok(!/(what is your view on|closest real.life story|thinking about your own experience)/i.test(p.text));
  assert.ok(p.audiences.length>0);
  assert.ok(!p.audiences.includes('Family')||!p.moods.includes('Flirty'));
 }
 assert.equal(topicCoverage.size,18,'Coverage must span all retained non-game topics');
});
test('expanded games are non-repeating, audience-appropriate and playable without rounds',()=>{
 assert.equal(expansion.games.length,96);
 assert.equal(allGames.length,106);
 assert.equal(new Set(allGames.map(p=>p.id)).size,allGames.length);
 const texts=new Set();
 for(const g of allGames){
  const key=normalise(g.text);
  assert.ok(!texts.has(key),'Repeated game card: '+g.id);
  texts.add(key);
  assert.ok(g.audiences.length>0 && g.audiences.every(a=>experience.audiences.includes(a)));
  assert.ok(g.mediums.length>0 && g.mediums.every(m=>experience.mediums.includes(m)&&m!=='Any format'));
  assert.notEqual(g.adult,true);
  assert.ok(!/(score|round \d+|leaderboard|points to win)/i.test(g.text));
  if(g.audiences.includes('Family'))assert.ok(!/\b(sext|nude|kiss someone)\b/i.test(g.text));
 }
 const types=[...new Set(allGames.map(g=>g.type))];
 assert.ok(types.includes('Story Chain'));
 for(const type of types)assert.ok(allGames.filter(g=>g.type===type).length>=12,type);
 assert.ok(allGames.some(g=>g.mediums.length===1 && g.mediums[0]==='Text'),'No tailored texting games');
 assert.ok(allGames.some(g=>g.mediums.length===1 && g.mediums[0]==='Call'),'No tailored calling games');
 assert.ok(allGames.some(g=>g.audiences.includes('Family')&&!g.audiences.includes('Anyone')));
 assert.ok(allGames.some(g=>g.audiences.includes('Crush / Talking stage')&&!g.audiences.includes('Anyone')));
});
