import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const vm={window:{}};
const sources=['conversation-experiences.js','conversation-expansion.js','conversation-next-starters.js','conversation-next-games.js','conversation-moments.js','play-moments.js','curated-d1.js','curated-d2.js','curated-games-d.js'];
for(const name of sources)runInNewContext(readFileSync('public/'+name,'utf8'),vm);
const v=vm.window;
const oldPrompts=[...v.SayMoreExperience.pilot,...v.SayMoreExpansion.pilot,...v.SayMoreNextStarters,...v.SayMoreConversationMoments];
const newPrompts=[...v.SayMoreCuratedD1,...v.SayMoreCuratedD2];
const allPrompts=[...oldPrompts,...newPrompts];
const oldGames=[...v.SayMoreExperience.games,...v.SayMoreExpansion.games,...v.SayMoreNextGames,...v.SayMorePlayMoments];
const newGames=v.SayMoreCuratedGamesD;
const norm=s=>s.toLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const assertUnique=(items,field)=>{
 const seen=new Set();
 for(const x of items){const k=norm(x[field]);assert.ok(!seen.has(k),'Repeated '+field+' in '+x.id);seen.add(k);}
};
test('90 independent author-written conversation starters evenly cover all 18 subjects',()=>{
 assert.equal(oldPrompts.length,109);
 assert.equal(newPrompts.length,90);
 assert.equal(allPrompts.length,199);
 const subjects=v.SayMoreExperience.themes.flatMap(t=>t.topics);
 assert.equal(subjects.length,18);
 for(const name of subjects)assert.equal(newPrompts.filter(p=>p.topic===name).length,5,name);
 assertUnique(allPrompts,'text');
 assert.equal(new Set(allPrompts.map(p=>p.id)).size,199);
});
test('360 specific four-part followups are original, conversational and audience-appropriate',()=>{
 assert.equal(newPrompts.reduce((n,p)=>n+p.angles.length,0),360);
 const auds=v.SayMoreExperience.audiences;
 const allFollowups=new Set();
 for(const p of allPrompts){
  assert.equal(p.angles.length,4,'Four followups per starter: '+p.id);
  for(const angle of p.angles){
   const k=norm(angle);
   assert.ok(!allFollowups.has(k),'Repeated follow-up: '+angle);allFollowups.add(k);
  }
 }
 for(const p of newPrompts){
  assert.ok(p.text.length>=55 && p.text.length<260,'Starter length '+p.id);
  assert.ok(p.angles.every(a=>a.length>26&&a.length<175&&a.endsWith('?')),'Natural follow-up '+p.id);
  assert.ok(p.moods.length>=2 && p.audiences.length>0);
  assert.ok(p.audiences.every(a=>auds.includes(a)),'Unknown audience '+p.id);
  assert.ok(!p.audiences.includes('Family') || !p.moods.includes('Flirty'));
  if(p.topic==='Dating')assert.ok(p.audiences.every(a=>a==='Partner'||a==='Crush / Talking stage'),'Dating is context-specific');
  assert.doesNotMatch(p.text,/what is your view on|tell us what you think|thinking about your own experience/i);
 }
});
test('36 situational games add six to each type without repeats, scores or unsuitable targeting',()=>{
 assert.equal(oldGames.length,208);
 assert.equal(newGames.length,36);
 const games=[...oldGames,...newGames];
 assert.equal(games.length,244);
 assert.equal(new Set(games.map(g=>g.id)).size,244);
 assertUnique(games,'text');
 const types=[...new Set(newGames.map(g=>g.type))];
 assert.equal(types.length,6);
 for(const type of types)assert.equal(newGames.filter(g=>g.type===type).length,6,type);
 for(const g of newGames){
  assert.ok(g.text.length>45);
  assert.ok(g.audiences.length&&g.audiences.every(a=>v.SayMoreExperience.audiences.includes(a)));
  assert.ok(g.mediums.length&&g.mediums.every(m=>['Text','Call','In person'].includes(m)));
  assert.doesNotMatch(g.text,/score|leaderboard|\bround \d+\b|restart/i);
  if(g.audiences.includes('Family'))assert.doesNotMatch(g.text,/sext|nude/i);
 }
});
test('old approved look stays locked and new resources remain available offline',()=>{
 const html=readFileSync('public/index.html','utf8');
 const css=readFileSync('public/conversation-ui-v2.css','utf8');
 const sw=readFileSync('public/sw.js','utf8');
 for(const file of ['curated-d1.js','curated-d2.js','curated-games-d.js']){
  assert.ok(html.includes('<script src="/'+file+'"></script>'));
  assert.ok(sw.includes("'/"+file+"'"));
 }
 assert.match(html,/class="cf-feed-row cf-home-idea"/);
 assert.match(html,/class="cf-focus-card"/);
 assert.match(css,/Say More card treatment/);
 assert.match(sw,/saymore-curated-90-v36/);
});
