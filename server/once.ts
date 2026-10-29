import {Archive} from './store';
import {Collector} from './collector';
const archive=new Archive(process.env.STORM_DATA_DIR??'.local/live');await archive.init();
try{const c=new Collector(archive);await c.poll();const s=archive.snapshot();console.log(JSON.stringify({at:s.asOf,health:s.health,systems:s.advisories.length,cursor:archive.cursor()}));if(s.health.state==='unavailable'||s.health.error)process.exitCode=1;}finally{archive.close();}
