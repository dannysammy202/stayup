import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext, Script} from 'node:vm';

const cwd=process.cwd();
const source=readFileSync(cwd+'/public/conversation-experiences.js','utf8');
const sandbox={window:{}};
runInNewContext(source,sandbox);
const experience=sandbox.window.SayMoreExperience;

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
});
