import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const require=createRequire(import.meta.url);
const {chromium}=require('playwright-core');
const base=process.env.BASE_URL||'http://127.0.0.1:4173';
const chrome=process.env.CHROME_BIN||process.env.CHROMIUM_PATH||'/usr/bin/google-chrome';
const browser=await chromium.launch({headless:true,executablePath:chrome,args:['--no-sandbox','--disable-dev-shm-usage']});
const findings=[],errors=[];
async function check(label,fn){
 try{findings.push({check:label,status:'pass',detail:await fn()})}
 catch(e){findings.push({check:label,status:'fail',error:String(e.stack||e)})}
}
async function size(width,height,label){
 const context=await browser.newContext({viewport:{width,height},serviceWorkers:'block',hasTouch:width<900,isMobile:width<900});
 const page=await context.newPage();
 page.on('pageerror',e=>errors.push(label+': '+e.message));
 await check(label+' deck-first home',async()=>{
  const response=await page.goto(base,{waitUntil:'load',timeout:30000});
  assert.equal(response.status(),200);
  await page.locator('.sm-conversation-bubble').waitFor({timeout:30000});
  const result=await page.evaluate(()=>({
   view:state.view,pool:filtered().length,total:inPool().length,
   bg:getComputedStyle(document.querySelector('.sm-deck')).backgroundColor,
   css:[...document.styleSheets].some(s=>s.href?.includes('next-generation.css')),
   bubbles:document.querySelectorAll('.sm-conversation-bubble').length,
   oldCards:document.querySelectorAll('.prompt-card,.home-showcase,.experience-quick,.home-feed-area').length,
   overflow:document.documentElement.scrollWidth-innerWidth,
   iconErrors:[...document.querySelectorAll('button svg')].filter(s=>!s.querySelector('path,rect,circle,line,polyline,polygon,ellipse')).length
  }));
  assert.equal(result.view,'explore');
  assert.equal(result.pool,49);
  assert.equal(result.total,16249);
  assert.equal(result.bubbles,1);
  assert.equal(result.oldCards,0);
  assert.equal(result.css,true);
  assert.equal(result.bg,'rgb(220, 235, 207)');
  assert.ok(result.overflow<=1);
  assert.equal(result.iconErrors,0);
  await page.screenshot({path:'/tmp/saymore-v3-'+label+'-home.jpg',type:'jpeg',quality:77});
  return result;
 });
 await check(label+' focus, continuations, saved',async()=>{
  const first=await page.locator('.sm-conversation-bubble').innerText();
  await page.locator('[data-action="nextFeatured"]').click();
  assert.notEqual(await page.locator('.sm-conversation-bubble').innerText(),first);
  await page.locator('.sm-conversation-bubble').click();
  await page.locator('.focus-overlay').waitFor();
  const focused=await page.evaluate(()=>state.focus);
  await page.locator('.focus-actions [data-action="angles"]').click();
  assert.equal(await page.locator('.angle-path').count(),4);
  await page.locator('.focus-actions [data-save]').click();
  assert.equal(await page.evaluate(id=>state.saved.includes(id),focused),true);
  if(label==='phone')await page.screenshot({path:'/tmp/saymore-v3-phone-focus.jpg',type:'jpeg',quality:77});
  await page.locator('[data-action="closeFocus"]').click();
  return {focused};
 });
 await check(label+' browsing and themes',async()=>{
  await page.locator('.sm-door-arrow').click();
  await page.locator('.sm-library').waitFor();
  assert.equal(await page.locator('.sm-reader-item').count(),12);
  assert.equal(await page.locator('.prompt-card').count(),0);
  if(label==='phone')await page.screenshot({path:'/tmp/saymore-v3-phone-library.jpg',type:'jpeg',quality:77});
  await page.locator('.sm-library-themes [data-topic="People & Connections"]').click();
  assert.equal(await page.evaluate(()=>state.topic),'People & Connections');
  assert.ok(await page.locator('.sm-reader-item').count()>0);
  await page.evaluate(()=>{state.topic='All topics';render();});
  await page.locator('.sm-library-filter').click();
  await page.locator('[data-audience="Family"]').click();
  await page.locator('[data-mood="Flirty"]').last().click();
  await page.locator('[data-action="applyFilters"]').click();
  assert.ok(await page.evaluate(()=>filtered().every(p=>p.topic!=='Dating')));
  await page.evaluate(()=>{state.mood='Mix It Up';state.audience='Anyone';state.topic='All topics';nav('browse')});
  await page.locator('[data-action="toggleEarlier"]').click();
  assert.equal(await page.evaluate(()=>filtered().length),16249);
  await page.locator('[data-action="toggleEarlier"]').click();
  assert.equal(await page.evaluate(()=>filtered().length),49);
 });
 await check(label+' instant games and optional settings',async()=>{
  await page.evaluate(()=>nav('play'));
  await page.locator('.sm-game-surface').waitFor();
  assert.ok((await page.locator('.sm-game-surface h2').innerText()).length>=20);
  await page.locator('[data-play-type="Story Chain"]').click();
  await page.locator('[data-action="playNext"]').click();
  assert.ok((await page.locator('.sm-game-surface h2').innerText()).length>=20);
  assert.doesNotMatch(await page.locator('.sm-game-surface').innerText(),/\b(?:round|score|streak|leaderboard|restart)\b/i);
  const box=await page.locator('.sm-game-surface').boundingBox();
  if(width<=780)assert.ok(box.y<500,'Game content must appear above the fold');
  if(label==='phone')await page.screenshot({path:'/tmp/saymore-v3-phone-games.jpg',type:'jpeg',quality:77});
  await page.locator('[data-action="playOptions"]').click();
  assert.equal(await page.locator('.sm-game-modal').count(),1);
  await page.locator('[data-play-audience="Family"]').click();
  await page.locator('.sm-game-modal [data-action="closeOverlay"]').last().click();
  await page.locator('[data-view="truthordare"]').click();
  await page.locator('[data-tod-type="Truth"]').click();
  assert.equal(await page.locator('.tod-card').count(),1);
 });
 await check(label+' More, Iconsax, and navigation',async()=>{
  await page.evaluate(()=>nav('more'));
  assert.equal(await page.locator('.sm-more-rows>button').count(),4);
  await page.locator('.sm-more-rows [data-view="history"]').click();
  assert.match(await page.locator('.page-heading').innerText(),/Recent conversations/);
  await page.evaluate(()=>nav('more'));
  await page.locator('.sm-more-rows [data-view="settings"]').click();
  assert.match(await page.locator('.main').innerText(),/Conversation preferences/);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth<=1));
  if(width<=780){
   assert.equal(await page.locator('.sm-bottom-nav button').count(),5);
   assert.equal(await page.locator('.sm-bottom-nav').isVisible(),true);
  }
 });
 await context.close();
}
try{
 for(const s of [{width:390,height:844,label:'phone'},{width:768,height:1024,label:'small-tablet'},{width:820,height:1180,label:'tablet'},{width:1440,height:900,label:'desktop'}])await size(s.width,s.height,s.label);
 await check('offline PWA and game access',async()=>{
  const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'allow'});
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push('offline: '+e.message));
  await page.goto(base,{waitUntil:'load'});
  await page.waitForFunction(()=>navigator.serviceWorker.controller!==null,{timeout:30000}).catch(async()=>{
   await page.reload({waitUntil:'load'});
   await page.waitForFunction(()=>navigator.serviceWorker.controller!==null,{timeout:30000})
  });
  await context.setOffline(true);
  await page.reload({waitUntil:'load',timeout:30000});
  assert.equal(await page.locator('.sm-conversation-bubble').count(),1);
  await page.evaluate(()=>nav('play'));
  assert.equal(await page.locator('.sm-game-surface').count(),1);
  await context.close();
 });
}finally{await browser.close()}
const summary={date:new Date().toISOString(),status:findings.every(x=>x.status==='pass')&&errors.length===0?'passed':'failed',checks:findings,javaScriptErrors:errors};
fs.writeFileSync('/tmp/saymore-conversation-browser-qa.json',JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify(summary,null,2));
if(summary.status!=='passed')process.exitCode=1;
