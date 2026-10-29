# STORM CHASER
## Product & Engineering Design Guide — v1.0

**Status:** Approved product direction; implementation-ready specification, pending source feasibility audit  
**Release strategy:** Functional core first; historical experiences afterward  
**Product type:** Independent, responsive web application  
**Audience:** Public users, with Taiwan as initial country of interest  
**Languages:** English and Traditional Chinese (zh-TW) from first release

---

## 1. Product intent

Storm Chaser transforms scattered, publicly disclosed tropical-cyclone information into a coherent, explorable, source-attributed command center. It covers the **western North Pacific and South China Sea**, automatically emphasizing storms potentially relevant to Taiwan, while allowing visitors to inspect the agencies' original charts and compare their forecast tracks.

**Product promise:** *See the wider picture. Understand what matters. Inspect the evidence.*

This is an information and visualization product, **not** an official meteorological warning service or an independently validated hazard forecast. Always prioritize official local instructions for safety decisions.

### Non-negotiable principles

1. **Build once, operate continuously.** A new storm, updated advisory, or storm dissipation is a data event, never a code deployment.
2. **Original evidence stays visible.** Attribute every forecast and provide an official-source link; show original chart images where lawful and technically feasible.
3. **No false certainty.** Distinguish agency forecast, observation, inferred relevance, stale data, and unavailable data.
4. **No opaque AI hazard judgments.** Rules for storm emphasis must be explainable and auditable.
5. **Bilingual from day one.** English and Traditional Chinese, including empty/error states.
6. **Night Operations visual identity.** Dark, clandestine command-center atmosphere with restrained red accents, while preserving alert semantics and accessibility.
7. **Independent product.** Separate repository, deployment, lifecycle, and identity; may later be linked from Possibility.
8. **Release only verified capabilities.** Never fabricate live data, claim unavailable agency coverage, or silently substitute simulation for production data.

## 2. Release scope

### v1.0 — functional core (required)

- Responsive western North Pacific interactive map, pan/zoom, geographic context, Taiwan marker/area.
- Automatically discover and track active tropical cyclones from verified permitted source feeds.
- Display storm location, motion, intensity **as reported**, latest advisory and valid times, agency attribution.
- Overlay independently selectable forecast tracks from multiple agencies **when each verified feed supports them**. Distinguish issuance cycles and forecast horizons.
- Original agency chart cards: embed permitted official chart assets or provide clearly labeled preview/link fallback. Never imply a redrawn chart is original.
- Default **Auto focus** selects the highest-relevance storm for Taiwan using explainable criteria; manual selection always available. All active storms remain discoverable.
- English/繁體中文 switch with persisted preference.
- Automatically refresh the frontend without reload; show source freshness, failures, and data-as-of timestamps.
- Archived raw source payloads/metadata and normalized forecast snapshots where permitted, to support later verification.
- Operational health checks, retries, observability, secure secrets, and integration/replay testing.
- Honest empty state when no active storm; no invented sample storm in production.

**Conditional feature rule:** CWA, JMA and JTWC are target sources, **not guaranteed live integrations**. First audit machine-readable data access, archival/reuse permissions, coverage, and update behavior. The release may ship with a verified subset only if clearly labeled, with no misleading comparison UI. If fewer than two independently verified track feeds exist, do not claim multi-agency overlay completion.

### v1.1+ — deferred

- **Forecast Showdown:** compare archived agency predictions at matched issuance times and lead times against an explicitly chosen best-track reference; publish position error in km, samples, limitations.
- **Forecast Time Travel:** replay genuine archived advisories as they became available, with no hindsight leakage.
- Country-of-interest selector (Taiwan fixed in v1.0); country-specific warnings, geographic relevance, terminology, and data coverage must be validated before enabling a country.
- Optional historical statistics, notifications, satellite layers, and explanatory AI summaries (only if justified).

## 3. Core experience and information architecture

### Desktop — command center

- **Top bar:** STORM CHASER / WESTERN NORTH PACIFIC, monitoring state, last successful check, language switch, source-status access.
- **Primary center:** large integrated MapLibre map. It remains the visual and interaction focus.
- **Peripheral source stations:** CWA / JMA / JTWC cards with agency name, chart preview or link, bulletin issue time, retrieval status, and track visibility toggle. On wide screens, arrange around or alongside center; never shrink the map to insignificance.
- **Storm rail/list:** all active systems, selected storm, Auto/manual focus control, rationale for prioritization.
- **Detail strip/panel:** agency-specific positions, valid times, intensity and units, warnings (official only), comparison legend, source links.
- **Status footer/drawer:** data coverage, source failures, update delays, disclaimer, methodology.

