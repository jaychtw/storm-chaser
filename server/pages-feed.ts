import {parseXml} from './jma';
// The official long feed covers all arrivals for several days, not an archive.
// Refuse a truncated/aged bootstrap window rather than infer absent storms.
export function validateLongWindow(body:string,now=Date.now()) {
 const f=parseXml(body).feed;
 const entries=Array.isArray(f?.entry)?f.entry:f?.entry?[f.entry]:[];
 const times=entries.map((e:any)=>Date.parse(e.updated));
 const updated=Date.parse(f?.updated);
 if(!times.length||times.some((t:number)=>!Number.isFinite(t))||!Number.isFinite(updated)||updated>now+15*60_000||now-updated>2*3600_000||Math.min(...times)>now-24*3600_000)throw new Error('Long-feed coverage window insufficient for reconciliation');
}
