> Current architecture: [ADR 0001 — M3 JMA operation](adr/0001-jma-operations.md). The following document is historical.

> Historical M1 architecture. The current implementation is documented in [M2 review](m2-review.md); its real JMA pipeline supersedes the fixture-only boundaries below.

# M1 architecture and boundaries

The attached design guide is retained at [Storm_Chaser_Design_Guide_v1.0.md](Storm_Chaser_Design_Guide_v1.0.md). This delivery implements its M1 visual proof of concept and records the M0 investigation with unresolved access gates. Later milestone instructions are roadmap context, not authorization to deploy.

## Current implementation

```
Local synthetic scenarios ──> TypeScript UI / locale state
Local Natural Earth GeoJSON ──> MapLibre GL JS
Official page links ──> user-controlled external navigation
```

Vite builds a static, always-labeled design prototype. MapLibre renders the coastlines, grid, independent illustrative paths and keyboard-selectable markers. The basemap is local: there are no tile keys, external font requests or third-party map-service dependencies. Pan/zoom is interactive; reset is explicit. Language and data redraws do not intentionally reset the camera. The locale preference alone persists locally. No personal information is collected.

`src/fixtures.ts` has two explicitly synthetic storm IDs (`demo-*`), positions, independent paths A/B and a fixed fixture issuance. Each path point advances 12 hours for demonstrating valid-time inspection. No wind/pressure, agency attribution, warnings or uncertainty cone is invented. Auto uses the authored Alpha-first scenario, not a relevance engine. Manual selection lasts within the page session until Auto is chosen; locale switches preserve it. Empty and outage scenarios are visual states, not observations of real weather.

The outage scenario intentionally retains stale **fixtures**. It does not validate real source-failure recovery. Original charts use external-page fallback because original assets and rights have not passed M0. No live timers, simulated refreshing, fabricated successful-check timestamps or cross-agency controls are present.

## M2 contract direction, not implemented

Preserve the guide's separate `Storm`, `Advisory`, `ForecastPoint` and `SourceHealth` records. Stable storm IDs must reconcile basin/season/native IDs and ambiguous spatial-temporal continuity. Each advisory preserves issue time, retrieval time, native ID, revision, official URL, raw reference and content hash. Forecast points preserve valid times, coordinates and native intensity units/averaging periods. Never confuse issuance with retrieval or interpolate official geometry silently.

A permitted collector will validate each source independently, archive immutable permitted payloads, deduplicate source/storm/advisory/revision hashes, and materialize latest views without allowing late advisories to displace newer ones. Corrected same-time content remains a revision. A read-only API and health endpoint must separate unknown, current, stale and unavailable. Scheduling, retries, identity matching, storage and all pipeline contract/replay tests belong to M2 and later.

## Operations / costs / retention

Current local prototype: no billable cloud infrastructure provisioned, no server-side secrets, no live collector, no database or raw weather archive. Hosting and future retention costs are **not estimated or approved** before source/cost review. The roughly 1 MB MapLibre-containing JS bundle currently triggers Vite's size advisory; lazy loading and finer geography can be evaluated later.

No deployment exists to roll back. Rebuild a previous reviewed revision for a future static prototype rollback. Git-backed source/lockfile and screenshots are review artifacts; preserve unpublished local work before resets. Future storage backups, retention limits, monitoring, CORS, server-side credentials and rollback must be designed and tested in their implementation milestones.
