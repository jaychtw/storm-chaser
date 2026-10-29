import {Archive} from './store';
import {normalize} from './jma';
const a=new Archive(process.env.STORM_DATA_DIR??'.local/live');await a.init();let accepted=0;const failures:Record<string,number>={};
try{if(!a.acquire())throw new Error('collector already running');for(const q of a.events('quarantine')){try{a.heartbeat();const raw=a.rawBody(q.contentHash);if(!raw)continue;await a.accept(normalize(raw,q.url,q.retrievedAt));accepted++;}catch(e){const m=(e as Error).message;failures[m]=(failures[m]??0)+1;}}await a.persist();console.log({accepted,failures});}finally{a.release();a.close();}
