// Isolated local runtime/backup/restore smoke. Never touches .local/live or JMA.
import {mkdtemp,mkdir,writeFile,readFile,copyFile,rm,access} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {createServer} from 'node:net';
import {spawn,execFile} from 'node:child_process';
import {promisify} from 'node:util';
import assert from 'node:assert/strict';
import {Archive} from '../server/store.ts';
import {normalize,hash} from '../server/jma.ts';
const exec=promisify(execFile),root=await mkdtemp(join(tmpdir(),'storm-v1-package-'));
const dir=join(root,'source'),restored=join(root,'restored'),bin=join(root,'bin');
let child;const checks=[];
async function check(name,fn){await fn();checks.push({name,status:'passed'});}
async function command(file,dataDir,ok=true){try{const r=await exec(process.execPath,['--import','tsx',file],{env:{...process.env,STORM_DATA_DIR:dataDir},timeout:20_000});if(!ok)throw new Error('unexpected command success');return r.stdout;}catch(e){if(ok||e.message==='unexpected command success')throw e;assert(e.code!==0);return '';}}
try{
 await mkdir(dir);await mkdir(bin);await writeFile(join(bin,'curl'),`#!/bin/sh\necho blocked > '${join(root,'unexpected-source-call')}'\nexit 1\n`,{mode:0o700});
 const raw=await readFile('docs/sources/evidence/2026-10-29/jma-vptw61.xml','utf8');
 const a=normalize(raw,'https://www.data.jma.go.jp/developer/xml/data/20261028154121_0_VPTW61_010000.xml','2026-10-28T16:00:00Z');
 const archive=new Archive(dir);await archive.init();await archive.raw(raw,hash(raw));await archive.accept(a);archive.health={state:'stale',lastSuccessAt:'2026-10-28T16:00:00Z'};archive.close();
 const reservation=createServer();await new Promise(r=>reservation.listen(0,'127.0.0.1',r));const port=reservation.address().port;await new Promise(r=>reservation.close(r));
 let stdout='';child=spawn(process.execPath,['--import','tsx','server/index.ts'],{env:{...process.env,PATH:bin+':'+process.env.PATH,STORM_DATA_DIR:dir,STORM_API_PORT:String(port)},stdio:['ignore','pipe','pipe']});
 await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(new Error('local API startup timeout')),10_000);child.stdout.on('data',b=>{stdout+=b;if(stdout.includes('listening')){clearTimeout(timeout);resolve();}});child.once('exit',code=>{clearTimeout(timeout);reject(new Error('local API exited '+code));});});
 const base=`http://127.0.0.1:${port}`;
 await check('default API is a loopback read-only reader with no implicit collection',async()=>{
  const r=await fetch(base+'/api/live');assert.equal(r.status,200);assert.equal(r.headers.get('cache-control'),'no-store');assert.equal(r.headers.get('x-content-type-options'),'nosniff');
  const s=await r.json();assert.equal(s.mode,'live');assert.notEqual(s.health.state,'fresh');assert(s.advisories.every(a=>a.source==='JMA'&&!a.stormId.startsWith('demo-')));
  assert.equal((await fetch(base+'/api/live',{method:'POST'})).status,405);assert.equal((await fetch(base+'/unexpected')).status,404);
  const db=new Archive(dir);await db.init();assert.equal(db.events('fetches').length,0);assert.equal(db.cursor().nextAttempt,0);db.close();
  await assert.rejects(access(join(root,'unexpected-source-call')));
 });
 await check('corrupt materialized record returns 503 without killing the reader and recovers after repair',async()=>{
  const db=new Archive(dir);await db.init();db.db.prepare('UPDATE heads SET json=?').run('{broken');assert.equal((await fetch(base+'/api/live')).status,503);
  db.db.prepare('UPDATE heads SET json=?').run(JSON.stringify(a));db.close();assert.equal((await fetch(base+'/api/live')).status,200);
 });
 const exited=new Promise(r=>child.once('exit',r));child.kill('SIGTERM');await exited;child=null;
 await check('backup CLI and restored-directory verification preserve source bytes and snapshots',async()=>{
  const report=JSON.parse(await command('server/backup.ts',dir));await mkdir(restored);await copyFile(report.backup,join(restored,'storm.sqlite'));
  const verification=JSON.parse(await command('server/verify.ts',restored));assert.equal(verification.integrity.integrity_check,'ok');assert.equal(verification.provenance.checked,1);assert.deepEqual(verification.provenance.failed,[]);
  const db=new Archive(restored);await db.init();assert.equal(db.rawBody(a.contentHash),raw);assert.equal(db.records.length,1);db.close();
 });
 await check('damaged raw provenance fails verification and blocks backup',async()=>{
  const db=new Archive(restored);await db.init();db.db.prepare('UPDATE raw SET body=?').run('damaged');db.close();
  await command('server/verify.ts',restored,false);await command('server/backup.ts',restored,false);
 });
 await check('verify refuses an absent archive rather than creating a misleading empty one',async()=>{
  const absent=join(root,'absent');await command('server/verify.ts',absent,false);await assert.rejects(access(join(absent,'storm.sqlite')));
 });
 const result={type:'isolated-software-package-runtime-check',checkedAt:new Date().toISOString(),version:JSON.parse(await readFile('package.json','utf8')).version,node:process.version,checks,sourceHash:hash(raw),liveSourceRequests:0,liveArchiveWrites:0,hostServicesActivated:0,limits:'Local temporary directory and loopback process only; not a real host reboot, off-host restore or unattended service test.'};
 await writeFile(resolve(process.env.PACKAGE_REPORT??'docs/v1/package-verification.json'),JSON.stringify(result,null,2)+'\n');console.log(`PASS: ${checks.length} isolated API/backup/restore checks; no weather requests or live archive writes.`);
}finally{if(child){child.kill('SIGTERM');await new Promise(r=>child.once('exit',r));}await rm(root,{recursive:true,force:true});}
