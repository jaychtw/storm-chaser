# M3 verification report and review gate

Date: 2026-10-29, Asia/Taipei. **M3 implementation and local verification are complete for review. No public deployment, host-service activation or production-readiness claim.** JMA remains primary. CWA and JTWC remain deferred and were not accessed or bypassed in this hardening pass.

## Outcome

The file-index prototype has been hardened into a SQLite/WAL archive with persistent scheduling/backoff, crash leases, bounded history, raw byte provenance, source validation, backup/restore tools and separate API/collector operation. The Night Operations interface and mobile map-first flow remain intact. The datum issue is now an explicit source/plotting contract with an unsupported-datum guard; it has **not** been mislabeled as an authoritative EPSG identity.

Read the [datum audit](m3-datum-audit.md), [architecture decision with costs](adr/0001-jma-operations.md), and [operations runbook](m3-operations.md).

## Executed checks

| Check | Observed result |
|---|---|
| Unit/pipeline/storage suite | **72 passed; 0 failed/skipped** across three test files |
| TypeScript + Vite build | Passed; known large MapLibre bundle advisory remains |
| Official published XML examples | **23 JMA examples** parsed, across versions `1.0_0`, `1.0_1`, `1.0_2`, including real example corrections/formation/terminal structures |
| Actual source archive | **105 normalized official bulletins**, one current system at capture; counts are observations, not fixed expectations |
| Non-destructive M2 migration | **46 imported, 0 failed**; original files preserved |
| SQLite integrity and raw/snapshot provenance | `integrity_check=ok`; **105 checked, zero hash failures** |
| Crash/restart | Child process killed inside a write transaction; committed data and integrity recovered. Scheduling/backoff persisted across reopen; an expired lease can be replaced without old-owner state writes |
| Backup/restore | Online consistent backup reopened with matching source bytes and snapshot; actual archive backup command completed and rotation is implemented |
| Production dependencies only | Clean `npm ci --omit=dev` in a temporary directory; Node/tsx/SQLite/parser smoke passed without weather requests or touching live storage |
| API reader / separate actual collector | Current source data remained readable; a due collection committed fresh health and a durable next-attempt cursor |
| Demo browser regression | Passed, 7 axe scans with no violations |
| Official-specimen UI replay | Passed, 5 axe scans with no violations; source update preserves manual selection/camera, locale and live/demo separation |
| Actual JMA desktop/mobile | Real API-to-map capture passed; desktop English and mobile Traditional Chinese screenshots retained |
| Unattended host assets | `systemd-analyze verify` passed; timer calendar parsed. **Not installed/enabled or tested on a systemd host** |

Evidence: [storage/migration/provenance](m3-storage-evidence.json), [production runtime smoke](m3-runtime-check.json), [actual integration](m3-live-integration.json), [controlled browser replay](m3-browser-results.json), [source specimen manifest](sources/evidence/m3-official-samples/manifest.json), [new document hashes](sources/evidence/m3/documents.json). Automated accessibility scans are not a full manual accessibility certification or physical-phone test.

## Coverage and truthful failure behavior

The tests exercise malformed XML and coordinates, missing IDs/timezones/optional winds, impossible calendar dates, unsupported namespace/unit/datum values, non-operational status, ordinary analysis/forecast/estimate distinctions, native ten-minute wind convention, out-of-order arrivals, duplicate polls, changed/corrected tracks, cancellation of an information unit, explicit validity, expiry, timeout/backoff/Retry-After, source recovery, partial collection and byte-decoding failures. Strict UTF-8 failure preserves original bytes and never normalizes replacement characters as weather.

Published examples are genuine JMA **examples**, not claimed observations of those historical storms or real current correction events. They are explicitly marked `inputKind=official-example` and live storage rejects them. Controlled mutations of the real specimen remain tests in isolated temporary storage. Actual live collection never substitutes those files or demo storms. The actual integration capture is independent of replay clock/response interception.

