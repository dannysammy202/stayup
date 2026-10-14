import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync('public/index.html', 'utf8');
const expectedBundles = [1, 2, 3, 4, 5];
const icons = {};
for (const part of expectedBundles) {
  const path = `public/iconsax/part-${part}.js`;
  const script = readFileSync(path, 'utf8');
  const match = script.match(/Object\.assign\(window\.SAYMORE_ICONSAX\|\|\{\},(\{[\s\S]*\})\);/);
  assert.ok(match, `Iconsax bundle ${part} must contain asset map`);
  Object.assign(icons, JSON.parse(match[1]));
}

test('bundled icons use genuine Iconsax Linear artwork', () => {
  assert.ok(Object.keys(icons).length >= 40);
  for (const [name, svg] of Object.entries(icons)) {
    assert.match(svg, /^<svg aria-hidden="true"/, name);
    assert.match(svg, /viewBox="0 0 24 24"/, name);
    assert.match(svg, /stroke="currentColor"/, name);
    assert.ok(svg.endsWith('</svg>'), name);
  }
});

test('the approved interface loads Iconsax before application code', () => {
  let previous = -1;
  for (const part of expectedBundles) {
    const position = html.indexOf(`src="/iconsax/part-${part}.js"`);
    assert.ok(position > previous, `bundle ${part} order`);
    previous = position;
  }
  assert.ok(previous < html.indexOf('<script>const DATA') || previous < html.indexOf('<script>\nconst DATA'));
  assert.ok(html.includes('const ICONS=window.SAYMORE_ICONSAX||{};'));
  assert.ok(html.includes("k==='sparkles'?'spark':k"));
});

test('all referenced Iconsax glyphs have a matching asset', () => {
  const named = [...html.matchAll(/icon\('([a-z]+)'\)/g)].map(match => match[1]);
  for (const icon of named) {
    assert.ok(icons[icon === 'sparkles' ? 'spark' : icon], `Missing Iconsax icon: ${icon}`);
  }
  const moods = ['sun', 'spark', 'circle', 'moon', 'heart', 'flash'];
  const topics = ['heart','people','sun','emoji','home','money','global','profile','trend','shuffle','star','music','video','briefcase','teacher','heartadd','musicplaylist','messagequestion'];
  for (const name of [...moods, ...topics]) assert.ok(icons[name], `Missing icon ${name}`);
});

test('no hand-drawn SVG icon definitions or Unicode icon substitutes remain', () => {
  assert.ok(!html.includes("const ICONS={home:'<path"));
  assert.doesNotMatch(html, /[✳☼◌◐⚡♥♡♫☻◈✎⇆]/);
  assert.ok(html.includes('icon(TOPIC_ICONS[TOPICS.indexOf(t)])'));
  assert.ok(html.includes("icon(m==='All moods'?'spark':MOOD_ICONS[m])"));
});

test('main Say More application script parses correctly', () => {
  const blocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert.equal(blocks.length, 1);
  assert.doesNotThrow(() => new vm.Script(blocks[0][1], { filename: 'saymore-inline.js' }));
});
