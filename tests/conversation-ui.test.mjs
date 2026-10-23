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
vm.runInContext(readFileSync('public/conversation-bridges.js','utf8'),assets);

function launch({oldLibrary=false}={}){
 const older=oldLibrary?Array.from({length:5400},(_,i)=>({id:'legacy-test-'+i,text:'Interview-style archive text '+i+'?',source:'batch1-editorial',adult:false,editorialStatus:'approved',topic:'Life',format:'Question',moods:['Chill'],audiences:['Anyone'],angles:['What happened next?']})):[];
 const app={innerHTML:''},overlays={innerHTML:''},toast={innerHTML:''};
 const elements={app,overlays,toaster:toast};
 const doc={
  body:{className:''},
  getElementById:id=>elements[id]||null,
  addEventListener(){},
  querySelector(){return null;}
 };
 const todExamples=[
  {id:'test-truth-1',type:'Truth',level:'Playful',adult:false,medium:'Text',audiences:['Friends'],text:'What song never fails to make you laugh?'},
  {id:'test-truth-2',type:'Truth',level:'Playful',adult:false,medium:'Text',audiences:['Friends'],text:'What is your funniest school memory?'},
  {id:'test-dare-1',type:'Dare',level:'Playful',adult:false,medium:'Text',audiences:['Friends'],text:'Describe your day with only three words.'}
 ];
 const ctx=vm.createContext({
  window:{SayMoreExperience:assets.window.SayMoreExperience,SayMoreExpansion:assets.window.SayMoreExpansion,SayMoreBridges:assets.window.SayMoreBridges,SayMoreBatch1:older,SayMoreEditorialTruthOrDare:todExamples,SAYMORE_ICONSAX:{info:'<svg></svg>',arrow:'<svg></svg>'},addEventListener(){},scrollTo(){}},
  document:doc,localStorage:{getItem:()=>null,setItem(){}},
  navigator:{serviceWorker:{register:async()=>{}}},
  location:{protocol:'https:',href:'https://preview.example'},
  fetch:async()=>({ok:false}),setTimeout:()=>0,clearTimeout(){},
  requestAnimationFrame:fn=>fn()
 });
 vm.runInContext(src,ctx,{timeout:10000});
 return {ctx,app,overlays};
}

test('app starts with real conversation cards and optional preferences',()=>{
 const {app}=launch();
 assert.match(app.innerHTML,/Start Something/);
 assert.match(app.innerHTML,/Surprise me/);
 assert.match(app.innerHTML,/Explore conversations/);
 assert.match(app.innerHTML,/Play Something/);
 assert.match(app.innerHTML,/Mix It Up/);
 assert.match(app.innerHTML,/What/);
});
test('theme browsing shows six categories without displaying 19 top-level buttons',()=>{
 const {ctx,app}=launch();
 vm.runInContext("nav('topics')",ctx);
 assert.match(app.innerHTML,/People &amp; Connections/);
 assert.match(app.innerHTML,/Money &amp; Ambitions/);
 assert.match(app.innerHTML,/Random &amp; What Ifs/);
});
test('Play Something draws cards and preserves Truth or Dare navigation',()=>{
 const {ctx,app}=launch();
 vm.runInContext("nav('play');playDraw()",ctx);
 assert.match(app.innerHTML,/Pick something to play/);
 assert.match(app.innerHTML,/Would You Rather/);
 assert.match(app.innerHTML,/Truth or Dare/);
 assert.doesNotMatch(app.innerHTML,/\b(?:ROUND|rounds?|score|streak)\b/i);
 vm.runInContext('playDraw()',ctx);
 assert.doesNotMatch(app.innerHTML,/\b(?:ROUND|rounds?|score|streak)\b/i);
 assert.match(app.innerHTML,/Another card/);
});
test('Keep Talking opens a prompt and exposes follow-up directions',()=>{
 const {ctx,overlays}=launch();
 vm.runInContext("nav('explore');applyAction('surprise');applyAction('angles')",ctx);
 assert.match(overlays.innerHTML,/Keep this conversation going/);
 assert.match(overlays.innerHTML,/Change direction/);
});

test('Truth or Dare displays unlimited cards without a round counter or restart mechanics',()=>{
 const {ctx,app}=launch();
 vm.runInContext("nav('truthordare');todDraw('Truth')",ctx);
 assert.match(app.innerHTML,/Truth/);
 assert.match(app.innerHTML,/Another Truth/);
 assert.doesNotMatch(app.innerHTML,/\b(?:ROUND|rounds?|score|streak|restart|session)\b/i);
 const first=vm.runInContext('todState.current',ctx);
 vm.runInContext("todDraw('Truth')",ctx);
 const second=vm.runInContext('todState.current',ctx);
 assert.notEqual(first,second,'Avoid immediate repeats while cards remain');
 assert.doesNotMatch(app.innerHTML,/\b(?:ROUND|rounds?|score|streak|restart|session)\b/i);
});

