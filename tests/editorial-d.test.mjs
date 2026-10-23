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
 assert.equal(new Set(current.map(p=>p.topic)).size,18);
 const all=[...past,...current];
 assert.equal(new Set(all.map(p=>p.id)).size,163);
 assert.equal(new Set(all.map(p=>norm(p.text))).size,163,'Duplicated curated conversation');
 const previousAngles=new Set();
 for(const p of all)for(const angle of p.angles){
  const key=norm(angle);
  assert.ok(!previousAngles.has(key),'Duplicate follow-up: '+angle);previousAngles.add(key);
 }
 assert.equal(previousAngles.size,652,'Existing 436 + 216 new authored directions');
 for(const p of current){
  assert.ok(p.text.length>=55&&p.text.length<=260,'Poor opener length '+p.id);
  assert.equal(p.angles.length,4,p.id);
  assert.ok(p.angles.every(a=>a.length>26&&a.length<175&&a.endsWith('?')),'Specific complete follow-up expected '+p.id);
  assert.ok(p.moods.length>=2&&p.moods.length<=3,p.id);
  assert.ok(p.audiences.length>0&&p.audiences.every(a=>w.SayMoreExperience.audiences.includes(a)),p.id);
  if(p.topic==='Dating')assert.ok(p.audiences.every(a=>['Partner','Crush / Talking stage'].includes(a)),'Dating audience mismatch');
  if(p.audiences.includes('Family'))assert.ok(!p.moods.includes('Flirty'),'Romantic material must never target Family');
 }
});

test('72 games add 12 each across existing six game experiences, with no scores or rounds',()=>{
 assert.equal(games.length,72);
 assert.equal(pastGames.length+games.length,280);
 const types=['Would You Rather','Hot Takes','Never Have I Ever','What Would You Do?','This or That','Story Chain'];
 for(const type of types)assert.equal(games.filter(g=>g.type===type).length,12,type);
 const seenIds=new Set(),seenText=new Set();
 for(const g of [...pastGames,...games]){
  assert.ok(!seenIds.has(g.id),'Repeated game ID '+g.id);seenIds.add(g.id);
  const key=norm(g.text);
  assert.ok(!seenText.has(key),'Repeated game '+g.id);seenText.add(key);
 }
 let audienceSpecific=0,channelSpecific=0;
 for(const g of games){
  assert.ok(g.text.length>=45,'Game is too brief '+g.id);
  assert.ok(g.mediums.length>0&&g.mediums.every(m=>['Text','Call','In person'].includes(m)));
  assert.ok(g.audiences.length>0&&g.audiences.every(a=>w.SayMoreExperience.audiences.includes(a)));
  assert.doesNotMatch(g.text,/leaderboard|score|restart|\bround \d+\b/i);
  if(!g.audiences.includes('Anyone'))audienceSpecific++;
  if(g.mediums.length===1)channelSpecific++;
  if(g.audiences.includes('Family'))assert.doesNotMatch(g.text,/kiss|sext|nude|sexual/i);
 }
 assert.ok(audienceSpecific>=40,'Include enough audience-specific games');
 assert.ok(channelSpecific>=6,'Add games written for text or call');
});

test('new editorial material is distinct from pre-existing 16,200 archive entries',()=>{
 const legacy=new Set();
 for(const file of ['batch1','batch3','batch4']){
  for(const entry of JSON.parse(readFileSync('content/'+file+'.json','utf8'))){
   legacy.add(norm(entry.text));
  }
 }
 for(const prompt of current){
  assert.ok(!legacy.has(norm(prompt.text)),'Repeat of archived copy: '+prompt.id);
 }
});

test('approved Say More cards and navigation unchanged, new assets offline-ready',()=>{
 const html=readFileSync('public/index.html','utf8');
 const sw=readFileSync('public/sw.js','utf8');
 const style=readFileSync('public/conversation-ui-v2.css','utf8');
 for(const name of ['editorial-d1.js','editorial-d2.js','games-d1.js','games-d2.js']){
  assert.ok(html.includes('<script src="/'+name+'"></script>'));
  assert.ok(sw.includes("'/"+name+"'"));
 }
 for(const token of ['EXPERIENCE_EDITORIAL_D1','EXPERIENCE_EDITORIAL_D2','EXPERIENCE_GAMES_D1','EXPERIENCE_GAMES_D2'])assert.ok(html.includes(token));
 assert.ok(html.includes('class="cf-feed-row cf-home-idea"'));
 assert.ok(html.includes('class="cf-focus-card"'));
 assert.ok(style.includes('Say More card treatment'));
 assert.ok(sw.includes('saymore-editorial-continued-v36'));
 assert.ok(html.includes("mobileItem('home'"));
});