Retention tests cover separate feed/body lifetimes, snapshot expiry, metadata-only ordering tombstones, pressure trimming, integrity/provenance detection and backup reopening. A persistent local body budget blocks collection before runaway traffic, separately from JMA's shared-IP download policy. The API shows stale/unavailable/partial state with last-known data; old forecasts or successful feed retrieval cannot fabricate meteorological freshness. An empty current view does not imply a clear basin.

## Usability review evidence

- [Actual JMA desktop, English](screenshots/m3/actual-collected-jma-desktop.png)
- [Actual JMA mobile, Traditional Chinese](screenshots/m3/actual-collected-jma-mobile-zh.png)
- [Controlled stale view](screenshots/m3/stale-official-specimen-zh.png)
- [Controlled unavailable view](screenshots/m3/unavailable-zh.png)

The map appears before storm/source panels on mobile; details start collapsed. Source issue/control/retrieval and center-valid times remain distinct. The approximate-reference notice is visible by the live map in both languages. Native winds/pressure remain separately labeled; no incompatible intensity aggregation, invented warnings, intermediate forecast points or original-chart claims were introduced. Keyboard selection, responsive overflow and locale persistence pass browser checks. Original chart cards remain official-page link fallbacks.

## Operational limits and release risks

1. **Datum:** omission semantics are verified from JMA's dictionary/schema, but no exact source EPSG/WGS84 realization/epoch is established. Native degrees are plotted on the WGS84 basemap with explicit assumptions. Precise proximity/impact calculations remain out of scope pending authoritative clarification and review. No quantitative datum error is fabricated.
2. **Host validation:** the recommended systemd design is implemented as reviewed assets and local components are tested; real reboot dispatch, long-running host behavior, off-host recovery, public edge/TLS and independent alerts are not verified. No remote infrastructure or cost quote was procured.
3. **Archive scope:** one host/local block filesystem only. SQLite is transactional, not WORM/tamper-proof storage. There is a finite DB/body budget and bounded retention; historical forecasts can be removed earlier under pressure, which is exposed explicitly. Local backups do not solve host loss. The rolling JMA feed cannot reconstruct arbitrary long outages.
4. **Source variants:** scoped approved product versions/examples are covered, not all JMA XSDs and future variants. Unknown inputs are quarantined. Explicit legacy datum requires a separately validated conversion before support. Source-clock anomalies, same-control conflicting hashes and undocumented same-URL mutations remain operator-review cases; serial alone is never used as precedence.
5. **Observation duration:** actual data, a restarted reader, due worker cycles and source hashes were verified locally. This is not a multi-day unattended soak, nor proof of every future source publication/change/correction occurring under supervision.
6. **Independent storm semantics:** default focus is latest JMA bulletin, not an operational Taiwan hazard/relevance engine. Source retirement/expiry is never a safety conclusion. No second-source comparison or agency consensus is available.

## Recommended path to a release candidate

1. Owner reviews M3's datum contract, visual wording, retention policy and the single-host decision. Accept approximate qualitative display explicitly, or require authoritative CRS clarification before proceeding. Do not enable precise impact features on the present evidence.
2. Obtain an actual hosting quote and approve a private staging host/backup destination/monitoring scope. Deploy only after that separate authorization; retain the loopback API and restrictive network/credential settings.
3. On that host, prove service-account permissions, reboot/timer catch-up, hard-stop/lease recovery, budget/disk-full behavior, a fresh-host off-machine restore and independent failure notifications. Run a monitored **48–72 hour staging soak** with at least one genuinely changed source advisory when available. A no-change period is not a failed source test, but must not be mislabeled changed-payload evidence.
4. Complete manual keyboard/screen-reader/touch/contrast checks in both languages, source attribution/legal wording review, security headers/rate limiting, dependency/runtime review, and deployment/rollback rehearsal. Keep CWA/JTWC deferred unless separately authorized and verified.
5. Freeze a release commit and reproducible artifact, record checksums/configuration/cost owner, present the private release candidate and residual risks, then obtain explicit public-deployment approval.

**Stop here for M3 review.** No release commit, public deployment, environment publication or next milestone was performed by this task.
