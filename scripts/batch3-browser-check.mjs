// Real-browser check for Batch 3 at mobile and desktop widths. Start the app first (PORT=4189 npm start).
// Env: BASE_URL, PLAYWRIGHT_MODULE (path to playwright), CHROMIUM_PATH (optional executable).
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.BASE_URL||'http://127.0.0.1:4189';
const TOPICS=['Culture','Personal Experiences','Future & Ambitions'],AUDIENCES=['Someone new','Friends','Partner'];
const browser=await chromium.launch({...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--no-sandbox','--disable-dev-shm-usage'],headless:true});
const errors=[],results=[];
try{
 for(const size of [{width:390,height:844},{width:1440,height:1000}]){
  const context=await browser.newContext({viewport:size,serviceWorkers:'block'});
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>typeof batch3Ready!=='undefined'&&batch3Ready);
  assert.equal(await page.evaluate(()=>filtered().length),10800);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Horizontal overflow');
  const counts=await page.evaluate(([topics,audiences])=>{
   const checks=[];for(const topic of topics)for(const mood of MOODS)for(const audience of audiences){Object.assign(state,{topic,mood,audience});checks.push(filtered().length);}
   Object.assign(state,{topic:'All topics',mood:'All moods',audience:'Anyone'});render();return checks;
  },[TOPICS,AUDIENCES]);
  assert.equal(counts.length,54);assert.ok(counts.every(x=>x===100),'Every Batch 3 cell returns 100');
  // Drive the real filter UI, as a person would.
  await page.locator('[data-action="refine"]').first().click();
  await page.locator('[data-audience="Partner"]').click();
  await page.locator('[data-topicfilter="Future & Ambitions"]').click();
  await page.locator('[data-mood="Deep"]').last().click();
  await page.locator('[data-action="applyFilters"]').click();
  assert.equal(await page.evaluate(()=>filtered().length),100);
  const shown=await page.evaluate(()=>filtered().every(p=>p.topic==='Future & Ambitions'&&p.moods[0]==='Deep'&&p.audiences[0]==='Partner'&&p.source==='batch3-editorial'));
  assert.ok(shown,'Filtered cards are the selected Batch 3 cell');
  assert.ok(await page.locator('.prompt-card').count()>0,'Cards render');
  const topicCounts=await page.evaluate(t=>t.map(x=>[x,totalTopic(x)]),[...TOPICS,'Relationships']);
  assert.ok(topicCounts.every(([,n])=>n===1800),'Topic cards show 1,800 each');
  results.push({viewport:size.width,total:10800,cells:54,uiFilter:100,topicCounts});
  await context.close();
 }
}finally{await browser.close();}
if(errors.length)throw Error('Page errors: '+errors.join(' | '));
console.log(JSON.stringify({status:'passed',results}));
