> Historical M3 runbook. Current startup is a read-only API with no embedded collector; use the [V1-F local operation guide](v1/local-operation.md). Original timer/host recommendations and unperformed checks below are retained as historical context.

# M3 operations runbook — local verification and proposed host setup

These instructions describe a reviewed candidate architecture. **No host service, public site or remote backup has been deployed.** Use the existing isolated repository checkout; do not create a worktree unless requested.

## Local review

Requires Node.js 24, npm and curl with normal CA/TLS trust. No JMA key is needed. Keep the platform proxy and allowed-domain policy intact.

```sh
cd /workspace/storm-chaser
npm ci
npm run build
STORM_EXTERNAL_SCHEDULER=1 npm run api
```

In a second terminal:

```sh
cd /workspace/storm-chaser
npm run collect
npm run healthcheck
npm run preview -- --port 4173
```

The read API binds loopback port 8787; Vite proxies `/api`. Use the address printed by Vite in your own browser. The API does not itself poll when `STORM_EXTERNAL_SCHEDULER=1`. Run the collector at the reviewed five-minute cadence, respecting its persistent due/backoff cursor. For temporary development, plain `npm run api` retains an embedded timer; it is not the recommended unattended deployment model.

`STORM_DATA_DIR` selects the database directory (default `.local/live`); use a completely different directory for experiments/replay. `STORM_API_PORT` selects the API port; update the Vite proxy too if changing it. New ingestion writes `storm.sqlite` plus its WAL/SHM files. Do not place them under `public/` or share them on NFS/across hosts. Unix filesystem ownership must restrict write access to the service account.

First M3 startup imports M2 snapshot/raw files non-destructively. It checks the raw hash and re-normalizes raw XML, then records import counts in the database `migration` metadata. Old files are preserved unchanged and are no longer growing. Any failed import leaves health stale for review. Back them up before separately authorized removal. The schema migration is idempotent; back up before changing software versions.

## Operational commands

```sh
npm run collect       # one bounded cycle; due/backoff and leases are persistent
npm run healthcheck   # nonzero when the read API is unavailable or source health is not fresh
npm run maintenance   # retention, SQLite integrity and raw/snapshot hash checks; requires free lease
npm run backup        # integrity/provenance checked, consistent online backup, 7 files / 7 days
npm run reprocess     # offline re-normalization of quarantined raw data after a parser fix
```

`rawPayloadRef` remains a logical content-addressed reference for backward compatibility; it is **not a promise that `raw/<hash>.xml` exists as a filesystem path**. In M3 it resolves to the `raw` SQLite row by `contentHash`. Accepted snapshots retain source URLs, original retrieval/control/issue/valid times, native units, schema version and datum interpretation. HTTP diagnostics retain only selected non-secret headers; no API key or environment dump is logged.

Partial/quarantined records degrade source health and retain last-known valid data. They require investigation, not an unbounded retry loop. Reprocess only saved source bytes after a supported parser change, and keep examples/synthetic data out of live storage. Unsupported explicit datums and unexpected units are rejected. Reprocessing an official **example** into live storage is blocked.

The API reports data/source age, not whether a storm is dangerous. An empty current view, expiry or dissipation remark is not a statement of safety or a complete survey of all activity. Archive pressure can shorten historical coverage; `/api/health.storage` reports used/capped bytes and pressure metadata. Watch those fields independently of source freshness and HTTP status.

## Proposed unattended host (not activated)

Review [ADR 0001](adr/0001-jma-operations.md) before installing anything. Prepare a service account `storm-chaser`, repository/artifact at `/opt/storm-chaser`, and persistent writable directory `/var/lib/storm-chaser`. The templates require Node 24 on `/usr/local/bin:/usr/bin:/bin` and curl/CA certificates. `tsx` is a production dependency; build the static frontend before using `npm ci --omit=dev` for a runtime-only installation.

The repository includes:

- `ops/storm-chaser-api.service`: restart-on-failure, loopback API, external scheduler mode.
- `ops/storm-chaser-collect.service` and `.timer`: bounded job every five minutes, persistent missed-run catch-up, randomized delay and durable application cursor.
- `ops/storm-chaser-backup.service` and `.timer`: daily backup at **03:20 Asia/Taipei** (19:20 UTC the preceding day), with up to five minutes jitter.

All templates use a dedicated user, restricted writes, private temporary directory and no-new-privileges. They have passed static `systemd-analyze verify`. They have not been installed, enabled, reboot-tested or observed firing on an unattended host. Do not claim otherwise based on calendar parsing or unit verification. This managed container is not a systemd host.

Serve the built frontend with an appropriate static server; proxy only the intended `/api/live` and `/api/health` routes to loopback. The public edge, TLS/domain, caching/security headers and rate limits remain release-candidate work after owner authorization. No public endpoint exists from this task.

## Recovery and backups

On normal restart, read the existing SQLite database; do not seed it from gold specimens. A killed transaction rolls back while prior commits remain readable. A dead collector's lease expires within 90 seconds; normal jobs retry at the next scheduled opportunity. A worker killed mid-fetch may leave no committed response, so normal source reconciliation is required. Accepted data is not promoted from an incomplete transaction.

Use the online backup command rather than copying a live SQLite main file without its WAL. Keep a last-known-good backup when investigating corruption. For a **private restoration rehearsal**, select a backup into a new isolated directory, verify `PRAGMA integrity_check` and source hashes, and start an API reader against that directory on a separate port. Do not overwrite the live database, run a collector against the rehearsal data, or label historical restored data fresh. Reconnecting the restored collector and confirming source reconciliation is a separate staging check.

Local backup files do not survive host loss independently. The owner still needs to select an encrypted off-host destination, credential/access scope, retention and alert mechanism, then authorize configuration and test a clean-host restore. No off-host upload, account creation or notification was performed here.

## Routine monitoring

Alert on missing/late successful collection, stale/unavailable/partial source state, failed one-shot jobs, exhausted disk/body budgets, rising quarantine count, missing/old backups, pressure-trimmed history and failed integrity/provenance checks. An external monitor should check both API reachability and JSON fields. It must not restart a healthy API repeatedly just because the weather source is down. Treat source outage and process liveness separately.

Service journal messages and structured fetch/quarantine records are available locally. There is no external notification integration yet; it requires explicit authorization. Maintain host time synchronization, supported Node/curl/OS security updates, tested lockfile updates, and a review of JMA technical notices. No user personal data is collected by this prototype.