### Mobile

Map-first view; storm selector and priority explanation above/below map; agency charts in accessible tabs/accordion; details in collapsible sheet. No horizontal overflow or tiny illegible maps. Retain access to original charts and source status.

### Primary interactions

1. Open app -> see regional map and current storms, or clear no-storm state.
2. Auto-focus selects a candidate storm for Taiwan; show *why* (e.g., official warning, forecast proximity, approach trend) and confidence/limitations.
3. Select a different storm -> update map and panels without losing access to others.
4. Toggle one or several agencies -> display their forecast lines with distinct patterns and legend.
5. Select a forecast issuance cycle -> avoid mixing mismatched cycles without explicit labels.
6. Open source chart -> original image if permitted or official external page.
7. Switch language -> preserve selection, map extent, and current data.
8. New data arrives -> update panels and map, announce changes unobtrusively; do not unexpectedly recenter while the user is manually exploring.

## 4. Night Operations design system

**Mood:** restrained, precise, atmospheric; a public-information operations center, not a fictional emergency alert.

**Provisional palette (adjust after accessibility review):**

| Token | Example | Usage |
|---|---|---|
| Background | `#090D12` | App shell |
| Surface | `#131A22` | Panels |
| Elevated | `#1B2732` | Active cards |
| Primary text | `#E8EDF1` | Readable data and prose |
| Secondary text | `#A9B6C1` | Metadata |
| Identity red | `#D66A70` | Branding, section labels, accents |
| Divider | `#35414C` | Quiet structure |
| Source track colors | To be tested | Distinct hues **and** dash/marker patterns |

**Critical:** do not use decorative red as the sole signifier of hazard. Official warning states require text, iconography, source and issued time, with a differentiated semantic treatment. Do not equate an internally calculated relevance rank with an official alert.

Typography: crisp sans-serif body, optional restrained monospace for coordinates/timestamps. Minimum readable text sizes, adequate contrast, visible keyboard focus, reduced-motion support, no flashing or theatrical alarms. Use UTC internally and display local times with explicit zone (Asia/Taipei by default).

## 5. Source feasibility gate — BEFORE promising live functionality

Candidate providers:

- **Taiwan CWA:** official Taiwan-specific typhoon advisories, warnings, tracks, open-data APIs. Audit exact dataset identifiers, API key policy, forecast geometry, license, cadence, and historical retention.
- **JMA / RSMC Tokyo:** western North Pacific forecast products. Audit machine-readable format, download mechanism, issuance cadence, redistribution terms, and original-chart availability.
- **JTWC:** additional forecast perspective. Audit current public access, automated retrieval permission, track format, archive access, and reliability; do not assume a stable public JSON API.
- **IBTrACS:** possible future historical best-track reference; **not** a live forecast substitute. Audit update/versioning and verification limitations.

For **each** provider, create a source-adapter dossier with: official URL; authoritative product; terms/license; authentication; sample payload; update frequency; storm ID/naming; issuance and valid timestamps; track coordinate convention; units and wind averaging period; advisory revision behavior; original image/embed policy; archive availability; fallback/error behavior. Record verified facts and evidence links. Do not scrape restricted pages or bypass anti-bot mechanisms. Prefer documented HTTPS APIs and permitted feeds; use website extraction only where explicitly allowed and stable enough.

**Exit gate:** at least one live, legally usable, machine-readable track source must be proven end-to-end for initial operational map; at least two independent forecast-track feeds are needed to claim working cross-agency comparison. Source-card placeholders must not be presented as live.

## 6. Architecture

```text
Official feeds / permitted chart assets
       |       |       |
   Source adapters (independent failures)
       | fetch, parse, schema validation
       v
  Normalization + provenance + deduplication
       | immutable raw payload metadata / hashes
       v
  Forecast archive + latest-current materialized view
       |                    |
       v                    v
  Read-only app API       Health/status endpoint
       |
       v
  Static web frontend (MapLibre GL JS)
  map / source charts / storm focus / bilingual UI
```

**Suggested implementation:** TypeScript frontend + MapLibre GL JS; scheduled Cloudflare Workers (or equivalent serverless jobs) for collection; D1/PostgreSQL or comparable store for snapshots; object storage if raw payloads/charts need larger retention. GitHub Pages can host a static frontend separately from the data API, subject to CORS/security configuration. Select exact hosting only after feed and cost review. Do not assume scheduled jobs run at exact wall-clock times.

**Polling:** choose per source based on documented cadence and rate limits; 10–15 minutes is an initial hypothesis, not a guaranteed SLA. Use ETag/Last-Modified where supported, content hash and advisory identifiers, and retries with backoff. Polling time is not publication time.

