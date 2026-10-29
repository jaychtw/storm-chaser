import {Archive} from './store';
const a=new Archive(process.env.STORM_DATA_DIR??'.local/live');await a.init();
try{
 if(process.argv[2]==='backup'){const target=process.argv[3];if(!target)throw new Error('provide a backup target path');await a.backup(target);console.log('consistent SQLite backup completed');}
 else{if(!a.acquire())throw new Error('collector lease held');a.prune();const result={integrity:a.integrity(),provenance:a.verifyProvenance()};console.log(JSON.stringify(result));if(Object.values(result.integrity??{})[0]!=='ok'||result.provenance.failed.length)process.exitCode=1;}
}finally{a.release();a.close();}
