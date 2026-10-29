import {randomUUID} from 'node:crypto';
import {Archive} from './store';
import {get,type Fetcher} from './fetch';
import {discover,normalize,hash} from './jma';
export const FEED='https://www.data.jma.go.jp/developer/xml/feed/extra.xml';
export const LONG_FEED='https://www.data.jma.go.jp/developer/xml/feed/extra_l.xml';
export class Collector{
 busy=false;lastLong=0;failures=0;nextAttempt=0;
 constructor(public archive:Archive,public fetcher:Fetcher=get){Object.assign(this,archive.cursor());}
 async request(url:string){
 const started=Date.now();this.archive.heartbeat();if(this.archive.dailyBytes()>500_000_000){const e=new Error('local daily source budget') as Error&{retryMs:number};e.retryMs=3600_000;throw e;}
 let r;try{r=await this.fetcher(url,this.archive.cache[url]);}catch(e){await this.archive.immutable(`fetches/${randomUUID()}.json`,JSON.stringify({url,retrievedAt:new Date().toISOString(),status:null,error:'transport-failed'}));throw e;}
 this.archive.heartbeat();const digest=hash(r.bodyBytes??r.body);
 if(r.status===200)await this.archive.raw(r.bodyBytes??r.body,digest,url.includes('/feed/')?'feed':'bulletin');
 await this.archive.immutable(`fetches/${randomUUID()}.json`,JSON.stringify({url,retrievedAt:r.retrievedAt,status:r.status,elapsedMs:Date.now()-started,bytes:r.bodyBytes?.byteLength??Buffer.byteLength(r.body),headers:r.headers,contentHash:r.status===200?digest:null,rawPayloadRef:r.status===200?`raw/${digest}.xml`:null}));
 if(r.status!==200&&r.status!==304){const e=new Error(`HTTP ${r.status}`) as Error&{retryMs?:number};const h=r.headers['retry-after'];if(h)e.retryMs=/^\d+$/.test(h)?Number(h)*1000:Math.max(0,Date.parse(h)-Date.now());throw e;}
 if(r.decodeError){await this.archive.immutable(`quarantine/${digest}.json`,JSON.stringify({url,contentHash:digest,retrievedAt:r.retrievedAt,error:'invalid-source-utf8'}));this.archive.issues[url]=digest;throw new Error('invalid source UTF-8 (raw bytes archived)');}return r;
 }
 async poll(now=Date.now()){
 if(this.busy||now<this.nextAttempt||!this.archive.acquire())return;const persisted=this.archive.cursor();if(now<persisted.nextAttempt){this.archive.release();return;}Object.assign(this,persisted);this.busy=true;const started=Date.now(),checkedAt=new Date(now).toISOString();
 try{
  const long=now-this.lastLong>=3600_000;let partial=Object.keys(this.archive.issues).length>0,downloaded=0;
  for(const feed of long?[LONG_FEED,FEED]:[FEED]){
   const r=await this.request(feed);if(r.status===304)continue;
   const urls=discover(r.body);
   for(const url of urls.sort()){
    if(this.archive.issues[url])continue;if(this.archive.seen.has(url))continue;
    if(downloaded>=100||Date.now()-started>150_000){partial=true;continue;}downloaded++;
    try{const b=await this.request(url);if(b.status!==200)throw new Error('missing bulletin payload');
     try{const a=normalize(b.body,url,b.retrievedAt);if(Date.parse(a.controlAt)>Date.now()+15*60_000||Date.parse(a.issuedAt)>Date.now()+15*60_000)throw new Error('future source timestamp');await this.archive.accept(a);}
     catch(e){partial=true;await this.archive.immutable(`quarantine/${hash(b.body)}.json`,JSON.stringify({url,contentHash:hash(b.body),error:(e as Error).message,retrievedAt:b.retrievedAt}));this.archive.issues[url]=hash(b.body);}
    }catch(e:any){if(e.message?.startsWith('HTTP 4')||e.message?.startsWith('HTTP 5'))throw e;partial=true;}
   }
   if(!partial)this.archive.cache[feed]={etag:r.headers.etag,modified:r.headers['last-modified']};
  }
  if(long&&!partial)this.lastLong=now;
  this.archive.heartbeat();this.archive.health={state:partial?'stale':'fresh',lastCheckedAt:checkedAt,lastSuccessAt:partial?this.archive.health.lastSuccessAt:checkedAt,partial,...(partial?{error:'partial-ingestion'}:{})};this.failures=0;this.nextAttempt=now+5*60_000;
 }catch(e:any){if(!this.archive.ownsLease())throw new Error('collector lease lost; no state overwritten');this.failures++;this.archive.health={...this.archive.health,state:this.archive.currentRecords().length?'stale':'unavailable',lastCheckedAt:checkedAt,error:'collection-failed'};this.nextAttempt=now+Math.max(5*60_000,Math.min(3600_000,5*60_000*2**(this.failures-1)),Number.isFinite(e.retryMs)?e.retryMs:0);}
 finally{try{if(!this.archive.ownsLease())throw new Error('collector lease lost; no state overwritten');await this.archive.persist();this.archive.saveCursor({lastLong:this.lastLong,failures:this.failures,nextAttempt:this.nextAttempt});this.archive.prune();}finally{this.archive.release();this.busy=false;}}
 }
}
