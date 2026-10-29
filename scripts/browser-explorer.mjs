// Actual rendered POC and baseline comparison, using isolated saved JMA replay.
import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {mkdir,writeFile} from 'node:fs/promises';
import {normalize} from '../server/jma.ts';
import {materialize} from '../server/store.ts';
const stage=process.env.REVIEW_STAGE??'v1f-explorer';
const base=process.env.PREVIEW_URL??'http://127.0.0.1:5173',beforeBase=process.env.BASELINE_URL;
const raw=readFileSync('docs/sources/evidence/2026-10-29/jma-vptw61.xml','utf8');
const sourceUrl='https://www.data.jma.go.jp/developer/xml/data/20261028154121_0_VPTW61_010000.xml';
const now=Date.parse('2026-10-28T16:00:00Z'),advisory=normalize(raw,sourceUrl,new Date(now).toISOString());
const health={state:'fresh',lastSuccessAt:new Date(now).toISOString(),lastCheckedAt:new Date(now).toISOString()};
const payload=()=>materialize([advisory],health,now);
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const checks=[],audits=[],screenshots=[],errors=[],unexpectedOrigins=[];
await mkdir(`docs/screenshots/${stage}`,{recursive:true});
async function create(locale,width,target=base) {
 const context=await browser.newContext({viewport:{width,height:width<640?844:1080},hasTouch:width<640,isMobile:width<640,reducedMotion:'reduce'});
 await context.addInitScript(locale=>localStorage.setItem('storm-chaser-locale',locale),locale);
 const page=await context.newPage(),state={payload:payload(),failed:false,successes:0};
 page.on('pageerror',e=>errors.push(e.message));await page.clock.install({time:now});
 await page.route('**/*',async route=>{const u=new URL(route.request().url());if(u.origin!==new URL(target).origin){unexpectedOrigins.push(u.origin);await route.abort();return;}if(u.pathname==='/api/live'){if(state.failed){await route.abort();return;}state.successes++;await route.fulfill({json:state.payload});return;}await route.continue();});
 await page.goto(target);await page.locator('.storm-card').waitFor();await page.locator('#map[data-ready="true"]').waitFor();
 await page.evaluate(before=>{const banner=document.createElement('aside');banner.textContent=`CONTROLLED REPLAY / 受控重播 · saved JMA specimen · not current weather · ${before?'BEFORE M3-P':'V1-F LOCAL CANDIDATE'}`;banner.style.cssText='padding:10px 18px;background:#302618;color:#f0d19b;font:12px sans-serif;line-height:1.6';document.body.prepend(banner);},target!==base);
 return {page,context,state};
}
async function check(name,fn){await fn();checks.push({name,status:'passed'});}
async function shot(page,name){await page.locator('.map-frame').scrollIntoViewIfNeeded();await page.clock.runFor(250);await page.locator('#map[data-ready="true"]').waitFor();await page.screenshot({path:`docs/screenshots/${stage}/${name}.png`,fullPage:true});screenshots.push(name);}
async function audit(page,name){const r=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();audits.push({name,violations:r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))});}
async function manual(page,touch=false){if(touch)await page.locator('.storm-card').tap();else await page.locator('.storm-card').click();}
async function setIndex(page,index){const r=page.locator('#explorer-range');await r.focus();await page.keyboard.press('Home');for(let i=0;i<index;i++)await page.keyboard.press('ArrowRight');}
async function assertPoint(page,index) {
 const p=advisory.points[index];assert.equal(await page.locator('#explorer').getAttribute('data-selected-time'),p.validAt);
 assert.equal(await page.locator('#explorer').getAttribute('data-kind'),p.kind);
 if(index){assert.equal(await page.locator('.forecast-dot.is-explored').count(),1);assert.deepEqual(JSON.parse(await page.locator('.forecast-dot.is-explored').getAttribute('data-position')),[p.longitude,p.latitude]);}
 else assert.equal(await page.locator('.forecast-dot.is-explored').count(),0);
 assert.match(await page.locator('.explorer-context').innerText(),new RegExp(String(p.latitude).replace('.','\\.')));
 assert.equal(await page.locator('#explorer-source').getAttribute('href'),sourceUrl);
}
try {
 for(const locale of ['en','zh-TW'])for(const width of [1440,390]) {
  const prefix=`${width<640?'mobile':'desktop'}-${locale}`;
  if(beforeBase){
   const s=await create(locale,width,beforeBase),{page}=s;await manual(page,width<640);
   if(await page.locator('.detail-disclosure').getAttribute('open')===null)await page.locator('#detail-summary').click();
   await page.locator('[data-forecast-time]').nth(2).click();await shot(page,`before-${prefix}-plus45`);await s.context.close();
  }
  const s=await create(locale,width),{page,state}=s;
  await check(`${prefix}: neutral Auto does not acquire a priority through the explorer`,async()=>{
   assert.equal(await page.locator('#explorer-range').count(),0);assert.equal(await page.locator('.storm-card[aria-pressed="true"]').count(),0);
   await manual(page,width<640);await page.locator('#explorer-range').waitFor();await assertPoint(page,0);
  });
  await check(`${prefix}: discrete navigation synchronizes valid time, source coordinates and camera`,async()=>{
   const camera=await page.locator('#map').getAttribute('data-camera');
   if(width<640){for(let i=0;i<3;i++)await page.locator('#explorer-next').tap();}
   else await setIndex(page,3);
   await assertPoint(page,3);assert.equal(await page.locator('#map').getAttribute('data-camera'),camera);
   assert((await page.locator('#explorer-kind').innerText()).includes(locale==='en'?'prediction, not an observation':'非實際觀測'));
   const text=await page.locator('#explorer-readout').innerText();assert(text.includes('45'));assert(text.includes('UTC+08:00'));assert(text.includes('24'));
   await shot(page,`after-${prefix}-plus45`);await audit(page,`${prefix}-forecast`);
  });
  await check(`${prefix}: source details, locale and map selection remain synchronized`,async()=>{
   await page.locator('#explorer-evidence-summary').click();
   assert((await page.locator('#explorer-evidence').innerText()).includes(locale==='en'?'knots':'節'));
   await page.locator('#language').click();await assertPoint(page,3);await page.locator('#language').click();
   await page.locator('.forecast-dot').last().focus();await page.keyboard.press('Enter');await assertPoint(page,6);
   await page.locator('[data-forecast-time]').nth(1).click();await assertPoint(page,2);
   assert((await page.locator('#explorer-readout').innerText()).includes('21'));
  });
  if(width===1440)await check(`${prefix}: native slider mouse drag retains DOM identity and hits only published points`,async()=>{
   await setIndex(page,0);await page.evaluate(()=>{window.testRange=document.querySelector('#explorer-range');});
   const box=await page.locator('#explorer-range').boundingBox();
   await page.mouse.move(box.x+8,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width-8,box.y+box.height/2,{steps:12});await page.mouse.up();
   await assertPoint(page,6);assert(await page.evaluate(()=>window.testRange===document.querySelector('#explorer-range')));
   await page.locator('#explorer-range').focus();await page.keyboard.press('Home');await assertPoint(page,0);await page.keyboard.press('End');await assertPoint(page,6);
  });
  await check(`${prefix}: hidden layer, analysis reset and reduced-motion semantics`,async()=>{
   await page.locator('[data-track="A"]').uncheck();assert.equal(await page.locator('#explorer-range').count(),0);assert.equal(await page.locator('.is-explored').count(),0);
   assert((await page.locator('#explorer-instructions').innerText()).includes(locale==='en'?'hidden':'隱藏'));
   await page.locator('[data-track="A"]').check();await assertPoint(page,0);
   assert(await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches));
   for(const w of [320,390,768,1440]){await page.setViewportSize({width:w,height:900});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${locale} ${w}`);}
   await page.setViewportSize({width,height:width<640?844:1080});
  });
  await check(`${prefix}: stale exploration and expiry operate without a fresh API response`,async()=>{
   await setIndex(page,3);state.failed=true;const successes=state.successes;
   await page.clock.setSystemTime(now+9*3600_000);await page.evaluate(()=>window.dispatchEvent(new Event('offline')));
   assert((await page.locator('#explorer-status').innerText()).includes(locale==='en'?'last-known':'資料延遲'));
   await assertPoint(page,3);await shot(page,`after-${prefix}-stale`);await audit(page,`${prefix}-stale`);
   await page.clock.setSystemTime(now+25*3600_000);await page.evaluate(()=>window.dispatchEvent(new Event('pageshow')));
   assert.equal(await page.locator('#explorer-range').count(),0);assert.equal(await page.locator('.is-explored').count(),0);assert.equal(await page.locator('.point-detail').count(),0);assert.equal(state.successes,successes);
   await shot(page,`after-${prefix}-expired`);await audit(page,`${prefix}-expired`);
  });
  await s.context.close();
 }
 const s=await create('en',1440),{page,state}=s;await manual(page);
 await check('selected forecast expires individually; baseline is explained, not another forecast',async()=>{
  await setIndex(page,1);state.failed=true;await page.clock.setSystemTime(now+13*3600_000);await page.evaluate(()=>window.dispatchEvent(new Event('focus')));
  assert.equal(await page.locator('#explorer').getAttribute('data-kind'),'analysis');assert.equal(await page.locator('.is-explored').count(),0);assert.match(await page.locator('#explorer-status').innerText(),/no longer current/);
 });
 await check('insufficient forecasts and missing native values stay explicit',async()=>{
  await page.clock.setSystemTime(now);state.failed=false;const missing=structuredClone(advisory);missing.id='controlled-no-forecasts';missing.points=missing.points.filter(p=>p.kind==='analysis');missing.points[0].winds=[];
  state.payload=materialize([missing],health,now);await page.evaluate(()=>window.dispatchEvent(new Event('online')));
  await page.waitForFunction(()=>document.querySelector('#explorer-instructions')?.textContent?.includes('No unexpired forecast positions'));
  assert.equal(await page.locator('#explorer-range').count(),0);await page.locator('#explorer-evidence-summary').click();assert.match(await page.locator('#explorer-evidence').innerText(),/Not reported/);await shot(page,'after-desktop-en-insufficient');await audit(page,'insufficient');
 });
 await check('explicit parent validity removes the timeline on resume despite future points',async()=>{
  const explicit={...advisory,id:'controlled-explicit',validUntil:new Date(now+60_000).toISOString()};state.payload=materialize([explicit],health,now);await page.evaluate(()=>window.dispatchEvent(new Event('online')));await page.locator('#explorer-range').waitFor();
  state.failed=true;const successes=state.successes;await page.clock.setSystemTime(now+60_001);await page.evaluate(()=>{Object.defineProperty(document,'visibilityState',{configurable:true,get:()=> 'visible'});document.dispatchEvent(new Event('visibilitychange'));});
  assert.equal(await page.locator('#explorer-range').count(),0);assert.equal(state.successes,successes);assert.equal(await page.locator('.is-explored').count(),0);
 });await s.context.close();
 assert.deepEqual(errors,[]);assert.deepEqual(unexpectedOrigins,[]);assert.equal(audits.flatMap(a=>a.violations).length,0,JSON.stringify(audits));
 console.log(`PASS: ${checks.length} explorer checks, ${audits.length} axe scans, ${screenshots.length} screenshots, baseline comparison ${Boolean(beforeBase)}.`);
}finally{
 await writeFile(`docs/${stage}-results.json`,JSON.stringify({type:'controlled-saved-official-specimen-finalization',checkedAt:new Date().toISOString(),baselineCommit:'129a3af3a13e882d8d92bcfd0360fdfa83b01cf7',baselineCompared:Boolean(beforeBase),sourceUrl,sourceHash:advisory.contentHash,checks,audits,screenshots,errors,unexpectedOrigins,liveSourceRequests:0,limits:'Browser rendering and controlled replay, not current weather, physical devices, human comprehension testing or owner V1-F acceptance.'},null,2)+'\n');await browser.close();
}
