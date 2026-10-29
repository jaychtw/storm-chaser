// Local-only characterization, not a performance SLA or a physical-phone test.
import {chromium} from '@playwright/test';
import {existsSync,readFileSync,readdirSync} from 'node:fs';
import {writeFile} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
import {normalize} from '../server/jma.ts';
import {materialize} from '../server/store.ts';
const base=process.env.PREVIEW_URL??'http://127.0.0.1:5173';
const now=Date.parse('2026-10-28T16:00:00Z');
const a=normalize(readFileSync('docs/sources/evidence/2026-10-29/jma-vptw61.xml','utf8'),'https://www.data.jma.go.jp/developer/xml/data/20261028154121_0_VPTW61_010000.xml',new Date(now).toISOString());
const payload=materialize([a],{state:'fresh',lastSuccessAt:new Date(now).toISOString()},now);
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const runs=[];let unexpected=0;
try{
 for(const profile of ['local-desktop','constrained-simulation'])for(let run=1;run<=2;run++){
  const constrained=profile!=='local-desktop';const context=await browser.newContext({viewport:{width:constrained?390:1440,height:900},reducedMotion:'reduce'}),page=await context.newPage();
  await page.clock.setFixedTime(now);
  await page.route('**/*',async route=>{const url=new URL(route.request().url());if(url.origin!==new URL(base).origin){unexpected++;await route.abort();return;}if(url.pathname==='/api/live'){await route.fulfill({json:payload});return;}await route.continue();});
  const cdp=await context.newCDPSession(page);await cdp.send('Performance.enable');
  if(constrained){await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});await cdp.send('Network.enable');await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:100,downloadThroughput:200_000,uploadThroughput:93_750});}
  const start=performance.now();await page.goto(base);await page.locator('.storm-card').waitFor();await page.locator('#map[data-ready="true"]').waitFor();const mapReadyMs=performance.now()-start;
  await page.locator('.storm-card').click();await page.locator('#explorer-range').waitFor();const interaction=performance.now();await page.locator('#explorer-next').click();await page.waitForFunction(()=>document.querySelector('#explorer')?.dataset.kind==='forecast');const nextStepMs=performance.now()-interaction;
  const timings=await page.evaluate(()=>({navigation:performance.getEntriesByType('navigation').map(n=>({domContentLoadedMs:n.domContentLoadedEventEnd,loadMs:n.loadEventEnd})),resources:performance.getEntriesByType('resource').filter(r=>!r.name.includes('/api/')).map(r=>({path:new URL(r.name).pathname,encodedBodySize:r.encodedBodySize,decodedBodySize:r.decodedBodySize,durationMs:r.duration}))}));
  const metrics=Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.filter(m=>['ScriptDuration','TaskDuration','JSHeapUsedSize','LayoutDuration'].includes(m.name)).map(m=>[m.name,m.value]));
  runs.push({profile,run,mapReadyMs,nextStepMs,timings,metrics});await context.close();
 }
 const assets=readdirSync('dist/assets').filter(p=>/\.(js|css)$/.test(p)).map(name=>{const b=readFileSync('dist/assets/'+name);return {name,bytes:b.length,gzipBytes:gzipSync(b).length};});
 const report={type:'local-bundle-characterization',checkedAt:new Date().toISOString(),runs,assets,geographyBytes:readFileSync('public/geography/countries.geojson').length,unexpectedOrigins:unexpected,liveSourceRequests:0,limits:'Two cold contexts/profile, loopback preview, software WebGL. Constrained profile is 4x CPU, 100ms latency, 1.6Mbit/s simulated throughput, not a real device, public host or SLA. No HTTP compression is added by this measurement.'};
 await writeFile('docs/v1/performance.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(runs.map(r=>({profile:r.profile,run:r.run,mapReadyMs:Math.round(r.mapReadyMs),nextStepMs:Math.round(r.nextStepMs)}))));
}finally{await browser.close();}
