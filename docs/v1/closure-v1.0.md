# Closure record v1.0 — accepted local-first software

**Lifecycle status: CLOSED — Local-first v1.0 software accepted.**

| Record | Accepted decision |
|---|---|
| Product | **Storm Chaser v1.0 — JMA-first Experiential Cyclone Viewer** |
| Package version | **`1.0.0-rc.1`**, unchanged; acceptance does not rename the package or publish a release |
| Exact accepted source commit | [`475dd767d6c18544996b4b9f0204b39dc8c01e3c`](https://github.com/jaychtw/storm-chaser/commit/475dd767d6c18544996b4b9f0204b39dc8c01e3c) |
| Owner acceptance date | **2026-10-29, Asia/Taipei** |
| Acceptance authority | Product owner's supplied **“Storm Chaser — Final Project Closure and AICP Retrospective”** assignment: “The owner has explicitly accepted the completed local-first software baseline with its documented limitations.” |
| Closure scope | Documentation and continuity only, on `closure/v1-local-first-acceptance` directly from the accepted commit |
| Continuing restrictions | **$0 expenditure; no public release/publication, main merge, deployment, service activation, external enrollment or live collection authorized** |

Acceptance is final for this development lifecycle and is not conditional on deferred features or public-service work. This record supersedes historical **pending software acceptance** wording in V1-F records; it does not rewrite evidence or authorize release. No version, Git tag or release artifact changes.

## Accepted scope and authority

[Scope-freeze ADR 0004 v1.0](../adr/0004-v1-scope-freeze.md) and [approved GDD amendment v1.0.3](../amendments/design-guide-v1.0.3-scope-freeze.md) govern the frozen features: WNP/South China Sea map; JMA analyzed/forecast centers; manual selection and neutral uncertain Auto; exact discrete Forecast-Time Explorer within the current advisory; native reported motion/intensity and missing values; EN/zh-TW; Night Operations/mobile map-first; attribution/provenance, original bulletin links and official-chart page fallbacks; honest current/stale/partial/expired/unavailable states; bounded local collection/archive/retention/recovery capabilities.

The [original Guide](../Storm_Chaser_Design_Guide_v1.0.md), amendments and ADRs remain preserved; [PROJECT_STATE](../../PROJECT_STATE.md) indexes their lineage. AICP **1.1.0** remains pinned to [`cb74fe9497d07370f44a18a09fec124ab99848ec`](https://github.com/jaychtw/game-development-standards/tree/cb74fe9497d07370f44a18a09fec124ab99848ec); no game-only UGDS adoption or standards update is made.

## Evidence retained, with its original limits

These are **locally reported V1-F results**, not independently rerun/certified at closure. The [report/acceptance matrix](verification.md) and [metadata](verification.json) retain commands, environment and hashes. The accepted commit includes implementation `011a77f7bab741ecc9233d0fc394b2c53d7d9c8e` plus documentation-only revision metadata.

| Existing evidence | Reported outcome |
|---|---|
| Regression tests | **131 passed, zero failed/skipped**; original 110 retained plus 21 finalization cases |
| TypeScript/production build | Passed; known bundle warning retained and measured |
| Browser suites | **Five passed; 53 axe scans, zero reported violations**; bilingual desktop/mobile replay evidence, not physical-device certification |
| Local runtime/backup/restore | **Five isolated checks passed**, including the production-only install; no real owner archive writes |
| Reproducibility | Clean cached offline install, 131 tests/build, byte-identical generated assets and local review smoke |
| Security/performance | Local/static checks and measured startup; offline audit is **not fresh vulnerability clearance** |

Reported environment: Debian 13, Node 24.19.0/npm 11.9.0, Chromium 154.0.8037.57/software WebGL. [Screenshots](verification.md#final-visual-evidence-and-local-review) are labeled replay. Earlier [M3 source observations](../m3-verification.md) remain dated evidence. Closure starts no application tests, build, weather-source requests or collector.

## Remaining limits and optional future work

Qualitative centers only: exact CRS realization, finite schema/vocabulary support, same-control conflicts, same-URL mutations and long source gaps retain documented limits. Archives have bounded retention/pressure trimming; the client cache is not an archive. Expiry or missing data is not a dissipation/clear-basin finding. Client time must be reasonably correct.

The [deferred register](deferred-capabilities.md) remains authoritative: Taiwan ranking, CWA/JTWC, comparisons, historical cycles/Time Travel, Showdown, precise geographic calculations and additional experiences remain unimplemented, without conditioning acceptance. Reopen only with explicit owner direction and the documented prerequisites; accepted design requires material new evidence or explicit owner direction to revisit.

The [local-operation guide](local-operation.md) remains the supported reference. The [public-service checklist](public-service-readiness.md) remains unverified/unauthorized beyond local software acceptance: fresh source/security review, physical devices/screen readers/human comprehension, actual scheduling/reboot/soak/off-host recovery, monitoring and public-edge/rollback. No continuous uptime is promised. Project deployment and portfolio publication are both **not started / not authorized**. Future integration, release, deployment, merge, activation or expenditure requires separate authority; $0 continues.

## Closure verification and handoff

Only Markdown documentation, navigation and this acceptance record may differ from the accepted baseline. Product code, tests, scripts, dependency/version/lock metadata, assets, CI and operational configuration remain identical. Reproduce that boundary from repository root:

```sh
git diff --exit-code 475dd767d6c18544996b4b9f0204b39dc8c01e3c HEAD -- . ':(exclude)docs/**' ':(exclude)README.md' ':(exclude)PROJECT_STATE.md'
git diff --name-status 475dd767d6c18544996b4b9f0204b39dc8c01e3c HEAD
```

Closure checks: **10 Markdown-only changes; 130 relative links/anchors resolved; 24 recorded source/report digests match**. All **58 protected non-documentation Git entries** remain identical to the accepted baseline. These are documentation/identity checks, not new runtime results. Delivery uses `[skip ci]` to avoid activating remote jobs; no remote CI result is claimed.

[Lifecycle retrospective](lifecycle-retrospective.md) and [standards handoff](../proposals/closure-standards-handoff.md) preserve lessons as appropriate; all shared-standard recommendations remain **proposals**. No shared-standard modification/push, merge, release/tag, deployment, service activation, live collection or expenditure occurs. The final handoff supplies the closure commit SHA. **Stop after pushing the documentation branch for review.**
