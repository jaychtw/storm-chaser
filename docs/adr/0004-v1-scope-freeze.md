> Subsequent acceptance (2026-10-29): [closure record v1.0](../v1/closure-v1.0.md) accepts exact baseline `475dd767d6c18544996b4b9f0204b39dc8c01e3c` as completed local-first software. This resolves the historical pending software-acceptance gate below; approved frozen scope and public-release restrictions remain unchanged.

# ADR 0004 v1.0 — frozen v1.0 product and local-first finalization

Date: 2026-10-29 Asia/Taipei. **Owner-approved product scope and V1-F work; software/release acceptance pending.** Authority: [V1-F assignment](../briefs/v1-f-authorization.md). Baseline `129a3af3a13e882d8d92bcfd0360fdfa83b01cf7`. No inferred acceptance of unperformed technical/operational checks.

## Frozen identity and capabilities

**Storm Chaser v1.0 — JMA-first Experiential Cyclone Viewer.** Transform lawfully reusable existing public information through distinctive organization, presentation and interaction. No firsthand/proprietary data procurement or independent forecasting objective.

The frozen product includes the WNP/South China Sea MapLibre map; JMA analyzed/forecast centers; manual selection and neutral uncertain Auto; accepted Forecast-Time Explorer within one current advisory; source-reported motion/intensity/native fields; EN/zh-TW; Night Operations and mobile map-first; source provenance, bulletin links and official-chart page fallback; honest current/stale/partial/expired/unavailable states; local collection/archive/retention/recovery in the existing Node/SQLite architecture.

The owner accepts M3-E's Forecast-Time Explorer for inclusion in this scope. Experience-first philosophy and bounded current-advisory interaction from the proposed M3-E amendment are adopted by the [approved scope amendment](../amendments/design-guide-v1.0.3-scope-freeze.md). This is feature/scope acceptance, not public deployment acceptance.

## Explicit supersession and deferrals

Original Guide v1.0 and ADR 0002 D-001 retained Taiwan ranking as an initial-release objective. **The owner now deliberately defers it from frozen v1.0**, together with CWA/JTWC, multi-agency comparison, historical cycle browsing/Time Travel, Forecast Showdown, precise proximity/impact and additional perspective/disclosure features. See the [deferred register](../v1/deferred-capabilities.md) for rationale and reopening criteria. They are neither implemented nor bugs/blockers against the frozen scope. Historical rationale is preserved.

## Delivery and technical choices

Conservative delivery: a local-first software package on existing authorized resources, versioned `1.0.0-rc.1` pending owner acceptance. No GitHub release/tag, registry publication or deployment. Pin Node 24/npm 11, locked dependencies and a reproducible build. A frontend-only labeled controlled replay is distinct from JMA-backed local operation.

Default API/frontend commands must be safe for local review: loopback binding and a read-only API with **no implicit collector timer**. One-shot collection remains explicit; systemd templates/architecture are retained but not activated. This consolidates the previously recommended separate-reader/collector architecture; it does not remove local collection or authorize unattended operation. No persistent owner environment setting is changed.

Finalization may consolidate point-selection logic, remove obsolete prototype labels and fix demonstrated integrity/interaction defects. It may not add a perspective feature, provider, framework, backend architecture or ranking methodology. Broader UI disclosure remains deferred.

## Gates and restrictions

Keep these states separate: approved product identity → accepted feature scope → verified software checks → software package ready for owner review → owner release acceptance → public-service readiness/deployment approval. A passed local build or accepted feature is not a later gate.

**$0 new expenditure; no paid/free-tier enrollment, billing, hosting/service activation, unattended weather collection, public preview/deployment or main merge.** V1-F work may be committed/pushed only to a dedicated development branch for owner review. Real host/reboot/soak/off-host restoration, physical-device/screen-reader/public-edge checks stay unverified unless specifically evidenced. Shared AICP/UGDS are unchanged.
