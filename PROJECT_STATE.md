# Storm Chaser — project state

**Adopted handoff index, not a second GDD.** Approved intent, reported/verified implementation, visual acceptance and release readiness are separate.

- Repository: https://github.com/jaychtw/storm-chaser
- Reviewed: 2026-10-29 Asia/Taipei. Owner: product owner; engineering: Codex; advisory design/product: ChatGPT.
- Lineage: M3-O `b09928a` → reconciliation `02dc7c2` → M3-P **`12dc2fc23ded833e8ba539fddd67caddde2af477`** → M3-E POC delivery on `development/m3-e-forecast-time-explorer` (pin `git rev-parse HEAD`; exact SHA in delivery handoff).
- Phase: **M3-E experiential POC delivered for review**, preserving M3-P/O work. Original Taiwan ranking and multi-agency objectives remain unfinished.
- Acceptance: owner explicitly **accepted M3-P visual design** in the M3-E assignment. M3-P technical results remain evidence, not inferred release acceptance. **M3-E interaction/visual/usability acceptance pending**; not production ready.
- Boundary: **$0 new expenditure**, no main merge, public preview/deployment, hosting/service activation or paid/free-tier enrollment. Local development/test frontends only; no live collection this cycle.
- Standards: AICP **1.1.0**, prospectively adopted at [`cb74fe9497d07370f44a18a09fec124ab99848ec`](https://github.com/jaychtw/game-development-standards/tree/cb74fe9497d07370f44a18a09fec124ab99848ec). App-specific GDD requirements; no mechanical game-only UGDS obligations or standards edits.

Intent: independent bilingual WNP/South China Sea cyclone experience with Taiwan relevance and visible official evidence. Approved priority: **originality of presentation/interaction over novelty of underlying information**; no firsthand/proprietary data or independent forecasting objective. Prior required functionality is not cancelled.

Authority/evidence:

- [Original approved Guide v1.0](docs/Storm_Chaser_Design_Guide_v1.0.md), [approved M3-P amendment](docs/amendments/design-guide-v1.0-m3p.md), [proposed experience amendment](docs/amendments/design-guide-v1.0-m3e-proposed.md)
- [M3-E owner assignment](docs/briefs/m3-e-authorization.md), [ADR 0003](docs/adr/0003-experience-layer-poc.md), [ADR 0002](docs/adr/0002-product-reconciliation-proposed.md)
- [M3-E rationale, comparison, evaluation, secondary proposals and review instructions](docs/m3e-review.md), [actual browser evidence](docs/m3e-explorer-results.json), [verification metadata](docs/m3e-verification.json)
- [M3-P verification](docs/m3p-verification.md), [M3-O report](docs/m3-verification.md), [architecture](docs/adr/0001-jma-operations.md), [sources](docs/sources/m0-completion.md), [datum](docs/m3-datum-audit.md)

Approved preserved behavior: Night Operations, EN/zh-TW, mobile map-first, JMA primary, native values/provenance, demo/live isolation, qualitative datum limitations, neutral uncertain Auto even for one storm, persistent manual selection, local expiry and honest source states. Historical issuance browsing deferred; official-page chart fallback satisfies access.

M3-E implemented: current-advisory discrete time slider/previous-next, synchronized exact map emphasis/source readout, analysis/prediction distinction, irregular-gap labels and no motion/interpolation. Existing marker/list navigation retained. No secondary global disclosure or alternate-perspective feature implemented. **110 tests pass**, production build passes (existing size warning), all four browser suites pass; **25 explorer checks, 41 total axe scans with zero violations**, actual matched desktop/mobile EN/zh-TW before/after replay screenshots. Headless local-review harness smoke passed. Human comprehension, physical devices, screen readers and headful review in this cloud run remain unverified.

Open: M3-E owner accept/revise/reject; proposed GDD wording; any future progressive-disclosure exploration; Taiwan ranking methodology; CWA credential/semantics and JTWC access/reuse gates; exact CRS/future schemas; real host dispatch/reboot/soak/off-host restore, security/rollback and RC acceptance. Local tests/backups/workspace do not prove continuous operation.

Next step: **owner reviews M3-E POC/evidence**. No production integration, next experiential expansion, main merge, external activation, expenditure or deployment is authorized. Standards proposals remain separately reviewable only.

Continuity: repository and supplied conversation recovered; separate ChatGPT Project history not retrieved. Update this index at material approved decisions or verified milestones; never silently promote a proposal, test or visual acceptance into release authorization.
