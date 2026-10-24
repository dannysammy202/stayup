import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const require=createRequire(import.meta.url);
const {chromium}=require('playwright-core');
const base=process.env.BASE_URL||'http://127.0.0.1:4173';
const chrome=process.env.CHROME_BIN||process.env.CHROMIUM_PATH||'/usr/bin/google-chrome';
const browser=await chromium.launch({headless:true,executablePath:chrome,args:['--no-sandbox','--disable-dev-shm-usage']});
const findings=[];
const errors=[];
async function record(label,fn){
  try {const detail=await fn();findings.push({check:label,status:'pass',detail:detail||undefined});}
  catch(e){findings.push({check:label,status:'fail',error:String(e.stack||e)});}
}
async function checkSize(width,height,label){
 const context=await browser.newContext({viewport:{width,height},serviceWorkers:'block',isMobile:width<900,hasTouch:width<900});
 const page=await context.newPage();
 page.on('pageerror',e=>errors.push(label+': '+e.message));
 await record(label+' initial render',async()=>{
  const response=await page.goto(base,{waitUntil:'load',timeout:30000});
  assert.equal(response.status(),200);
  await page.locator('.home-content').waitFor({timeout:30000});
  const result=await page.evaluate(()=>({
   curated:filtered().length,total:inPool().length,older:state.showEarlier,
   cards:document.querySelectorAll('.cf-home-idea').length,view:state.view,
   overflow:document.documentElement.scrollWidth-innerWidth,
   bridgeCount:Object.¶»§q«^