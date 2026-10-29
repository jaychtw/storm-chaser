import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {normalize,hash} from '../server/jma';
import {Archive,materialize} from '../server/store';
import {eligibility,advisoryStale,STALE_MS,EXPIRE_MS} from '../shared/eligibility';
import {liveStorms,liveView} from './live';
import {resolveFocus} from './focus';
import {nativeLabel,reportedValue,reportedDirection} from './data-labels';
const raw=readFileSync('docs/sources/evidence/2026-10-29/jma-vptw61.xml','utf8');
const url='https://www.data.jma.go.jp/developer/xml/data/20261028154121_0_VPTW61_010000.xml';
const now=Date.parse('2026-10-28T16:00:00Z');
const a=()=>normalize(raw,url,new Date(now).toISOString());
const health={state:'fresh' as const,lastSuccessAt:new Date(now).toISOString()};

describe('shared advisory eligibility and cached-data integrity',()=>{
 it.each([0,8,16,24,25,72])('keeps client/server eligibility consistent at +%sh without new API data',hours=>{
  const source=a(),cached=materialize([source],health,now),later=now+hours*3600_000;
  expect(liveStorms(cached,later).map(s=>s.id)).toEqual(materialize([source],health,later).advisories.map(s=>s.stormId));
 });
 it('retains stale-but-eligible data on API loss without refreshing source time',()=>{
  const cached=materialize([a()],health,now),view=liveView(cached,true,now+9*3600_000);
  expect(view.storms).toHaveLength(1);expect(view.state).toBe('stale');expect(view.storms[0].advisory?.issuedAt).toBe(a().issuedAt);
 });
 it('honors explicit validity at its exact boundary independently of future points',()=>{
  const source={...a(),validUntil:new Date(now+60_000).toISOString()},cached=materialize([source],health,now);
  expect(liveStorms(cached,now+59_999)).toHaveLength(1);expect(liveStorms(cached,now+60_000)).toHaveLength(0);
  expect(eligibility(source,now+60_000)).toBe('source-expired');
 });
 it('preserves the existing stale and expiry boundaries',()=>{
  const source=a(),issued=Date.parse(source.issuedAt);
  expect(advisoryStale(source,issued+STALE_MS)).toBe(false);expect(advisoryStale(source,issued+STALE_MS+1)).toBe(true);
  expect(eligibility(source,issued+EXPIRE_MS)).toBe('eligible');expect(eligibility(source,issued+EXPIRE_MS+1)).toBe('age-expired');
 });
 it('does not label old meteorology fresh after successful API contact',()=>{
  const later=now+9*3600_000,cached=materialize([a()],health,now);
  cached.health={state:'fresh',lastSuccessAt:new Date(later).toISOString()};
  expect(liveView(cached,false,later).state).toBe('stale');
 });
 it('retains partial collection independently of API failure and expiry',()=>{
  const cached=materialize([a()],{...health,partial:true},now);
  expect(liveView(cached,false,now).state).toBe('stale');expect(liveView(cached,true,now+25*3600_000).expiredCount).toBe(1);
  expect(cached.health.partial).toBe(true);expect(cached.advisories).toHaveLength(1);
 });
 it('never admits inactive, cancelled or unusable records as current candidates',()=>{
  for(const source of [{...a(),cancelled:true},{...a(),lifecycle:'inactive' as const},{...a(),points:[]}]){
   const cached={...materialize([a()],health,now),advisories:[source]};expect(liveStorms(cached,now)).toEqual([]);
  }
 });
 it('excludes expired current data without removing archived bytes or changing lifecycle',async()=>{
  const dir=await mkdtemp(join(tmpdir(),'storm-m3p-'));const archive=new Archive(dir);
  try{await archive.init();await archive.raw(raw,hash(raw));await archive.accept(a());
   const cached=archive.snapshot(now);expect(liveView(cached,true,now+25*3600_000).storms).toEqual([]);
   expect(archive.rawBody(hash(raw))).toBe(raw);expect(archive.records[0].lifecycle).toBe('active');expect(archive.verifyProvenance().failed).toEqual([]);
  }finally{archive.close();await rm(dir,{recursive:true,force:true});}
 });
});

