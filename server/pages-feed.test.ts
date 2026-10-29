import {describe,it,expect} from 'vitest';
import {validateLongWindow} from './pages-feed';
const now=Date.parse('2026-10-30T00:00:00Z');
const feed=(updated:string,entries:string[])=>`<feed xmlns="http://www.w3.org/2005/Atom"><updated>${updated}</updated>${entries.map(t=>`<entry><updated>${t}</updated></entry>`).join('')}</feed>`;
describe('Pages long-feed reconciliation window',()=>{
 it('requires an observed rolling window covering the full eligibility age',()=>{
 expect(()=>validateLongWindow(feed('2026-10-29T23:59:00Z',['2026-10-28T00:00:00Z','2026-10-29T23:00:00Z']),now)).not.toThrow();
 expect(()=>validateLongWindow(feed('2026-10-29T23:59:00Z',['2026-10-29T23:00:00Z']),now)).toThrow();
 });
 it('rejects stale, future, malformed and empty feeds',()=>{
 for(const [updated,entries] of [['2026-10-29T20:00:00Z',['2026-10-28T00:00:00Z']],['2026-10-30T01:00:00Z',['2026-10-28T00:00:00Z']],['bad',['bad']],['2026-10-29T23:59:00Z',[]]] as [string,string[]][])expect(()=>validateLongWindow(feed(updated,entries),now)).toThrow();
 });
});
