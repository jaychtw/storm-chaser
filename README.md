# Storm Chaser

**v1.0 — JMA-first Experiential Cyclone Viewer.** An owner-accepted bilingual local-first software baseline (`1.0.0-rc.1`, private/unpublished) for exploring official JMA information geographically and through discrete published forecast times. Night Operations identity, map-first mobile, native values, source evidence and honest data states. No independent warning/forecast or production-readiness claim.

## Frozen scope and acceptance

- [Closure record v1.0 — local software accepted, 2026-10-29](docs/v1/closure-v1.0.md)
- [Lifecycle retrospective](docs/v1/lifecycle-retrospective.md) · [consolidated standards proposals](docs/proposals/closure-standards-handoff.md)
- [V1-F verification, acceptance matrix, measured performance and limitations](docs/v1/verification.md)
- [Owner-approved scope ADR v1.0](docs/adr/0004-v1-scope-freeze.md) · [approved GDD amendment](docs/amendments/design-guide-v1.0.3-scope-freeze.md)
- [Deferred capabilities and reopening criteria](docs/v1/deferred-capabilities.md)
- [PROJECT_STATE.md](PROJECT_STATE.md) · [V1-F authorization](docs/briefs/v1-f-authorization.md)
- [Final desktop EN](docs/screenshots/v1f/desktop-en-current.png) · [Final mobile zh-TW](docs/screenshots/v1f/mobile-zh-TW-current.png)

Forecast-Time Explorer is accepted into the frozen product scope. Auto remains a neutral uncertain regional overview; choose a storm manually. Taiwan ranking, CWA/JTWC, comparisons, history/Showdown, precise proximity/impact and additional perspectives are deliberately deferred. They are not claimed implemented or treated as frozen-scope defects.

## Install and review locally

Tested Linux, Node 24.19.0/npm 11.9.0; Node 24.x/npm 11.x supported. WebGL Chromium/browser and a graphical display for headful review. No API key, tile subscription or new account needed.

```sh
npm ci --no-audit --no-fund
npm test
npm run build
npm run preview -- --port 4183 --strictPort
```

In another terminal, for **frontend-only labeled saved-source replay**:

```sh
PREVIEW_URL=http://127.0.0.1:4183 npm run review:local
# Headless/cloud smoke:
PREVIEW_URL=http://127.0.0.1:4183 npm run review:local -- --smoke
```

No API/collector/database is needed for replay. The isolated browser freezes Date at the saved specimen's time, blocks external requests and shows NOT CURRENT WEATHER. Synthetic demo fixtures remain separately labeled under `?mode=demo`; normal JMA mode never substitutes them. Close the review browser and Ctrl+C your frontend to stop.

For **actual JMA-backed local operation**, [follow the complete guide](docs/v1/local-operation.md): `npm run api` starts a loopback **read-only reader**, with **no embedded collection timer**. Real one-shot collection remains an explicit operator command. Source polling, archive/retention and configuration limitations are documented; no unattended service is authorized or activated by V1-F. Never promise continuous operation from an ephemeral workspace.

## Verify and recover

With the loopback frontend running:

```sh
PREVIEW_URL=http://127.0.0.1:4183 npm run test:browser
PREVIEW_URL=http://127.0.0.1:4183 npm run test:live-browser
PREVIEW_URL=http://127.0.0.1:4183 npm run test:product-browser
PREVIEW_URL=http://127.0.0.1:4183 npm run test:explorer-browser
PREVIEW_URL=http://127.0.0.1:4183 npm run test:finalization-browser
npm run verify:package
```

Browser suites use saved official specimens/controlled cases. `verify:package` uses temporary archives and a temporary local reader; no weather source requests or live archive writes. Against a deliberately chosen existing archive, `npm run verify:archive` checks integrity/provenance without retention pruning; `npm run backup` creates verified online snapshots. Use the [backup/restore guide](docs/v1/local-operation.md), [troubleshooting](docs/v1/known-issues.md) and [service-readiness separation](docs/v1/public-service-readiness.md).

## Evidence and boundaries

[Historical Guide v1.0](docs/Storm_Chaser_Design_Guide_v1.0.md), [source dossiers](docs/sources/m0-completion.md), [datum audit](docs/m3-datum-audit.md), [M3-O](docs/m3-verification.md), [M3-P](docs/m3p-verification.md), [M3-E](docs/m3e-review.md) and [architecture](docs/adr/0001-jma-operations.md) retain original rationale. Latest approved scope is ADR 0004; old unfinished goals are explicit deferrals now.

**$0 new expenditure.** No public release/preview, hosting/service activation, real collection, main merge or deployment performed by V1-F. The owner has finally accepted the local-first software baseline at `475dd767d6c18544996b4b9f0204b39dc8c01e3c`; the current lifecycle is **CLOSED**. Package version and accepted product code remain unchanged. Public release/publication, main merge, deployment, service activation, live collection and expenditure remain unauthorized. The [closure record](docs/v1/closure-v1.0.md) separates that acceptance from unverified public operation and optional enhancements. Standards recommendations remain proposals; no next implementation cycle is authorized.
