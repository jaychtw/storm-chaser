import type {Advisory} from './model';

// Local display policies, not JMA warning validity or dissipation criteria.
export const POLL_MS = 5 * 60_000;
export const STALE_MS = 8 * 3600_000;
export const EXPIRE_MS = 24 * 3600_000;
export const COLLECTION_STALE_MS = 3 * POLL_MS;
export type Eligibility = 'eligible' | 'source-expired' | 'age-expired' | 'inactive' | 'missing';

export function eligibility(a: Advisory, now: number): Eligibility {
  if (a.cancelled || a.lifecycle === 'inactive') return 'inactive';
  if (!a.points.length || !Number.isFinite(Date.parse(a.issuedAt))) return 'missing';
  if (a.validUntil && (!Number.isFinite(Date.parse(a.validUntil)) || now >= Date.parse(a.validUntil))) return 'source-expired';
  if (now - Date.parse(a.issuedAt) > EXPIRE_MS) return 'age-expired';
  return 'eligible';
}

export function advisoryStale(a: Advisory, now: number) {
  return now - Date.parse(a.issuedAt) > STALE_MS;
}
