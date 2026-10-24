import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const ctx={window:{}};
for(const f of ['conversation-experiences.js','conversation-expansion.js','conversation-next-starters.js','conversation-next-games.js','conversation-moments.js','play-moments.js','editorial-d1.js','editorial-d2.js','games-d1.js','games-d2.js','editorial-e1.js','games-e1.js'])vm.runInNewContext(readFileSync('public/'+f,'utf8'),ctx);
const w=ctx.window;
const fresh=w.SayMoreEditorialE1;
const freshGames=w.SayMoreGamesE1;
const previous=[...w.SayMoreExperience.pilot,...w.SayMoreExpansion.pilot,...w.SayMoreNextStarters,...w.SayMoreConversationMoments,...w.SayMoreEditorialD1,...w.SayMoreEditorialD2];
const previousGames=[...w.SayMoreExperience.games,...w.SayMoreExpansion.games,...w.SayMoreNextGames,...w.SayMorePlayMoments,...w.SayMoreGamesD1,...w.SayMoreGamesD2];
const topics=w.SayMoreExperience.themes.flatMap(t=>t.topics);
const normalize=s=>s.toLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const words=s=>new Set(normalize(s).split(' ').filter(x=>x.length>2));
function near(x,y){
 const a=words(x),b=words(y);
 if(Math.max(a.size,b.size)>Math.min(a.size,b.size)*1.65)return false;
 let n=0;for(const word of a)if(b.has(word))n++;
 return n/(a.size+b.size-n)>=0.78;
}

test('E1 adds 54 original starters and 216 distinct contextual directions across 18 subjects',()=>{
 assert.equal(fresh.length,54);
 assert.equal(previous.length,163);
 assert.equal(topics.length,18);
 const texts=new Set(),angles=new Set(),ids=new Set();
 const prior=[...previous,...fresh];
 for(const topic of topics)assert.equal(fresh.filter(p=>p.topic===topic).length,3,topic);
 for(const p of prior){
  assert.ok(!ids.has(p.id),'Duplicated starter ID '+p.id);ids.add(p.id);
  const key=normalize(p.text);assert.ok(!texts.has(key),'Duplicated starter '+p.id);texts.add(key);
  assert.equal(p.angles.length,4,'Missing follow-ups '+p.id);
  for(const text of p.angles){
   const key=normalize(text);assert.ok(!angles.has(key),'Duplicated follow-up '+p.id+': '+text);angles.add(key);
  }
 }
 assert.equal(ids.size,217);
 assert.equal(angles.size,868);
 for(let i=0;i<fresh.length;i++){
  const p=fresh[i];
  assert.ok(topics.includes(p.topic));
  assert.ok(p.text.length>=55&&p.text.length<=260,p.id);
  assert.ok(['Hot take','Story starter','Question','Scenario','Random observation','Quick choice'].includes(p.format),p.id);
  assert.ok(p.moods.length>=2&&p.moods.every(m=>['Chill','Playful','Curious','Deep','Flirty','Bold'].includes(m)),p.id);
  assert.ok(p.audiences.length>0&&p.audiences.every(a=>w.SayMoreExperience.audiences.includes(a)),p.id);
  if(p.topic==='Dating')assert.ok(p.audiences.every(a=>a==='Partner'||a==='Crush / Talking stage'),p.id);
  if(p.audiences.includes('Family'))assert.ok(!p.moods.includes('Flirty'),p.id);
  for(const angle of p.angles){
   assert.ok(angle.length>26&&angle.length<175&&angle.endsWith('?'),p.id);
   assert.ok(!near(p.text,angle),'A direction repeats its opener '+p.id);
  }
  for(const older of [...previous,...fresh.slice(0,i)])assert.ok(!near(p.text,older.text),'Near-duplicate conversation '+p.id+' / '+older.id);
 }
});

test('E1 adds 60 unique games, 10 per type, with suitable audiences and mediums',()=>{
 const types=['Would You Rather','Hot Takes','Never Have I Ever','What Would You Do?','This or That','Story Chain'];
 const all=[...previousGames,...freshGames],ids=new Set(),texts=new Set();
 assert.equal(freshGames.length,60);
 assert.equal(all.length,340);
 for(const type of types)assert.equal(freshGames.filter(g=>g.type===type).length,10,type);
 for(const g of all){
  assert.ok(!ids.has(g.id),'Duplicated game ID '+g.id);ids.add(g.id);
  const key=normalize(g.text);assert.ok(!texts.has(key),'Duplicated game '+g.id);texts.add(key);
 }
 for(let i=0;i<freshGames.length;i++){
  const g=freshGames[i];
  assert.ok(g.text.length>=45&&types.includes(g.type),g.id);
  assert.ok(g.audiences.length>0&&g.audiences.every(a=>w.SayMoreExperience.audiences.includes(a)),g.id);
  assert.ok(g.mediums.length>0&&g.mediums.every(m=>['Text','Call','In person'].includes(m)),g.id);
  assert.doesNotMatch(g.text,/score|leaderboard|restart|points to win|\bround \d+\b/i);
  if(g.audiences.includes('Family'))assert.doesNotMatch(g.text,/sext|nude|sexual|kiss/i);
  for(const other of [...previousGames,...freshGames.slice(0,i)])assert.ok(!near(g.text,other.text),'Near-duplicate game '+g.id+' / '+other.id);
 }
 assert.ok(freshGames.filter(g=>!g.audiences.includes('Anyone')).length>=40);
});

test('E1 retains 16,200 archived everyday conversations and does not copy them verbatim',()=>{
 const archive=['batch1','batch3','batch4'].flatMap(f=>JSON.parse(readFileSync('content/'+f+'.json','utf8')));
 assert.equal(archive.length,16200);
 const seen=new Set(archive.map(p=>normalize(p.text)));
 for(const p of fresh)assert.ok(!seen.has(normalize(p.text)),'Copied archive entry '+p.id);
});

test('E1 registers content in existing UI and offline PWA without replacing card design',()=>{
 const html=readFileSync('public/index.html','utf8');
 const sw=readFileSync('public/sw.js','utf8');
 const css=readFileSync('public/conversation-ui-v2.css','utf8');
 for(const file of ['editorial-e1.js','games-e1.js']){
  assert.ok(html.includes('<script src="/'+file+'"></script>'),'Missing loader '+file);
  assert.ok(sw.includes("'/"+file+"'"),'Missing cached asset '+file);
  assert.ok(sw.includes("url.pathname==='/"+file+"'"),'Missing network refresh '+file);
 }
 for(const item of ['EXPERIENCE_EDITORIAL_E1','EXPERIENCE_GAMES_E1','class="cf-feed-row cf-home-idea"','class="cf-focus-card"'])assert.ok(html.includes(item));
 assert.ok(css.includes('Say More card treatment'));
 assert.ok(sw.includes('saymore-editorial-continued-v37'));
 assert.equal(JSON.parse(readFileSync('public/version.json','utf8')).version,'2026-10-24-editorial-e1');
 assert.ok(readFileSync('public/update-check.js','utf8').includes('2026-10-24-editorial-e1'));
});
