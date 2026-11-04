import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {writeFileSync} from 'node:fs';

const require=createRequire(import.meta.url);
const {chromium}=require('playwright-core');
const base=(process.env.BASE_URL||'http://127.0.0.1:4173').replace(/\\/$/,'');
const browser=await chromium.launch({
  headless:true,
  executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',
  args:['--no-sandbox','--disable-dev-shm-usage']
});
const results=[];
const viewports=[
  {width:390,height:844,name:'phone'},
  {width:768,height:1024,name:'tablet'},
  {width:1024,height:768,name:'small laptop'},
  {width:1440,height:900,name:'laptop'},
  {width:1920,height:1080,name:'wide desktop'}
];
try {
  for(const {width,height,name} of viewports){
    const context=await browser.newContext({
      viewport:{width,height},
      serviceWorkers:'block',
      isMobile:width<620,
      hasTouch:width<620
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
          cards:document.querySelectorAll('.hscroll .idea-card').length
        };
      });
      assert.ok(metrics.overflow<=2,name+': horizontal overflow '+metrics.overflow);
      assert.ok(metrics.cards>0,name+': homepage cards missing');
      if(width<620){
        assert.equal(metrics.railDisplay,'none');
        assert.notEqual(metrics.bottomDisplay,'none');
      } else {
        assert.ok(metrics.shellWidth>=width-2,name+': app remains trapped in phone frame');
        if(width>=1024){
          assert.notEqual(metrics.railDisplay,'none',name+': desktop rail hidden');
          assert.equal(metrics.bottomDisplay,'none',name+': mobile navigation still visible');
        }else{
          assert.equal(metrics.railDisplay,'none',name+': desktop rail visible on tablet');
          assert.notEqual(metrics.bottomDisplay,'none',name+': tablet navigation missing');
        }
      }
      await page.locator('[data-action="open-collection"]').first().click();
      await page.locator('.collection-hero').waitFor();
      await page.locator('[data-action="start-collection"]').click();
      await page.locator('.focuspage .prompt').waitFor();
      assert.ok(await page.locator('[data-action="howto-open"]').isVisible());
      if(width>=1024){
        await page.locator('#desktop-nav [data-page="games"]').click();
      }else{
        await page.locator('[data-action="focus-back"]').first().click();
        await page.locator('[data-action="nav"][data-page="games"]').first().click();
      }
      await page.locator('.gamegrid').waitFor();
      assert.ok(await page.locator('.gamegrid .deck-tile').count()>0);
      if(width>=1024){
        assert.equal(await page.locator('#desktop-nav [data-page="games"]').getAttribute('aria-current'),'page');
        await page.locator('#desktop-nav [data-page="saved"]').click();
        await page.locator('.pagehead').waitFor();
        await page.locator('#desktop-nav [data-page="settings"]').click();
        await page.locator('.settings-list').waitFor();
      }
      assert.deepEqual(errors,[],name+': browser errors');
      results.push({name,width,height,status:'passed',...metrics});
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
}
writeFileSync('/tmp/saymore-desktop-browser-qa.json',JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify(results,null,2));
