# Storm Chaser

Bilingual western North Pacific cyclone prototype using verified **JMA XML**, a transactional SQLite archive, and the Night Operations MapLibre interface. M3-E Forecast-Time Explorer is a working interaction POC for owner review, preserving M3-P/O engineering. M3-P visual design is owner-accepted; M3-E acceptance remains pending. It is not an official warning service and is not publicly deployed.

## Review the Forecast-Time Explorer POC

- [Design rationale, actual before/after screenshots, tests and local replay instructions](docs/m3e-review.md)
- [Owner assignment](docs/briefs/m3-e-authorization.md) · [decision status](docs/adr/0003-experience-layer-poc.md) · [proposed GDD amendment](docs/amendments/design-guide-v1.0-m3e-proposed.md)
- [Desktop EN POC](docs/screenshots/m3e/after-desktop-en-plus45.png) · [Mobile zh-TW POC](docs/screenshots/m3e/after-mobile-zh-TW-plus45.png)

For a source-isolated local review, build the frontend and serve it on loopback without an API/collector, then run `PREVIEW_URL=http://127.0.0.1:4183 npm run review:explorer` on a graphical desktop. It supplies clearly labeled, frozen saved-source replay in that browser context only. Use `-- --smoke` for headless verification. See the report for exact commands. No public preview exists.

## Existing JMA development workflow

Requires Node.js 24, npm, curl with normal proxy/CA trust, and a WebGL browser.

```sh
npm ci
npm run build
STORM_EXTERNAL_SCHEDULER=1 npm run api
```

Keep the read API running. In another terminal:

```sh
npm run collect
npm run healthcheck
npm run preview -- --port 4173
```

Open the local address printed by Vite in your own browser. `/api` is proxied to loopback port 8787. The external-scheduler mode intentionally does not poll inside the API; the collector's due/backoff state persists across one-shot runs. For development, `npm run dev -- --port 5173` serves the frontend, and plain `npm run api` optionally provides an embedded timer.

Default storage is ignored `.local/live/storm.sqlite` (`STORM_DATA_DIR` selects another directory). M2 file archives are imported non-destructively and preserved. Synthetic demos and official published examples never seed live storage. JMA is the only integrated source; CWA/JTWC remain deferred. Live Auto is a neutral regional overview: Taiwan relevance cannot yet be ranked, even when only one storm is available. Select a storm manually to inspect its reported forecast. Expiry is enforced locally during API outages; it is not a dissipation or safety conclusion.

## Verify and maintain

```sh
npm test
npm run build
# With the frontend running:
npm run test:browser
npm run test:live-browser
npm run test:product-browser
npm run test:explorer-browser
# Actual live data, no replay substitution:
node scripts/capture-live.mjs
# Local archive maintenance:
npm run maintenance
npm run backup
```

Browser checks use system Chromium, `CHROMIUM_PATH`, or Playwright Chromium. `PREVIEW_URL` selects a local preview. Tests/replay use isolated data. The capture script requires real currently usable JMA data and fails rather than injecting fixtures. Use `npm run reprocess` only to inspect quarantined saved bytes after a supported parser fix.

## M3-P review materials

- [M3-P verification and acceptance matrix](docs/m3p-verification.md)
- [Approved authorization](docs/briefs/m3-p-authorization.md) · [decision dispositions](docs/adr/0002-product-reconciliation-proposed.md) · [guide amendment](docs/amendments/design-guide-v1.0-m3p.md)
- [Project state / handoff](PROJECT_STATE.md)
- [Desktop EN replay](docs/screenshots/m3p/desktop-en-manual-current.png) · [Mobile zh-TW replay](docs/screenshots/m3p/mobile-zh-TW-auto-uncertain.png)

M3-P browser checks use isolated saved-source/controlled replay, not current weather. Run them against a local built preview without an API/collector; they intercept/abort `/api/live`. The optional actual-data and archive commands above are separate from M3-P verification and were not executed this cycle.

## Preserved M3-O evidence

- [Verification report and release-candidate path](docs/m3-verification.md)
- [Architecture decision, hosting requirements and planning costs](docs/adr/0001-jma-operations.md)
- [Datum audit and display limitations](docs/m3-datum-audit.md)
- [Operations/recovery runbook](docs/m3-operations.md)
- [Actual desktop](docs/screenshots/m3/actual-collected-jma-desktop.png) · [Actual mobile zh-TW](docs/screenshots/m3/actual-collected-jma-mobile-zh.png)
- [Original design guide](docs/Storm_Chaser_Design_Guide_v1.0.md)

Proposed systemd assets under `ops/` passed static verification but have not been installed/enabled. Off-host backups, external alerting, host reboot/timer observation and a private staging soak remain release gates. The current financial limit is **$0 new expenditure**. The historical $7–20/month planning estimate is unverified and is not an approved budget or procurement instruction. Review the documented retention/disk limits before promising historical coverage.

M3-E stops at POC review; actual Taiwan relevance ranking and multi-agency comparison remain unresolved. The owner decides accept/revise/reject before production integration or further experiential work. No host service activation, environment publication, public deployment or release candidate has been performed.
