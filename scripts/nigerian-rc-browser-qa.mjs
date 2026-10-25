import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
const require=createRequire(import.meta.url);
const {chromium}=require('playwright-core');
const base=(process.env.BASE_URL||'http://127.0.0.1:4173').replace(/\/$/,'');
const executablePath=process.env.CHROME_BIN||'/usr/bin/google-chrome';
const browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
const report={startedAt:new Date().toISOString(),checks:[],pageErrors:[]};
async function check(name,task){
 try{const detail=await task();report.checks.push({name,status:'pass',detail:detail??undefined});}
 catch(err){report.checks.push({name,status:'fail',error:String(err.stack||err)});}
}
function listen(page,label){page.on('pageerror',e=>report.pageErrors.push(`${label}: ${e.message}`));}
async function contextFor(width,height,serviceWorkers='block'){
 const c=await browser.newContext({viewport:{width,height},serviceWorkers,hasTouch:width<850,isMobile:width<700,acceptDownloads:true});
 await c.addInitScript(()=>localStorage.setItem('saymore-ng-v2-onboard','true'));
 return c;
}
async function openPage(c,label){
 const page=await c.newPage();listen(page,label);
 const response=await page.goto(base+'/rc/index.html',{waitUntil:'load',timeout:35000});
 assert.equal(response.status(),200);
 await page.locator('#screen .scroller').waitFor({timeout:30000});
 return page;
}
try{
 for(const [width,height,label] of [[390,844,'phone'],[768,1024,'tablet'],[1440,900,'desktop']]){
  const c=await contextFor(width,height);
  const page=await openPage(c,label);
  await check(`${label}: initial Discover and layout`,async()=>{
   assert.match(await page.locator('.hero h1').innerText(),/Better[\s\S]*conversations[\s\S]*start here/i);
   assert.ok(await page.locator('[data-action="open-collection"][data-id="late"]').count()>0);
   const x=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
   assert.ok(x<=2,'Unexpected horizontal overflow '+x);
   return {width,overflow:x};
  });
  await check(`${label}: collection, swipe, save and history`,async()=>{
   await page.locator('[data-action="open-collection"][data-id="late"]').first().click();
   assert.ok((await page.locator('.collection-hero .meta').innerText()).includes('500 ideas'));
   await page.locator('[data-action="start-collection"]').click();
   await page.locator('.focuspage .prompt').waitFor();
   const old=await page.locator('.focuspage .prompt').innerText();
   await page.locator('[data-action="next"]').click();
   const now=await page.locator('.focuspage .prompt').innerText();
   assert.notEqual(old,now);
   await page.locator('[data-action="toggle-save"]').click();
   await page.locator('[data-action="focus-back"]').first().click();
   await page.locator('[data-action="nav"][data-page="discover"]').first().click();
   await page.locator('.navbtn[data-page="saved"]').click();
   assert.ok(await page.locator('.savedgrid .idea-card').count()>0);
   await page.locator('.navbtn[data-page="history"]').click();
   assert.ok(await page.locator('.history-item').count()>0);
   return {saved:true,history:true};
  });
  await check(`${label}: Truth/Dare and 300-card deck counts`,async()=>{
   await page.locator('.navbtn[data-page="games"]').click();
   await page.locator('[data-action="open-game"][data-id="truthdare"]').click();
   assert.match(await page.locator('.collection-hero .meta').innerText(),/300 cards/);
   await page.locator('[data-action="start-game"]').click();
   assert.equal((await page.locator('.focus-front .smallbottom').innerText()).trim().toLowerCase(),'truth');
   await page.locator('[data-action="game-tab"][data-tab="Dare"]').click();
   assert.equal((await page.locator('.focus-front .smallbottom').innerText()).trim().toLowerCase(),'dare');
   await page.locator('[data-action="next"]').click();
   assert.equal((await page.locator('.focus-front .smallbottom').innerText()).trim().toLowerCase(),'dare');
   await page.locator('[data-action="focus-back"]').first().click();
   assert.match(await page.locator('.collection-hero .meta').innerText(),/300 cards/);
   return {truth:300,dare:300};
  });
  await check(`${label}: rewritten hot-take cards are active`,async()=>{
   await page.locator('[data-action="nav"][data-page="games"]').first().click();
   await page.locator('[data-action="open-game"][data-id="hot"]').first().click();
   assert.match(await page.locator('.collection-hero .meta').innerText(),/300 cards/);
   assert.ok(await page.getByText('Some of the best memories happen on ordinary weekdays, not holidays.',{exact:true}).count()>0);
   return {hotTakes:300,rewritesLoaded:true};
  });
  await c.close();
 }
 await check('classic Saved/History preservation and disabled mock services',async()=>{
  const c=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});
  await c.addInitScript(()=>{
   localStorage.setItem('saymore-ng-v2-onboard','true');
   localStorage.setItem('conversation-companion-proto-v4',JSON.stringify({saved:['old-saved-001'],seen:['old-seen-001']}));
  });
  const page=await openPage(c,'migration');
  const snapshot=await page.evaluate(()=>({old:localStorage.getItem('conversation-companion-proto-v4'),backup:localStorage.getItem('saymore-ng-v2-legacy-backup')}));
  assert.equal(snapshot.old,snapshot.backup);
  await page.locator('.navbtn[data-page="saved"]').click();
  assert.match(await page.locator('.pref-box').innerText(),/1 earlier saved cards preserved/i);
  assert.ok(await page.locator('a[href="/classic/"]').count()>0);
  await page.locator('[data-action="nav"][data-page="settings"]').first().click().catch(async()=>{
   await page.goto(base+'/rc/index.html');await page.locator('[data-action="nav"][data-page="settings"]').first().click();
  });
  await page.locator('[data-action="nav"][data-page="account"]').click();
  assert.match(await page.locator('.pref-box').innerText(),/No account is required/);
  assert.equal(await page.locator('input[type="email"]').count(),0);
  await page.locator('[data-action="nav"][data-page="settings"]').first().click();
  await page.locator('[data-action="nav"][data-page="mature"]').click();
  assert.match(await page.locator('.pref-box').innerText(),/18\+ content is currently unavailable/);
  assert.equal(await page.locator('[data-action="toggle-18"]').count(),0);
  await c.close();
  return {classicUntouched:true,accountDemoAbsent:true,adultDemoAbsent:true};
 });
 await check('RC offline PWA shell',async()=>{
  const c=await contextFor(390,844,'allow');
  const page=await openPage(c,'offline');
  await page.waitForFunction(()=>navigator.serviceWorker.controller!==null,{timeout:20000}).catch(async()=>{
   await page.reload({waitUntil:'load'});
   await page.waitForFunction(()=>navigator.serviceWorker.controller!==null,{timeout:20000});
  });
  await page.waitForTimeout(700);
  await c.setOffline(true);
  await page.reload({waitUntil:'load',timeout:25000});
  assert.ok(await page.locator('.hero').count()>0);
  await page.locator('.navbtn[data-page="games"]').click();
  assert.ok(await page.locator('[data-action="open-game"][data-id="truthdare"]').count()>0);
  await c.close();
  return {offline:true};
 });

 await check('public homepage serves approved Nigerian-first experience',async()=>{
  const c=await contextFor(390,844,'block');
  try{
   const page=await c.newPage();
   listen(page,'public-homepage');
   const response=await page.goto(base+'/',{waitUntil:'load',timeout:35000});
   assert.equal(response.status(),200);
   assert.match(await page.title(),/Say More.*Better Conversations/);
   await page.locator('#screen .scroller').waitFor({timeout:25000});
   assert.ok(await page.locator('[data-action="open-collection"]').count()>0);
   assert.equal(await page.locator('.status').count(),0,'Do not render a second fake system status bar');
   const geometry=await page.evaluate(()=>{
      const box=sel=>{const r=document.querySelector(sel).getBoundingClientRect();return {top:r.top,bottom:r.bottom,height:r.height}};
      return {header:box('.titlebar'),hero:box('.hero'),firstSection:box('.section'),nav:box('.bottomnav'),width:document.documentElement.scrollWidth};
   });
   assert.ok(geometry.header.top<25,'Logo should begin near the actual top of the web viewport');
   assert.ok(geometry.firstSection.top<410,'Homepage first collection must not start below the fold');
   assert.ok(geometry.nav.height<=76,'Bottom navigation should fit within a compact tab bar');
   assert.ok(geometry.width<=390,'Phone homepage must not overflow sideways');
   await page.locator('.navbtn[data-page="games"]').click();
   await page.locator('[data-action="open-game"][data-id="truthdare"]').click();
   assert.match(await page.locator('.collection-hero .meta').innerText(),/300 cards/);
   await page.reload({waitUntil:'load'});
   await page.locator('.navbtn[data-page="saved"]').click();
   await page.locator('[data-action="nav"][data-page="settings"]').first().click();
   await page.locator('[data-action="nav"][data-page="account"]').click();
   assert.match(await page.locator('.pref-box').first().innerText(),/No account is required/);
   assert.equal(await page.locator('input[type="email"]').count(),0);
   return {newHomepage:true,localOnly:true};
  }finally{await c.close();}
 });
 await check('classic recovery app remains accessible',async()=>{
  const c=await contextFor(390,844,'block');
  try{
   const page=await c.newPage();
   listen(page,'classic-fallback');
   const response=await page.goto(base+'/classic/index.html',{waitUntil:'load',timeout:35000});
   assert.equal(response.status(),200);
   assert.match(await page.title(),/Say More/);
   assert.ok(await page.locator('#app').count()>0);
   return {classicFallback:true};
  }finally{await c.close()}
 });
 await check('Iconsax icons render across every primary production screen',async()=>{
  const c=await contextFor(390,844,'block');
  const routes=[];
  try{
    const page=await c.newPage();
    listen(page,'iconsax-complete');
    async function fresh(){
      await page.goto(base+'/',{waitUntil:'load',timeout:35000});
      await page.locator('#screen .scroller').waitFor({timeout:25000});
    }
    async function scan(label){
      const missing=await page.evaluate(()=>{
        return [...document.querySelectorAll('#screen .icon')].filter(el=>{
          const svg=el.querySelector('svg');
          return !svg||!svg.querySelector('path,circle,rect,polygon,polyline,line,ellipse')||
            getComputedStyle(svg).display==='none'||svg.getBoundingClientRect().width<8;
        }).map(el=>({icon:el.dataset.iconsax||'unknown',html:el.outerHTML.slice(0,180)}));
      });
      assert.deepEqual(missing,[],`Icons not rendered on ${label}: ${JSON.stringify(missing)}`);
      routes.push(label);
    }
    await fresh(); await scan('Discover');
    await page.locator('[data-action="open-collection"][data-id="late"]').first().click();
    await scan('Collection details');
    await page.locator('[data-action="start-collection"]').first().click();
    await scan('Focus / action controls');
    await fresh();
    await page.locator('.navbtn[data-page="games"]').click();
    await scan('Games');
    await page.locator('[data-action="open-game"][data-id="truthdare"]').click();
    await scan('Truth or Dare details');
    await page.locator('[data-action="start-game"]').click();
    await scan('Game focus controls');
    await fresh();
    await page.locator('[data-action="nav-subtopics"]').first().click();
    await scan('Nigerian topics');
    await page.locator('[data-action="open-subtopic"]').first().click();
    await scan('Nigerian topic detail');
    await fresh();
    await page.locator('.navbtn[data-page="saved"]').click();
    await scan('Saved');
    await fresh();
    await page.locator('.navbtn[data-page="history"]').click();
    await scan('History');
    await fresh();
    await page.locator('[data-action="nav"][data-page="settings"]').first().click();
    await scan('Settings');
    await page.locator('[data-action="nav"][data-page="appearance"]').click();
    await scan('Settings detail');
    assert.ok(routes.length>=12,'Expected broad route coverage');
    return {screens:routes};
  }finally{await c.close()}
 });
 await check('public homepage works offline as installed PWA',async()=>{
  const c=await contextFor(390,844,'allow');
  try{
   const page=await c.newPage();
   listen(page,'public-offline');
   await page.goto(base+'/',{waitUntil:'load',timeout:35000});
   await page.waitForFunction(()=>navigator.serviceWorker.controller!==null,{timeout:20000}).catch(async()=>{
    await page.reload({waitUntil:'load'});
    await page.waitForFunction(()=>navigator.serviceWorker.controller!==null,{timeout:20000});
   });
   await page.waitForTimeout(500);
   await c.setOffline(true);
   await page.reload({waitUntil:'load',timeout:25000});
   assert.ok(await page.locator('.hero').count()>0);
   await page.locator('.navbtn[data-page="games"]').click();
   assert.ok(await page.locator('[data-action="open-game"][data-id="truthdare"]').count()>0);
   return {offline:true};
  }finally{await c.close();}
 });
}finally{await browser.close()}
report.finishedAt=new Date().toISOString();
report.status=report.checks.every(x=>x.status==='pass')&&report.pageErrors.length===0?'passed':'failed';
writeFileSync('/tmp/saymore-rc-browser-qa.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(report.status!=='passed')process.exitCode=1;