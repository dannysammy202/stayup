import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const src=readFileSync('public/rc/migration.js','utf8');
const context=vm.createContext({});
vm.runInContext(src,context);
const migration=context.SayMoreMigration;
function store(seed={}){
 const m=new Map(Object.entries(seed));
 return {
  getItem:k=>m.has(k)?m.get(k):null,
  setItem:(k,v)=>m.set(k,String(v)),
  removeItem:k=>m.delete(k),
  key:i=>Array.from(m.keys())[i]??null,
  get length(){return m.size},
  entries:()=>Object.fromEntries(m),
 };
}
test('classic data is copied, never overwritten or deleted',()=>{
 const old=JSON.stringify({saved:['classic-1','same-1','classic-2'],seen:['classic-3','same-1'],hidden:['private'],medium:'Text'});
 const s=store({'conversation-companion-proto-v4':old,'saymore-ng-v2-saved':JSON.stringify(['new-1'])});
 const first=migration.migrate(s,['same-1','new-1']);
 assert.equal(s.getItem('conversation-companion-proto-v4'),old);
 assert.deepEqual(JSON.parse(s.getItem('saymore-ng-v2-saved')),['new-1','same-1']);
 assert.deepEqual(JSON.parse(s.getItem('saymore-ng-v2-history')),['same-1']);
 assert.deepEqual(Array.from(first.archivedSaved),['classic-1','classic-2']);
 assert.deepEqual(Array.from(first.archivedHistory),['classic-3']);
 assert.equal(s.getItem('saymore-ng-v2-legacy-backup'),old);
 migration.migrate(s,['same-1','new-1']);
 assert.deepEqual(JSON.parse(s.getItem('saymore-ng-v2-saved')),['new-1','same-1']);
});
test('reset is scoped and does not unexpectedly re-import classics',()=>{
 const old=JSON.stringify({saved:['same-1']});
 const s=store({'conversation-companion-proto-v4':old,'unrelated-settings':'yes'});
 migration.migrate(s,['same-1']);
 assert.equal(migration.resetRC(s),true);
 assert.equal(s.getItem('conversation-companion-proto-v4'),old);
 assert.equal(s.getItem('unrelated-settings'),'yes');
 assert.equal(s.getItem('saymore-ng-v2-saved'),null);
 assert.equal(s.getItem('saymore-ng-v2-legacy-backup'),old);
 migration.migrate(s,['same-1']);
 assert.equal(s.getItem('saymore-ng-v2-saved'),null);
});
test('corrupt old data is ignored and never erased',()=>{
 const s=store({'conversation-companion-proto-v4':'invalid json','saymore-ng-v2-saved':'["new-1"]'});
 const result=migration.migrate(s,['new-1']);
 assert.equal(result.status,'no-legacy');
 assert.equal(s.getItem('conversation-companion-proto-v4'),'invalid json');
});
test('RC uses migration and no global storage.clear; false sync or adult verification unavailable',()=>{
 const html=readFileSync('public/rc/index.html','utf8');
 const sw=readFileSync('public/rc/sw.js','utf8');
 assert.match(html,/\/rc\/migration\.js/);
 assert.match(html,/SayMoreMigration\?\.migrate/);
 assert.match(html,/legacyNotice\("saved"\)/);
 assert.match(html,/legacyNotice\("history"\)/);
 assert.doesNotMatch(html,/localStorage\.clear\(\)/);
 assert.doesNotMatch(html,/data-action="auth-demo"/);
 assert.doesNotMatch(html,/data-action="toggle-18"/);
 assert.match(html,/case 'export-data'/);
 assert.match(sw,/\/rc\/migration\.js/);
});
