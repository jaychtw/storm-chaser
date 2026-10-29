import {mkdir,readdir,stat,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {Archive} from './store';
const a=new Archive(process.env.STORM_DATA_DIR??'.local/live');await a.init();
try{
 const checks={integrity:a.integrity(),provenance:a.verifyProvenance()};if(Object.values(checks.integrity??{})[0]!=='ok'||checks.provenance.failed.length)throw new Error('backup blocked: archive verification failed');
 const dir=join(a.dir,'backups');await mkdir(dir,{recursive:true});const path=join(dir,`${new Date().toISOString().replace(/[:.]/g,'-')}.sqlite`);await a.backup(path);
 const files=await Promise.all((await readdir(dir)).filter(n=>n.endsWith('.sqlite')).map(async name=>({name,time:(await stat(join(dir,name))).mtimeMs})));
 files.sort((a,b)=>b.time-a.time);for(const [i,f] of files.entries())if(i>=7||f.time<Date.now()-7*86400_000)await rm(join(dir,f.name));
 console.log(JSON.stringify({backup:path,retention:'7 days / at most 7 snapshots',integrity:a.integrity()}));
}finally{a.close();}