**Secrets:** server-side only; never expose API keys in client bundles. HTTPS; strict CORS; rate limits; no unauthorized database access. Avoid storing personal data; local language preference is fine.

## 7. Canonical data contracts

Keep raw records and normalized objects separately. Suggested minimal schema:

```ts
type Source = 'CWA' | 'JMA' | 'JTWC' | string;
type Storm = {
  id: string;                  // internal stable ID
  basin: string;
  names: Record<string,string>;
  externalIds: Record<Source,string>;
  lifecycle: 'active'|'inactive'|'unknown';
  updatedAt: string;
};
type Advisory = {
  id: string; stormId: string; source: Source;
  sourceAdvisoryId?: string;
  issuedAt: string;            // source issue time, UTC ISO-8601
  retrievedAt: string;         // collector time, UTC ISO-8601
  revision?: string;
  contentHash: string;
  sourceUrl: string;
  rawPayloadRef?: string;
};
type ForecastPoint = {
  advisoryId: string;
  validAt: string;             // predicted time, UTC ISO-8601
  latitude: number; longitude: number;
  leadHours?: number;
  wind?: { value: number; unit: string; averagingPeriod?: string };
  pressure?: { value: number; unit: string };
};
type SourceHealth = {
  source: Source;
  lastCheckedAt?: string;
  lastSuccessAt?: string;
  lastIssuedAt?: string;
  state: 'ok'|'stale'|'unavailable'|'unknown';
  message?: string;
};
```

Cross-agency storm matching must not rely on storm name alone. Reconcile agency IDs, basin/season, spatial-temporal continuity, and explicit ambiguous-match handling. Preserve agency-native naming, storm categories, wind conventions, forecast uncertainty products, and missing values. Never silently interpolate official positions or convert incompatible intensity scales without labeling methodology.

**Idempotency:** unique key by source + storm + advisory ID/revision or verified content hash; identical polls do not duplicate. Corrections with same issue time but different content must be archived as revisions. Older advisories must not displace newer valid current views. On source failure, retain last-known records marked stale; never silently present as fresh.

## 8. Taiwan relevance and auto-focus

**Intent:** prioritize potential future relevance, not nearest-center distance. This is an attention-ranking aid, **not** a danger rating or independent impact forecast.

Priority inputs, in approximate order:

1. Active official Taiwan warning/advisory associated with the storm (strongest signal).
2. Forecast track and published uncertainty/impact footprint intersecting or approaching Taiwan's defined area of interest.
3. Forecast time to closest approach / potential impact window.
4. Forecast trend and motion: approaching vs receding; intensity as *reported*.
5. Data recency, confidence, completeness and agency disagreement.

Implementation should use deterministic, documented rules and source-backed thresholds determined during feasibility. Do **not** fabricate quantitative probabilities or declare a storm safe. A distant approaching storm may outrank a nearer departing storm. Avoid thrashing between two similar candidates: add hysteresis and preserve manual focus until user returns to Auto. When signals are insufficient or contradictory, show 'Priority uncertain' and allow user selection. When no storms exist, select none.

Provide visible **Why this storm?** explanation with source and timestamp. Store country as an internal parameter (`countryOfInterest='TW'`) for future extensibility, but do not expose unimplemented country options in production v1.0.

## 9. Forecast map semantics

- Display **observed current position**, **forecast positions**, and **past observed track** as distinct objects when available.
- Agency tracks have consistent identity colors and distinct line patterns; toggles and accessible legend.
- Show issue time per agency and valid time for forecast point, with optional lead-hour labels.
- Forecast uncertainty cones/areas only if the source provides them and the representation is understood; never draw invented cones.
- Avoid implied consensus path or average track unless explicitly developed, justified, and labeled as a separate derived product.
- Compare agencies only with explicit cycle differences; warn when forecast issuance times are not aligned.
- Original charts: official asset + attribution + issued time, or link fallback. Do not use cross-origin iframe embedding without checking permission and technical compatibility.
- Empty/stale/missing data should be represented truthfully, not replaced with a dramatic illustrative typhoon.

## 10. Localization

Locale identifiers: `en`, `zh-TW`. Externalize all UI strings, status explanations, legends, error messages, source attribution, and accessibility labels. Store locale locally; switch without page reload or state loss. Use official agency names as proper nouns, with localized display aliases. Do not silently machine-translate official advisories and pass them off as authoritative. Dates use explicit timezone and locale conventions; wind/pressure units must remain labeled. Test long Traditional Chinese strings and mixed Latin/numeric typography.

## 11. Test strategy — no need to wait for a typhoon

**Three levels:**

