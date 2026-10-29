# ADR 0001 — JMA-first single-host operation

Status: **recommended for owner review; not deployed**. Date: 2026-10-29 Asia/Taipei.

## Decision

Use one small Linux host with **Node.js 24, curl, systemd and local persistent block storage** for the initial release candidate. Keep the API reader separate from scheduled collector jobs. Use SQLite WAL transactions for source bytes, provenance, normalized revisions, latest-unit ordering, scheduling cursor, leases and health. Retain static MapLibre assets independently. Continue using JMA only; CWA/JTWC remain deferred.

```
JMA short/long Atom → bounded collector job → SQLite WAL on local SSD
                              ↑                    ↓
                    systemd 5-minute timer    loopback read API
                                                   ↓
                                         static bilingual frontend
SQLite → verified online snapshot → 7 local backup files
                                  → future encrypted off-host copy
Health JSON + systemd failure status → future independent monitor/alert
```

The SQLite-backed implementation and jobs are in the repository. Service/timer files under `ops/` pass `systemd-analyze verify` but have **not** been installed/enabled. The current container's PID 1 is `tail`, not systemd; actual host reboot, calendar dispatch and journal alert delivery are not claimed as tested.

## Why this architecture

| Option | Assessment |
|---|---|
| Single VM + systemd + SQLite | Recommended initial fit. Matches the implemented Node/curl runtime, supports consistent backups and process-level failures, and keeps operational complexity low for one verified source. One-host failure domain and off-host backups must be addressed before release. |
| Serverless cron + managed SQL/object storage | Plausible later. Requires replacing local SQLite/curl execution, validating duration/CPU/egress limits and implementing provider-specific scheduler/storage adapters. It is not a deployable substitute for the current runtime without engineering/testing. |
| Multi-node replicas / shared network filesystem | Deferred. Do not share this SQLite database across hosts or NFS. A distributed database/queue and leader control would be required. Current leases coordinate processes on one host only. |

## Collection, restart and consistency

- `storm-chaser-collect.timer` schedules every five minutes with a small randomized delay and `Persistent=true` catch-up. The application also stores `nextAttempt`, failure count and last long-feed reconciliation in SQLite, so process restarts cannot reset backoff or generate rapid duplicate requests.
- `storm-chaser-collect.service` is a bounded one-shot job with a four-minute service timeout. A cycle limits new bulletin requests to 100, stops starting them after 150 seconds, uses a 30-second per-request timeout, and serializes source work. An eight-MB response cap and a local 500-MB rolling-day **body-byte** budget guard source load. One final request can cross the body-budget threshold by at most the response cap; headers/other clients sharing the public source IP are not included. This is not a substitute for JMA's ten-GB/day source-IP restriction.
- A SQLite lease expires after 90 seconds and is renewed around network work and before accepting normalized data. A replacement owner invalidates the old token; the old owner cannot overwrite cycle state after losing its lease. Forced termination leaves the last committed transaction readable; a later timer run recovers an expired lease.
- Each raw payload is content-addressed before parsing. UTF-8 decoding is strict; even undecodable response bytes are preserved, not silently replaced by Unicode replacement characters. Namespace, calendar/timezone, units, coordinate range/type, forecast lead range and source URL checks reject unsupported inputs. Partial failures retain prior valid information and source health records the gap.
- Snapshot and latest-unit changes commit together. SHA-256 deduplicates payloads; source Control time orders advisories, corrections and cancellation tombstones, not serial/arrival order. Multiple API readers see committed data without restarting.
- Accepted bulletin URLs are treated as immutable, consistent with their publication-time-specific naming. Undocumented same-URL mutation is not continuously polled; this remains a release risk. A changed advisory at a new URL/hash is handled and tested. Same-control-time conflicting hashes are retained with a deterministic later-retrieval tie-break; authoritative precedence for such a real anomaly requires operator review.

## Storage bounds and historical claims

| Data | Policy |
|---|---|
| Raw Atom feed bodies | At most 24 hours |
| Raw bulletin bodies + normalized revisions | At most 90 days; can be shorter under disk pressure |
| HTTP fetch metadata | 14 days |
| Quarantine diagnostics/raw malformed bulletins | At most 90 days; raw data can be trimmed earlier under pressure |
| Accepted URL deduplication index | 90 days |
| Latest-unit ordering/retirement metadata | 400 days; full points are removed once their snapshot is pruned |
| Online backup files | Seven days, at most seven snapshots |

SQLite's configured main-file ceiling is **256 MiB**. Above 192 MiB used pages, retention removes oldest history older than 24 hours; a retention-pressure event is exposed by `/api/health`. Recent data is not silently purged to make ingestion appear successful. If recent data alone cannot fit, SQLite fails the write, the job fails and health ages stale; monitoring/operator action is required. WAL has a 16-MiB post-checkpoint size target, not a guaranteed hard bound while readers pin it. Checkpoints and disk monitoring remain necessary. Freed database pages are reused rather than necessarily shrinking the file.

Current runtime data is approximately 8 MiB in the observed archive, not a capacity forecast. Feed traffic and storm count vary. The migration preserves old M2 files unchanged as a finite legacy archive; new ingestion does not grow those files. Their storage is outside the new DB cap. Preserve/verify a backup before any separately authorized cleanup. Versioned gold specimens are small test artifacts, not a comprehensive operational archive.

Backups use SQLite's online backup API and are preceded by integrity/provenance checks; a bad archive stops the backup job rather than rotating out good copies silently. Local snapshots do not protect against host/disk loss. Before release, configure an encrypted off-host destination, access policy and lifecycle, and prove restoration onto a clean host. No remote backup destination or credentials are configured here.

## Hosting and planning costs

Initial target: one vCPU, 1 GiB RAM, **at least 5–10 GiB persistent SSD**, Node 24, curl/CA trust, a static asset server and a reverse proxy for the loopback API. Install the service account and use full paths appropriate to the chosen host. `tsx` is now a runtime dependency; build tools remain dev dependencies. The built frontend must be prepared before a production-only dependency install.

Planning budget, **not verified provider quotes or a purchase recommendation**:

| Item | Monthly planning allowance (USD) |
|---|---:|
| Small host with persistent SSD | $6–15 |
| Small encrypted off-host backups and basic monitoring | $1–5 |
| Total initial allowance | **$7–20/month** |

Actual price depends on provider/region, included disk/egress, backup operations, monitoring and tax. Domain registration and unusually high traffic are excluded. Obtain a current quote before approving hosting. No account, paid resource or public endpoint was created.

## Maintenance and release prerequisites

Monitor API reachability **and** `health.state`, last successful collection age, partial/quarantine flags, used/capped storage and retention-pressure metadata; HTTP 200 alone is not readiness. Check systemd exit/failure status and backup age independently, and connect an alert channel only with explicit authorization. No external notifications have been sent or configured.

Review JMA technical notices/schema changes, update pinned lockfile/runtime with tests, inspect quarantines, check disk/backup health, and rehearse restoration. Suggested owner cadence: daily automated monitoring, weekly manual operational review, monthly restore rehearsal and dependency/security review. These are operational recommendations, not completed unattended observation.

Before public release: approve this decision, select/quote a host, install privately, prove reboot/timer catch-up and off-host restore, run a monitored multi-day staging soak, review datum limitations and wording, resolve the remaining anomaly/schema/security gates, pin a release commit and rollback artifact, then obtain explicit deployment approval. M3 stops before those actions.