test('expanded game types, playable audience filters and format-only cards are available',()=>{
 const {ctx,app}=launch();
 vm.runInContext("nav('play')",ctx);
 assert.match(app.innerHTML,/Story Chain/);
 assert.match(app.innerHTML,/Someone new/);
 assert.match(app.innerHTML,/Crush \/ Talking stage/);
 assert.match(app.innerHTML,/In person/);
 const general=vm.runInContext("playState.audience='Anyone';playPool('Would You Rather').length",ctx);
 const forCrush=vm.runInContext("playState.audience='Crush / Talking stage';playPool('Would You Rather').length",ctx);
 assert.ok(forCrush>general,'Crush-specific games need an explicit audience choice');
 const familyCards=vm.runInContext("playState.audience='Family';playPool('Would You Rather').map(g=>g.text)",ctx);
 assert.ok(familyCards.some(t=>t.includes('family story')));
 assert.ok(familyCards.every(t=>!t.includes('crush')));
 const all=vm.runInContext("playState.audience='Anyone';state.medium='Any format';playPool('What Would You Do?').length",ctx);
 const textOnly=vm.runInContext("state.medium='Text';playPool('What Would You Do?').length",ctx);
 assert.ok(textOnly<all,'Text filtering must exclude call-only scenarios');
 vm.runInContext("state.medium='Any format';applyAction('playSurprise')",ctx);
 assert.match(app.innerHTML,/Another card/);
 assert.doesNotMatch(app.innerHTML,/\b(?:ROUND|rounds?|score|streak)\b/i);
});

test('curated-first discovery keeps the older catalogue separate without breaking saved and history',()=>{
 const {ctx,app,overlays}=launch({oldLibrary:true});
 const initial=vm.runInContext('({all:inPool().length,curated:filtered().length,mode:state.showEarlier})',ctx);
 assert.equal(initial.all,5449);
 assert.equal(initial.curated,49);
 assert.equal(initial.mode,false);
 assert.match(app.innerHTML,/data-view="browse"/);
 vm.runInContext("nav('browse')",ctx);
 assert.match(app.innerHTML,/Explore earlier library/);
 assert.doesNotMatch(app.innerHTML,/Interview-style archive text/);
 vm.runInContext("state.saved=['legacy-test-23'];nav('saved')",ctx);
 assert.match(app.innerHTML,/Interview-style archive text 23/,'Previously saved archive remains accessible');
 vm.runInContext("state.seen=['legacy-test-24'];nav('history')",ctx);
 assert.match(app.innerHTML,/Interview-style archive text 24/,'History can still open older records');
 vm.runInContext("nav('browse');applyAction('toggleEarlier')",ctx);
 assert.equal(vm.runInContext('filtered().length',ctx),5449);
 assert.match(app.innerHTML,/Back to curated ideas/);
 vm.runInContext("applyAction('toggleEarlier')",ctx);
 assert.equal(vm.runInContext('filtered().length',ctx),49);
 vm.runInContext("focus('legacy-test-23')",ctx);
 assert.match(overlays.innerHTML,/Interview-style archive text 23/,'Saved older items remain focusable');
});
test('curated follow-ups offer genuine directions and empty filters never bypass suitability',()=>{
 const {ctx,overlays}=launch();
 vm.runInContext("nav('explore');focus('exp-001');applyAction('angles')",ctx);
 assert.match(overlays.innerHTML,/Tell a story/);
 assert.match(overlays.innerHTML,/Go a little deeper/);
 assert.match(overlays.innerHTML,/Try another perspective/);
 assert.match(overlays.innerHTML,/Take a new direction/);
 vm.runInContext("state.focus=null;state.topic='Faith & Spirituality';state.mood='Flirty';applyAction('surprise')",ctx);
 assert.equal(vm.runInContext('state.focus',ctx),null,'Do not expose unrelated results under an empty filter');
});

test('Keep Talking offers a non-interrogative conversational bridge, not only follow-up questions',()=>{
 const {ctx,overlays}=launch();
 vm.runInContext("nav('explore');focus('exp-001');applyAction('angles')",ctx);
 assert.match(overlays.innerHTML,/A different kind of response/);
 assert.match(overlays.innerHTML,/Copy this thought/);
 assert.match(overlays.innerHTML,/typing indicator/);
 assert.match(overlays.innerHTML,/Tell a story/);
});

test('the October 14 approved visual hierarchy is preserved without a stacked home feed',()=>{
 const {app,ctx,overlays}=launch();
 assert.match(app.innerHTML,/class="home-showcase/);
 assert.match(app.innerHTML,/class="home-featured/);
 assert.match(app.innerHTML,/class="home-moods/);
 assert.match(app.innerHTML,/data-view="browse"/);
 assert.doesNotMatch(app.innerHTML,/home-feed-area/);
 assert.doesNotMatch(app.innerHTML,/experience-quick/);
 vm.runInContext("nav('browse')",ctx);
 assert.match(app.innerHTML,/home-feed-area/);
 assert.match(app.innerHTML,/data-action="toggleEarlier"/);
 vm.runInContext("nav('explore');focus('exp-001')",ctx);
 assert.match(overlays.innerHTML,/approved-focus-card/);
 assert.match(overlays.innerHTML,/More|Keep Talking/);
});
