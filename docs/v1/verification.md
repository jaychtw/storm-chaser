# V1-F — frozen software candidate verification and acceptance gate

Date: 2026-10-29 Asia/Taipei. Package **1.0.0-rc.1**, private/local-first. **Software candidate prepared for owner acceptance; no public release or service-readiness claim.** Development branch: `development/v1-f-finalization`. Baseline: `129a3af3a13e882d8d92bcfd0360fdfa83b01cf7`. Implementation revision: **recorded in the final revision entry before handoff**; [verification metadata](verification.json) contains tested-file hashes and the final handoff supplies the exact delivery SHA.

Authority: [V1-F owner assignment](../briefs/v1-f-authorization.md), [versioned scope ADR](../adr/0004-v1-scope-freeze.md), [approved GDD amendment v1.0.3](../amendments/design-guide-v1.0.3-scope-freeze.md), AICP 1.1.0 at `cb74fe9497d07370f44a18a09fec124ab99848ec`. Original guide, source evidence and M3-O/P/E reports remain historical records. Separate ChatGPT Project conversations were not retrieved.

## Completion state

| Gate | State |
|---|---|
| Product identity / feature scope | Owner-approved JMA-first Experiential Cyclone Viewer; experience-first philosophy and Forecast-Time Explorer accepted into v1.0. |
| Deliberate deferrals | Recorded in [register](deferred-capabilities.md), with reopening conditions. Not implemented and not failures against frozen v1.0. |
| Integrated software / supported local package | Implemented, tested and reproducible on the stated existing Linux environment, with limitations below. |
| Owner software/release acceptance | **Pending V1-F review**. Feature acceptance does not supply this gate. |
| Public-service operation / deployment / main merge | **Not authorized; operational checks unverified**. Separate [readiness checklist](public-service-readiness.md). |

## Finalization changes

- Adopted frozen scope, accepted M3-E feature and versioned experience amendment; removed obsolete POC wording from the accepted interaction and local viewer identity. Existing synthetic demonstrations remain explicitly labeled.
- Consolidated marker/list/Explorer selection into one source-record resolution path. All routes preserve exact point identity, native lead/valid time, source attribution and local eligibility. No interpolated geometry, motion animation, new forecast, relevance algorithm or intensity conversion.
- Added defensive validation before a local API JSON reply can replace last-known data. Demonstrated malformed shape/JSON no longer causes an interface failure; invalid local information is explained distinctly, cached records are not renewed, and parent expiry still removes them.
- Made API startup always read-only, with no embedded collector timer. Frontend/API defaults bind loopback. One-shot collection and existing inactive scheduling assets remain available. No owner environment configuration was persisted/changed.
- Added a non-pruning `verify:archive` CLI that requires an existing archive. Maintenance now exits nonzero on non-OK integrity as well as provenance failure. A malformed materialized head produces API 503 without killing the reader; recovery after repair is verified in isolated test storage. This is not a promise that arbitrary damaged database files can open or repair themselves.
- Added Node/npm specifications, candidate version, install/start/stop/configuration, demonstration vs JMA operation, backup/restore and troubleshooting guides. No dependency versions, database schema, storage policy, architecture, provider or framework changed.

The original detailed forecast readout and nearby Explorer remain intentional alternate inspection contexts; they share one selected source record and formatter. No broader progressive-disclosure redesign was added during finalization.

## Executed tests and reproducibility

Environment: Linux Debian 13, Node **24.19.0**, npm **11.9.0**, Chromium **154.0.8037.57**, software WebGL, built-in Node SQLite. Isolated source/data directories and browser request interception; **no real weather collection or live archive writes** this cycle.

