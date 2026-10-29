import type {LiveSnapshot} from '../shared/model';
import {bulletinUrl} from '../shared/source-url';

const object=(v:unknown):v is Record<string,any>=>typeof v==='object'&&v!==null&&!Array.isArray(v);
const instant=(v:unknown)=>typeof v==='string'&&/Z$/.test(v)&&Number.isFinite(Date.parse(v));
const strings=(v:Record<string,any>,keys:string[])=>keys.every(k=>typeof v[k]==='string');
const values=(v:unknown,units:string[])=>Array.isArray(v)&&v.every(x=>object(x)&&typeof x.type==='string'&&units.includes(x.unit)&&(x.value===null||typeof x.value==='number'&&Number.isFinite(x.value)&&x.value>=0)&&['condition','description'].every(k=>x[k]===undefined||typeof x[k]==='string'));

// Defensive JSON boundary for the local API. Upstream parsing, provenance and
// archival remain server responsibilities; malformed replies never replace the
// last usable snapshot or become meteorological values.
export function isLiveSnapshot(v:unknown):v is LiveSnapshot {
 try {
  if(!object(v)||v.mode!=='live'||v.coverage!=='recent-jma-bulletins'||!instant(v.asOf)||!Number.isFinite(v.pollSeconds)||v.pollSeconds<=0)return false;
  if(!object(v.health)||!['fresh','stale','unavailable','unknown'].includes(v.health.state)||!['lastCheckedAt','lastSuccessAt'].every(k=>v.health[k]===undefined||instant(v.health[k]))||!(v.health.partial===undefined||typeof v.health.partial==='boolean')||!(v.health.error===undefined||typeof v.health.error==='string'))return false;
  if(!['expiredCount','inactiveCount'].every(k=>Number.isInteger(v[k])&&v[k]>=0)||!Array.isArray(v.advisories))return false;
  return v.advisories.every((a:unknown)=>{
   if(!object(a)||a.source!=='JMA'||a.inputKind!=='live'||!strings(a,['id','stormId','name','sourceUrl','contentHash','rawPayloadRef'])||!['issuedAt','controlAt','analysisAt','retrievedAt'].every(k=>instant(a[k]))||!(a.validUntil===null||instant(a.validUntil))||!(a.nativeClass===null||typeof a.nativeClass==='string')||typeof a.cancelled!=='boolean'||!['active','inactive','unknown'].includes(a.lifecycle)||!Array.isArray(a.points))return false;
   bulletinUrl(a.sourceUrl);
   return a.points.every((p:unknown)=>object(p)&&['analysis','estimate','forecast'].includes(p.kind)&&instant(p.validAt)&&Number.isFinite(p.latitude)&&Math.abs(p.latitude)<=90&&Number.isFinite(p.longitude)&&Math.abs(p.longitude)<=180&&Number.isFinite(p.leadHours)&&p.leadHours>=0&&p.leadHours<=120&&values(p.winds,['m/s','ノット'])&&values(p.pressure,['hPa'])&&values(p.motion,['km/h','ノット'])&&(p.direction===undefined||object(p.direction)&&typeof p.direction.type==='string'&&typeof p.direction.unit==='string'&&(p.direction.value===null||typeof p.direction.value==='string')&&['condition','description'].every(k=>p.direction[k]===undefined||typeof p.direction[k]==='string')));
  });
 }catch{return false;}
}
