# Install and operate the frozen local-first software

Package: **Storm Chaser 1.0.0-rc.1**, a private software review candidate. No public release, hosting enrollment or service installation is implied. See [scope ADR](../adr/0004-v1-scope-freeze.md), [limitations](known-issues.md) and [separate service readiness](public-service-readiness.md).

## Supported environment

Tested: Linux (Debian 13), Node **24.19.0**, npm **11.9.0**, Chromium **154.0.8037.57**, built-in Node SQLite, local writable filesystem. Declared support: Node 24.x/npm 11.x; `.nvmrc` pins the tested Node version. Other OS/browser/physical-device combinations are not certified. Need a WebGL-capable browser for the interactive map; details/source links remain available when WebGL fails. Use local persistent block storage, not NFS or a multi-host shared SQLite file.

Full local installation uses locked dependencies, including Vite/TypeScript/browser tooling. Existing Node/npm and Chromium may be used; no account, API key, tile subscription or telemetry is required. `curl` with valid CA/proxy settings is needed only for later explicit real JMA collection. Do not disable TLS or bypass source restrictions. The runtime feed/body origin is `https://www.data.jma.go.jp`; other official documentation URLs remain attribution/evidence references.

## Install and build

From an existing authorized checkout of the delivered development commit:

```sh
node --version
npm --version
npm ci --no-audit --no-fund
npm test
npm run build
```

`npm ci` follows `package-lock.json`; do not substitute `npm install`/automatic upgrades when reproducing this candidate. Network access to the existing npm registry is needed only if packages are not cached. With the complete cache, `npm ci --offline --no-audit --no-fund` is supported and was tested in an isolated copy. Fresh vulnerability-advisory data is not supplied by an offline install. No dependency version changed in V1-F.

The build output is `dist/`. Scripts run TypeScript through production dependency `tsx`; do not remove `server/` or `shared/` for an API-only runtime. A production-dependencies-only runtime smoke is separate from the supported full local frontend workflow: Vite preview requires the development tools installed above. No new static-server architecture is introduced.

## Option A — frontend-only controlled demonstration

No API, database or collector is required:

```sh
npm run preview -- --port 4183 --strictPort
```

On a graphical desktop, in a second terminal:

```sh
PREVIEW_URL=http://127.0.0.1:4183 npm run review:local
# Phone-size touch emulation:
REVIEW_WIDTH=390 PREVIEW_URL=http://127.0.0.1:4183 npm run review:local
# Headless environment smoke:
PREVIEW_URL=http://127.0.0.1:4183 npm run review:local -- --smoke
```

The harness opens an isolated local browser context, blocks external requests and injects only the saved official specimen into that context's `/api/live` response. Date is frozen at the specimen's replay time, and a persistent bilingual **NOT CURRENT WEATHER** banner is displayed. No raw/normalized fixture enters a live archive. Original-source URLs remain inspectable, but external navigation is blocked in this isolated review context. Closing the review browser/Ctrl+C ends it. Stop the frontend with Ctrl+C in its own terminal.

The separate `?mode=demo` UI uses explicitly labeled synthetic fixture scenarios; it is not JMA replay or live data. Normal local JMA mode never falls back to either demonstration automatically. Headful review needs a graphical display; the cloud run verifies the headless path and captures actual emulated screenshots.

## Option B — JMA-backed local operation

The following are **operator choices for an existing authorized machine**, not actions activated by V1-F. No unattended source service is started by these instructions automatically.

```sh
# Terminal 1: loopback read API, safe default; no embedded collection timer
npm run api
# Terminal 2: local frontend, same-origin /api proxy to loopback API
npm run preview -- --port 4183 --strictPort
```

Both bind **127.0.0.1**. Default API port is 8787. Open `http://127.0.0.1:4183` in your own browser. The frontend polls the local read API; it does not fetch weather upstream. A new archive initially has no usable current records and unknown source health; this is not a clear-basin assertion.

If separately choosing a bounded real collection, run **one explicit cycle**:

```sh
npm run collect
npm run healthcheck
```

`collect` honors persistent due/backoff, source load/byte limits, deduplication and leases. Do not wrap it in a shell loop, cron, systemd or background task without separate authorization. Source failures retain last-known records with honest age/status; no source change/new storm requires a software rebuild. This V1-F task does not execute real collection or change the environment allowlist.

**Startup change:** `npm run api` is now always a read-only reader. The older embedded collector was removed to prevent accidental unattended requests. Legacy `STORM_EXTERNAL_SCHEDULER=1` is unnecessary/ignored; existing service templates remain inactive. Actual scheduling is a separate approved-host decision.

