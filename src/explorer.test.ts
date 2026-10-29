import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {normalize} from '../server/jma';
import {forecastSteps,explorerState} from './explorer-model';
const raw=readFileSync('docs/sources/evidence/2026-10-29/jma-vptw61.xml','utf8');
const url='https://www.data.jma.go.jp/developer/xml/data/20261028154121_0_VPTW61_010000.xml';
const now=Date.parse('2026-10-28T16:00:00Z');
const a=()=>normalize(raw,url,new Date(now).toISOString());

describe('Forecast-Time Explorer source semantics',()=>{
 it('keeps the analysis baseline distinct and uses only published forecast records',()=>{
  const advisory=a(),steps=forecastSteps(advisory,now);
  expect(steps.map(p=>p.kind)).toEqual(['analysis',...Array(6).fill('forecast')]);
  expect(steps.map(p=>p.leadHours)).toEqual([0,12,24,45,69,93,117]);
  for(const step of steps)expect(advisory.points).toContain(step);
 });
 it('reveals irregular temporal gaps without creating intermediate positions',()=>{
  const advisory=a(),selected=explorerState(advisory,advisory.points[2].validAt,now);
  expect(selected.selected).toBe(advisory.points[2]);expect(selected.nextGapHours).toBe(21);
  expect(explorerState(advisory,advisory.points.at(-1)!.validAt,now).nextGapHours).toBeNull();
 });
 it('uses analysis as the initial state, never a current-time interpolated center',()=>{
  const model=explorerState(a(),null,now);expect(model.index).toBe(0);expect(model.selected?.validAt).toBe(a().analysisAt);expect(model.selected?.kind).toBe('analysis');
 });
 it('never snaps a vanished selected timestamp onto another forecast',()=>{
  const model=explorerState(a(),'2026-10-28T17:00:00Z',now);expect(model.selected).toBeUndefined();expect(model.index).toBe(-1);
 });
 it('omits estimates rather than relabeling them forecast observations',()=>{
  const advisory=a();advisory.points.push({...advisory.points[0],kind:'estimate',validAt:'2026-10-28T17:00:00Z',leadHours:2});
  expect(forecastSteps(advisory,now)).toHaveLength(7);expect(forecastSteps(advisory,now).some(p=>p.kind==='estimate')).toBe(false);
 });
 it('allows stale-but-eligible points while respecting point validity',()=>{
  const later=now+13*3600_000,advisory=a(),steps=forecastSteps(advisory,later);
  expect(steps[0].kind).toBe('analysis');expect(steps.filter(p=>p.kind==='forecast').every(p=>Date.parse(p.validAt)>=later)).toBe(true);expect(steps).toHaveLength(6);
 });
 it.each(['age','explicit','cancelled','inactive'] as const)('removes the entire timeline when the parent is %s',reason=>{
  const advisory=a();let clock=now;
  if(reason==='age')clock+=25*3600_000;
  if(reason==='explicit')advisory.validUntil=new Date(now).toISOString();
  if(reason==='cancelled')advisory.cancelled=true;
  if(reason==='inactive')advisory.lifecycle='inactive';
  expect(forecastSteps(advisory,clock)).toEqual([]);
 });
 it('represents insufficient or missing forecasts without making up a step',()=>{
  expect(forecastSteps(undefined,now)).toEqual([]);
  const advisory=a();advisory.points=advisory.points.filter(p=>p.kind==='analysis');
  expect(forecastSteps(advisory,now)).toEqual(advisory.points);
  advisory.points=[];expect(forecastSteps(advisory,now)).toEqual([]);
 });
 it('preserves native missing values, motion and advisory provenance without mutation',()=>{
  const advisory=a(),before=structuredClone(advisory),steps=forecastSteps(advisory,now);
  expect(steps.at(-2)?.motion[0]).toMatchObject({value:null,condition:'ゆっくり'});
  expect(steps[0].winds.map(v=>v.unit)).toEqual(['ノット','m/s','ノット','m/s']);
  expect(advisory).toEqual(before);expect(advisory.sourceUrl).toBe(url);
 });
 it('takes revised values only from the currently selected advisory, preserving a matching valid time',()=>{
  const advisory=a(),revised=structuredClone(advisory),time=advisory.points[3].validAt;
  revised.points[3].latitude+=0.1;
  expect(explorerState(revised,time,now).selected).toBe(revised.points[3]);
  expect(explorerState(advisory,time,now).selected).toBe(advisory.points[3]);
 });
});