1. **Mock feed contract tests:** new storm, revised track, duplicate, corrected same-timestamp advisory, late/out-of-order advisory, malformed coordinates, missing fields, source timeout, rate limit, key failure, source recovery, simultaneous storms, storm identity ambiguity.
2. **Historical replay:** feed real archived advisories chronologically at accelerated time through the **same** parsers and normalization path as live collection. Verify active/inactive lifecycle, relevance ordering, overlays, archive retention and time semantics. If historical forecast data cannot be licensed/obtained, use explicitly labeled synthetic fixtures for pipeline tests and report the limitation.
3. **Live integration observation:** verify documented endpoints, credentials, empty-storm response, scheduled job execution, source freshness and retrieval logs. Observe at least one real changed payload when available; do not claim live update behavior was empirically witnessed before it happens.

**Security boundary:** staging/test storage, URLs, keys and banners are distinct from production. Synthetic storms must never enter production. CI runs unit, adapter contract, UI/browser, accessibility, and deployment smoke tests.

### Release acceptance checklist

- [ ] Source dossiers and usage permissions recorded; production claims match verified feed capability.
- [ ] Map works on desktop/mobile and with keyboard; source legends remain legible.
- [ ] New simulated storm appears **without app redeployment**.
- [ ] Changed simulated forecast updates **without app redeployment**.
- [ ] Duplicate/corrected/out-of-order advisories handled correctly.
- [ ] Two simultaneous storms ranked by relevance, not simply distance; manual override persists.
- [ ] Source outage does not break other feeds; staleness visible.
- [ ] Active storm retirement preserves permitted historical records.
- [ ] CWA/JMA/JTWC source cards accurately show live, unsupported, or unavailable states.
- [ ] Both locales cover every user-facing state; switching retains selection.
- [ ] No simulated data or unsupported hazard conclusions in production.
- [ ] Scheduled collection, retries, logs, secret handling and recovery tested.
- [ ] Clear links to official warnings and prominent non-official disclaimer.
- [ ] Owner reviews live release candidate and explicitly approves deployment.

## 12. Implementation milestones for Codex

**M0 — Source feasibility and evidence (mandatory first).** Investigate authoritative feeds, sample data, licenses, archive formats and original charts. Produce `docs/sources/` dossiers, verified example payloads, gaps, and go/no-go recommendation. Do not implement imaginary API endpoints.

**M1 — Visual proof of concept.** Build responsive Night Operations shell and MapLibre map using clearly labeled fixtures. Integrated map central, original-source stations peripheral, storm list, bilingual controls. Provide screenshots and local preview instructions. Seek design review.

**M2 — Data pipeline.** Implement one real source adapter end-to-end, canonical model, deduplication, archive, health API, scheduled refresh, staging environment. Test with mock/replay feeds.

**M3 — Multi-source comparison and relevance.** Add independently verified adapters, multi-agency track toggles, chart link/embed handling, Taiwan relevance engine, manual selection, stale/failure UI. Report unsupported sources honestly.

**M4 — Production readiness.** Accessibility, bilingual coverage, security, monitoring, cost/retention, deployment/rollback, end-to-end tests, documentation and release candidate. **Do not publish without explicit approval.**

**M5 — Post-release observation.** Verify real collection cadence, monitor feed changes, fix source drift, confirm real storms automatically appear when they occur. Preserve release evidence.

**Later:** Showdown and Time Travel only after forecast archive availability, comparability, and historical-reference methodology are proven.

## 13. Delivery expectations

Codex should return:

- Repository structure and reproducible local setup instructions.
- Source feasibility report with direct official links and clearly marked verified/unverified claims.
- UI preview screenshots for desktop/mobile, including no-storm, multi-storm, outage and bilingual states.
- Automated test report, known gaps, and production-readiness checklist.
- Architecture/data-model documentation, operating costs, secrets setup, backup/retention, monitoring and rollback instructions.
- Release candidate and exact commit SHA; **never silently deploy**.

### Initial Codex handoff

> Implement Storm Chaser according to `Storm_Chaser_Design_Guide_v1.0.md`. Begin with **M0 source feasibility** and **M1 visual proof of concept**. Verify real official data formats, access and reuse rights before coding integrations; do not invent endpoints. Preserve the central command-center map, original source panels, bilingual EN/zh-TW support, Taiwan-first explainable relevance selection, and dark Night Operations styling. Use labeled fixtures only in development. Return a source audit, screenshots, runnable preview, and risks for review. Do not deploy or modify unrelated repositories without approval.

---

**Version policy:** v1.0 records approved product requirements and proposed engineering choices; any unverified agency access, hosting costs, relevance thresholds, and embed permissions remain explicit implementation gates rather than asserted facts.
