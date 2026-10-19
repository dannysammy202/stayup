import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Script } from 'node:vm';
import { buildContent } from '../scripts/build-content.mjs';

test('library build gracefully skips absent archive',async()=>{
 const result=await buildContent('/tmp/saymore-archive-not-present.zip','/tmp/saymore-not-used');
 assert.equal(result,null);
});
test('library loader and application inline script parse',()=>{
 const html=readFileSync(new URL('../public/index.html',import.meta.url),'utf8');
 const source=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)][0][1];
 assert.doesNotThrow(()=>new Script(source));
 assert.doesNotThrow(()=>new Script(readFileSync(new URL('../public/library-loader.js',import.meta.url),'utf8')));
 assert.match(html,/librarySettings\(\)/);
 assert.match(html,/publishedManifest/);
});
test('build converts exact 100k source into deployment shards',()=>{
 const build=readFileSync(new URL('../scripts/build-content.mjs',import.meta.url),'utf8');
 assert.match(build,/ids\.size!==100000/);
 assert.match(build,/drafts\.length!==99900/);
 assert.match(build,/approved\.length!==100/);
});
