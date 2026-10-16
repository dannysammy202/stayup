import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script,runInNewContext} from 'node:vm';

const html=readFileSync('public/index.html','utf8');
const css=readFileSync('public/truth-or-dare.css','utf8');
const dataset=readFileSync('public/truth-or-dare-data.js','utf8');
const sandbox={window:{}};
runInNewContext(dataset,sandbox);
const cards=Array.from(sandbox.window.SayMoreTruthOrDare);
const audiences=['Anyone','Someone new','Friends','Crush / Talking stage','Partner','Family','Group'];
const levels=['Chill','Playful','Bold'];
const normalize=s=>s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();

test('184 original cards, even Truth/Dare split and no duplicates',()=>{
 assert.equal(cards.length,184);
 assert.equal(cards.filter(x=>x.type==='Truth').length,92);
 assert.equal(cards.filter(x=>x.type==='Dare').length,92);
 assert.equal(new Set(cards.map(x=>x.id)).size,cards.length);
 assert.equal(new Set(cards.map(x=>normalize(x.text))).size,cards.length);
 for(const c of cards){
  assert.match(c.id,/^tod-\d{3}$/);
  assert.ok(['Truth','Dare'].includes(c.type));
  assert.ok(typeof c.text==='string'&&c.text.length>=22&&c.text.length<=220);
  assert.ok(levels.includes(c.level));
  assert.ok(c.audiences.every(a=>audiences.includes(a)));
  assert.equal(typeof c.adult,'boolean');
 }
});
test('all seven audiences and three levels have everyday Truth and Dare content',()=>{
 for(const audience of audiences)for(const level of levels)for(const type of ['Truth','Dare']){
  const matching=cards.filter(c=>!c.adult&&c.type===type&&c.level===level&&(c.audiences.includes(audience)||c.audiences.includes('Anyone')));
  assert.ok(matching.length>=4,`${audience}/${level}/${type} has ${matching.length} cards`);
 }
});
test('adult cards remain explicitly marked and use appropriate audiences',()=>{
 const adult=cards.filter(c=>c.adult);
 assert.equal(adult.length,16);
 assert.ok(adult.every(c=>c.level==='Bold'&&c.audiences.every(a=>['Partner','Crush / Talking stage'].includes(a))));
 assert.ok(cards.some(c=>!c.adult));
});
test('game is present in desktop and mobile navigation without changing catalogue',()=>{
 assert.ok(html.includes("menuItem('shuffle','Truth or Dare','truthordare')"));
 assert.ok(html.includes("mobileItem('shuffle','Play','truthordare')"));
 assert.ok(html.includes('truthordare:todView'));
 assert.ok(html.includes('data-tod-audience'));
 assert.ok(html.includes('data-tod-level'));
 assert.ok(html.includes('data-tod-type'));
 assert.ok(html.includes("!c.adult||state.adult"));
 assert.ok(html.includes('/truth-or-dare.css'));
 assert.ok(html.includes('/truth-or-dare-data.js'));
 assert.ok(css.includes('grid-template-columns:repeat(6'));
});
test('application inline script compiles',()=>{
 const match=html.match(/<script>([\s\S]*?)<\/script>/);
 assert.ok(match);
 assert.doesNotThrow(()=>new Script(match[1]));
});