## Configuration

Set variables per command/terminal as appropriate; never commit secrets or dump the environment.

| Variable | Default / purpose |
|---|---|
| `STORM_DATA_DIR` | `.local/live`, relative to repository root; stores `storm.sqlite`, WAL/SHM and backups. Use a different absolute directory for tests/restores. Keep it outside `public/` and `dist/`. |
| `STORM_API_PORT` | `8787`, integer 1–65535. Set the same value in API **and frontend preview/dev terminals** so Vite's proxy matches. Invalid values fail startup/config evaluation. |
| `PREVIEW_URL` | Used by browser review/tests, typically `http://127.0.0.1:4183`. Not a public deployment URL. |
| `REVIEW_WIDTH` | `1440`, review harness viewport; `390` enables phone-size touch emulation. |
| `CHROMIUM_PATH` | Optional existing Chromium executable for browser tools; otherwise use system Chromium or installed Playwright Chromium. |
| `REVIEW_STAGE` | Optional separate artifact prefix for established browser suites. Defaults point to V1-F paths; do not overwrite historical milestone evidence. |
| Existing HTTPS proxy / CA configuration | Inherited by `curl`; preserve managed-platform settings and valid TLS trust. No JMA key required. |

For an alternate API port, for example, use `STORM_API_PORT=19087 npm run api` and `STORM_API_PORT=19087 npm run preview -- --port 4183 --strictPort`. This changes only the invoked processes, not persistent cloud configuration.

## Stop, restart, backup and restore

Stop your frontend and API with Ctrl+C in their terminals. The API handles SIGINT/SIGTERM, closes its listener and database. No service was installed that needs disabling. Restart the same commands/data directory to reuse committed records; never seed gold specimens into live storage. A terminated SQLite transaction rolls back; collector leases expire/recover under the existing design. Do not delete WAL/SHM files while a database is open.

```sh
npm run verify:archive   # existing database required; no retention pruning
npm run backup           # integrity/provenance checked, online consistent snapshot
npm run maintenance      # requires free collector lease; prunes then checks integrity/provenance
```

Backup files are under `STORM_DATA_DIR/backups/`, at most seven files/seven days. Do not copy only the main file of an open WAL database. Use the online backup, preserve a known-good snapshot, and restrict archive/backup write access to the local operator. SQLite is not WORM/tamper-proof storage.

For restore, stop your API and any separately authorized collector. Choose an **empty new directory**, copy a verified standalone backup there as `storm.sqlite`, then verify before switching any reader:

```sh
# Replace these example absolute paths; do not overwrite the original data directory.
mkdir /absolute/path/to/new-restore
cp /absolute/path/to/verified-backup.sqlite /absolute/path/to/new-restore/storm.sqlite
STORM_DATA_DIR=/absolute/path/to/new-restore npm run verify:archive
STORM_DATA_DIR=/absolute/path/to/new-restore STORM_API_PORT=19087 npm run api
# In the frontend terminal, use STORM_API_PORT=19087 as well.
```

Verification reports SQLite integrity, snapshot count and raw/snapshot provenance. It fails on damaged provenance or a nonexistent database rather than creating an empty success. Opening a legacy archive can perform the existing non-destructive M2 import; back up first. Verification does not prune history, poll sources or make restored old records fresh. Inspect source/valid/retrieval times after restore. The isolated package smoke exercises backup→new-directory restore and deliberately damaged raw rejection; it is not an off-machine disaster-recovery test.

## Retention and operating limits

Feed bodies ≤24h; bulletin raw/snapshots ≤90d (earlier under storage pressure); fetch diagnostics 14d; URL index 90d; latest-unit ordering metadata 400d. Main SQLite cap 256 MiB, pressure threshold 192 MiB; WAL target 16 MiB after checkpoint, not an absolute bound with pinned readers. Legacy M2 files remain outside the cap and are not deleted by V1-F. Health exposes storage pressure.

A current record becomes locally stale after >8h and is excluded after >24h unless source validity ends earlier. These are display policies, not official dissipation/safety judgments. Individual expired forecast points are excluded. Archived history and current display eligibility are separate; there is no historical browser in frozen v1.0. Rolling source feeds cannot reconstruct arbitrary outages. An ephemeral workspace/sleeping computer stops collection; no uninterrupted service is promised.

Local backups do not protect against host loss. Off-host copies, independent alerts, real host scheduling and public edge/security require separate resources, evidence and approval. See [service readiness](public-service-readiness.md), not a paid hosting recommendation.
