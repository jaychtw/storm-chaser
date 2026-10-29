# Software limitations and troubleshooting

Frozen v1.0 is a local-first software candidate, not an operated public service. [Deferred capabilities](deferred-capabilities.md) are deliberate scope choices, not product bugs.

| Symptom / limitation | Meaning and bounded action |
|---|---|
| “Current data unavailable” / no systems after install | API/collector may not have usable records. Start the read API for actual local data, or use the clearly labeled frontend-only replay. Choose a real one-shot collection only when authorized. No usable bulletin does not mean no storms. |
| API unreachable | Confirm the API terminal is running and frontend/API `STORM_API_PORT` values match. Both bind loopback. `npm run healthcheck` is nonzero for unavailable/non-fresh data; HTTP 200 alone is not weather readiness. |
| “Invalid information” from local API | Malformed/unsupported JSON is rejected; last-known eligible data is retained without renewed source freshness. Check local reader/archive integrity, source versions and logs. Do not turn the reply into weather values or restart a source poll repeatedly. |
| API HTTP 503 after local archive damage | Reader remains alive but cannot materialize usable data. Stop it, preserve a copy/known-good backup, run verification in an isolated restore directory, investigate before switching. No automatic destructive repair. |
| Map unavailable | WebGL/GPU/driver support may be absent. Details, source links and non-map controls remain accessible. Current tests use software Chromium WebGL; physical-phone performance is unverified. |
| Source stale/partial | Old source issue time, missed/failed collection or quarantined records can degrade coverage even with a reachable API. Inspect source/check/valid/retrieval times separately. Unsupported units/datums/schema variants are quarantined, not filled. |
| Expired forecast/selection disappears | Client/server enforce source validity and local >24h expiry, including API outage/resume. A manual storm is not silently replaced. This is not dissipation or a safety conclusion. |
| Uneven forecast gaps | Published horizons are irregular; slider steps are records, not evenly spaced hours. Displayed next-step gaps come from the source timestamps. No intermediate positions or simulated movement. |
| Missing motion/winds/class terms | “Not reported” remains missing; unknown terms are explicitly untranslated. Legacy snapshots may lack the optional motion direction and are not silently re-derived. Native units/conventions remain separate. |
| Collector does nothing immediately | Persistent due/backoff/lease/budget may prevent a new request. Inspect cursor/health; don't reset it to force repeated downloads. No collector is embedded in the API anymore. |
| Archive verification fails | Preserve original/known-good backups, don't rotate damaged data over good copies. Verify raw provenance and SQLite integrity in an isolated directory. No delete/reset/seed command is recommended as a generic fix. |
| Big JavaScript bundle | MapLibre dominates a ~1 MB JS build; local measurements and constrained simulation are in the final report. No new framework was introduced. Compression/remote-network tuning and device budgets are not proven by local preview. |
| Headful replay cannot open | A graphical desktop is required. Use `npm run review:local -- --smoke` or browser suites in the cloud; actual human/headful review remains distinct. External source navigation is deliberately blocked inside the replay context. |
| Port already used / invalid | Stop only your known local process or choose valid unused ports. API/proxy must match; frontend `--strictPort` prevents silent port substitution. Don't kill unrelated processes or expose 0.0.0.0 as a shortcut. |

Other limits: exact JMA datum realization remains unverified (qualitative regional plotting only); Natural Earth coastlines are coarse; no independent warnings, precise impact/proximity or forecast accuracy claims; supported product/schema family is finite; same-control conflicts and undocumented same-URL mutations remain review cases. SQLite/local files are not tamper-proof. No telemetry/accounts are present; locale preference alone is persisted in the browser.

Automated keyboard/touch-emulation/axe checks do not replace screen-reader, physical-device, casual-user or owner release acceptance. Fresh vulnerability intelligence is not supplied by the offline dependency audit. Real systemd dispatch/reboot, multi-day operation, host-loss/off-host restoration and public edge/TLS/rate-limit checks remain explicitly unverified.
