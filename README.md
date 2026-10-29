# Storm Chaser

Bilingual western North Pacific cyclone prototype using verified **JMA XML**, a transactional SQLite archive, and the Night Operations MapLibre interface. M3-P is ready for owner review, preserving M3-O operational hardening. It is not an official warning service and is not publicly deployed.

## Run locally

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

M3-P stops here for review; actual Taiwan relevance ranking and multi-agency comparison remain unresolved. No host service activation, environment publication, public deployment or release candidate has been performed.
