import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
export type ResponseRecord={url:string;retrievedAt:string;status:number;body:string;bodyBytes?:Uint8Array;decodeError?:boolean;headers:Record<string,string>};
export type Fetcher=(url:string,cache?:{etag?:string;modified?:string})=>Promise<ResponseRecord>;
export async function responseBody(status:number,path:string){return status===304?'':readFile(path,'utf8');}
export const get:Fetcher=async(url,cache)=>{
 // curl inherits platform proxy and CA trust; no TLS/proxy overrides. No shell
 // interpolation, user URLs, credential-bearing inputs, or redirects.
 const dir=await mkdtemp(join(tmpdir(),'storm-jma-'));
 try{const args=['--silent','--show-error','--retry','0','--connect-timeout','10','--max-time','30','--max-filesize','8000000','--proto','=https','-D',join(dir,'headers'),'-o',join(dir,'body'),'-w','%{http_code}'];
 if(cache?.etag)args.push('-H',`If-None-Match: ${cache.etag}`);if(cache?.modified)args.push('-H',`If-Modified-Since: ${cache.modified}`);args.push(url);
 const {stdout}=await promisify(execFile)('curl',args,{maxBuffer:9_000_000});
 const headers:Record<string,string>={};for(const line of (await readFile(join(dir,'headers'),'utf8')).split(/\r?\n/)){const m=line.match(/^([\w-]+):\s*(.*)$/);if(m&&['etag','last-modified','content-type','date','cache-control','retry-after'].includes(m[1].toLowerCase()))headers[m[1].toLowerCase()]=m[2];}
 const status=Number(stdout);const bodyBytes=status===304?new Uint8Array():await readFile(join(dir,'body'));let body='',decodeError=false;try{body=new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(bodyBytes);}catch{decodeError=true;}
 return {url,retrievedAt:new Date().toISOString(),status,body,bodyBytes,decodeError,headers};
 }finally{await rm(dir,{recursive:true,force:true});}
};
