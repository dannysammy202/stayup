import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const html=readFileSync('public/index.html','utf8');
const marker='<div id="app"></div><script>';
const src=html.slice(html.indexOf(marker)+marker.length,html.indexOf('</script><script src="/update-check.js"'));
const assets=vm.createContext({window:{}});
vm.runInContext(readFileSync('public/conversation-experiences.js','utf8'),assets);
vm.runInContext(readFileSync('public/conversation-expansion.js','utf8'),assets);
vm.runInContext(readFileSync('public/conversation-next-starters.js','utf8'),assets);
vm.runInContext(readFileSync('public/conversation-next-games.js','utf8'),assets);
vm.runInContext(readFileSync('public/conversation-moments.js','utf8'),assets);
vm.runInContext(readFileSync('public/play-moments.js','utf8'),assets);
for(const file of ['editorial-d1.js','editorial-d2.js','games-d1.js','games-d2.js','editorial-e1.js','games-e1.js'])vm.runInContext(readFileSync('public/'+file,'utf8'),assets);
vm.runInContext(readFileSync('public/conversation-bridges.js','utf8'),assets);

function launch({oldLibrary=false}={}){
 const older=oldLibrary?Array.from({length:5400},(_,i)=>({id:'legacy-test-'+i,text:'Interview-style archive text '+i+'?',source:'batch1-editorial',adult:false,editorialStatus:'approved',topic:'Life',format:'Question',moods:['Chill'],audiences:['Anyone'],angles:['What happened next?']})):[];
 const app={innerHTML:''},overlays={in¶»§q«^