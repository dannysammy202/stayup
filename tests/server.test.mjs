import test from 'node:test';
import assert from 'node:assert/strict';
import handler,{similarity} from '../api/ai/generate.js';
function simulate(body){return new Promise(resolve=>{const req={method:'POST',body,socket:{remoteAddress:'127.0.0.1'}};const res={statusCode:200,headers:{},setHeader(k,v){this.headers[k]=v},end(txt){resolve({code:this.statusCode,data:JSON.parse(txt)})}};handler(req,res)})}
test('paraphrases score as related',()=>assert.ok(similarity('How do you spend money with your family?','What makes you spend money with family?')>.7));
test('adult requests are excluded from Gemini generation',async()=>{const r=await simulate({task:'prompts',adult:true,ageConfirmed:true});assert.equal(r.code,403)});
test('unknown task is rejected',async()=>{const r=await simulate({task:'other',ageConfirmed:true});assert.equal(r.code,400)});
test('age acknowledgement is required',async()=>{const r=await simulate({task:'prompts',ageConfirmed:false});assert.equal(r.code,403)});
test('Gemini remains optional without an API key',async()=>{const r=await simulate({task:'prompts',ageConfirmed:true});assert.equal(r.code,503)});
