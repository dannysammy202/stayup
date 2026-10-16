import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script,runInNewContext} from 'node:vm';

const html=readFileSync('public/index.html','utf8');
const css=readFileSync('public/truth-or-dare.css','utf8');
const sources=['tod-truth-banks.js','tod-dare-banks.js','truth-or-dare-data.js'];
const sandbox={window:{}};
for(const name of sources)runInNewContext(readFileSync('public/'+name,'utf8'),sandbox);
const cards=Array.from(sandbox.window.SayMoreTruthOrDare);
const audiences=['Anyone','Someone new','Friends','Crush / Talking stage','Partner','Family','Group'];
const levels=['Chill','Playful','Bold'];
const normalise=s=>s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();

test('16,800 cards split evenly between modes and types, without exact duplicates',()=>{
 assert.equal(cards.length,16800);
 assert.equal(cards.filter(c=>!c.adult).length,8400);
 assert.equal(cards.filter(c=>c.adult).length,8400);
 assert.equal(cards.filter(c=>c.type==='Truth').length,8400);
 assert.equal(cards.filter(c=>c.type==='Dare').length,8400);
 assert.equal(new Set(cards.map(c=>c.id)).size,16800);
 assert.equal(new Set(cards.map(c=>normalise(c.text))).size,16800);
 assert.equal(sandbox.window.SayMoreTruthOrDareSummary.total,16800);
});
test('100 Truths and 100 Dares in each of all 84 audience/level/mode/medium selections',()=>{
 for(const adult of [false,true])for(const medium of ['Call','Text'])for(const audience of audiences)for(const level of levels){
  const pool=cards.filter(c=>c.adult===adult&&c.medium===medium&&c.audiences.length===1&&c.audiences[0]===audience&&c.level===level);
  assert.equal(pool.length,200,[adult,audience,level].join('/'));
  assert.equal(pool.filter(c=>c.type==='Truth').length,100);
  assert.equal(pool.filter(c=>c.type==='Dare').length,100);
 }
});
test('all dares work over text, voice note or voice call',()=>{
 const acceptable=new Set(['text','call']);
 for(const c of cards){
  assert.ok(c.id.startsWith('tod-'),c.id);
  assert.ok(c.text.length>=35&&c.text.length<350,c.id+': '+c.text);
  assert.ok(audiences.includes(c.audiences[0]));
  assert.ok(levels.includes(c.level));
  assert.equal(c.humanReviewed,false);
  assert.equal(c.editorialStatus,'screened_pending_editorial_review');
  if(c.type==='Dare'){
    assert.ok(acceptable.has(c.channel),c.id+': '+c.channel);
    assert.ok(c.text.length>0);
    assert.doesNotMatch(c.text,/send (an? )?(intimate |nude |private )?(photo|picture|video)\b/i);
    assert.doesNotMatch(c.text,/\b(post publicly|call a stranger|contact your ex|kiss someone|touch someone)\b/i);
  }else assert.equal(c.channel,'conversation');
 }
});
test('family, group and general-audience 18+ cards avoid romantic physical dares',()=>{
 const nonromantic=new Set(['Anyone','Someone new','Friends','Family','Group']);
 const mature=cards.filter(c=>c.adult&&nonromantic.has(c.audiences[0]));
 assert.equal(mature.length,5*3*2*100*2);
 assert.ok(mature.every(c=>!(/\b(kiss|sext|undress|naked|touch your|sexual fantasy)\b/i.test(c.text))));
});
test('game loads banks before generator, isolates audience/mode and preserves navigation',()=>{
 const a=html.indexOf('/tod-truth-banks.js');
 const b=html.indexOf('/tod-dare-banks.js');
 const c=html.indexOf('/truth-or-dare-data.js');
 assert.ok(a>=0&&b>a&&c>b);
 assert.ok(html.includes("c.audiences.includes(todState.audience)&&c.level===todState.level&&c.adult===state.adult&&c.medium===todState.medium"));
 assert.ok(html.includes("menuItem('shuffle','Truth or Dare','truthordare')"));
 assert.ok(html.includes("mobileItem('shuffle','Play','truthordare')"));
 assert.ok(html.includes('truthordare:todView'));
 assert.ok(html.includes('data-tod-medium'));
 assert.ok(html.includes('data-tod-audience'));
 assert.ok(html.includes('data-tod-level'));
 assert.ok(html.includes('data-tod-type'));
 assert.ok(css.includes('grid-template-columns:repeat(6'));
});
test('inline application script remains syntactically valid',()=>{
 const match=html.match(/<script>([\s\S]*?)<\/script>/);
 assert.ok(match);
 assert.doesNotThrow(()=>new Script(match[1]));
});