| Check / command | Observed result |
|---|---|
| `npm test` | **131 passed, 0 failed/skipped**, six files. Original 110 retained; 21 finalization cases cover snapshot rejection, authoritative point resolution and supported port configuration. |
| `npm run build` | TypeScript and Vite pass; existing large-bundle warning retained and characterized below. |
| `npm run test:browser` | Existing demo regression passed; 7 axe scans, zero violations. [Evidence](../v1f-demo-browser-results.json). |
| `npm run test:live-browser` | Saved-source UI/pipeline regression passed; 5 axe scans, zero violations. [Evidence](../v1f-pipeline-browser-results.json). |
| `npm run test:product-browser` | 25 M3-P acceptance groups passed; 16 axe scans, zero violations. [Evidence](../v1f-product-acceptance-results.json). |
| `npm run test:explorer-browser` | 25 Explorer checks passed; 13 axe scans, zero violations; current candidate replay screenshots. [Evidence](../v1f-explorer-results.json). No new baseline comparison was claimed in this finalization run; original M3-E pairs are preserved. |
| `npm run test:finalization-browser` | **12 finalization checks**, 12 axe scans, zero violations; **12 final screenshots** in both languages/desktop/mobile. [Evidence](browser-finalization.json). |
| `npm run verify:package` | **5 isolated API/backup/restore checks** passed. Reader starts with no collector invocation, correct GET-only/status/cache behavior; malformed head returns 503 and can recover; online backup/new-directory restore preserves raw bytes; damaged provenance fails verification/backup; absent archive is not created to claim success. [Evidence](package-verification.json). |
| Fresh `npm ci --offline --no-audit --no-fund` | Succeeded in an isolated source export with no prior dependencies/dist/live data. All **131 tests** and build passed there. Every generated asset was **byte-identical** to the working build. [Evidence](clean-install.json). |
| Fresh-install `npm run review:local -- --smoke` | Passed against its own temporary loopback frontend. Source is browser-only frozen replay with persistent NOT CURRENT WEATHER banner; no API/collector. |
| Fresh `npm ci --omit=dev --offline --no-audit --no-fund` then `npm run verify:package` | Production-only runtime passed the same **5 checks**, separately from the normal full local frontend install. [Evidence](clean-runtime-verification.json). |

Total browser audits: **53 scans, zero reported violations**. This is automated/emulated evidence, not screen-reader, physical-device, owner visual/release acceptance or human comprehension certification. Screenshots use actual running UI with saved official specimens and controlled cases; their labels identify replay. Source issue/valid/retrieval times remain source-backed, while replay time is explicit.

Tests ran against the candidate working tree; file digests tie those files to the implementation revision recorded before handoff. Remote CI is not claimed. The workflow supports the new checks, but delivery commits use `[skip ci]` to avoid activating remote jobs under the $0 constraint. Temporary loopback frontends/readers are stopped at delivery.

## Frozen v1.0 acceptance matrix

| Frozen requirement | Software verification status | Evidence / limitation |
|---|---|---|
| WNP/South China Sea interactive map | Pass on tested environment | Actual MapLibre renders, pan/zoom/reset, map-first view, WebGL fallback. Physical devices unverified. |
| JMA analyzed and forecast positions | Pass for supported source family | Saved source/23 official example and normalization regressions; exact plotted coordinates and analysis/prediction distinction. Approximate datum interpretation remains visible. No fresh source availability claim. |
| Manual selection / neutral Auto | Pass | Zero/one/multiple candidates, no speculative priority, retirement, explicit return to Auto and recovery. Ranking deliberately deferred. |
| Forecast-Time Explorer | Pass | Accepted feature, exact irregular horizons and gaps, marker/list/timeline synchronization, keyboard/mouse/touch, stable camera/focus, no simulation/interpolation. |
| Native motion/intensity/other validated fields | Pass for supported mappings | Native units/types, ten-minute maximum wind vs gusts, direction/speed, missing/unknown values and source provenance retained. No incompatible conversions. |
| EN / zh-TW | Pass for exercised flows | Localized navigation, field/source-state/time explanations; unknown native terms labeled; original prose not passed off as authoritative translation. Full future vocabulary not asserted. |
| Night Operations / responsive map-first | Pass for implemented frozen design | Previously accepted visual direction, current bilingual captures/320–1440px checks. Final software acceptance and real-device checks remain owner tasks. |
| Attribution / provenance / original links and chart fallback | Pass | Fixed official bulletin links, content-addressed raw records, selected-advisory source context, labeled external-page fallback. No copied chart asset/embed claim. |
| Current/stale/expired/unavailable/partial states | Pass | Parent validity, >8h stale/>24h expiry, individual points, API outage/resume, malformed local reply, quarantine/partial coverage and no clear-basin inference. |
| Local collection/archive/retention/recovery capabilities | Pass in bounded local software tests | Existing collector contracts/lease/cursor/corrections/retention/backup tests and actual CLI restore smoke; API has no implicit polling. New real collection, scheduling, host-loss recovery and uptime not verified. |
| Installation/configuration/start/stop | Pass on tested Linux/runtime | Fresh cached install, tests/build, matching assets, isolated review smoke, production-only API runtime; Node/npm pinned and API/proxy port aligned. Other OS/browser combinations unverified. |
| Available local security/dependency checks | Completed with explicit limits | Locked graph unchanged; fixed origin/GET-only/escaping/JSON boundary/TLS/SQL/provenance checks. Offline audit zero is not fresh advisory clearance. |
| Bundle-size assessment | Completed; warning retained | Local and constrained measurements below; no framework rewrite or unmeasured optimization. |
| Public operation/release | Not authorized / unverified | Separate readiness checklist, not a feature-completion claim. |
| Ranking, additional sources/comparison, history/Showdown, precise impacts, more perspectives | **Deferred by owner** | [Register](deferred-capabilities.md), not software defects or silently completed functionality. |

