import type {Advisory,LiveSnapshot} from '../shared/model';
export type MapStorm={id:string;name:string;position:[number,number];tracks:Record<'A'|'B',[number,number][]>;forecastTimes?:string[];forecastLeads?:number[];advisory?:Advisory};
export function liveStorms(snapshot:LiveSnapshot|null,now=Date.now()):MapStorm[]{
 return (snapshot?.advisories??[]).flatMap(a=>{
  const current=a.points.find(p=>p.kind==='analysis');if(!current)return [];
  const forecast=a.points.filter(p=>p.kind==='forecast'&&Date.parse(p.validAt)>=now);
  return [{id:a.stormId,name:a.name,position:[current.longitude,current.latitude] as [number,number],tracks:{A:[[current.longitude,current.latitude] as [number,number],...forecast.map(p=>[p.longitude,p.latitude] as [number,number])],B:[]},forecastTimes:forecast.map(p=>p.validAt),forecastLeads:forecast.map(p=>p.leadHours),advisory:a}];
 });
}
export function escapeHTML(s:string){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));}
