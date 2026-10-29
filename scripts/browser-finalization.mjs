import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {existsSync,readFileSync} from 'node:fs';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {normalize} from '../server/jma.ts';
import {materialize} from '../server/store.ts';
const base=process.env.PREVIEW_URL??'http://127.0.0.1:5173',now=Date.parse('2026-10-28T16:00:00Z');
const sourceUrl='https://www.data.jma.go.jp/developer/xml/data/20261028154121_0_VPTW61_010000.xml';
const a=normalize(readFileSync('docs/sources/evidence/2026-10-29/jma-vptw61.xml','utf8'),sourceUrl,new Date(now).toISOString());
const good=()=>materialize([a],{state:'fresh',lastSuccessAt:new Date(now).toISOString()},now);
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--disable-dev-shm-usage','--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const checks=[],audits=[],screenshots=[],errors=[],unexpectedOrigins=[];await mkdir('docs/screenshots/v1f',{recursive:true});
async function shot(page,name){await page.locator('.map-frame').scrollIntoViewIfNeeded();await page.evaluate(()=>window.dispatchEvent(new Event('resize')));await page.clock.runFor(500);await page.locator('#map[data-ready="true"]').waitFor();await page.locator('.map-frame').screenshot({animations:'disabled'});await page.screenshot({path:`docs/screenshots/v1f/${name}.png`,fullPage:true});screenshots.push(name);}
async function audit(page,name){const r=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();audits.push({name,violations:r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))});}
try{
 for(const locale of ['en','zh-TW'])for(const width of [1440,390]){
  const label=`${width<640?'mobile':'desktop'}-${locale}`,context=await browser.newContext({viewport:{width,height:width<640?844:1080},hasTouch:width<640,isMobile:width<640,reducedMotion:'reduce'});
  await context.addInitScript(locale=>localStorage.setItem('storm-chaser-locale',locale),locale);
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.clock.install({time:now});let response=good(),badJSON=false;
  await page.route('**/*',async route=>{const u=new URL(route.request().url());if(u.origin!==new URL(base).origin){unexpectedOrigins.push(u.origin);await route.abort();return;}if(u.pathname==='/api/live'){await route.fulfill(badJSON?{contentType:'application/json',body:'{broken'}:{json:response});return;}await route.continue();});
  await page.goto(base);await page.locator('.storm-card').waitFor();await page.locator('#map[data-ready="true"]').waitFor();
  await page.evaluate(()=>{const b=document.createElement('aside');b.textContent='V1-F CONTROLLED REPLAY / 受控重播 · saved JMA specimen · NOT CURRENT WEATHER / 非目前天氣';b.style.cssText='padding:10px 18px;background:#302618;color:#f0d19b;font:12px sans-serif;line-height:1.7';document.body.prepend(b);});
  assert.equal(await page.locator('.storm-card[aria-pressed="true"]').count(),0);
  if(width<640)await page.locator('.storm-card').tap();else await page.locator('.storm-card').click();
  const point=a.points[3];
  for(const route of ['marker','list','timeline']){
   if(route==='marker'){await page.locator('.forecast-dot').nth(2).focus();await page.keyboard.press('Enter');}
   if(route==='list'){if(await page.locator('.detail-disclosure').getAttribute('open')===null)await page.locator('#detail-summary').click();await page.locator('[data-forecast-time]').nth(2).click();}
   if(route==='timeline'){await page.locator('#explorer-range').focus();await page.keyboard.press('Home');for(let i=0;i<3;i++)await page.keyboard.press('ArrowRight');}
   assert.equal(await page.locator('#explorer').getAttribute('data-selected-time'),point.validAt);assert.equal(await page.locator('#explorer').getAttribute('data-advisory'),a.id);
   assert.deepEqual(JSON.parse(await page.locator('.is-explored').getAttribute('data-position')),[point.longitude,point.latitude]);assert.match(await page.locator('.point-detail').innerText(),/45/);
  }
  if(await page.locator('#explorer-evidence').getAttribute('open')===null)await page.locator('#explorer-evidence-summary').click();
  const evidence=await page.locator('#explorer-evidence').innerText();
  for(const v of [...point.winds,...point.pressure])if(v.value!==null)assert(evidence.includes(`${v.value} ${v.unit==='ノット'?(locale==='en'?'knots':'節'):v.unit}`));
  await shot(page,`${label}-current`);await audit(page,`${label}-current`);checks.push({name:`${label}: marker/list/explorer point identity, time, coordinates and native values agree`,status:'passed'});
  response={...good(),advisories:[{}]};await page.clock.runFor(31_000);
  const invalidText=locale==='en'?'returned invalid information':'未通過檢查';await page.waitForFunction(text=>document.querySelector('[data-source="JMA"]')?.textContent?.includes(text),invalidText);
  assert.equal(await page.locator('.storm-card').count(),1);assert.equal(await page.locator('#explorer').getAttribute('data-selected-time'),point.validAt);
  badJSON=true;await page.clock.runFor(31_000);assert((await page.locator('[data-source="JMA"]').innerText()).includes(invalidText));
  await shot(page,`${label}-invalid-api-stale`);await audit(page,`${label}-invalid-api`);checks.push({name:`${label}: malformed shape/JSON retain last-known eligible source without renewal or crash`,status:'passed'});
  await page.clock.setSystemTime(now+25*3600_000);await page.evaluate(()=>window.dispatchEvent(new Event('pageshow')));
  assert.equal(await page.locator('.storm-card').count(),0);assert.equal(await page.locator('#explorer-range').count(),0);assert.equal(await page.locator('.is-explored').count(),0);assert.equal(await page.locator('.expiry-notice').count(),1);
  await shot(page,`${label}-expired`);await audit(page,`${label}-expired`);checks.push({name:`${label}: expiry excludes data despite malformed API responses`,status:'passed'});
  for(const w of [320,390,768,1440]){await page.setViewportSize({width:w,height:900});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
  await context.close();
 }
 assert.deepEqual(errors,[]);assert.deepEqual(unexpectedOrigins,[]);assert.equal(audits.flatMap(a=>a.violations).length,0,JSON.stringify(audits));console.log(`PASS: ${checks.length} finalization checks, ${audits.length} axe scans, ${screenshots.length} final screenshots.`);
}finally{await writeFile('docs/v1/browser-finalization.json',JSON.stringify({type:'final-local-software-controlled-replay',checkedAt:new Date().toISOString(),sourceUrl,sourceHash:a.contentHash,checks,audits,screenshots,errors,unexpectedOrigins,liveSourceRequests:0,limits:'Emulated browsers and saved source, not current weather, physical devices, human acceptance or public hosting.'},null,2)+'\n');await browser.close();}
