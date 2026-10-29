> Historical M2 review. Current storage, retention, source coverage, datum handling and runtime instructions are in [M3 verification](m3-verification.md), [ADR 0001](adr/0001-jma-operations.md) and the [M3 runbook](m3-operations.md). The file-only storage limitations below describe the previous stage.

# M2 — JMA-first prototype for review

Implemented locally, 2026-10-29 Asia/Taipei. **Not publicly deployed. Stop for owner review before later milestones.**

## Working behavior

- Default mode is real JMA collection from the documented XML PULL feed family. There is no official-specimen seed or demo fallback in the collector.
- Local read-only API serves the materialized view and health. MapLibre shows JMA analysis centers as large circles and published forecast centers as smaller circles joined by straight cartographic connectors. Expired forecast points are omitted, without changing the retained source record. No interpolated center positions, past observed track, independent warning, invented cone or second-agency forecast is drawn.
- Official issue, source-control, observation-valid, forecast-valid and retrieval times remain distinct. Units and source wind types remain separate; missing values are shown as unreported. JMA maximum wind's documented ten-minute averaging is disclosed, gust averaging is not invented.
- Explicit collector/source failure and age-derived stale states preserve permitted last-known data. Expired/cancelled/retired information stays archived but is excluded from current systems. Empty recent coverage does not claim a clear basin.
- “Demo fixtures” remains a separate browser mode with a persistent synthetic banner, two illustrative paths and explicit empty/outage scenarios. Server ingestion never imports demo fixtures. Tests use temporary storage and injected responses.
- Mobile now places the map before the storm rail/source stations, with system details initially collapsed. Locale, manual selection, map view and disclosure preference survive normal redraws; data updates do not unexpectedly recenter. Explicit storm selection/reset changes the view. Initial/reset map extent includes Taiwan and the selected JMA path for geographic context.
- Default focus is latest JMA bulletin, explicitly **not Taiwan relevance ranking**. That engine and multi-agency comparison remain outside M2.

## Reproduce locally

Node.js 24 (tested), npm, curl with the platform's proxy/CA configuration, a WebGL-capable browser. No weather API credential is required for JMA.

```sh
cd /workspace/storm-chaser
npm ci
npm run api
```

Keep the API terminal running. In another terminal:

```sh
cd /workspace/storm-chaser
npm run dev -- --port 5173
```

Use the local address printed by Vite in your own browser. It proxies `/api` to the loopback API on port 8787. For the built app, use `npm run build` and `npm run preview -- --port 4173`; the preview proxy is configured too. These are local development servers, not public deployment instructions.

API defaults to `127.0.0.1:8787`; `STORM_API_PORT` changes its port (also update the Vite proxy if changing it). Storage defaults to ignored `.local/live`; `STORM_DATA_DIR` can select an isolated path. Never use the live directory for synthetic replay. Do not start multiple collectors against the same archive.

```sh
npm test
npm run build
npm run test:browser
npm run test:live-browser
```

Browser tests require an app server. They use `/usr/bin/chromium`, a `CHROMIUM_PATH` override, or Playwright Chromium. Set `PREVIEW_URL` to the local built preview to test the distribution. `node scripts/capture-live.mjs` performs a separate actual-collection capture, requires current usable JMA bulletins and an accessible local API, and intentionally fails if none exist; it does not substitute specimens.

`npm run collect` is a one-shot real collection command. Normal operation uses `npm run api` with an in-process timer. `npm run reprocess` re-inspects quarantined saved raw payloads offline after a parser fix, preserving original retrieval provenance; it does not refetch those payloads. Restart the API afterward to reload offline revisions.

## Modules and archive

| Path | Responsibility |
|---|---|
| `server/jma.ts` | Safe feed-link discovery, XML validation, scoped VPTW61 H30 `1.0_2` normalization |
| `server/fetch.ts` | Bounded HTTPS curl retrieval using inherited proxy and TLS trust; selected response headers only |
| `server/collector.ts` | Short/long feed cadence, deduplication, conditional requests, retries/backoff, quarantine |
| `server/store.ts` | Immutable raw/snapshots, atomic state index, source-control ordering, validity/materialization |
| `shared/model.ts` | Advisory, analysis/estimate/forecast point, native value, health and API contracts |
| `src/live.ts` | Live-map view and expired-forecast filtering; no synthetic substitution |

Storage layout: `raw/<sha256>.xml` for unchanged response text; `fetches/<uuid>.json` for URL/time/status/selected headers/hash; `snapshots/<sha256>.json` for normalized advisory revisions; `quarantine/<sha256>.json` for parse errors and raw references; `state.json` for atomic cache/seen/health bookkeeping. Feed responses are also preserved. Hash-identical polls do not duplicate advisory snapshots. Raw data is archived **before** parsing. Archives are local and not placed under public static assets.

