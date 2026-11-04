import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {writeFileSync} from 'node:fs';

const require=createRequire(import.meta.url);
const {chromium}=require('playwright-core');
const base=(process.env.BASE_URL||'http://127.0.0.1:4173').replace(/[/]$/,'');
const browser=await chromium.launch({
  headless:true,
  executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',
  args:['--no-sandbox','--disable-dev-shm-usage']
});
const results=[];
const viewports=[
  {width:390,height:844,name:'phone',touch:true},
  {width:768,height:1024,name:'tablet portrait',touch:true},
  {width:820,height:1180,name:'large tablet portrait',touch:true},
  {width:912,height:1368,name:'large portrait tablet',touch:true},
  {width:1024,height:768,name:'tablet landscape',touch:true},
  {width:1180,height:820,name:'large tablet landscape',touch:true},
  {width:1366,height:1024,name:'wide tablet landscape',touch:true},
  {width:1024,height:768,name:'small laptop',touch:false},
  {width:1440,height:900,name:'laptop',touch:false},
  {width:1920,height:1080,name:'wide desktop',touch:false}
];
try {
  for(const {width,height,name,touch} of viewports){
    const context=await browser.newContext({
      viewport:{width,height},
      serviceWorkers:'block',
      isMobile:width<620,
      hasTouch:touch
    });
    await context.addInitScript(()=>{
      localStorage.setItem('saymore-ng-v2-onboard','true');
    });
    const page=await context.newPage();
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    try {
      const response=await page.goto(base+'/',{waitUntil:'load',timeout:35000});
      assert.equal(response.status(),200);
      await page.locator('.hero h1').waitFor();
      const metrics=await page.evaluate(()=>{
        const shell=document.querySelector('#app-shell');
        const rail=document.querySelector('#desktop-nav');
        const nav=document.querySelector('.bottomnav');
        return {
          shellWidth:Math.round(shell.getBoundingClientRect().width),
          viewportWidth:window.innerWidth,
          overflow:document.documentElement.scrollWidth-window.innerWidth,
          railDisplay:getComputedStyle(rail).display,
          bottomDisplay:getComputedStyle(nav).display,
          cards:document.querySelectorAll('.hscroll .idea-card').length,
          touchMedia:matchMedia('(any-pointer: coarse)').matches,
          homeColumns:getComputedStyle(document.querySelector('.hscroll')).gridTemplateColumns.split(' ').filter(Boolean).length,
          heroWidth:Math.round(document.querySelector('.hero').getBoundingClientRect().width),
          bottomTargets:[...nav.querySelectorAll('button')].map(b=>Math.round(b.getBoundingClientRect().height))
        };
      });
      assert.ok(metrics.overflow<=2,name+': horizontal overflow '+metrics.overflow);
      assert.ok(metrics.cards>0,name+': homepage cards missing');
      if(width<620){
        assert.equal(metrics.railDisplay,'none');
        assert.notEqual(metrics.bottomDisplay,'none');
      } else {
        assert.ok(metrics.shellWidth>=width-2,name+': app remains trapped in phone frame');
        const tablet=width<1024 || (touch && width<=1366);
        if(tablet){
          assert.equal(metrics.railDisplay,'none',name+': laptop sidebar visible on tablet');
          assert.notEqual(metrics.bottomDisplay,'none',name+': tablet navigation missing');
          assert.ok(metrics.homeColumns>=3,name+': tablet homepage must show a card grid');
          assert.ok(metrics.bottomTargets.every(height=>height>=44),name+': undersized navigation targets');
          if(touch)assert.equal(metrics.touchMedia,true,name+': tablet pointer mode not enabled');
        }else{
          assert.notEqual(metrics.railDisplay,'none',name+': desktop rail hidden');
          assert.equal(metrics.bottomDisplay,'none',name+': mobile navigation still visible');
        }
      }
      await page.locator('[data-action="open-collection"]').first().click();
      await page.locator('.collection-hero').waitFor();
      await page.locator('[data-action="start-collection"]').click();
      await page.locator('.focuspage .prompt').waitFor();
      assert.ok(await page.locator('[data-action="howto-open"]').isVisible());
      if(width>=1024 && !touch){
        await page.locator('#desktop-nav [data-page="games"]').click();
      }else{
        await page.locator('[data-action="focus-back"]').first().click();
        await page.locator('.collection-hero [data-action="nav"][data-page="discover"]').click();
        await page.locator('.navbtn[data-page="games"]').click();
      }
      await page.locator('.gamegrid').waitFor();
      assert.ok(await page.locator('.gamegrid .deck-tile').count()>0);
      if(width>=1024 && !touch){
        assert.equal(await page.locator('#desktop-nav [data-page="games"]').getAttribute('aria-current'),'page');
        await page.locator('#desktop-nav [data-page="saved"]').click();
        await page.locator('.pagehead').waitFor();
        await page.locator('#desktop-nav [data-page="settings"]').click();
        await page.locator('.settings-list').first().waitFor();
      }else if(width>=620){
        await page.locator('.navbtn[data-page="saved"]').click();
        await page.locator('.pagehead').waitFor();
        await page.locator('.titlebar [data-page="settings"]').click();
        await page.locator('.settings-list').first().waitFor();
      }
      if(touch && width>=620){
        await page.locator('.setting-row[data-page="appearance"]').click();
        await page.locator('.pref-box').first().waitFor();
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'Settings overflow');
      }
      assert.deepEqual(errors,[],name+': browser errors');
      if(touch && width>=620 && (name==='tablet portrait' || name==='large tablet landscape')){
        await page.screenshot({path:'/tmp/saymore-'+name.replaceAll(' ','-')+'.png',fullPage:true});
      }
      results.push({name,width,height,touch,status:'passed',...metrics});
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
}
writeFileSync('/tmp/saymore-desktop-browser-qa.json',JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify(results,null,2));
