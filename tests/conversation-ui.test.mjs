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

function launch(){
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
  window:{SayMoreExperience:assets.window.SayMoreExperience,SayMoreExpansion:assets.window.SayMoreExpansion,SayMoreEditorialTruthOrDare:todExamples,SAYMORE_ICONSAX:{info:'<svg></svg>',arrow:'<svg></svg>'},addEventListener(){},scrollTo(){}},
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
 assert.match(app.innerHTML,/Keep Talking/);
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
