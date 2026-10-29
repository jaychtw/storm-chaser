// Pages-only isolated archive. Never use the owner's local-first data directory.
import {resolve,join} from 'node:path';
import {mkdir,stat,writeFile} from 'node:fs/promises';
import {Archive} from '../server/store';
import {Collector,LONG_FEED} from '../server/collector';
import {get} from '../server/fetch';
import {validateLongWindow} from '../server/pages-feed';
import {isLiveSnapshot} from '../src/snapshot-contract';
const state=resolve('.pages-state'),out=resolve('dist/data');
const archive=new Archive(state);await archive.init();
try {
 const collector=new Collector(archive,async(url,cache)=>{const response=await get(url,url===LONG_FEED?undefined:cache);if(url===LONG_FEED){if(response.status!==200||response.decodeError)throw new Error('Missing long feed');validateLongWindow(response.body);}return response;});
 // Every scheduled run reconciles the rolling long feed as well as the short feed.
 collector.lastLong=0;archive.saveCursor({...archive.cursor(),lastLong:0});
 await collector.poll();
 const snapshot=archive.snapshot();
 if(!isLiveSnapshot(snapshot))throw new Error('invalid generated snapshot');
 if(!archive.health.lastSuccessAt||archive.health.partial||archive.health.error||Date.now()-Date.parse(archive.health.lastSuccessAt)>15*60_000)throw new Error('Incomplete or failed reconciliation; retain previously deployed site, never publish as complete');
 if(archive.verifyProvenance().failed.length)throw new Error('provenance check failed');
 await mkdir(out,{recursive:true});
 const json=JSON.stringify(snapshot);if(Buffer.byteLength(json)>1_000_000)throw new Error('public snapshot size limit');
 await writeFile(join(out,'live.json'),json+'\n');
 console.log(JSON.stringify({lastSuccessAt:snapshot.health.lastSuccessAt,asOf:snapshot.asOf,advisories:snapshot.advisories.map(a=>({id:a.id,issuedAt:a.issuedAt,sourceUrl:a.sourceUrl,contentHash:a.contentHash})),expired:snapshot.expiredCount}));
}finally{
 // Keep latest raw-backed units and cancellation tombstones, not historical cycles.
 // Deduplication, cursor, health and recent fetch-byte accounting survive cache restore.
 archive.db.exec(`DELETE FROM snapshots WHERE hash NOT IN (SELECT json_extract(json,'$.contentHash') FROM heads);
 DELETE FROM raw WHERE hash NOT IN (SELECT hash FROM snapshots);
 PRAGMA wal_checkpoint(TRUNCATE); VACUUM;`);
 archive.close();
 const size=(await stat(join(state,'storm.sqlite'))).size;
 if(size>16*1024*1024)throw new Error('State exceeds 16 MiB; stop, do not upload cache or deploy');
 console.log('Bounded isolated Actions cache bytes:',size);
}
