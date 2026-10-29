# Storm Chaser — project state

**Adopted handoff index.** Approved scope, verified software, owner release acceptance and public service readiness are separate.

- Repository: https://github.com/jaychtw/storm-chaser
- Reviewed: 2026-10-29 Asia/Taipei. Owner: product owner; implementation: Codex; advisory product/design: ChatGPT.
- Identity: **Storm Chaser v1.0 — JMA-first Experiential Cyclone Viewer**, local-first candidate `1.0.0-rc.1` (private). Experience-first organization/presentation/interaction of lawful existing public evidence; no independent forecasting.
- Baseline: M3-O `b09928a` → M3-P `12dc2fc` → M3-E **`129a3af3a13e882d8d92bcfd0360fdfa83b01cf7`** → V1-F on `development/v1-f-finalization`. Implementation revision `011a77f7bab741ecc9233d0fc394b2c53d7d9c8e`; the subsequent documentation-only commit records it. Final delivery SHA in completion message.
- Acceptance: M3-P visual design and M3-E Forecast-Time Explorer **accepted into scope by owner**. Frozen v1.0 identity/features approved. **V1-F software/release acceptance pending**; no public-readiness assertion.
- Gate: software candidate consolidated, documented and locally reproducible; stop for owner acceptance. **$0 new expenditure**, no main merge, public release/preview/deployment, hosting/service enrollment or unattended collection.
- Standards: AICP **1.1.0** at [`cb74fe9497d07370f44a18a09fec124ab99848ec`](https://github.com/jaychtw/game-development-standards/tree/cb74fe9497d07370f44a18a09fec124ab99848ec). Application GDD requirements; no game-only UGDS adoption or shared standards edits.

Authority/current records:

- [V1-F assignment](docs/briefs/v1-f-authorization.md), [scope-freeze ADR 0004 v1.0](docs/adr/0004-v1-scope-freeze.md), [approved GDD amendment v1.0.3](docs/amendments/design-guide-v1.0.3-scope-freeze.md)
- [Frozen-scope acceptance matrix/report](docs/v1/verification.md), [verification metadata](docs/v1/verification.json), [clean install](docs/v1/clean-install.json), [final browser evidence](docs/v1/browser-finalization.json)
- [Install/start/stop/config/backup/restore](docs/v1/local-operation.md), [known issues](docs/v1/known-issues.md), [public-service checklist](docs/v1/public-service-readiness.md), [deferred register](docs/v1/deferred-capabilities.md)
- [Original Guide v1.0](docs/Storm_Chaser_Design_Guide_v1.0.md), [M3-O](docs/m3-verification.md), [M3-P](docs/m3p-verification.md), [M3-E](docs/m3e-review.md), [sources](docs/sources/m0-completion.md), [datum](docs/m3-datum-audit.md)

Frozen implemented scope: WNP/South China Sea map; JMA analyzed/forecast centers; manual/neutral Auto; exact published-time Explorer; native motion/intensity/missing values; EN/zh-TW; Night Operations/map-first; provenance/bulletin links/chart page fallback; honest freshness/partial/unavailable/expiry; bounded local collection/archive/recovery.

V1-F verified: **131 tests**, TypeScript/build, **five browser suites /53 axe scans with zero reported violations**, exact point agreement across marker/list/Explorer, malformed API cache retention/expiry, **five isolated API/backup/restore checks**, fresh offline install/tests/build with byte-identical assets, clean review smoke, production-only runtime smoke. API/frontend default loopback; API no longer embeds a collector. Shared source/time/selection validation; raw/provenance/storage guards preserved. No new dependency version or architectural migration.

Performance measured: local map ready **1.18–2.23s**, constrained emulation **7.48–8.27s**; ~1 MB JS warning retained with evidence. Security: locked dependency graph unchanged, static/local boundary checks passed; **fresh vulnerability clearance not verified** (offline audit only). Source availability was not re-probed this cycle. Physical devices, screen readers, independent usability, actual host scheduling/reboot/soak/off-host restore, public edge/security/rollback remain unverified.

**Deliberately deferred, not frozen-scope bugs:** Taiwan ranking, CWA/JTWC, multi-agency comparison, historical cycles/Time Travel, Showdown, precise impacts/proximity and additional perspectives/disclosure. Reopen only on register criteria plus owner approval. Neutral Auto remains approved; no newest/nearest ranking substitute.

Next authorized step: **owner reviews V1-F software acceptance**. No next feature cycle, public release/main merge, service activation, expenditure or deployment follows automatically. [Retrospective](docs/v1/retrospective.md) and existing standards proposals stay local/separately reviewable.

Continuity: repository and supplied conversation available; separate ChatGPT Project history not retrieved. Preserve original rationale and dated evidence; never promote deferrals, local tests or feature/visual acceptance into public readiness.
