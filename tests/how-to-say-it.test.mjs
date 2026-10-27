import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const engine=readFileSync('public/rc/how-to-say-it.js','utf8');
const context=vm.createContext({window:{}});
vm.runInContext(engine,context,{timeout:10000});
const how=context.window.SayMoreHowToSayIt;
assert.ok(how&&typeof how.forCard==='function','Opener engine must load offline');
const samples=[
{id:'gist-011',kind:'Stories',text:"What's the funniest excuse someone has given for cancelling plans?",tags:['friends']},
{id:'hot-1',kind:'Hot Takes',text:"A first date shouldn't feel like a job interview."},
{id:'story-1',kind:'Story Spark',text:"Tell us about a time you met somebody's family."},
{id:'dare-1',kind:'Dare',text:'Do a ten-second impression of an impatient bus conductor.'},
{id:'wyr-1',kind:'Would You Rather',text:'Would you rather have free transport for a year or no traffic for a month?'},
{id:'never-1',kind:'Never Have I Ever',text:'Never have I ever sent a text to the wrong person.'},
{id:'choice-1',kind:'This or That',text:'Jollof rice or ofada rice? Tell us why.'}
];
test('one useful introduction for each medium across different card formats',()=>{
 for(const c of samples){
  const options=how.forCard(c);
  assert.ok(options,'Missing opener for '+c.kind);
  assert.deepEqual(Object.keys(options),['text','call','person']);
  for(const text of Object.values(options)){
   assert.ok(typeof text==='string'&&text.length>c.text.length,'Unusable introduction for '+c.kind);
   assert.ok(text.includes(c.text.slice(0,10))||c.kind==='Story Spark','Opener must preserve the original idea');
   assert.doesNotMatch(text,/More gist|Keep the gist going|four follow-up/i);
  }
  assert.equal(new Set(Object.values(options)).size,3,'Each medium needs different delivery');
 }
 assert.match(how.forCard(samples[0]).text,/Friendship|Friend|friend|gist/i);
 assert.match(how.forCard(samples[1]).call,/Hear me out/);
 assert.match(how.forCard(samples[3]).text,/voice note/i);
 assert.match(how.forCard(samples[2]).person,/Tell me about/);
});
test('handles unfamiliar, empty, and user-entered prompt text safely',()=>{
 assert.equal(how.forCard(null),null);
 assert.equal(how.forCard({text:'   '}),null);
 const out=how.forCard({text:'What do you make of this unusual idea?',id:'unusual'});
 assert.ok(out.text.includes('unusual idea'));
 assert.ok(out.call&&out.person);
});
test('How to say it is wired for root, RC, offline, and does not restore More gist',()=>{
 for(const path of ['public/index.html','public/rc/index.html']){
  const html=readFileSync(path,'utf8');
  assert.match(html,/<script src="\/rc\/how-to-say-it\.js"><\/script>/);
  for(const action of ['howto-open','howto-medium','howto-copy'])assert.ok(html.includes("data-action=\""+action+"\"")||html.includes("case '"+action+"':"),path+': '+action);
  for(const label of ['How to say it','Text','Call','In person'])assert.ok(html.includes(label),path+': '+label);
  assert.doesNotMatch(html,/data-action="more-gist"|data-action="copy-angle"/);
  assert.match(html,/data-action="focus-back"/);
  assert.match(html,/data-action="toggle-save"/);
  assert.match(html,/data-action="next"/);
  const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  for(const [,code] of scripts)assert.doesNotThrow(()=>new vm.Script(code),'Inline JS syntax: '+path);
 }
 for(const sw of ['public/sw.js','public/rc/sw.js']){
  const data=readFileSync(sw,'utf8');
  assert.ok(data.includes('/rc/how-to-say-it.js'),sw);
  assert.doesNotThrow(()=>new vm.Script(data));
 }
});
