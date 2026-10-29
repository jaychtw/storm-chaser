import {createServer} from 'node:http';
import {resolve} from 'node:path';
import {Archive} from './store';
import {Collector} from './collector';
const archive=new Archive(resolve(process.env.STORM_DATA_DIR??'.local/live'));await archive.init();const collector=new Collector(archive);
// Local-only read API; GET never triggers upstream requests. No synthetic seed.
const server=createServer((req,res)=>{
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method!=='GET'){res.writeHead(405);res.end();return;}
 if(req.url!=='/api/live'&&req.url!=='/api/health'){res.writeHead(404);res.end();return;}
 const snapshot=archive.snapshot();res.setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify(req.url==='/api/health'?{mode:snapshot.mode,asOf:snapshot.asOf,health:snapshot.health,storage:archive.storage()}:snapshot));
});
server.listen(Number(process.env.STORM_API_PORT??8787),'127.0.0.1',()=>console.log('Storm Chaser local JMA API listening; no public deployment'));
const embedded=process.env.STORM_EXTERNAL_SCHEDULER!=='1';if(embedded)await collector.poll();const timer=embedded?setInterval(()=>{void collector.poll().catch(()=>console.error('archive-write-failed'));},60_000):null;
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{if(timer)clearInterval(timer);server.close(()=>{archive.close();});});
