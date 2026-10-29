// Owner-invoked local browser review. Never serves or seeds weather data.
import {chromium} from '@playwright/test';
import {existsSync,readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {normalize} from '../server/jma.ts';
import {materialize} from '../server/store.ts';
const base=process.env.PREVIEW_URL??'http://127.0.0.1:5173';
const target=new URL(base);
if(!['localhost','127.0.0.1','[::1]'].includes(target.hostname)||target.protocol!=='http:')throw new Error('Local replay requires an HTTP loopback frontend; no public preview is supported.');
const smoke=process.argv.includes('--smoke');
const raw=readFileSync('docs/sources/evidence/2026-10-29/jma-vptw61.xml','utf8');
const sourceUrl='https://www.data.jma.go.jp/developer/xml/data/20261028154121_0_VPTW61_010000.xml';
const now=Date.parse('2026-10-28T16:00:00Z');
const a=normalize(raw,sourceUrl,new Date(now).toISOString());
const payload=materialize([a],{state:'fresh',lastSuccessAt:new Date(now).toISOString(),lastCheckedAt:new Date(now).toISOString()},now);
const browser=await chromium.launch({headless:smoke,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try {
 const width=Number(process.env.REVIEW_WIDTH??1440),context=await browser.newContext({viewport:{width,height:width<640?844:1080},hasTouch:width<640,isMobile:width<640,reducedMotion:'reduce'});
 await context.route('**/*',async route=>{
  const url=new URL(route.request().url());
  if(url.origin!==target.origin){await route.abort();return;}
  if(url.pathname==='/api/live'){await route.fulfill({json:payload});return;}
  await route.continue();
 });
 await context.addInitScript(()=>document.addEventListener('DOMContentLoaded',()=>{
  const banner=document.createElement('aside');banner.textContent='LOCAL CONTROLLED REPLAY / 本機受控重播 · saved official JMA specimen · frozen 2026-10-28 16:00 UTC · NOT CURRENT WEATHER / 非目前天氣';banner.style.cssText='padding:12px 18px;background:#302618;color:#f0d19b;font:13px sans-serif;line-height:1.7';document.body.prepend(banner);
 }));
 const page=await context.newPage();await page.clock.setFixedTime(now);await page.goto(base);await page.locator('.storm-card').waitFor();
 if(smoke){
  assert.equal(await page.locator('#explorer-range').count(),0);await page.locator('.storm-card').click();await page.locator('#explorer-next').click();
  assert.equal(await page.locator('#explorer').getAttribute('data-selected-time'),a.points[1].validAt);
  assert.match(await page.locator('body>aside').innerText(),/NOT CURRENT WEATHER/);
  console.log('PASS: local review harness, frozen source clock, neutral Auto, published step and persistent replay banner. No live source/API/collector.');
 }else{
  console.log('Local controlled replay opened. Select IN-FA, then use the timeline or previous/next. Change language or resize the browser. Close the browser or press Ctrl+C to finish. No live source requests or archive writes.');
  const stop=()=>{void browser.close();};process.once('SIGINT',stop);process.once('SIGTERM',stop);
  await new Promise(resolve=>browser.once('disconnected',resolve));
 }
}finally{if(browser.isConnected())await browser.close();}
