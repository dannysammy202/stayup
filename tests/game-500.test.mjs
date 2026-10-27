import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const expansion=['truth','dare','wyr','never','hot','thisthat','story'];
const root='public/rc/';
const originals=readFileSync(root+'games.js','utf8').match(/^window\.SAYMORE_GAME_LIBRARY=(\[[\s\S]*\]);\s*$/);
assert.ok(originals,'Original game catalogue must remain intact');
const baseline=JSON.parse(originals[1]);
const context=vm.createContext({window:{SAYMORE_GAME_LIBRARY:baseline.map(x=>({...x}))}});
for(const file of ['game-overrides.js','game-overrides-remaining.js',...expansion.map(x=>'game-500-'+x+'.js')]){
  vm.runInContext(readFileSync(root+file,'utf8'),context,{timeout:10000});
}
const combined=Array.from(context.window.SAYMORE_GAME_LIBRARY);
const norm=s=>s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();

test('all seven formats now contain exactly 500 cards, preserving the previous 2,100',()=>{
  assert.equal(baseline.length,2100);
  assert.equal(combined.length,3500);
  const expected=['Truth','Dare','Would You Rather','Never Have I Ever','Hot Takes','This or That','Story Spark'];
  for(const kind of expected){
    assert.equal(combined.filter(x=>x.kind===kind).length,500,kind);
    assert.equal(baseline.filter(x=>x.kind===kind).length,300,'Original count: '+kind);
  }
  assert.equal(combined.filter(x=>x.game==='truthdare').length,1000);
  assert.equal(context.window.SAYMORE_GAME_EDITORIAL_REWRITE_COUNT,30);
  assert.equal(context.window.SAYMORE_GAME_ADDITIONAL_REWRITES,660);
});

test('expanded games preserve IDs and all new cards contain usable prompts',()=>{
  const currentIds=new Set(baseline.map(x=>x.id));
  const added=combined.filter(x=>!currentIds.has(x.id));
  assert.equal(added.length,1400);
  assert.equal(new Set(combined.map(x=>x.id)).size,3500);
  assert.equal(new Set(combined.map(x=>norm(x.text))).size,3500);
  assert.ok(added.every(x=>x.isGame&&x.text.length>=25&&x.mediums.includes('Text')&&x.mediums.includes('Call')&&x.mediums.includes('In person')));
  assert.ok(added.every(x=>x.editorialStatus==='new_nigerian_game_draft_pending_editorial_review'));
  for(const name of expansion){
    const records=added.filter(x=>x.id.startsWith('ng-game-'+(name==='truth'||name==='dare'?'truthdare-'+name+'-':name+'-')));
    assert.equal(records.length,200,name);
    const sequence=records.map(x=>Number(x.id.slice(-3))).sort((a,b)=>a-b);
    assert.deepEqual(sequence,Array.from({length:200},(_,i)=>i+301),name);
  }
});

test('new game content does not repeat existing collections or Gist Bringer',()=>{
  const cards=JSON.parse(readFileSync(root+'cards.js','utf8').match(/^window\.SAYMORE_COLLECTION_LIBRARY=(\[[\s\S]*\]);\s*$/)[1]);
  const gist=vm.createContext({window:{}});
  for(const file of ['gist-bringer.js','gist-bringer-expansion-1.js','gist-bringer-expansion-2.js','gist-bringer-expansion-3.js']){
    vm.runInContext(readFileSync(root+file,'utf8'),gist,{timeout:10000});
  }
  const otherTexts=new Set([...cards,...Array.from(gist.window.SAYMORE_GIST_LIBRARY)].map(x=>norm(x.text)));
  const existingIds=new Set(baseline.map(x=>x.id));
  const newCards=combined.filter(x=>!existingIds.has(x.id));
  assert.deepEqual(newCards.filter(x=>otherTexts.has(norm(x.text))).map(x=>x.id),[]);
});

test('all added banks are loaded in both app routes and cached offline',()=>{
  for(const htmlPath of ['public/index.html','public/rc/index.html']){
    const html=readFileSync(htmlPath,'utf8');
    assert.match(html,/3,500 Nigerian-first game cards/);
    const overridePosition=html.indexOf('/rc/game-overrides-remaining.js');
    for(const x of expansion){
      const pos=html.indexOf('/rc/game-500-'+x+'.js');
      assert.ok(pos>overridePosition,htmlPath+': '+x+' must load after overrides');
    }
  }
  for(const swPath of ['public/sw.js','public/rc/sw.js']){
    const sw=readFileSync(swPath,'utf8');
    for(const x of expansion) assert.ok(sw.includes('/rc/game-500-'+x+'.js'),swPath+': '+x);
    assert.doesNotThrow(()=>new vm.Script(sw));
  }
});
