import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {existsSync,readFileSync} from 'node:fs';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {normalize} from '../server/jma.ts';
import {materialize} from '../server/store.ts';
const stage=process.env.REVIEW_STAGE??'m3';
const base=process.env.PREVIEW_URL??'http://127.0.0.1:5173';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
await mkdir(`docs/screenshots/${stage}`,{recursive:true});const results=[];
const raw=readFileSync('docs/sources/evidence/2026-10-29/jma-vptw61.xml','utf8');
const url='https://www.data.jma.go.jp/developer/xml/data/20261028154121_0_VPTW61_010000.xml';
const now=Date.parse('2026-10-28T16:00:00Z');const a=normalize(raw,url,new Date(now).toISOString());
const good={state:'fresh',lastSuccessAt:new Date(now).toISOString(),lastCheckedAt:new Date(now).toISOString()};
let payload=materialize([a],good,now);const errors=[];
const context=await browser.newContext({viewport:{width:1440,height:1080},reducedMotion:'reduce'});const page=await context.newPage();
page.on('pageerror',e=>errors.push(e.message));await page.clock.install({time:now});
await page.route('**/api/live',route=>route.fulfill({json:payload}));
async function ready(){await page.locator('.storm-card').first().waitFor();await page.locator('#map[data-ready="true"]').waitFor();}
async function shot(name){await page.locator('#map[data-ready="true"]').waitFor();await page.screenshot({path:`docs/screenshots/${stage}/${name}.png`,fullPage:true});}
async function audit(name){const r=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();results.push({name,violations:r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))});}
try{
 await page.goto(base);await ready();assert.equal(await page.locator('.storm-card').count(),1);assert.equal(await page.locator('.forecast-dot').count(),6);assert.equal(await page.locator('[data-track="B"]').count(),0);assert.match(await page.locator('#detail').innerText(),/IN-FA/);await shot('official-specimen-en');await audit('official-specimen-en');
 // Manual focus and camera must survive a genuinely changed normalized revision
 // arriving at the local API. This is an explicitly controlled replay, not a
 // claim of a future live source update witnessed in the wild.
 await page.locator('.storm-card').click();await page.locator('#map button.maplibregl-ctrl-zoom-in').click();
 await page.clock.runFor(500);const before=await page.locator('#map').getAttribute('data-camera');
 const revised=normalize(raw.replace('15:41:20Z','15:51:20Z').replace('+15.4+157.0/','+15.5+157.0/'),url,new Date(now+60_000).toISOString());payload=materialize([a,revised],good,now+60_000);
 await page.clock.runFor(31_000);await page.waitForFunction(()=>document.querySelector('#detail')?.textContent?.includes('15.5°'));assert.equal(await page.locator('.storm-card').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('#map').getAttribute('data-camera'),before,'data refresh recentered the map');
 await page.locator('.forecast-dot').last().focus();await page.keyboard.press('Enter');assert.match(await page.locator('.point-detail').innerText(),/UTC\+08:00/);
 await page.locator('#language').click();assert.equal(await page.locator('html').getAttribute('lang'),'zh-TW');assert.equal(await page.locator('.storm-card').getAttribute('aria-pressed'),'true');await shot('official-specimen-zh');await audit('official-specimen-zh');
 payload=materialize([revised],{...good,state:'stale',error:'collection-failed'},now+60_000);await page.clock.runFor(31_000);await page.locator('.outage-banner').waitFor();assert.equal(await page.locator('.storm-card').count(),1);await shot('stale-official-specimen-zh');await audit('stale-official-specimen-zh');
 payload=materialize([],{state:'unavailable'},now);await page.clock.runFor(31_000);await page.waitForFunction(()=>document.querySelectorAll('.storm-card').length===0);assert.equal(await page.locator('.forecast-dot').count(),0);assert.equal(await page.locator('[data-storm^="demo-"]').count(),0);await shot('unavailable-zh');await audit('unavailable-zh');
 payload=materialize([] ,good,now);await page.clock.runFor(31_000);await shot('no-current-bulletins-zh');
 await page.locator('#data-mode').selectOption('demo');assert.equal(await page.locator('.storm-card').count(),2);await page.locator('#data-mode').selectOption('live');assert.equal(await page.locator('.storm-card').count(),0);
 // New mobile navigation initializes the disclosure collapsed, with the map
 // ahead of storm rail and source stations in the rendered layout.
 payload=materialize([a],good,now);await page.setViewportSize({width:390,height:844});await page.goto(base);await ready();assert.equal(await page.locator('.detail-disclosure').getAttribute('open'),null);
 const mapY=await page.locator('.map-frame').boundingBox(),railY=await page.locator('#storm-rail').boundingBox();assert(mapY.y<railY.y);await shot('mobile-official-specimen-zh');await audit('mobile-official-specimen-zh');
 for(const width of [320,390,768,1024]){await page.setViewportSize({width,height:900});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'horizontal overflow');}
 assert.deepEqual(errors,[]);assert.equal(results.flatMap(r=>r.violations).length,0,JSON.stringify(results));
 console.log('PASS: official-specimen replay, data refresh, manual selection, locale, stale/unavailable/empty, no demo substitution, mobile map-first, responsive layout and 5 axe scans.');
}finally{await writeFile(`docs/${stage}-browser-results.json`,JSON.stringify({type:'controlled-official-specimen-replay',checkedAt:new Date().toISOString(),errors,results},null,2)+'\n');await browser.close();}
