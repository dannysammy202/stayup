import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const ctx={window:{}};
const files=['conversation-experiences.js','conversation-expansion.js','conversation-next-starters.js','conversation-next-games.js','conversation-moments.js','play-moments.js','editorial-d1.js','editorial-d2.js','games-d1.js','games-d2.js','editorial-e1.js','games-e1.js'];
for(const file of files)vm.runInNewContext(readFileSync('public/'+file,'utf8'),ctx);
const w=ctx.window;
const fresh=w.SayMoreEditorialE1;
const freshGames=w.SayMoreGamesE1;
const previous=[...w.SayMoreExperience.pilot,...w.SayMoreExpansion.pilot,...w.SayMoreNextStarters,...w.SayMoreConversationMoments,...w.SayMoreEditorialD1,...w.SayMoreEditorialD2];
const previousGames=[...w.SayMoreExperience.games,...w.SayMoreExpansion.games,...w.SayMoreNextGames,...w.SayMorePlayMoments,...w.SayMoreGamesD1,...w.SayMoreGamesD2];
const topics=w.SayMoreExperience.themes.flatMap(x=>x.topics);
const moods=['Chill','Playful','Curious','Deep','Flirty','Bold'];
const normalise=s=>s.toLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const words=s=>new Set(normalise(s).split(' ').filter(x=>x.length>2));
function closeEnough(x,y){
 if(x===y)return true;
 const a=words(x),b=words(y);
 if(Math.max(a.size,b.size)>1.65*Math.min(a.size,b.size))return false;
 let overlap=0;for(const term of a)if(b.has(term))overlap++;
 return overlap/(a.size+b.size-overlap)>=.7¶»§q«^