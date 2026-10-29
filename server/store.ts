import {mkdir,readFile,readdir} from 'node:fs/promises';
import {join} from 'node:path';
import {DatabaseSync,backup} from 'node:sqlite';
import {randomUUID,createHash} from 'node:crypto';
import type {Advisory,Health,LiveSnapshot} from '../shared/model';
import {normalize} from './jma';
import {eligibility,POLL_MS,STALE_MS,COLLECTION_STALE_MS} from '../shared/eligibility';
export {POLL_MS,STALE_MS,EXPIRE_MS} from '../shared/eligibility';
export function latest(records:Advisory[]){
 const units=new Map<string,Advisory>();
 for(const a of records){const old=units.get(a.unitKey);if(!old||a.controlAt>old.controlAt||(a.controlAt===old.controlAt&&a.retrievedAt>old.retrievedAt))units.set(a.unitKey,a);}
 return [...units.values()];
}
export function materialize(records:Advisory[],health:Health,now=Date.now()):LiveSnapshot{
 const current=latest(records);let expiredCount=0,inactiveCount=0;
 const advisories=current.filter(a=>{
  const status=eligibility(a,now);
  if(status==='inactive'){inactiveCount++;return false;}
  if(status!=='eligible'){expiredCount++;return false;}
  return true;
 }).sort((a,b)=>b.controlAt.localeCompare(a.controlAt));
 let state=health.state;
 if(health.lastSuccessAt&&now-Date.parse(health.lastSuccessAt)>COLLECTION_STALE_MS)state=records.length?'stale':'unavailable';
 if(state==='fresh'&&advisories.some(a=>now-Date.parse(a.issuedAt)>STALE_MS))state='stale';
 return {mode:'live',asOf:new Date(now).toISOString(),health:{...health,state},advisories,expiredCount,inactiveCount,coverage:'recent-jma-bulletins',pollSeconds:POLL_MS/1000};
}
export type Cursor={lastLong:number;failures:number;nextAttempt:number};
export class Archive{
 db!:DatabaseSync;seen=new Set<string>();issues:Record<string,string>={};cache:Record<string,{etag?:string;modified?:string}>={};leaseToken:string|null=null;
 constructor(public dir:string){}
 async init(){await mkdir(this.dir,{recursive:true});this.db=new DatabaseSync(join(this.dir,'storm.sqlite'));this.db.exec(`
 PRAGMA busy_timeout=5000; PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA foreign_keys=ON;
 PRAGMA max_page_count=65536; PRAGMA journal_size_limit=16777216;
 CREATE TABLE IF NOT EXISTS meta(key TEXT PRIMARY KEY,value TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS raw(hash TEXT PRIMARY KEY,body TEXT NOT NULL,created INTEGER NOT NULL,kind TEXT NOT NULL DEFAULT 'bulletin');
 CREATE TABLE IF NOT EXISTS snapshots(hash TEXT PRIMARY KEY,unit TEXT NOT NULL,control TEXT NOT NULL,retrieved TEXT NOT NULL,json TEXT NOT NULL,created INTEGER NOT NULL,FOREIGN KEY(hash) REFERENCES raw(hash));
 CREATE TABLE IF NOT EXISTS heads(unit TEXT PRIMARY KEY,json TEXT NOT NULL,updated INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS events(id TEXT PRIMARY KEY,kind TEXT NOT NULL,json TEXT NOT NULL,created INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS urls(url TEXT PRIMARY KEY,hash TEXT NOT NULL,checked INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS lease(id INTEGER PRIMARY KEY CHECK(id=1),token TEXT NOT NULL,expires INTEGER NOT NULL);
 `);
 const columns=this.db.prepare('PRAGMA table_info(raw)').all() as {name:string}[];if(!columns.some(c=>c.name==='kind'))this.transaction(()=>{const current=this.db.prepare('PRAGMA table_info(raw)').all() as {name:string}[];if(!current.some(c=>c.name==='kind'))this.db.exec("ALTER TABLE raw ADD COLUMN kind TEXT NOT NULL DEFAULT 'bulletin'; UPDATE raw SET kind='feed' WHERE hash IN (SELECT json_extract(json,'$.contentHash') FROM events WHERE kind='fetches' AND json_extract(json,'$.url') LIKE '%/feed/%')");});
 if(!this.meta('migration'))await this.migrate();this.reload();}
 meta(key:string){const r=this.db.prepare('SELECT value FROM meta WHERE key=?').get(key) as {value:string}|undefined;return r?JSON.parse(r.value):undefined;}
 setMeta(key:string,value:unknown){this.db.prepare('INSERT INTO meta VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run(key,JSON.stringify(value));}
 get health():Health{const h=this.meta('health')??{state:'unknown'};return this.meta('migration')?.failed?{...h,state:'stale',error:'legacy-migration-partial',partial:true}:h;}set health(h:Health){this.setMeta('health',h);}
 get records():Advisory[]{return this.db.prepare('SELECT json FROM snapshots ORDER BY created,hash').all().map((r:any)=>JSON.parse(r.json));}
 currentRecords():Advisory[]{return this.db.prepare('SELECT json FROM heads').all().map((r:any)=>JSON.parse(r.json));}
 reload(){this.seen=new Set((this.db.prepare('SELECT url FROM urls').all() as {url:string}[]).map(x=>x.url));this.issues=this.meta('issues')??{};this.cache=this.meta('cache')??{};}
 transaction<T>(fn:()=>T):T{this.db.exec('BEGIN IMMEDIATE');try{const r=fn();this.db.exec('COMMIT');return r;}catch(e){this.db.exec('ROLLBACK');throw e;}}
 async raw(body:string|Uint8Array,digest:string,kind:'feed'|'bulletin'='bulletin'){if(createHash('sha256').update(body).digest('hex')!==digest)throw new Error('raw checksum mismatch');this.db.prepare('INSERT OR IGNORE INTO raw(hash,body,created,kind) VALUES(?,?,?,?)').run(digest,body,Date.now(),kind);}
 rawBytes(hash:string):string|Uint8Array|undefined{return (this.db.prepare('SELECT body FROM raw WHERE hash=?').get(hash) as {body:string|Uint8Array}|undefined)?.body;}
 rawBody(hash:string):string|undefined{const b=this.rawBytes(hash);return b===undefined?undefined:typeof b==='string'?b:new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(b);}
 dailyBytes(now=Date.now()){return Number((this.db.prepare("SELECT COALESCE(SUM(json_extract(json,'$.bytes')),0) n FROM events WHERE kind='fetches' AND created>=?").get(now-86400_000) as {n:number}).n);}
 async accept(a:Advisory){if(this.leaseToken)this.heartbeat();
 if(a.inputKind!=='live')throw new Error('official examples cannot enter the live archive');
 if(!this.rawBody(a.contentHash))throw new Error('raw record required before normalization');
 this.transaction(()=>{
  this.db.prepare('INSERT OR IGNORE INTO snapshots VALUES(?,?,?,?,?,?)').run(a.contentHash,a.unitKey,a.controlAt,a.retrievedAt,JSON.stringify(a),Date.now());
  const r=this.db.prepare('SELECT json FROM heads WHERE unit=?').get(a.unitKey) as {json:string}|undefined;const old=r?JSON.parse(r.json) as Advisory:undefined;
  if(!old||a.controlAt>old.controlAt||(a.controlAt===old.controlAt&&a.retrievedAt>old.retrievedAt))this.db.prepare('INSERT INTO heads VALUES(?,?,?) ON CONFLICT(unit) DO UPDATE SET json=excluded.json,updated=excluded.updated').run(a.unitKey,JSON.stringify(a),Date.now());
  this.db.prepare('INSERT INTO urls VALUES(?,?,?) ON CONFLICT(url) DO UPDATE SET hash=excluded.hash,checked=excluded.checked').run(a.sourceUrl,a.contentHash,Date.now());
  delete this.issues[a.sourceUrl];this.setMeta('issues',this.issues);
 });this.seen.add(a.sourceUrl);
 }
 async immutable(path:string,value:string){const [kind,id]=path.split('/');if(!['fetches','quarantine'].includes(kind)||!id)throw new Error('unsupported archive event');this.db.prepare('INSERT OR IGNORE INTO events VALUES(?,?,?,?)').run(id,kind,value,Date.now());}
 events(kind:string){return this.db.prepare('SELECT json FROM events WHERE kind=? ORDER BY created').all(kind).map((r:any)=>JSON.parse(r.json));}
 async persist(){this.transaction(()=>{this.setMeta('cache',this.cache);this.setMeta('issues',this.issues);});}
 cursor():Cursor{return this.meta('cursor')??{lastLong:0,failures:0,nextAttempt:0};}
 saveCursor(c:Cursor){this.setMeta('cursor',c);}
 acquire(now=Date.now()){const token=randomUUID();const ok=this.transaction(()=>{const row=this.db.prepare('SELECT expires FROM lease WHERE id=1').get() as {expires:number}|undefined;if(row&&row.expires>now)return false;this.db.prepare('INSERT INTO lease VALUES(1,?,?) ON CONFLICT(id) DO UPDATE SET token=excluded.token,expires=excluded.expires').run(token,now+90_000);return true;});if(ok){this.leaseToken=token;this.reload();}return ok;}
 ownsLease(now=Date.now()){if(!this.leaseToken)return false;const r=this.db.prepare('SELECT 1 FROM lease WHERE id=1 AND token=? AND expires>?').get(this.leaseToken,now);return !!r;}
 heartbeat(now=Date.now()){if(!this.leaseToken)throw new Error('missing lease');const r=this.db.prepare('UPDATE lease SET expires=? WHERE id=1 AND token=? AND expires>?').run(now+90_000,this.leaseToken,now);if(r.changes!==1)throw new Error('lost collector lease');}
 release(){if(this.leaseToken)this.db.prepare('DELETE FROM lease WHERE id=1 AND token=?').run(this.leaseToken);this.leaseToken=null;}
 snapshot(now=Date.now()){return materialize(this.currentRecords(),this.health,now);}
 prune(now=Date.now()){
 const day=86400_000;
 this.transaction(()=>{
  this.db.prepare("DELETE FROM events WHERE kind='fetches' AND created<?").run(now-14*day);
  this.db.prepare("DELETE FROM events WHERE kind='quarantine' AND created<?").run(now-90*day);
  this.db.prepare("DELETE FROM raw WHERE kind='feed' AND created<?").run(now-day);
  this.db.prepare('DELETE FROM snapshots WHERE created<?').run(now-90*day);
  this.db.prepare('DELETE FROM heads WHERE updated<?').run(now-400*day);
  this.db.prepare('DELETE FROM urls WHERE checked<?').run(now-90*day);
  this.db.prepare('DELETE FROM raw WHERE created<? AND hash NOT IN (SELECT hash FROM snapshots)').run(now-90*day);
  const kept:Record<string,string>={};for(const [url,digest] of Object.entries(this.issues))if(this.rawBytes(digest)!==undefined)kept[url]=digest;this.issues=kept;this.setMeta('issues',kept);
 });
 let pressure=false;while(this.usedBytes()>192*1024*1024){const n=this.db.prepare('DELETE FROM snapshots WHERE hash IN (SELECT hash FROM snapshots WHERE created<? ORDER BY created LIMIT 100)').run(now-day).changes;this.db.prepare('DELETE FROM raw WHERE hash NOT IN (SELECT hash FROM snapshots) AND created<?').run(now-day);pressure=true;if(!n)break;}if(pressure)this.setMeta('retention-pressure',{at:new Date(now).toISOString(),reason:'size-budget-history-trimmed'});
 for(const row of this.db.prepare('SELECT unit,json FROM heads').all() as {unit:string;json:string}[]){const a=JSON.parse(row.json) as Advisory;if(!this.db.prepare('SELECT 1 FROM snapshots WHERE hash=?').get(a.contentHash))this.db.prepare('UPDATE heads SET json=? WHERE unit=?').run(JSON.stringify({...a,points:[],rawPayloadRef:`retention-expired:${a.contentHash}`}),row.unit);}
 this.db.exec('PRAGMA wal_checkpoint(TRUNCATE)');this.reload();
 }
 usedBytes(){const page=this.db.prepare('PRAGMA page_count').get() as {page_count:number},free=this.db.prepare('PRAGMA freelist_count').get() as {freelist_count:number},size=this.db.prepare('PRAGMA page_size').get() as {page_size:number};return (page.page_count-free.freelist_count)*size.page_size;}
 storage(){return {usedBytes:this.usedBytes(),hardCapBytes:256*1024*1024,retentionPressure:this.meta('retention-pressure')??null};}
 integrity(){return this.db.prepare('PRAGMA integrity_check').get();}
 verifyProvenance(){const rows=this.db.prepare('SELECT s.hash,r.body FROM snapshots s LEFT JOIN raw r ON s.hash=r.hash').all() as {hash:string;body:string|Uint8Array|null}[];const failed=rows.filter(r=>r.body===null||createHash('sha256').update(r.body).digest('hex')!==r.hash);return {checked:rows.length,failed:failed.map(r=>r.hash)};}
 async backup(path:string){await backup(this.db,path);}
 close(){this.db.close();}
 private async migrate(){
 // Non-destructive M2 migration. Old files are preserved as a finite legacy
 // archive; new ingestion writes only SQLite. Re-normalize raw, not old JSON.
 let files:string[]=[];try{files=await readdir(join(this.dir,'snapshots'));}catch(e:any){if(e.code!=='ENOENT')throw e;}
 let imported=0,failed=0;
 for(const file of files.filter(f=>f.endsWith('.json'))){try{const old=JSON.parse(await readFile(join(this.dir,'snapshots',file),'utf8'));const raw=await readFile(join(this.dir,old.rawPayloadRef),'utf8');await this.raw(raw,old.contentHash);await this.accept(normalize(raw,old.sourceUrl,old.retrievedAt));imported++;}catch{failed++;}}
 this.setMeta('migration',{from:'M2-files',imported,failed,at:new Date().toISOString()});if(failed)this.health={state:'stale',error:'legacy-migration-partial',partial:true};
 }
}