## Bundle warning: measured effect and decision

[Measurements](performance.json) used two fresh browser contexts per profile against loopback preview, with saved-source API interception and software WebGL. JS **1,007,265 bytes** (gzip **277,892**), CSS **89,885** (gzip **14,726**), vendored geography **838,726** bytes. Preview resource entries show actual local delivery; gzip values are computed representation sizes, not a claim that preview enables HTTP compression.

| Profile | Map ready from navigation | Next-step automation wall time |
|---|---|---|
| Local desktop, unthrottled | **1.18–2.23s** | **132–425ms** |
| Simulated 4× CPU /100ms latency/1.6Mbit/s, 390px | **7.48–8.27s** | **260–280ms** |

These small samples include software rendering and Playwright action/scroll overhead; they are not a device benchmark or SLA. MapLibre/geography dominate startup. The supported same-host local path showed no demonstrated blocking interaction failure. The constrained profile identifies a future network/device cost; no agreed public-device budget exists. **Retain and disclose the warning**, keep the current framework, and evaluate compression/device/edge choices only if a future delivery target requires them. No warning threshold was raised to hide the result.

## Static/local security and dependency review

[Security record](security.json): all **150 locked dependency package records unchanged** except root candidate metadata/engines; installed runtime dependency resolution succeeded. Direct runtime license metadata: fast-xml-parser MIT, MapLibre BSD-3-Clause, tsx MIT. Existing dependency/source notices remain applicable; no project license is invented by finalization.

`npm audit --offline --json` exited 0/reported zero vulnerabilities, but **fresh advisory data is not verified**. No registry audit service, external scanner/account or paid dependency was activated. No automatic audit fix/version upgrade was performed without evidence. Available checks cover loopback/default startup, GET-only API/no arbitrary proxy, shared source URL allowlist, XML/entity/encoding/unit/date/coordinate regressions, escaped/textContent source output, browser snapshot rejection, prepared SQLite/provenance/backup and inherited curl TLS/proxy. This is not an independent penetration test or a public-host security clearance. CSP/TLS/edge/CORS/rate-limit/host patching and current advisory review remain separate unverified service/release checks.

## Final visual evidence and local review

- [Desktop EN current](../screenshots/v1f/desktop-en-current.png) · [Desktop zh-TW current](../screenshots/v1f/desktop-zh-TW-current.png)
- [Mobile EN current](../screenshots/v1f/mobile-en-current.png) · [Mobile zh-TW current](../screenshots/v1f/mobile-zh-TW-current.png)
- [Desktop EN malformed API/stale](../screenshots/v1f/desktop-en-invalid-api-stale.png) · [Mobile zh-TW malformed API/stale](../screenshots/v1f/mobile-zh-TW-invalid-api-stale.png)
- [Desktop EN expired](../screenshots/v1f/desktop-en-expired.png) · [Mobile zh-TW expired](../screenshots/v1f/mobile-zh-TW-expired.png)

[Install/operate/stop/backup/restore instructions](local-operation.md) distinguish frontend-only controlled replay from explicit real local JMA operation. Headful review requires a graphical desktop; headless smoke was executed in the clean install. No weather credentials or external account required for the verified source. All test stores are isolated from `.local/live`.

## Remaining limitations and owner gate

The frozen software candidate is ready for owner acceptance review with the documented limits: current JMA reachability/publication changes not re-observed this cycle; finite supported schema/datum/history, same-control/same-URL anomalies; fresh vulnerability status, independent human/screen-reader/physical-device review; real scheduling/reboot/soak/host-loss/off-host restore and public edge/security/rollback. The **separate service checklist is not passed**. Deferred capabilities are recorded accurately and do not enlarge the chosen v1.0 package.

No expenditure, external account/hosting activation, unattended collection, public preview/deployment, release/tag or main merge occurred. [Retrospective](retrospective.md) proposes consequential lessons only; governing standards are unchanged. **Stop at product-owner software acceptance.** No next development cycle or public deployment follows automatically.
