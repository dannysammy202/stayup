import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const html=readFileSync('public/index.html','utf8');
const sandbox=vm.createContext({window:{},console});
for(let i=1;i<=5;i++)vm.runInContext(readFileSync(`public/iconsax/part-${i}.js`,'utf8'),sandbox);
const core=html.slice(html.indexOf('const iconsaxName='),html.indexOf('const colors='));
assert.ok(core.startsWith('const iconsaxName='));
vm.runInContext(core,sandbox);
const names=vm.runInContext('({iconsaxName,collectionIcon,gameIcon,topicIcon})',sandbox);

test('all requested UI icons resolve to official local Iconsax vector assets',()=>{
 const keys=new Set(Object.keys(sandbox.window.SAYMORE_ICONSAX));
 assert.ok(keys.size>=40,'Official icon pack missing');
 const targets=new Set([...Object.values(names.iconsaxName),...Object.values(names.collectionIcon),...Object.values(names.gameIcon),...Object.values(names.topicIcon),'home','grid','heart','clock','left','arrow','copy','moon','flash','info']);
 for(const k of targets)assert.ok(keys.has(k),`Missing Iconsax SVG: ${k}`);
 for(const k of targets){
  const svg=sandbox.window.SAYMORE_ICONSAX[k];
  assert.match(svg,/<svg\b/,k);
  assert.match(svg,/<path\b|<circle\b|<rect\b/,k);
 }
});
test('all navigation, settings, and actions render SVG, not glyph fallback',()=>{
 for(const name of ['discover','game','bookmark','play','arrow-left','arrow-right','profile-circle','magic-star','message-text','shield-tick','info-circle']){
  const actual=vm.runInContext(`icon(${JSON.stringify(name)})`,sandbox);
  assert.match(actual,/<svg\b/,`Unrendered ${name}`);
  assert.match(actual,/data-iconsax="/);
  assert.doesNotMatch(actual,/data-iconsax="(?:undefined|missing)"/);
 }
});
test('home, game, cards, topics, settings, and history use real svg icons',()=>{
 assert.match(html,/\['discover','Discover','home'/);
 assert.match(html,/\['games','Games','grid'/);
 assert.match(html,/icon\(collectionIcon\[c\.id\]/);
 assert.match(html,/icon\(gameIcon\[g\.id\]/);
 assert.match(html,/icon\(topicIcon\[t\.id\]/);
 assert.match(html,/class="tile-arr">\$\{icon\('arrow-right'/);
 assert.match(html,/class="chev">\$\{icon\('arrow-right'/);
 assert.doesNotMatch(html,/class="tile-arr">›/);
 assert.doesNotMatch(html,/\$\{t\.icon\}/);
});
