import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const html=readFileSync('public/rc/index.html','utf8');
const cardsSrc=readFileSync('public/rc/cards.js','utf8');
const gamesSrc=readFileSync('public/rc/games.js','utf8');
const inline=cardsSrc.match(/^window\.SAYMORE_COLLECTION_LIBRARY=(\[[\s\S]*\]);\s*$/);
const game=gamesSrc.match(/^window\.SAYMORE_GAME_LIBRARY=(\[[\s\S]*\]);\s*$/);
assert.ok(inline,'Nigerian-first conversation asset should be bundled');
assert.ok(game,'Nigerian-first game asset should be bundled');
assert.match(html,/\/rc\/cards\.js/);
assert.match(html,/\/rc\/games\.js/);
const ideas=JSON.parse(inline[1]), games=JSON.parse(game[1]);
const tally=(a,k)=>a.reduce((acc,x)=>{acc[x[k]]=(acc[x[k]]||0)+1;return acc},{});
const norm=s=>s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();

test('release candidate has 10 collections of 500 and 18 subject tags of 200',()=>{
 assert.equal(ideas.length,5000);
 const byCollection=tally(ideas,'collection');
 assert.equal(Object.keys(byCollection).length,10);
 assert.ok(Object.values(byCollection).every(n=>n===500));
 const tagTotals={};
 for(const c of ideas)for(const t of c.tags||[])tagTotals[t]=(tagTotals[t]||0)+1;
 assert.equal(Object.keys(tagTotals).length,18);
 assert.ok(Object.values(tagTotals).every(n=>n===200));
 assert.equal(new Set(ideas.map(x=>x.id)).size,5000);
 assert.equal(new Set(ideas.map(x=>norm(x.text))).size,5000);
});

test('release candidate contains 300 of each game format with isolated Truth and Dare',()=>{
 assert.equal(games.length,2100);
 const byKind=tally(games,'kind');
 assert.deepEqual(Object.keys(byKind).sort(),['Dare','Hot Takes','Never Have I Ever','Story Spark','This or That','Truth','Would You Rather'].sort());
 assert.ok(Object.values(byKind).every(n=>n===300));
 assert.equal(new Set(games.map(x=>x.id)).size,2100);
 assert.equal(new Set(games.map(x=>norm(x.text))).size,2100);
});

test('the 690 known overlaps are tracked rather than silently published as unique',()=>{
 const texts=new Set(ideas.map(x=>norm(x.text)));
 const overlap=games.filter(x=>texts.has(norm(x.text)));
 assert.ok(overlap.length<=690,'Must not increase previously observed duplicates');
 const ledger=readFileSync('public/rc/overlaps.csv','utf8');
 assert.ok(ledger.includes('game_id,game_type'));
 for(const x of overlap)assert.ok(ledger.includes(x.id));
});

test('staged route uses existing official Iconsax, scoped service worker and isolated saves',()=>{
 assert.match(html,/\/iconsax\/part-1\.js/);
 assert.doesNotMatch(html,/esm\.sh\/iconsax/);
 assert.match(html,/saymore-ng-v2-/);
 assert.doesNotMatch(html,/sm-proto-ng-sample-/);
 assert.match(html,/Open classic Say More/);
 const sw=readFileSync('public/rc/sw.js','utf8');
 assert.match(sw,/\/rc\/index\.html/);
 assert.match(sw,/u\.pathname\.startsWith\('\/rc\/'\)/);
 const current=readFileSync('public/index.html','utf8');
 assert.match(current,/conversation-companion-proto-v4/);
});
