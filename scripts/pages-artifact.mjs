import {readdir,stat,readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {isLiveSnapshot} from '../src/snapshot-contract.ts';
const allowed=/^(index\.html|assets\/[A-Za-z0-9_.-]+\.(js|css)|geography\/countries\.geojson|data\/live\.json|NOTICE\.txt)$/;
let total=0;
async function walk(dir='dist',prefix=''){for(const e of await readdir(dir,{withFileTypes:true})){const p=join(dir,e.name),rel=prefix+e.name;if(e.isSymbolicLink())throw Error('symlink in artifact');if(e.isDirectory())await walk(p,rel+'/');else{if(!allowed.test(rel))throw Error('Unexpected public file: '+rel);if(rel.endsWith('.js')&&/demo-alpha|demo-bravo/.test(await readFile(p,'utf8')))throw Error('Synthetic storm data in public bundle');total+=(await stat(p)).size;}}}
const snapshot=JSON.parse(await readFile('dist/data/live.json','utf8'));if(!isLiveSnapshot(snapshot)||snapshot.health.partial)throw Error('Missing or invalid complete public snapshot');
await readFile('dist/NOTICE.txt');await readFile('dist/geography/countries.geojson');
await walk();if(total>5*1024*1024)throw Error('Pages artifact exceeds 5 MiB');
const html=await readFile('dist/index.html','utf8');if(!html.includes('/storm-chaser/assets/'))throw Error('Incorrect Pages base');
console.log('Public static artifact allowlist passed:',total,'bytes');
