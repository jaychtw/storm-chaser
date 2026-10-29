// M3-P acceptance: controlled saved-source replay only. No live collector/API.
import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {mkdir,writeFile} from 'node:fs/promises';
import {normalize} from '../server/jma.ts';
import {materialize} from '../server/store.ts';
const stage='m3p',base=process.env.PREVIEW_URL??'http://127.0.0.1:5173';
const raw=readFileSync('docs/sources/evidence/2026-10-29/jma-vptw61.xml','utf8');
const url='https://www.data.jma.go.jp/developer/xml/data/20261028154121_0_VPTW61_010000.xml';
const now=Date.parse('2026-10-28T16:00:00Z');
const a=normalize(raw,url,new Date(now).toISOString());
const b={...structuredClone(a),id:'controlled-second',unitKey:a.unitKey+'|controlled-second',stormId:'JMA:2026:CONTROLLED-SECOND',name:'CONTROLLED SECOND'};
const good={state:'fresh',lastSuccessAt:new Date(now).toISOString(),lastCheckedAt:new Date(now).toISOString()};
const initial=records=>materialize(records,good,now);
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const results=[],audits=[],shots=[],errors=[],unexpectedNetwork=[];
await mkdir(`docs/screenshots/${stage}`,{recursive:true});
async function session(locale='en',width=1440,payload=initial([a,b])) {
 const context=await browser.newContext({viewport:{width,height:width<640?844:1080},hasTouch:width<640,isMobile:width<640,reducedMotion:'reduce'});
 await context.addInitScript(locale=>localStorage.setItem('storm-chaser-locale',locale),locale);
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 const state={payload,failed:false,calls:0,successes:0};
 await page.clock.install({time:now});
 await page.route('**/*',async route=>{
  const u=new URL(route.request().url());
  if(u.origin!==new URL(base).origin){unexpectedNetwork.push(u.origin);await route.abort();return;}
  if(u.pathname==='/api/live'){state.calls++;if(state.failed){await route.abort('failed');return;}state.successes++;await route.fulfill({json:state.payload});return;}
  await route.continue();
 });
 await page.goto(base);await page.locator('#map[data-ready="true"]').waitFor();
 await page.waitForFunction(()=>!document.querySelector('#map-heading')?.textContent?.includes('Checking source'));
 await page.evaluate(()=>{const banner=document.createElement('aside');banner.textContent='CONTROLLED REPLAY / 受控重播 · saved JMA specimen and controlled cases · not current weather';banner.style.cssText='padding:10px 18px;background:#302618;color:#f0d19b;font:12px sans-serif;line-height:1.6';document.body.prepend(banner);});
 return {context,page,state};
}
async function check(name,fn){await fn();results.push({name,status:'passed'});}
async function shot(page,name){await page.locator('#map[data-ready="true"]').waitFor();await page.screenshot({path:`docs/screenshots/${stage}/${name}.png`,fullPage:true});shots.push(name);}
async function audit(page,name){const r=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();audits.push({name,violations:r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))});}
async function currentCount(page,n){await page.waitForFunction(n=>document.querySelectorAll('.storm-card').length===n,n);}
async function openManual(page,index=0){await page.locator('.storm-card').nth(index).click();const d=page.locator('.detail-disclosure');if(await d.getAttribute('open')===null)await page.locator('#detail-summary').click();}
try {
 for(const locale of ['en','zh-TW']) {
  const s=await session(locale),{page,state}=s;
  await check(`${locale}: neutral Auto / no arbitrary winner with two storms`,async()=>{
   await currentCount(page,2);assert.equal(await page.locator('.storm-card[aria-pressed="true"]').count(),0);assert.equal(await page.locator('.storm-pin.active').count(),0);assert.equal(await page.locator('.forecast-dot').count(),0);
   assert((await page.locator('.focus-overview').innerText()).includes(locale==='en'?'cannot currently be determined':'資料不足'));
   await shot(page,`desktop-${locale}-auto-uncertain`);await audit(page,`${locale}-neutral`);
  });
  await check(`${locale}: manual native motion, localized labels and source timestamps`,async()=>{
   await openManual(page);await page.locator('.forecast-dot').first().waitFor();
   const text=await page.locator('#detail').innerText();
   assert(text.includes(locale==='en'?'West':'西'));assert(text.includes(locale==='en'?'knots':'節'));assert(!text.includes('ノット'));assert(!text.includes('中心気圧'));assert(text.includes('95'));assert(text.includes('UTC+08:00'));
   const card=await page.locator('[data-source="JMA"]').innerText();assert(card.includes(locale==='en'?'Issued':'發布'));assert(card.includes(locale==='en'?'Source control time':'來源控制時間'));assert(card.includes(locale==='en'?'Retrieved':'擷取時間'));
   await shot(page,`desktop-${locale}-manual-current`);await audit(page,`${locale}-manual`);
  });
  await check(`${locale}: keyboard focus, forecast detail, locale and camera survive changed advisories`,async()=>{
   await page.locator('.forecast-dot').last().focus();await page.keyboard.press('Enter');await page.locator('.point-detail').waitFor();
   await page.locator('#map button.maplibregl-ctrl-zoom-in').click();await page.clock.runFor(500);
   const before=await page.locator('#map').getAttribute('data-camera');
   await page.locator('.forecast-dot').last().focus();const key=await page.evaluate(()=>document.activeElement.dataset.mapPoint);
   const revised=normalize(raw.replace('15:41:20Z','15:51:20Z').replace('+15.4+157.0/','+15.5+157.0/'),url,new Date(now+60_000).toISOString());
   state.payload=materialize([b,revised],good,now+60_000);await page.clock.runFor(31_000);
   await page.waitForFunction(()=>document.querySelector('#detail')?.textContent?.includes('15.5°'));
   assert.equal(await page.locator('#map').getAttribute('data-camera'),before);assert.equal(await page.evaluate(()=>document.activeElement.dataset.mapPoint),key);assert.equal(await page.locator('.point-detail').count(),1);
   await page.locator('#language').click();assert.equal(await page.locator('.storm-card[aria-pressed="true"]').count(),1);assert.equal(await page.locator('#map').getAttribute('data-camera'),before);await page.locator('#language').click();
  });
  await check(`${locale}: changed forecast invalidates selected point and restores logical keyboard focus`,async()=>{
   await page.locator('.forecast-dot').last().focus();await page.keyboard.press('Enter');await page.locator('#close-point').focus();
   const changed=structuredClone(a);changed.id='controlled-removed-forecast';changed.points=changed.points.slice(0,-1);
   state.payload=materialize([changed,b],good,now);await page.clock.runFor(31_000);
   await page.waitForFunction(()=>document.querySelectorAll('.point-detail').length===0);
   assert.equal(await page.locator('#point-lost').count(),1);assert.equal(await page.evaluate(()=>document.activeElement.id),'detail-summary');
   assert.equal(await page.locator('.storm-card[aria-pressed="true"]').count(),1);
  });
  await check(`${locale}: partial ingestion plus retained eligible records`,async()=>{
   state.payload=materialize([a,b],{...good,state:'stale',partial:true,error:'partial-ingestion'},now);
   await page.clock.runFor(31_000);await page.locator('.outage-banner').waitFor();assert((await page.locator('[data-source="JMA"]').innerText()).includes(locale==='en'?'Some JMA records':'部分 JMA'));
   await shot(page,`desktop-${locale}-partial`);await audit(page,`${locale}-partial`);
  });
  await check(`${locale}: upstream collection failure is distinct from local API loss`,async()=>{
   state.payload=materialize([a,b],{...good,state:'stale',error:'collection-failed'},now);await page.clock.runFor(31_000);
   await page.waitForFunction(expected=>document.querySelector('[data-source="JMA"]')?.textContent?.includes(expected),locale==='en'?'latest collection attempt failed':'最近一次蒐集失敗');
   state.failed=true;await page.evaluate(()=>window.dispatchEvent(new Event('offline')));await page.clock.runFor(31_000);
   assert((await page.locator('[data-source="JMA"]').innerText()).includes(locale==='en'?'cannot reach the local data API':'無法連線至本機資料 API'));
   assert.equal(await page.locator('.storm-card').count(),2);await shot(page,`desktop-${locale}-api-stale`);await audit(page,`${locale}-api-stale`);
  });
  await check(`${locale}: expired cached records/selected points disappear while API stays failed`,async()=>{
   await page.locator('.forecast-dot').last().focus();await page.keyboard.press('Enter');
   const successes=state.successes;
   // Jump wall time without firing all intervening timers: models suspended tab.
   await page.clock.setSystemTime(now+25*3600_000);
   await page.evaluate(()=>{Object.defineProperty(document,'visibilityState',{configurable:true,get:()=> 'visible'});document.dispatchEvent(new Event('visibilitychange'));});
   await currentCount(page,0);assert.equal(state.successes,successes);assert.equal(await page.locator('.forecast-dot').count(),0);assert.equal(await page.locator('.point-detail').count(),0);
   assert.equal(await page.locator('#selection-notice').count(),1);assert.equal(await page.locator('.expiry-notice').count(),1);assert.equal(await page.locator('.storm-pin').count(),0);
   await page.locator('#coverage-toggle').click();assert((await page.locator('#coverage-body').innerText()).includes(locale==='en'?'cache is not an archive':'快取並非封存庫'));
   assert.equal(await page.locator('[data-storm^="demo-"]').count(),0);await shot(page,`desktop-${locale}-expired-outage`);await audit(page,`${locale}-expired`);
  });
  await check(`${locale}: recovery restores same manual storm; Auto returns to neutral with one storm`,async()=>{
   const later=now+25*3600_000;
   const recovered={...a,id:'controlled-recovered',issuedAt:new Date(later-60_000).toISOString(),controlAt:new Date(later-60_000).toISOString()};
   state.payload=materialize([recovered],{state:'fresh',lastSuccessAt:new Date(later).toISOString()},later);state.failed=false;
   await page.evaluate(()=>window.dispatchEvent(new Event('online')));await currentCount(page,1);
   assert.equal(await page.locator('.storm-card[aria-pressed="true"]').count(),1);await page.locator('#auto').click();assert.equal(await page.locator('.storm-card[aria-pressed="true"]').count(),0);assert.equal(await page.locator('.forecast-dot').count(),0);
  });
  await s.context.close();
 }
 // Separate validities exercise resume hooks, frozen dispatch, offline mode and
 // still-running timers, rather than only rendering an expired server payload.
 for(const event of ['pageshow','focus','visibilitychange','timer']) {
  const validity=now+60_000,source={...a,validUntil:new Date(validity).toISOString()};
  const s=await session('en',390,initial([source])),{page,state}=s;
  await openManual(page);await page.locator('.forecast-dot').last().focus();await page.keyboard.press('Enter');
  state.failed=true;const successes=state.successes;
  if(event==='visibilitychange')await page.evaluate(()=>{Object.defineProperty(document,'visibilityState',{configurable:true,get:()=> 'hidden'});document.dispatchEvent(new Event('visibilitychange'));});
  await page.clock.setSystemTime(validity+1);
  await check(`explicit validity during API failure: ${event}`,async()=>{
   if(event==='timer')await page.clock.runFor(5_100);
   else await page.evaluate(event=>{
    if(event==='visibilitychange'){Object.defineProperty(document,'visibilityState',{configurable:true,get:()=> 'visible'});document.dispatchEvent(new Event(event));}
    else window.dispatchEvent(new Event(event));
   },event);
   await currentCount(page,0);assert.equal(state.successes,successes);assert.equal(await page.locator('.point-detail').count(),0);assert.equal(await page.locator('.forecast-dot').count(),0);
   assert.match(await page.locator('.expiry-notice').innerText(),/Source validity ended/);
   assert((await page.locator('#selection-notice').innerText()).includes('does not establish dissipation'));
  });
  await s.context.close();
 }
 for(const locale of ['en','zh-TW']) {
  const s=await session(locale,390),{page,state}=s;
  await check(`${locale}: mobile map-first and bilingual source access / touch alternative`,async()=>{
   const map=await page.locator('.map-frame').boundingBox(),rail=await page.locator('#storm-rail').boundingBox();assert(map.y<rail.y);
   await shot(page,`mobile-${locale}-auto-uncertain`);
   await page.locator('#source-jump').click();assert.equal(await page.evaluate(()=>document.activeElement.id),'source-heading');
   await page.locator('.storm-card').first().tap();assert.equal(await page.locator('.detail-disclosure').getAttribute('open'),null);await page.locator('#detail-summary').click();
   await page.locator('[data-forecast-time]').last().tap();assert.equal(await page.locator('.point-detail').count(),1);
   assert((await page.locator('.point-detail').innerText()).includes(locale==='en'?'Reported speed':'來源發布的移動速度'));
   const dot=await page.locator('.forecast-dot').first().boundingBox();assert(dot.width>=44&&dot.height>=44);
   await shot(page,`mobile-${locale}-manual-current`);await audit(page,`${locale}-mobile-manual`);
   for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:900});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${locale} overflow ${width}`);}
   await page.setViewportSize({width:390,height:844});
  });
  await check(`${locale}: mobile offline/expired/unavailable evidence`,async()=>{
   await page.context().setOffline(true);state.failed=true;await page.evaluate(()=>window.dispatchEvent(new Event('offline')));
   await shot(page,`mobile-${locale}-stale-outage`);
   await page.clock.setSystemTime(now+25*3600_000);await page.evaluate(()=>window.dispatchEvent(new Event('pageshow')));await currentCount(page,0);await shot(page,`mobile-${locale}-expired-outage`);await audit(page,`${locale}-mobile-expired`);
   await page.context().setOffline(false);await page.clock.setSystemTime(now);state.failed=false;state.payload=materialize([],{state:'unavailable',error:'collection-failed'},now);await page.evaluate(()=>window.dispatchEvent(new Event('online')));
   await page.waitForFunction(expected=>document.querySelector('[data-source="JMA"]')?.textContent?.includes(expected),locale==='en'?'latest collection attempt failed':'最近一次蒐集失敗');
   await shot(page,`mobile-${locale}-unavailable`);await audit(page,`${locale}-mobile-unavailable`);
   assert.equal(await page.locator('.storm-card').count(),0);
  });
  await s.context.close();
 }
 const missing=structuredClone(a);missing.points[0].motion=[];delete missing.points[0].direction;missing.points[0].winds=[];
 const ms=await session('en',1440,initial([missing]));await openManual(ms.page);
 await check('missing motion/wind and native qualitative forecast conditions remain honest',async()=>{
  assert((await ms.page.locator('.motion').first().innerText()).includes('Not reported'));
  await ms.page.locator('[data-forecast-time]').nth(4).click();assert((await ms.page.locator('.point-detail').innerText()).includes('Slowly'));assert(!/Reported speed: 0/.test(await ms.page.locator('.point-detail').innerText()));
  await ms.page.locator('#native-summary').click();assert((await ms.page.locator('#native-terms').innerText()).includes('台風(TY)'));
 });await ms.context.close();
 assert.deepEqual(errors,[]);assert.deepEqual(unexpectedNetwork,[]);assert.equal(audits.flatMap(a=>a.violations).length,0,JSON.stringify(audits));
 console.log(`PASS: ${results.length} M3-P acceptance groups; ${audits.length} axe scans; ${shots.length} controlled screenshots; zero live source requests.`);
}finally{
 await writeFile(`docs/${stage}-acceptance-results.json`,JSON.stringify({type:'controlled-official-specimen-and-mutated-cases',checkedAt:new Date().toISOString(),sourceUrl:url,sourceHash:a.contentHash,results,audits,shots,errors,unexpectedNetwork,liveSourceRequests:0,limits:'Saved official specimen and isolated controlled cases; not actual current weather, real OS sleep, a physical phone, screen-reader certification or owner visual acceptance.'},null,2)+'\n');
 await browser.close();
}
