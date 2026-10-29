import {describe,it,expect} from 'vitest';
import {availableStorms,parseScenario,selectStorm,pointTime,fixtureIssuedAt} from './fixtures';
import {copy,readLocale,formatTime} from './i18n';
describe('prototype scenarios and selection',()=>{
 it('does not invent storms in the empty scenario',()=>{expect(availableStorms('empty')).toEqual([]);expect(selectStorm('empty','demo-alpha')).toBeNull();});
 it('preserves a manual selection through outage and recovers invalid selections',()=>{expect(selectStorm('outage','demo-bravo')?.id).toBe('demo-bravo');expect(selectStorm('multi','invalid')?.id).toBe('demo-alpha');});
 it('keeps malformed URL scenarios from creating unsupported states',()=>{expect(parseScenario('<script>')).toBe('multi');expect(parseScenario('outage')).toBe('outage');});
 it('keeps synthetic tracks valid and forecast times tied to fixture issuance',()=>{
  for(const storm of availableStorms('multi')) for(const points of Object.values(storm.tracks)) {
   expect(points[0]).toEqual(storm.position);
   for(const [lng,lat] of points){expect(lng).toBeGreaterThanOrEqual(-180);expect(lng).toBeLessThanOrEqual(180);expect(lat).toBeGreaterThanOrEqual(-90);expect(lat).toBeLessThanOrEqual(90);}
  }
  expect(Date.parse(pointTime(2))-Date.parse(fixtureIssuedAt)).toBe(24*3600_000);
 });
});
describe('localization',()=>{
 it('covers every message in both languages',()=>{expect(Object.keys(copy.en).sort()).toEqual(Object.keys(copy['zh-TW']).sort());for(const v of Object.values(copy['zh-TW']))expect(v.trim().length).toBeGreaterThan(0);});
 it('handles blocked storage and unknown preferences',()=>{expect(readLocale({getItem:()=>{throw new Error('denied');}})).toBe('en');expect(readLocale({getItem:()=> 'zh-TW'})).toBe('zh-TW');expect(readLocale({getItem:()=> 'fr'})).toBe('en');});
 it('renders explicit Taiwan timezone independently of host timezone',()=>{for(const locale of ['en','zh-TW'] as const)expect(formatTime('2026-08-01T00:00:00Z',locale)).toContain('08:00 UTC+08:00');});
});
