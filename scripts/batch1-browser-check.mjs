import {createRequire} from 'node:module';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base=process.env.BASE_URL||'http://127.0.0.1:4189';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/tmp/saymore-browser',args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader'],headless:true});
const errors=[],results=[];
try{
 for(const size of [{width:390,height:844},{width:1440,height:1000}]){
  const context=await browser.newContext({viewport:size,serviceWorkers:'block'});
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>typeof batchReady!=='undefined'&&batchReady);
  assert.equal(await page.evaluate(()=>filtered().length),5400);
  assert.equal(await page.locator('.prompt-card').count(),48);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Horizontal overflow');
  const counts=await page.evaluate(()=>{
   const checks=[];for(const topic of ['Relationships','Friendships','Life'])for(const mood of MOODS)for(const audience of ['Someone new','Friends','Partner']){Object.assign(state,{topic,mood,audience});checks.push(filtered().length);}
   Object.assign(state,{topic:'All topics',mood:'All moods',audience:'Anyone'});render();return checks;
  });assert.equal(counts.length,54);assert.ok(counts.every(x=>x===100));
  await page.locator('[data-action="refine"]').first().click();
  await page.locator('[data-audience="Friends"]').click();
  await page.locator('[data-topicfilter="Life"]').click();
  await page.locator('[data-mood="Flirty"]').last().click();
  await page.locator('[data-action="applyFilters"]').click();
  assert.equal(await page.evaluate(()=>filtered().length),100);
  await page.locator('.prompt-card [data-focus]').first().click();
  assert.equal(await page.locator('.focus-overlay').count(),1);
  const first=await page.evaluate(()=>state.focus);
  await page.locator('.focus-actions [data-save]').click();
  assert.ok(await page.evaluate(id=>state.saved.includes(id),first));
  await page.keyboard.press('ArrowRight');assert.notEqual(await page.evaluate(()=>state.focus),first);
  await page.keyboard.press('Escape');
  await page.evaluate(()=>{state.large=true;state.compact=true;persist();});
  await page.reload({waitUntil:'networkidle'});
  assert.ok(await page.evaluate(id=>state.saved.includes(id)&&state.large&&state.compact,first));
  await page.evaluate(()=>{state.large=false;state.compact=false;persist();nav('saved')});
  assert.equal(await page.locator('.prompt-card').count(),1);
  await page.evaluate(()=>nav('truthordare'));
  await page.locator('[data-tod-type="Truth"]').click();assert.equal(await page.locator('.tod-card').count(),1);
  await page.locator('[data-tod-medium="Call"]').click();await page.locator('[data-tod-type="Dare"]').click();assert.equal(await page.locator('.tod-card').count(),1);
  await page.evaluate(()=>{state.adult=true;state.adultUnlocked=true;state.view='explore';render();});
  assert.ok(await page.evaluate(()=>inPool().every(p=>p.adult)&&inPool().length>0));
  await page.evaluate(()=>{state.adult=false;state.topic='All topics';state.mood='All moods';state.audience='Anyone';state.view='explore';render();});
  await page.locator('[data-action="loadMore"]').click();assert.equal(await page.locator('.prompt-card').count(),96);
  await page.screenshot({path:'/tmp/saymore-batch1-'+size.width+'.png',fullPage:false});
  results.push({width:size.width,filterCells:54,all:5400,feed:true,focus:true,saved:true,preferences:true,truthOrDare:true,adultSeparation:true});
  await context.close();
 }
 // Verify older saved IDs load without re-entering everyday browsing.
 const context=await browser.newContext({serviceWorkers:'block'});
 await context.addInitScript(()=>localStorage.setItem('conversation-companion-proto-v4',JSON.stringify({saved:['SM-000001','edited-everyday-6'],seen:['SM-000002'],large:true,compact:false})));
 const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(base,{waitUntil:'networkidle'});
 await p.waitForFunction(()=>PROMPTS.some(p=>p.id==='SM-000001'));
 assert.equal(await p.evaluate(()=>filtered().length),5400);
 assert.ok(await p.evaluate(()=>state.saved.includes('SM-000001')&&state.large));
 await p.evaluate(()=>nav('saved'));assert.equal(await p.locator('.prompt-card').count(),2);
 await context.close();assert.deepEqual(errors,[]);
 const report={status:'passed',base,results,legacySaved:true,javascriptErrors:errors};
 fs.writeFileSync('/tmp/saymore-browser-result.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
}finally{await browser.close();}
