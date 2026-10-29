import {access} from 'node:fs/promises';
import {join} from 'node:path';
import {Archive} from './store';
const dir=process.env.STORM_DATA_DIR??'.local/live';
await access(join(dir,'storm.sqlite')); // Never create an empty archive to "verify" a wrong path.
const a=new Archive(dir);await a.init();
try{
 const result={integrity:a.integrity(),provenance:a.verifyProvenance(),snapshots:a.records.length};
 console.log(JSON.stringify(result));
 if(Object.values(result.integrity??{})[0]!=='ok'||result.provenance.failed.length)process.exitCode=1;
}finally{a.close();}
