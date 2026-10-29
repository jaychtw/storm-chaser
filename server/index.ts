import {createServer} from 'node:http';
import {resolve} from 'node:path';
import {Archive} from './store';
import {localApiPort} from '../shared/config';
const port=localApiPort(process.env.STORM_API_PORT);
const archive=new Archive(resolve(process.env.STORM_DATA_DIR??'.local/live'));await archive.init();
// Local-only read API; GET never triggers upstream requests. No synthetic seed.
const server=createServer((req,res)=>{
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method!=='GET'){res.writeHead(405);res.end();return;}
 if(req.url!=='/api/live'&&req.url!=='/api/health'){res.writeHead(404);res.end();return;}
 res.setHeader('Content-Type','application/json; charset=utf-8');
 try{const snapshot=archive.snapshot();res.end(JSON.stringify(req.url==='/api/health'?{mode:snapshot.mode,asOf:snapshot.asOf,health:snapshot.health,storage:archive.storage()}:snapshot));}
 catch{res.writeHead(503);res.end(JSON.stringify({error:'local-data-unavailable'}));}
});
server.listen(port,'127.0.0.1',()=>console.log('Storm Chaser local JMA API listening; no public deployment'));
// V1 local-first default: starting a reader never activates source collection.
// Collection is an explicit bounded `npm run collect` operation; unattended
// scheduling remains a separately authorized host decision.
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{server.close(()=>{archive.close();});});
