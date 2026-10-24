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
  assert.equal(p.angles.length,4,'Four distinct continuations per curated prompt '+p.id);
  for(const angle of p.angles){const a=norm(angle);assert.ok(!angles.has(a),'Repeated follow-up '+angle);angles.add(a);}
 }
 for(const p of newPrompts){
  assert.ok(p.text.length>=55&&p.text.length<=260);
  assert.ok(p.audiences.length>0&&p.audiences.every(a=>w.SayMoreExperience.audiences.includes(a)));
  assert.ok(p.moods.length>=2);
  assert.ok(p.angles.every(s=>s.length>26&&s.length<175&&s.endsWith('?')));
  if(p.topic==='Dating')assert.ok(p.audiences.every(a=>['Crush / Talking stage','Partner'].includes(a)));
  if(p.audiences.includes('Family'))assert.ok(!p.moods.includes('Flirty'));
  assert.doesNotMatch(p.text,/what is your view on|tell us what you think|closest real.life story|thinking about your own experience/i);
 }
});

test('60 more original game prompts across six types, each suitable for audience and medium',()=>{
 assert.equal(newGames.length,60);
 assert.equal(games.length,208);
 const types=[...new Set(newGames.map(g=>g.type))];
 assert.equal(types.length,6);
 for(const t of types)assert.equal(newGames.filter(g=>g.type===t).length,10,t);
 let targeted=0,channelSpecific=0;
 const ids=new Set(),texts=new Set();
 for(const g of games){
  assert.ok(!ids.has(g.id),'Duplicate game ID '+g.id);ids.add(g.id);
  const key=norm(g.text);assert.ok(!texts.has(key),'Duplicate game card: '+g.id);texts.add(key);
 }
 for(const g of newGames){
  assert.ok(g.text.length>=45);
  assert.ok(g.audiences.length&&g.audiences.every(a=>w.SayMoreExperience.audiences.includes(a)));
  assert.ok(g.mediums.length&&g.mediums.every(m=>['Text','Call','In person'].includes(m)));
  assert.doesNotMatch(g.text,/score|leaderboard|\bround \d+\b|restart/i);
  if(!g.audiences.includes('Anyone'))targeted++;
  if(g.mediums.length===1)channelSpecific++;
  if(g.audiences.includes('Family'))assert.doesNotMatch(g.text,/sext|nude/i);
 }
 assert.ok(targeted>=30,'More than half should have a specific audience');
 assert.ok(channelSpecific>=10,'At least ten cards should be channel-specific');
});

test('no new authorship accidentally repeats published older daily prompts',()=>{
 const legacy=new Set();
 for(const filename of ['batch1','batch3','batch4'])
  for(const p of JSON.parse(readFileSync('content/'+filename+'.json','utf8')))legacy.add(norm(p.text));
 for(const p of newPrompts)assert.ok(!legacy.has(norm(p.text)),'Already in old library: '+p.id);
});

test('locked Say More UI remains untouched and new content is available offline',()=>{
 const html=readFileSync('public/index.html','utf8');
 const sw=readFileSync('public/sw.js','utf8');
 const css=readFileSync('public/conversation-ui-v2.css','utf8');
 for(const name of ['conversation-moments.js','play-moments.js']){
  assert.ok(html.includes('<script src="/'+name+'"></script>'));
  assert.ok(sw.includes("'/" + name + "'"));
 }
 assert.ok(html.includes('EXPERIENCE_MOMENTS'));
 assert.ok(html.includes('EXPERIENCE_GAME_MOMENTS'));
 assert.ok(html.includes('class="cf-feed-row cf-home-idea"'));
 assert.ok(html.includes('class="cf-focus-card"'));
 assert.match(css,/Say More card treatment/);
 assert.match(sw,/saymore-editorial-continued-v37/);
});
