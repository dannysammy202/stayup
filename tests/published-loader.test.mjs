import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const html=readFileSync('public/index.html','utf8');
const loader=html.slice(html.indexOf('async function fetchPublishedFiles('),html.indexOf('async function loadNextPublishedFiles('));
const manifest=JSON.parse(readFileSync('public/library-data/manifest.json','utf8'));
function fixture(){
 const warnings=[],requests=[];
 const context=vm.createContext({publishedManifest:manifest,publishedLoading:false,PROMPTS:[],
  TOPICS:manifest.topics,MOODS:manifest.moods,AUDIENCES:manifest.audiences,
  loadedPublishedShards:new Set(),resetFeedAfterContentUpdate(){},render(){},showToast(){},
  console:{warn(...args){warnings.push(args)}},
  async fetch(path){requests.push(path);return {ok:true,json:async()=>JSON.parse(readFileSync('public'+path,'utf8'))}}});
 vm.runInContext(loader,context);
 return {context,warnings,requests};
}
test('browser loader accepts every real shard, stable ID and Unicode text',async()=>{
 const {context,warnings}=fixture();
 for(const path of manifest.publishedFiles)assert.equal(await context.fetchPublishedFiles([path]),true,path);
 assert.equal(context.PROMPTS.length,manifest.publishedCount);
 assert.equal(context.loadedPublishedShards.size,manifest.publishedFiles.length);
 assert.deepEqual(warnings,[]);
});
test('browser loader rejects unsafe paths before fetching',async()=>{
 const {context,requests}=fixture();
 assert.equal(await context.fetchPublishedFiles(['../private.txt']),false);
 assert.deepEqual(requests,[]);
 assert.equal(context.PROMPTS.length,0);
});
test('browser loader rejects duplicate records without partially adding a shard',async()=>{
 const {context}=fixture();
 assert.equal(await context.fetchPublishedFiles(['approved.json']),true);
 assert.equal(await context.fetchPublishedFiles(['approved.json']),false);
 assert.equal(context.PROMPTS.length,100);
});
