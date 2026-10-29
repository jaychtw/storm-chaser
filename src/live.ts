import type {Advisory,LiveSnapshot} from '../shared/model';
import {eligibility,advisoryStale,COLLECTION_STALE_MS} from '../shared/eligibility';
export type MapStorm={id:string;name:string;position:[number,number];tracks:Record<'A'|'B',[number,number][]>;forecastTimes?:string[];forecastLeads?:number[];advisory?:Advisory};
export function liveStorms(snapshot:LiveSnapshot|null,now=Date.now()):MapStorm[]{
 return (snapshot?.advisories??[]).filter(a=>eligibility(a,now)==='eligible').flatMap(a=>{
  const current=a.points.find(p=>p.kind==='analysis');if(!current)return [];
  const forecast=a.points.filter(p=>p.kind==='forecast'&&Date.parse(p.validAt)>=now);
  return [{id:a.stormId,name:a.name,position:[current.longitude,current.latitude] as [number,number],tracks:{A:[[current.longitude,current.latitude] as [number,number],...forecast.map(p=>[p.longitude,p.latitude] as [number,number])],B:[]},forecastTimes:forecast.map(p=>p.validAt),forecastLeads:forecast.map(p=>p.leadHours),advisory:a}];
 });
}
// Re-evaluate the cached snapshot locally. No API success or timer dispatch is
// required to make expired data ineligible; raw/history storage is untouched.
export function liveView(snapshot:LiveSnapshot|null,clientError:boolean,now=Date.now()) {
 const excluded=(snapshot?.advisories??[]).filter(a=>eligibility(a,now)!=='eligible');
 const storms=liveStorms(snapshot,now);
 let state=snapshot?.health.state??'unknown';
 if(snapshot?.health.partial)state='stale';
 if(snapshot?.health.lastSuccessAt&&now-Date.parse(snapshot.health.lastSuccessAt)>COLLECTION_STALE_MS)state=storms.length?'stale':'unavailable';
 if(state==='fresh'&&storms.some(s=>advisoryStale(s.advisory!,now)))state='stale';
 if(clientError)state=storms.length?'stale':'unavailable';
 return {storms,state,excluded,expiredCount:(snapshot?.expiredCount??0)+excluded.filter(a=>eligibility(a,now)!=='inactive').length};
}
export function escapeHTML(s:string){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));}
