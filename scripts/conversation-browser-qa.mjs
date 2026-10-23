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
   bridgeCount:Object.keys(BRIDGES).length,
   missingIconCount:[...document.querySelectorAll('button svg')].filter(x=>!x.querySelector('path,rect,circle,line,polyline,polygon,ellipse')).length
  }));
  assert.equal(result.curated,49);
  assert.equal(result.total,16249);
  assert.equal(result.older,false);
  assert.ok(result.cards>0);
  assert.ok(result.overflow<=1,'Horizontal overflow '+result.overflow);
  assert.equal(result.bridgeCount,49);
  assert.equal(result.missingIconCount,0);
  const ui=await page.evaluate(()=>({stage:!!document.querySelector('.cf-spotlight'),topBar:!!document.querySelector('.cf-header'),oldHero:!!document.querySelector('.home-showcase'),newStyles:[...document.styleSheets].some(s=>s.href?.includes('conversation-ui-v2.css')),headerDisplay:getComputedStyle(document.querySelector('.cf-header')).display}));
  assert.ok(ui.stage&&ui.topBar&&!ui.oldHero,'Must be a rebuilt conversation-first UI, not a styled old dashboard');
  assert.ok(ui.newStyles,'Conversation-first stylesheet must load');
  assert.equal(ui.headerDisplay,'flex');
  await page.screenshot({path:'/tmp/saymore-v2-'+label+'.jpg',type:'jpeg',quality:65});
  return result;
 });
 await record(label+' compact Start Something discovery',async()=>{
   const metrics=await page.evaluate(()=>{
     const shelf=document.querySelector('.cf-theme-strip');
     const chips=[...shelf.querySelectorAll('.cf-theme-tile')];
     const first=document.querySelector('.cf-feed-row');
     const header=document.querySelector('.cf-ideas-header');
     const pill=chips[0]?.getBoundingClientRect(),shelfRect=shelf.getBoundingClientRect(),
       firstRect=first?.getBoundingClientRect(),headerRect=header.getBoundingClientRect();
     return {pillCount:chips.length,pillHeight:pill?.height,
       firstRowHeight:firstRect?.height,headerHeight:headerRect.height,
       verticalGap:firstRect.top-shelfRect.bottom,
       hasOldTiles:!!document.querySelector('.cf-themes-block'),
       rowTextWidth:document.querySelector('.cf-home-idea .cf-idea-open')?.getBoundingClientRect().width,
       noStackBorder:getComputedStyle(first).borderLeftWidth==='0px',
       noCardBackground:getComputedStyle(first).backgroundColor==='rgba(0, 0, 0, 0)',
       buttonCount:first?.querySelectorAll('button').length,
       rowWidth:firstRect?.width,bodyOverflow:document.documentElement.scrollWidth-innerWidth};
   });
   assert.equal(metrics.pillCount,7,'All ideas plus six topic chips');
   assert.ok(metrics.pillHeight<=41,'Theme selection must be compact pills, not giant cards');
   assert.ok(metrics.firstRowHeight<190,'Idea rows must use compact full-width typography');
   assert.ok(metrics.verticalGap>=0&&metrics.verticalGap<105,'No excessive whitespace between theme chips and ideas');
   assert.ok(metrics.rowTextWidth>metrics.rowWidth*.8,'Text must use the full row, not be squeezed by two action icons');
   assert.equal(metrics.hasOldTiles,false);
   assert.equal(metrics.noStackBorder,true,'Home ideas must not be boxed cards');
   assert.equal(metrics.noCardBackground,true,'Home ideas are unboxed list entries');
   assert.equal(metrics.buttonCount,2,'Save and Open actions are retained');
   assert.ok(metrics.bodyOverflow<=1);
   if(label==='phone'){
     await page.evaluate(()=>{const y=window.scrollY+document.querySelector('.cf-ideas-header').getBoundingClientRect().top-55;window.scrollTo({top:y,behavior:'instant'})});
     await page.screenshot({path:'/tmp/saymore-v2-phone-compact-discovery.jpg',type:'jpeg',quality:78});
   }
   const y=await page.evaluate(()=>{const el=document.querySelector('.cf-theme-strip');window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-95,behavior:'instant'});return window.scrollY});
   await page.evaluate(()=>document.querySelector('.cf-theme-strip [data-topic="People & Connections"]').click());
   await page.waitForFunction(()=>state.topic==='People & Connections');
   await page.waitForTimeout(90);
   const after=await page.evaluate(()=>window.scrollY);
   assert.ok(Math.abs(y-after)<105,'Choosing a theme on Start should not jump the user to the page top');
   await page.evaluate(()=>{state.topic='All topics';render();window.scrollTo({top:0,behavior:'instant'})});
   return metrics;
 });
 await record(label+' Focus and continuations',async()=>{
  await page.locator('.cf-home-idea [data-focus]').first().click();
  await page.locator('.focus-overlay').waitFor();
  const id=await page.evaluate(()=>state.focus);
  const focusAppearance=await page.evaluate(()=>{
   const x=document.querySelector('.focus-top .close');
   const prev=document.querySelector('.focus-bottom .nexts button');
   const body=document.querySelector('.focus-main');
   const text=getComputedStyle(body),cx=getComputedStyle(x),ca=getComputedStyle(prev);
   return {closeColor:cx.color,previousColor:ca.color,fontSize:parseFloat(text.fontSize),lineHeight:parseFloat(text.lineHeight),textTop:body.getBoundingClientRect().top,
     keepTalking:document.querySelectorAll('.focus-primary-action').length,sidebar:document.querySelectorAll('.focus-secondary-actions .focus-subtle-action').length};
  });
  assert.equal(focusAppearance.closeColor,'rgb(51, 91, 61)','Close icon should be forest green, never browser blue');
  assert.equal(focusAppearance.previousColor,'rgb(50, 94, 61)','Previous arrow should be green, never browser blue');
  assert.equal(focusAppearance.keepTalking,1);
  assert.equal(focusAppearance.sidebar,2);
  if(width<=780){
   assert.ok(focusAppearance.fontSize<=31,'Focus content is too large for a phone');
   assert.ok(focusAppearance.textTop<350,'Focus text should start near the top, not float mid-screen');
  }
  if(label==='phone')await page.screenshot({path:'/tmp/saymore-v2-phone-focus.jpg',type:'jpeg',quality:75});
  await page.locator('[data-action="angles"]').click();
  await page.locator('.angle-path').first().waitFor();
  assert.equal(await page.locator('.angle-path').count(),4);
  assert.equal(await page.locator('.bridge-path').count(),1);
  await page.locator('[data-save]').last().click();
  assert.ok(await page.evaluate(id=>state.saved.includes(id),id));
  await page.locator('[data-action="closeFocus"]').click();
  return {savedId:id};
 });
 await record(label+' legacy library and saved',async()=>{
  await page.locator('[data-action="toggleEarlier"]').click();
  assert.equal(await page.evaluate(()=>filtered().length),16249);
  await page.locator('[data-action="toggleEarlier"]').click();
  assert.equal(await page.evaluate(()=>filtered().length),49);
  await page.evaluate(()=>nav('saved'));
  assert.ok(await page.locator('.prompt-card').count()>0);
 });
 await record(label+' themes and filters',async()=>{
  await page.evaluate(()=>nav('topics'));
  assert.equal(await page.locator('.cf-topics-page .cf-link-row').count(),6);
  const displayedIcons=await page.locator('.cf-topics-page .cf-link-icon').evaluateAll(els=>els.map(el=>{
    const svg=el.querySelector('svg');
    const b=svg?.getBoundingClientRect();
    return {exists:!!svg,paths:svg?.querySelectorAll('path,rect,circle,line,polyline,polygon').length||0,width:b?.width||0,height:b?.height||0,color:getComputedStyle(svg||el).color};
  }));
  assert.ok(displayedIcons.every(x=>x.exists&&x.paths>0&&x.width>=18&&x.height>=18),'Theme Iconsax symbols must be visibly sized');
  if(label==='phone')await page.screenshot({path:'/tmp/saymore-v2-phone-themes.jpg',type:'jpeg',quality:70});
  await page.locator('[data-topic="People &amp; Connections"],[data-topic="People & Connections"]').first().click();
  assert.ok(await page.evaluate(()=>filtered().length)>0);
  await page.evaluate(()=>{state.topic='All topics';nav('explore');});
  await page.locator('[data-action="refine"]').first().click();
  const filterAppearance=await page.evaluate(()=>{
   const modal=document.querySelector('.cf-refine-modal'),footer=modal?.querySelector('.modal-actions'),close=modal?.querySelector('.close');
   return {isSheet:!!modal,modalHeight:modal?.getBoundingClientRect().height,viewport:innerHeight,
     footerVisible:footer?.getBoundingClientRect().bottom<=innerHeight+1,
     closeColor:close?getComputedStyle(close).color:'',scrollable:modal?.querySelector('.modal-body')?.scrollHeight>modal?.querySelector('.modal-body')?.clientHeight}
  });
  assert.ok(filterAppearance.isSheet&&filterAppearance.footerVisible,'Filter action must stay visible');
  assert.equal(filterAppearance.closeColor,'rgb(51, 91, 61)','Filter close icon should match forest green');
  if(width<=780)assert.ok(filterAppearance.modalHeight<=filterAppearance.viewport*.9+2);
  if(label==='phone')await page.screenshot({path:'/tmp/saymore-v2-phone-filters.jpg',type:'jpeg',quality:75});
  await page.locator('[data-audience="Family"]').click();
  await page.locator('[data-mood="Flirty"]').last().click();
  await page.locator('[data-action="applyFilters"]').click();
  assert.ok((await page.evaluate(()=>filtered().map(p=>p.topic).every(topic=>topic!=='Dating'))));
  await page.evaluate(()=>{state.mood='Mix It Up';state.audience='Anyone';state.topic='All topics';nav('explore');});
 });
 await record(label+' games and Truth or Dare',async()=>{
  await page.evaluate(()=>nav('play'));
  assert.ok(await page.getByRole('button',{name:'Story Chain'}).count()>0);
  await page.locator('[data-play-type="Story Chain"]').click();
  await page.locator('[data-action="playNext"]').click();
  assert.ok((await page.locator('.play-card h2').innerText()).length>20);
  assert.doesNotMatch(await page.locator('.play-card').innerText(),/\\b(?:round|score|streak|leaderboard)\\b/i);
  await page.waitForFunction(()=>{
   const active=document.querySelector('.cf-game-rail .choice.on');
   const rail=active?.parentElement;
   if(!active||!rail)return false;
   const a=active.getBoundingClientRect(),b=rail.getBoundingClientRect();
   return a.left>=b.left-2&&a.right<=b.right+2;
  },null,{timeout:3000});
  const firstCardBox=await page.locator('.cf-game-stage').boundingBox();
  assert.ok(firstCardBox.y<460,'Play card should be above the fold, not hidden under mandatory filters');
  if(label==='phone')await page.screenshot({path:'/tmp/saymore-v2-phone-play.jpg',type:'jpeg',quality:70});
  await page.locator('[data-action="playOptions"]').click();
  assert.ok(await page.locator('.cf-play-modal').count()===1);
  await page.locator('[data-play-audience="Family"]').click();
  await page.locator('.cf-play-modal [data-action="closeOverlay"]').last().click();
  await page.locator('[data-action="playNext"]').click();
  assert.ok((await page.locator('.play-card h2').innerText()).length>20);
  await page.locator('[data-view="truthordare"]').last().click();
  await page.locator('[data-tod-type="Truth"]').click();
  assert.ok(await page.locator('.tod-card').count()===1);
  assert.doesNotMatch(await page.locator('.tod-card').innerText(),/\\b(?:round|score|streak|restart)\\b/i);
 });
 await record(label+' More list and navigation',async()=>{
  await page.evaluate(()=>nav('more'));
  assert.equal(await page.locator('.cf-more-page .cf-link-row').count(),4);
  const icons=await page.locator('.cf-more-page .cf-link-icon svg').count();
  assert.equal(icons,4);
  if(label==='phone')await page.screenshot({path:'/tmp/saymore-v2-phone-more.jpg',type:'jpeg',quality:70});
  await page.locator('.cf-more-page [data-view="history"]').click();
  assert.match(await page.locator('.page-heading h1').innerText(),/Recent conversations/);
  await page.evaluate(()=>nav('more'));
  await page.locator('.cf-more-page [data-view="settings"]').click();
  assert.ok(await page.locator('.main').innerText().then(t=>/Conversation preferences/i.test(t)));
 });
 await record(label+' no horizontal overflow after navigation',async()=>{
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth<=1));
  if(width<=780){
   const mobile=page.locator('.mobile-nav');
   assert.ok(await mobile.isVisible());
   const box=await mobile.boundingBox();
   assert.ok(box.width<=width+1);
   const items=await mobile.locator('button').evaluateAll(els=>els.map(el=>({label:el.textContent.trim(),top:el.getBoundingClientRect().top,bottom:el.getBoundingClientRect().bottom,left:el.getBoundingClientRect().left,right:el.getBoundingClientRect().right})));
   assert.equal(items.length,5,'Mobile navigation should contain five primary routes');
   const navBottom=box.y+box.height;
   assert.ok(items.every(item=>item.left>=-1&&item.right<=width+1&&item.top>=box.y-1&&item.bottom<=navBottom+1),'Five mobile nav buttons must fit in one row');
  }
 });
 await context.close();
}
try{
 for(const s of [{width:390,height:844,label:'phone'},{width:768,height:1024,label:'small-tablet'},{width:820,height:1180,label:'tablet'},{width:1440,height:900,label:'desktop'}])await checkSize(s.width,s.height,s.label);
 await record('PWA offline cached shell',async()=>{
  const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'allow'});
  const page=await context.newPage(); page.on('pageerror',e=>errors.push('offline: '+e.message));
  await page.goto(base,{waitUntil:'load'});
  await page.waitForFunction(()=>navigator.serviceWorker.controller!==null,{timeout:30000}).catch(async()=>{await page.reload({waitUntil:'load'});await page.waitForFunction(()=>navigator.serviceWorker.controller!==null,{timeout:30000})});
  await page.evaluate(async()=>{const reg=await navigator.serviceWorker.ready;await reg.update()});
  await context.setOffline(true);
  await page.reload({waitUntil:'load',timeout:30000});
  assert.equal(await page.evaluate(()=>filtered().length),49);
  await page.evaluate(()=>nav('play'));
  assert.ok(await page.getByRole('button',{name:'Story Chain'}).count()>0);
  await context.close();
  return {cached:true};
 });
}finally{await browser.close()}
const summary={date:new Date().toISOString(),status:findings.every(x=>x.status==='pass')&&errors.length===0?'passed':'failed',checks:findings,javaScriptErrors:errors};
fs.writeFileSync('/tmp/saymore-conversation-browser-qa.json',JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify(summary,null,2));
if(summary.status!=='passed')process.exitCode=1;
