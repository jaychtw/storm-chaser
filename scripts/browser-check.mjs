import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {mkdir,writeFile} from 'node:fs/promises';
const stage=process.env.REVIEW_STAGE??'m3e-demo';
const base=process.env.PREVIEW_URL || 'http://127.0.0.1:5173';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || (existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const errors=[]; const checks=[];
await mkdir(`docs/screenshots/${stage}`,{recursive:true});
const context=await browser.newContext({viewport:{width:1440,height:1120},deviceScaleFactor:1,reducedMotion:'reduce'});
await context.route('**/api/live',route=>route.abort());
const page=await context.newPage();
page.on('pageerror',e=>errors.push(e.message));
async function screenshot(name){await page.locator('#map[data-ready="true"]').waitFor();await page.screenshot({path:`docs/screenshots/${stage}/${name}.png`,fullPage:true});}
async function noOverflow(){assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),'horizontal overflow');}
async function audit(name){const r=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();checks.push({name,violations:r.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>n.target)}))});}
try {
 await page.goto(base+'?mode=demo');await page.locator('.forecast-dot').first().waitFor();
 assert.equal(await page.locator('.storm-card').count(),2);assert.equal(await page.locator('.source-state', {hasText:'NOT INTEGRATED'}).count(),3);
 assert.equal(await page.locator('.map-error').count(),0);assert.equal(await page.locator('.forecast-dot').first().evaluate(el=>getComputedStyle(el).position),'absolute');await noOverflow();
 await screenshot('desktop-en-multi');await audit('desktop-en-multi');
 const before=await page.locator('.forecast-dot').count();await page.locator('[data-track="B"]').uncheck();assert(await page.locator('.forecast-dot').count()<before);
 await page.locator('.forecast-dot.track-A').last().click();await page.locator('.point-detail').waitFor();assert.match(await page.locator('.point-detail').innerText(),/UTC\+08:00/);await page.locator('[data-track="B"]').check();
 await page.locator('[data-storm="demo-bravo"]').click();assert.equal(await page.locator('[data-storm="demo-bravo"]').getAttribute('aria-pressed'),'true');
 await page.locator('#language').click();assert.equal(await page.locator('html').getAttribute('lang'),'zh-TW');assert.equal(await page.locator('[data-storm="demo-bravo"]').getAttribute('aria-pressed'),'true');
 await screenshot('desktop-zh-manual');await audit('desktop-zh-manual');
 await page.reload();assert.equal(await page.locator('html').getAttribute('lang'),'zh-TW');
 await page.locator('#auto').click();assert.equal(await page.locator('[data-storm="demo-alpha"]').getAttribute('aria-pressed'),'true');
 await page.locator('#scenario').selectOption('empty');assert.equal(await page.locator('.storm-card').count(),0);assert.equal(await page.locator('.forecast-dot').count(),0);await screenshot('desktop-zh-empty');await audit('desktop-zh-empty');
 await page.locator('#language').click();await page.locator('#scenario').selectOption('outage');await page.locator('.outage-banner').waitFor();assert.equal(await page.locator('.storm-card').count(),2);await screenshot('desktop-en-outage');await audit('desktop-en-outage');
 await page.setViewportSize({width:390,height:844});await page.locator('#scenario').selectOption('multi');await noOverflow();await screenshot('mobile-en-multi');await audit('mobile-en-multi');
 await page.locator('#language').click();await noOverflow();await screenshot('mobile-zh-multi');await audit('mobile-zh-multi');
 await page.locator('#scenario').selectOption('empty');await noOverflow();await screenshot('mobile-zh-empty');
 await page.locator('#scenario').selectOption('outage');await noOverflow();await screenshot('mobile-zh-outage');await audit('mobile-zh-outage');
 for(const width of [320,768,1024]){await page.setViewportSize({width,height:900});await noOverflow();}
 await page.setViewportSize({width:1440,height:1120});await page.locator('#scenario').selectOption('multi');
 await page.locator('#auto').focus();await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement?.getAttribute('data-storm')),'demo-alpha');
 await page.keyboard.press('Tab');await page.keyboard.press('Enter');assert.equal(await page.locator('[data-storm="demo-bravo"]').getAttribute('aria-pressed'),'true');
 // WebGL failure must leave a useful, localized fallback rather than a blank shell.
 const fallback=await browser.newPage();await fallback.route('**/api/live',route=>route.abort());await fallback.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return String(type).includes('webgl')?null:get.call(this,type,...args);};});
 await fallback.goto(base+'?mode=demo');await fallback.locator('.map-error').waitFor();assert.equal(await fallback.locator('.source-link').count(),3);await fallback.close();
 assert.deepEqual(errors,[]);assert.equal(checks.flatMap(c=>c.violations).length,0,JSON.stringify(checks,null,2));
 console.log('PASS: map rendered; selection, Auto, tracks, forecast time, locale persistence, empty/outage, keyboard, WebGL fallback, 320–1440px overflow, and 7 axe scans.');
} finally {await writeFile(`docs/${stage}-browser-results.json`,JSON.stringify({checkedAt:new Date().toISOString(),errors,checks},null,2)+'\n');await browser.close();}