## Validation evidence

Final checks: **28 unit/pipeline tests passed**, TypeScript/Vite build passed, demo browser suite passed, official-specimen UI suite passed, and actual local JMA API-to-map capture passed. The two browser suites completed **12 axe scans with zero violations**. Vite reports the known large-bundle advisory. No remote CI run or public deployment is claimed.


- Pipeline tests start with the saved real JMA XML. Mutated cases are clearly controlled tests, not claimed official corrected bulletins: malformed XML/coordinates, missing IDs/timezones/optional winds, non-operational status, cancellation, terminal remarks, out-of-order arrival, same-time correction, duplicate polling, expiry, partial ingestion, timeout/recovery, Retry-After, persistence/restart and unsafe source links.
- [Actual collection capture](m2-live-integration.json) records source URLs, content hashes and times used in the real local map. Initial long-feed retrieval produced **46** normalized official bulletins; current materialization selected **one** JMA system at capture time. Those counts are observations, not permanently fixed expected weather.
- [Controlled live-UI replay results](m2-browser-results.json) exercise source updates without redeployment, retained manual selection and locale, stale/unavailable/empty states, no demo substitution and mobile map-first layout. Replay screenshots use a fixed source-time test clock and must not be treated as live weather.
- [Demo browser results](browser-results.json) cover labeled synthetic scenarios. Automated axe scans are not a full accessibility certification.
- Screenshots: [actual desktop](screenshots/m2/actual-collected-jma-desktop.png), [actual mobile zh-TW](screenshots/m2/actual-collected-jma-mobile-zh.png), [controlled stale state](screenshots/m2/stale-official-specimen-zh.png), [controlled unavailable state](screenshots/m2/unavailable-zh.png).

## Unresolved operational risks

1. **Scheduling:** in-process timer only. It stops with the API process; no durable cloud scheduler/deployment/SLA exists. Startup reconciles the long feed; an outage longer than its rolling window can leave gaps. An actual upstream HTTP 304 path and restart recovery were verified; that is not proof every upstream response supplies useful validators.
2. **Supported schema:** scoped product/version only, not full XSD validation of all JMA products. Unsupported/malformed records are retained in quarantine and degrade health. The first run exposed a namespace-check bug; all 46 raw files were reprocessed locally after correction without repeated downloads. Restart validation also found and fixed handling of curl 304 responses without a body file; a regression test and an actual upstream 304 check verify the correction. Historical quarantine diagnostics remain as evidence.
3. **Ordering ambiguity:** same source-control time with different hashes is retained; later retrieval wins deterministically. Real conflicting corrections, clock errors and all restart/lifecycle variants require extended observation. Future control times beyond 15 minutes are rejected. Same-URL mutation after acceptance is not polled again, relying on documented unique bulletin publication; archive drift needs monitoring.
4. **Freshness policy:** 8-hour stale / 24-hour display expiry thresholds are local choices, not JMA warning validity or proof of dissipation. Explicit source validity takes precedence. Unknown lifecycle remains labeled; retirement does not imply safety.
5. **Geodesy and visualization:** ISO 6709 decimal encoding is verified; a product-specific datum was not explicitly established. Map plotting uses native geographic degrees without datum transformation. Coarse Natural Earth geography and straight connectors are explanatory, not an impact calculation. Estimated +1-hour centers are preserved separately and not drawn as observations/forecasts.
6. **Storage:** files are immutable by application convention, not WORM storage. State index uses atomic rename, but there is no multi-process lock, archive quota, off-machine backup, retention job or tested disaster recovery. Backoff schedule is not durable across a process restart. Do not run parallel collectors against the same directory. A single process/one archive is the tested scope.
7. **Security/operations:** loopback read API, no secrets needed for JMA, no write endpoints, no arbitrary upstream URL proxy, TLS verification preserved. Production authentication, rate limits, hosting headers, monitoring/alerts, quotas, costs and rollout/rollback still require M4 design. Current large MapLibre bundle triggers Vite's size advisory.
8. **Secondary feeds:** CWA still needs secure member authorization and real sample verification. JTWC remains CDN-blocked; no bypass. No independent second-source comparison, Taiwan hazard calculation or production-readiness claim.

Review the live/demo distinction, mobile map-first arrangement, timestamp/units clarity and stale/unknown wording. No public release, publishing action, or subsequent milestone is authorized by this prototype delivery.
