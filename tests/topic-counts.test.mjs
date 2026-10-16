import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const html=readFileSync('public/index.html','utf8');
const manifest=JSON.parse(readFileSync('public/library-data/manifest.json','utf8'));
const from=html.indexOf('function totalTopic(topic){');
const to=html.indexOf('function menuItem(',from);
assert.ok(from>0&&to>from,'topic counter functions must exist');
const counterCode=html.slice(from,to);
const context=vm.createContext({
 publishedManifest:manifest,librarySummary:{count:manifest.publishedCount},
 libraryLoadError:'',topicCountCacheKey:'',topicCountCache:{},
 state:{adult:false,hidden:[]},inPool:()=>[]
});
vm.runInContext(counterCode+';this.topicCount=totalTopic;this.topicLabel=topicCountLabel;',context);

test('All Topics shows active 50-per-combination totals before prompt shards are downloaded',()=>{
 for(const topic of manifest.topics){
  const expected=manifest.combinations.filter(c=>c.eligible&&c.topic===topic).reduce((n,c)=>n+c.active,0);
  assert.equal(context.topicCount(topic),expected,topic);
  const label=context.topicLabel(topic);
  if(expected)assert.match(label,new RegExp(expected.toLocaleString('en-GB').replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+' published prompts'),topic);
  else assert.match(label,/No published prompts yet/,topic);
 }
 assert.match(html,/\$\{topicCountLabel\(t\)\}/,'topic cards use full catalogue labels');
});

test('Missing catalogue is never represented by the tiny demonstration collection',()=>{
 context.publishedManifest=null;
 assert.match(context.topicLabel('Relationships'),/Loading published catalogue/);
 context.libraryLoadError='Failed to load';
 assert.match(context.topicLabel('Relationships'),/Catalogue unavailable/);
 assert.match(html,/data-action="retryLibrary"/);
 assert.match(html,/a==='retryLibrary'/);
});

test('PWA fetches updated page and catalogue manifest online before using cache',()=>{
 const sw=readFileSync('public/sw.js','utf8');
 assert.match(sw,/saymore-curated-v6/);
 assert.match(sw,/networkFirst=url\.pathname/);
 assert.match(sw,/url\.pathname==='\/library-data\/manifest\.json'/);
 assert.match(sw,/fetch\(request,\{cache:'no-store'\}\)/);
 assert.match(html,/fetch\('\/library-data\/manifest\.json',\{cache:'no-store'\}\)/);
});