describe('uncertainty-first focus without ordering or geometry',()=>{
 it.each([0,1,2])('does not choose a priority from %s available systems',count=>{
  const candidates=Array.from({length:count},(_,i)=>({id:String(i)}));
  expect(resolveFocus(candidates,{manual:false,selectedId:null})).toEqual({selected:null,reason:'uncertain'});
 });
 it('keeps manual selection across reorder/recovery and never silently substitutes a replacement',()=>{
  const first={id:'first'},other={id:'other'},focus={manual:true,selectedId:'first'};
  expect(resolveFocus([other,first],focus).selected).toBe(first);
  expect(resolveFocus([other],focus)).toEqual({selected:null,reason:'ineligible'});
  expect(resolveFocus([first,other],focus).selected).toBe(first);
  expect(resolveFocus([first,other],{...focus,manual:false}).selected).toBeNull();
 });
});

describe('source-backed motion and bilingual terminology',()=>{
 it('preserves the documented center direction and native speed separately from wind-area directions',()=>{
  const source=a();expect(source.points[0].direction).toMatchObject({value:'西',unit:'１６方位漢字',type:'移動方向'});
  expect(source.points[0].motion.map(v=>v.unit)).toEqual(['ノット','km/h']);
  expect(source.points.at(-2)?.motion[0]).toMatchObject({value:null,condition:'ゆっくり',description:'ゆっくり'});
 });
 it('handles missing and explicitly undetermined direction without geometric inference',()=>{
  const missing=normalize(raw.replace(/<jmx_eb:Direction unit="１６方位漢字" type="移動方向">[^<]*<\/jmx_eb:Direction>/g,''),url,new Date(now).toISOString());
  expect(missing.points.every(p=>p.direction===undefined)).toBe(true);
  const uncertain=normalize(raw.replace('<jmx_eb:Direction unit="１６方位漢字" type="移動方向">西</jmx_eb:Direction>','<jmx_eb:Direction unit="１６方位漢字" type="移動方向" condition="不定" description="不定"/>'),url,new Date(now).toISOString());
  expect(uncertain.points[0].direction).toMatchObject({value:null,condition:'不定'});
  expect(reportedDirection(uncertain.points[0].direction,'en')).toContain('Undetermined');
 });
 it.each(['unit="degrees" type="移動方向">西','unit="１６方位漢字" type="wind">西','unit="１６方位漢字" type="移動方向">unknown'])('rejects unsupported direction semantics: %s',replacement=>{
  expect(()=>normalize(raw.replace('unit="１６方位漢字" type="移動方向">西',replacement),url,new Date(now).toISOString())).toThrow('direction');
 });
 it.each(['en','zh-TW'] as const)('localizes field/class/unit/condition labels in %s and marks unknown terms honestly',locale=>{
  const text=reportedValue(a().points[0].winds[0],locale);expect(text).not.toContain('ノット');
  expect(nativeLabel('台風(TY)',locale)).not.toContain('台風');expect(nativeLabel('台風(TS)',locale)).not.toMatch(/Typhoon|颱風/);
  expect(reportedValue(a().points.at(-2)!.motion[0],locale)).not.toMatch(/ゆっくり|: 0 /);
  expect(nativeLabel('未知の条件',locale)).toContain('未知の条件');
  expect(reportedDirection(undefined,locale)).toBe(locale==='en'?'Not reported':'未提供');
 });
 it('maps Japanese compass wording without guessing bearings or averaging winds',()=>{
  const d={value:'北西',unit:'１６方位漢字',type:'移動方向'};
  expect(reportedDirection(d,'en')).toBe('Northwest');expect(reportedDirection(d,'zh-TW')).toBe('西北');
  expect(a().points[0].winds.map(v=>v.value)).toEqual([95,50,135,70]);
 });
});
