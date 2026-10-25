import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source = readFileSync('public/rc/gist-bringer.js', 'utf8');
const dataMatch = source.match(/^window\.SAYMORE_GIST_LIBRARY=(\[[\s\S]*\]);\s*$/m);
assert.ok(dataMatch, 'Gist Bringer must publish a static, local editorial asset');
const gist = JSON.parse(dataMatch[1]);
const classicCards = readFileSync('public/rc/cards.js', 'utf8');
const originalMatch = classicCards.match(/^window\.SAYMORE_COLLECTION_LIBRARY=(\[[\s\S]*\]);\s*$/);
assert.ok(originalMatch, 'The 5,000 existing collection cards must remain available');
const originals = JSON.parse(originalMatch[1]);
const normalise = str => str.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

test('Gist Bringer has distinct starters and four follow-up directions per story', () => {
  assert.ok(gist.length >= 50, 'Provide a meaningful starter collection');
  assert.ok(gist.every(x => x.collection === 'gist' && /^gist-\d{3}$/.test(x.id)));
  assert.equal(new Set(gist.map(x => x.id)).size, gist.length);
  assert.equal(new Set(gist.map(x => normalise(x.text))).size, gist.length);
  assert.ok(gist.every(x => x.text.length >= 35 && x.text.length <= 260));
  assert.ok(gist.every(x => Array.isArray(x.angles) && x.angles.length === 4));
  assert.ok(gist.every(x => x.angles.every(a => a.length >= 12 && a.length <= 180)));
  assert.ok(gist.every(x => x.editorialStatus === 'new_draft_pending_human_review'));
  assert.ok(gist.every(x => ['Text','Call','In person'].every(m => x.mediums.includes(m))));
  const existing = new Set(originals.map(x => normalise(x.text)));
  assert.ok(gist.every(x => !existing.has(normalise(x.text))), 'New starters must not duplicate existing collection cards');
});

test('Gist Bringer preserves collection navigation, saved IDs and official icon support', () => {
  for (const page of ['public/index.html', 'public/rc/index.html']) {
    const html = readFileSync(page, 'utf8');
    assert.match(html, /<script src="\/rc\/gist-bringer\.js"><\/script>/);
    assert.match(html, /name:'Gist Bringer'/);
    assert.match(html, /window\.SAYMORE_GIST_LIBRARY/);
    assert.match(html, /data-action="more-gist"/);
    assert.match(html, /data-action="copy-angle"/);
    assert.match(html, /state\.saved/);
    assert.match(html, /data-action="next"/);
    const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
    for (const [, script] of scripts) assert.doesNotThrow(() => new vm.Script(script), 'Inline Javascript must parse');
  }
  const root = readFileSync('public/index.html', 'utf8');
  assert.match(root, /gist:'message'/);
  const icons={window:{},console};
  const ctx=vm.createContext(icons);
  for(let i=1;i<=5;i++) vm.runInContext(readFileSync(`public/iconsax/part-${i}.js`,'utf8'),ctx);
  assert.match(icons.window.SAYMORE_ICONSAX.message, /<svg\b/);
});

test('both service workers cache offline Gist Bringer content', () => {
  for (const path of ['public/sw.js','public/rc/sw.js']) {
    const source = readFileSync(path, 'utf8');
    assert.match(source, /\/rc\/gist-bringer\.js/);
    assert.doesNotThrow(() => new vm.Script(source));
  }
});
