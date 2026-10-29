import {DatabaseSync} from 'node:sqlite';
import {stat} from 'node:fs/promises';
const path='.pages-state/storm.sqlite';if((await stat(path)).size>16*1024*1024)throw Error('State over 16 MiB');
const db=new DatabaseSync(path,{readOnly:true});try{if(db.prepare('PRAGMA integrity_check').get().integrity_check!=='ok')throw Error('Invalid state');}finally{db.close();}
console.log('State integrity and size bounds passed');
