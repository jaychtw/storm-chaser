import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {normalize} from '../server/jma';
import {materialize} from '../server/store';
import {liveStorms} from './live';
import {isLiveSnapshot} from './snapshot-contract';
import {selectPublishedPoint} from './point-selection';
import {localApiPort} from '../shared/config';
const raw=readFileSync('docs/sources/evidence/2026-10-29/jma-vptw61.xml','utf8');
const now=Date.parse('2026-10-28T16:00:00Z'),url='https://www.data.jma.go.jp/developer/xml/data/20261028154121_0_VPTW61_010000.xml';
const a=()=>normalize(raw,url,new Date(now).toISOString());
const snapshot=()=>materialize([a()],{state:'fresh',lastSuccessAt:new Date(now).toISOString()},now);

describe('local snapshot JSON boundary',()=>{
 it('accepts the actual normalized source and a valid empty/unavailable response',()=>{
  expect(isLiveSnapshot(snapshot())).toBe(true);expect(isLiveSnapshot(materialize([],{state:'unavailable'},now))).toBe(true);
 });
 it.each(['missing-points','invalid-date','outside-coordinate','invalid-unit','unsafe-url','wrong-source','official-example','non-number-wind','bad-health','bad-direction'])(
  'rejects %s before replacing last-known data',kind=>{
   const s:any=snapshot(),a=s.advisories[0];
   if(kind==='missing-points')delete a.points;
   if(kind==='invalid-date')a.issuedAt='not a date';
   if(kind==='outside-coordinate')a.points[0].latitude=99;
   if(kind==='invalid-unit')a.points[0].winds[0].unit='mph';
   if(kind==='unsafe-url')a.sourceUrl='javascript:alert(1)';
   if(kind==='wrong-source')a.source='CWA';
   if(kind==='official-example')a.inputKind='official-example';
   if(kind==='non-number-wind')a.points[0].winds[0].value='95';
   if(kind==='bad-health')s.health.partial='false';
   if(kind==='bad-direction')a.points[0].direction.value={invalid:true};
   expect(isLiveSnapshot(s)).toBe(false);
  });
 it('does not throw on arbitrary malformed replies',()=>{
  for(const value of [null,[],{},false,{mode:'live',advisories:[{}],health:{}},'<html/>'])expect(isLiveSnapshot(value)).toBe(false);
 });
});
describe('one source-selection contract for marker/list/explorer routes',()=>{
 it('resolves exact irregular times and native lead hours without trusting a caller-supplied lead',()=>{
  const s=liveStorms(snapshot(),now)[0],p=a().points[3];
  expect(selectPublishedPoint(s,p.validAt,'A',false,now)).toEqual({point:{validAt:p.validAt,track:'A',lead:45,stormId:s.id}});
 });
 it('selects analysis explicitly but rejects estimates, absent times and a second agency path',()=>{
  const s=liveStorms(snapshot(),now)[0];expect(selectPublishedPoint(s,a().analysisAt,'A',false,now)).toEqual({point:null});
  expect(selectPublishedPoint(s,'2026-10-28T17:00:00Z','A',false,now)).toBeNull();expect(selectPublishedPoint(s,a().points[1].validAt,'B',false,now)).toBeNull();
 });
 it('rechecks parent expiry even when a marker/list event was queued from an old render',()=>{
  const s=liveStorms(snapshot(),now)[0];expect(selectPublishedPoint(s,a().points[3].validAt,'A',false,now+25*3600_000)).toBeNull();
 });
 it('never relabels synthetic selection as a JMA source record',()=>{
  const s=liveStorms(snapshot(),now)[0];expect(selectPublishedPoint(s,a().points[1].validAt,'A',true,now)).toBeNull();expect(selectPublishedPoint(null,a().analysisAt,'A',false,now)).toBeNull();
 });
});

describe('supported local port configuration',()=>{
 it('uses the documented default and accepts a valid alternate port for API/proxy',()=>{expect(localApiPort(undefined)).toBe(8787);expect(localApiPort('19087')).toBe(19087);});
 it.each(['0','-1','65536','not-a-port'])('rejects unsupported configuration %s before server startup',value=>expect(()=>localApiPort(value)).toThrow('STORM_API_PORT'));
});
