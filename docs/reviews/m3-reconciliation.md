> Historical reconciliation at review commit `02dc7c2`. Bounded M3-P has since been authorized; see the [owner authorization](../briefs/m3-p-authorization.md), [current acceptance report](../m3p-verification.md) and [ADR 0002](../adr/0002-product-reconciliation-proposed.md). The findings and proposed statuses below describe the review baseline, not current implementation or acceptance.

# Storm Chaser — M3 reconciliation

Review date: 2026-10-29, Asia/Taipei. **Review and planning only; draft for owner/advisory review.** Implementation baseline: [`b09928a4ed758e0c053e9da6eaad264cbdf4625f`](https://github.com/jaychtw/storm-chaser/commit/b09928a4ed758e0c053e9da6eaad264cbdf4625f), confirmed against remote `main` during this review. Documentation publication is authorized on `review/m3-reconciliation`, without merging into `main`. These drafts do not establish a new implementation, accepted milestone or M3-P authorization.

## Finding

Storm Chaser has a substantial, locally verified **JMA-first prototype with operational hardening**. It has not completed the design guide's original **M3 — Multi-source comparison and relevance**. Taiwan relevance ranking is absent, no second independent forecast feed is verified, and the source presentation is useful but incomplete. Preserve the working pipeline, archive and Night Operations interface. Complete product-facing gaps before describing the project as ready for the original M4 release gate.

The owner's latest decisions retain Taiwan relevance as a v1.0 objective, permit qualitative approximate center plotting, accept the single-host direction in principle, and prohibit expenditure. They do not authorize this next cycle or waive source verification. The [proposed decision record](../adr/0002-product-reconciliation-proposed.md) separates those approved directions from recommendations awaiting approval.

## Authority and evidence

Read for this review:

- [Approved Design Guide v1.0](../Storm_Chaser_Design_Guide_v1.0.md), especially §§2–3, 5, 8–12. The uploaded guide and implementation are separate kinds of evidence; its initial handoff is historical scope, not new execution authority.
- Current [AICP 1.1.0](https://github.com/jaychtw/game-development-standards/blob/cb74fe9497d07370f44a18a09fec124ab99848ec/AI-COLLABORATION-PROTOCOL.md), full UGDS 1.0.0, README, changelog and GDD/brief/state/conversation templates at standards commit **`cb74fe9497d07370f44a18a09fec124ab99848ec`**. This is the resolved current standards reference, not a claim that Storm Chaser previously pinned it.
- [M0 completion](../sources/m0-completion.md), JMA/CWA/JTWC/IBTrACS [dossiers](../sources/README.md), [M1 architecture](../architecture.md), [M2 review](../m2-review.md), [M3 report](../m3-verification.md), [datum audit](../m3-datum-audit.md), [ADR 0001](../adr/0001-jma-operations.md), and [runbook](../m3-operations.md).
- Frontend, normalizer, collector, SQLite store, service templates, tests, browser scripts and committed JSON/screenshot evidence at the baseline above.

AICP §§1/3 apply to this requested review. Storm Chaser is an application; no previous explicit adoption/pin of UGDS provisions was found. UGDS game-loop, puzzle-balance and art-production obligations are not retroactively imposed. Its responsive, bilingual, accessibility and evidence practices are useful references; the Design Guide already requires the relevant app outcomes. Formal selective adoption is an owner decision, not a prerequisite invented for this review. The game-specific CODEX-BRIEF template needs an app applicability clarification, proposed [separately](../proposals/standards-applicability-and-milestone-lineage.md).

The project repository is public (GitHub repository-public metadata inspected). Drafts contain technical project records only. Current supplied conversation instructions were available; separate ChatGPT Project conversations and unrecorded approvals were not retrieved. No full historical recall or M3 owner acceptance is asserted.

Evidence labels below:

- **Inspected:** code, saved artifacts or screenshots checked in this review.
- **Reported:** prior execution recorded in M3 artifacts/report; not freshly rerun here.
- **Reproduced:** the limited offline expiry probe below, run during this review.
- **Not verified:** no adequate execution/acceptance evidence found.

No services, collector jobs or browsers were started for this review. No current weather-source accessibility or source change is newly claimed. Old connectivity results remain dated evidence. The 72-test suite/build/browser results below are prior results, not new execution results.

## Requirements reconciliation matrix

Statuses use the owner's requested categories. “Implemented and verified” means the stated bounded capability has supporting evidence, not that public operation or all possible inputs are certified.

| ID | Approved requirement / guide section | Classification | Implementation and evidence | Remaining gap / disposition |
|---|---|---|---|---|
| R01 | Responsive WNP/South China Sea map; Taiwan context (§§2–4, 9) | Implemented and verified | MapLibre, local Natural Earth geography, pan/zoom/reset, Taiwan label; inspected actual desktop/mobile captures and reported viewport checks. | Qualitative map only; physical-device performance not verified. |
| R02 | Night Operations; map-first mobile (§§3–4) | Implemented and verified | Existing restrained dark/red shell; mobile map before storm/source panels, collapsed details; actual EN desktop / zh-TW mobile evidence. | Full visual acceptance and touch usability remain owner/manual checks. |
| R03 | Automatic discovery and real-source integration (§§2, 5–7) | Implemented and verified | JMA VPTW60/61 discovery, normalization, API; actual capture and archive evidence. | Scoped JMA feed window/versions, not all basin activity or all JMA products. |
| R04 | New/changed systems without deployment (§§1–2, 11) | Implemented but incompletely verified | Polling architecture, changed-revision replay, frontend 30-second refresh; one actual collected-system capture. | No multi-day unattended observation or newly published changed bulletin witnessed during that observation. |
| R05 | Location, intensity as reported, timestamps and attribution (§§2, 7, 9) | Implemented and verified | Analysis/forecast point separation, native values/units, distinct issue/control/retrieval/valid times, source URL/hash; pipeline and actual capture evidence. | Exact datum remains a disclosed plotting assumption. Native labels need localization, assessed separately. |
| R06 | Motion as reported (§2) | Partially implemented | Native speed values/conditions/descriptions normalized; raw XML preserves original evidence. | UI does not show motion; direction is not represented in normalized `Position`. Do not derive it from connectors. |
| R07 | Raw records, revisions and source provenance (§§2, 6–7) | Implemented and verified | SQLite raw-before-parse, SHA-256, revisions, ordering and online backup; reported 105 snapshot/hash checks, zero failures. | Finite retention; neither WORM nor permanent historical coverage. |
| R08 | Corrections, cancellation, lifecycle, missing fields (§§7, 11) | Implemented but incompletely verified | Tests inspect 23 official published examples plus controlled changes; cancellation/high-water metadata, late-data ordering, optional values. | Not every JMA schema/lifecycle variant or genuine correction event observed operationally. Unknown variants quarantine. |
| R09 | Multi-agency track comparison/toggles (§§2–3, 7, 9, original M3) | Blocked by an external dependency | Live UI exposes JMA only. A/B synthetic paths are labeled demos and are not two agencies. | CWA credential/payload/semantics gates; JTWC upstream access/rights gates. No live matching, cycle alignment or comparison implemented. Conditional requirement remains open. |
| R10 | CWA target source (§5) | Blocked by an external dependency | Official API/terms dossier; documented member-code authentication; prior no-key 401. | No authorized successful track payload, unit/time/lifecycle validation or verified quota. No credential enrollment or binding in this cycle. |
| R11 | JTWC target source (§5) | Blocked by an external dependency | Prior proxy CONNECT succeeded, then upstream CloudFront 403; inspected dossier. | Access, automation, reuse and format unverified. No bypass or unchanged retry. |
| R12 | Taiwan relevance-based Auto, rationale, hysteresis (§8, original M3) | Not implemented | `selectedNow()` uses first advisory; store orders by Control time. Visible text admits latest-bulletin selection. Demo Alpha-first order is authored. | Relevance objective retained by owner. Current warning/impact/CRS evidence cannot support original ranked inputs. Honest uncertain fallback requires explicit design agreement; it is not ranking completion. |
| R13 | Manual selection; all systems accessible (§§3, 8) | Implemented but incompletely verified | List/markers and manual flag; reported replay preserves selected ID and camera across a revision/language switch. | Actual capture has one storm. Retirement of manual selection, multiple official-source systems and keyboard focus across periodic redraw need coverage. |
| R14 | Original source charts or lawful fallback (§§2–3, 5, 9) | Implemented and verified | All three cards clearly say official-page link only; links distinct from the redrawn map. Guide expressly permits this fallback. | Stable assets/asset-specific permission not verified. Embeds are optional conditional enhancement, not a required infrastructure project. |
| R15 | Source card issue time and source-state presentation (§3, original M3) | Partially implemented | JMA check/success times and generic freshness; CWA/JTWC “not integrated”; coverage drawer. | JMA card lacks selected bulletin issue time; all incomplete sources share generic reason. Partial ingestion and source-vs-local-API failure are not distinctly explained. |
| R16 | Fresh/stale/unavailable/expired truthfulness (§§1–2, 7, 9) | Partially implemented | Server age/validity filtering, stale last-known records, forecast-point filtering, no synthetic fallback; reported backend tests. | Reproduced client cache expiry mismatch under prolonged API failure. Stale banner alone does not enforce advisory validity. |
| R17 | Honest no-current-data state (§§2, 9, 11) | Implemented and verified | Says no usable bulletin does not establish a clear basin; unavailable state has no demo substitution. | Must preserve distinction when client expiry is fixed; no source-empty-basin conclusion. |
| R18 | Complete EN/zh-TW presentation (§10) | Partially implemented | Centralized copy, persisted language, timezone; reported both-locale browser checks. | Native class/type/unit strings appear untranslated in both locales; raw source prose must remain attributed, not passed off as official translation. zh-TW stale wording also overlaps “expired.” |
| R19 | Locale and camera state retained (§§3, 10) | Implemented and verified | Locale storage guard; manual selection/camera assertion in replay. | This does not prove DOM keyboard-focus continuity on automatic redraw. |
| R20 | Accessible desktop/mobile primary interaction (§§3–4, 11) | Implemented but incompletely verified | Keyboard-selectable markers/list, visible focus, reduced motion, reported 12 axe scans with zero violations. | 24px forecast dots, dense paths and small metadata need touch/readability review; no physical-phone/screen-reader certification. |
| R21 | Forecast semantics, no invented cone/consensus (§§7, 9) | Implemented and verified | Distinct analyzed/forecast centers, native valid times/lead, straight connectors described; no inferred winds/cones/consensus. | Past observed tracks/uncertainty geometry not exposed; guide makes them conditional on available understood source data. Preserve deferral. |
| R22 | Select issuance cycle, warn mismatched comparison cycles (§§3, 9) | Not implemented | Latest materialized view only; archive exists. | Multi-agency cycle comparison blocked; ordinary cycle browsing also absent. Propose deferring browser rather than implying historical replay exists. |
| R23 | Unattended scheduler, recovery and bounded storage (§§2, 6, 11) | Implemented but incompletely verified | Persistent cursor/backoff, leases/fencing, WAL, retention and service assets; crash/reopen tests reported. | Static unit verification is not real timer/reboot/soak evidence. No host authorized. |
| R24 | Health, observability, backup recovery (§§2, 6, 11) | Partially implemented | Read API/healthcheck, structured diagnostics, online local backups, reported reopen/hash verification. | Independent alerts/off-host loss recovery not configured; quota/disk-full host behavior not proven. |
| R25 | Secrets, HTTPS/edge and release security (§§6, 11, M4) | Partially implemented | No JMA secret needed, loopback GET API, fixed upstream, TLS checks and escaped source text; no public service. | Production edge/TLS/headers/rate limits, dependency/runtime review and rollout/rollback remain release gates. No claim of full security audit. |
| R26 | Separate demo/test/official inputs (§§1, 11) | Implemented and verified | Explicit mode/banner; isolated replay; `official-example` rejected by live archive; no demo seed. | Keep “official published example,” controlled mutation and actual collection distinct in future reports. |
| R27 | Automated tests and reproducible QA (§11) | Implemented but incompletely verified | Reported 72 tests/build plus browser scripts; CI workflow exists. Scripts/assertions inspected. | Remote CI outcome not checked; no original relevance/second-feed test coverage, exhaustive localization review or deployment smoke. |
| R28 | Showdown, Time Travel, countries, AI/notifications (§2) | Deferred with documented rationale | Guide explicitly postpones; IBTrACS dossier identifies best-track limitations. | Need licensed historical forecasts and methodology, not only best tracks; no next-cycle expansion. |
| R29 | Release candidate and deployment gate (§§11–13) | Not implemented | Review snapshot pushed; no deployment performed. | Owner acceptance, release artifact, operational evidence and explicit deployment approval remain separate. |

## Milestone and decision drift

1. **Original M3 vs delivered M3:** the guide assigns comparisons, relevance, charts, manual selection and failure UI to M3. The later owner assignment explicitly authorized **M3 operational hardening**, moving forward some original M4 operations work. That assignment justified the engineering work; it did not state that original relevance/comparison objectives were cancelled. The current report's “M3 complete for review” is scoped to that later brief.
2. **Latest-bulletin Auto:** an honest M2/M3 implementation limitation became the live default. No recorded owner approval made it the permanent Taiwan relevance design. The latest assignment expressly retains that objective. Neither “newest” nor “nearest” is an acceptable unstated substitute.
3. **Architecture:** the guide suggested Workers/D1 or equivalent, not a binding platform. Single-host SQLite is a defensible simpler choice and is now accepted in principle. Preserve it. Its previous $7–20/month planning allowance is not approved expenditure; the newly approved $0 constraint controls all action.
4. **Sources/charts:** verified subsets and official-page links were allowed from the start. JMA-only is legitimate limited coverage, but two feeds are still needed to claim comparison. Lack of embedded charts alone is not a failure against the approved fallback requirement.
5. **Datum:** qualitative plotting is now explicitly accepted; the limitation is no longer an owner choice between blocking all visualization and proceeding. Precise impact/proximity remains gated. Amend the old RC recommendation prospectively; preserve historical reports.

Proposed vocabulary: **M3-O** = delivered operational-hardening work, review status pending; **M3-P** = proposed product-completion pass. These are lineage labels, not a renumbering of the approved guide or permission to start. Original M4 remains a later readiness gate.

## Engineering and experience assessment

### Preserve

The modular JMA adapter, raw-byte provenance, corrections/ordering, local WAL storage, bounded collector and durable backoff are appropriate for the verified scope. Local geometry avoids tile subscriptions/keys. Separate read API and collector reduce failure coupling. Replacing these with a managed queue, distributed database, new map framework or serverless runtime would add work without demonstrated product benefit at present.

Inspected [storage evidence](../m3-storage-evidence.json) reports 105 normalized snapshots with matching hashes, 46 successful legacy imports and zero failed imports/hash checks. [Runtime evidence](../m3-runtime-check.json) records an isolated production-dependency smoke. These are valuable bounded checks, not current archive integrity, indefinite capacity or unattended-host certification.

The actual screenshots retain the intended map hierarchy and clear chart-link fallback. Mobile is map-first, but the full page is long, with three similarly sized chart placeholders and priority information below details. A compact source accordion and a short focus explanation beside the map are reasonable targeted improvements, not grounds for redesigning the visual system. Desktop metadata and forecast dots warrant manual readability/touch checks; axe does not establish their usability.

### Concrete gaps

| Priority | Finding | Evidence and practical impact |
|---|---|---|
| P0 | Cached advisory validity is not re-evaluated in the browser | `src/live.ts` filters forecast-point dates only; `src/main.ts` retains snapshot on fetch failure. Offline probe at +25h still returns one system/four future forecast points while server materialization returns zero/one expired advisory. A stale warning is present, so this is an expiry-contract gap, not an accusation of fresh labeling. |
| P1 | Taiwan priority absent | `src/main.ts:19`, `server/store.ts:19`, visible `livePriority`. No warning association, validated Taiwan area, threshold, source-supported ranking or hysteresis exists. |
| P1 | Source state lacks detail | `src/main.ts:38–39` shows generic state/check/success; it does not render `partial` or a specific safe reason. Issue time is elsewhere, not in the source card. Users cannot readily distinguish stale source, partial collection, local API loss and a feed never integrated. |
| P1 | Motion and bilingual data labels incomplete | `server/jma.ts` preserves center speed in `motion`; `src/main.ts:36–37` does not render it, and displays native type/unit/class strings verbatim. Actual EN screenshot includes Japanese field labels. Direction needs a documented field, not geometric inference. |
| P2 | Automatic redraw can disrupt keyboard use | `render()` replaces controls/details; `StormMap.update()` removes/recreates markers every refresh. Code-review concern: selected ID/camera tests do not assert `document.activeElement`. Reproduce with a browser before choosing the narrowest fix. |
| P2 | Mobile evidence access is verbose | Actual mobile screenshot shows full source placeholders stacked after the rail. Verify a compact accordion preserves links/status and improves access before accepting a change. |

These are product fidelity, data truthfulness and usability issues. Bundle splitting, richer coastlines, external monitoring vendors, distributed storage and longer archives are optional engineering proposals unless profiling or a release requirement establishes need. The known ~984kB JS bundle advisory is a performance risk to measure, not a justification for a framework rewrite.

## Read-only reproduced finding

[Probe output](m3-expiry-probe.json) records a pure-function check against the saved official specimen. It does not poll JMA, write an archive or start services. From repository root with the existing Node 24 dependencies:

```sh
node --import tsx --input-type=module <<'JS'
import {readFileSync} from 'node:fs';
import {normalize} from './server/jma.ts';
import {materialize} from './server/store.ts';
import {liveStorms} from './src/live.ts';
const raw = readFileSync('docs/sources/evidence/2026-10-29/jma-vptw61.xml', 'utf8');
const url = 'https://www.data.jma.go.jp/developer/xml/data/20261028154121_0_VPTW61_010000.xml';
const start = Date.parse('2026-10-28T16:00:00Z');
const advisory = normalize(raw, url, new Date(start).toISOString());
const cached = materialize([advisory], {state:'fresh', lastSuccessAt:new Date(start).toISOString()}, start);
const later = start + 25 * 3600_000;
console.log({client:liveStorms(cached, later).length,
  clientForecasts:liveStorms(cached, later)[0]?.forecastTimes?.length,
  server:materialize([advisory], cached.health, later).advisories.length});
JS
```

Observed: `{client:1, clientForecasts:4, server:0}`. The cached-server health is not a fresh current server response. A future regression test must simulate API failure plus clock advancement, not simply return an already expired server payload.

## Risks and owner decisions

| Item | Current disposition | Owner input / next evidence |
|---|---|---|
| M3 acceptance | Delivery and push do not establish owner acceptance. | Review M3-O evidence and this reconciliation; record scoped acceptance without declaring original M3 complete. |
| Next cycle | Proposed [M3-P brief](m3-product-completion-brief.md); not started. | Authorize bounded work explicitly. |
| Auto fallback and eventual relevance | JMA-only data lacks verified Taiwan warning association; precise geometric ranking is not authorized. | Approve uncertainty-first stable selection policy or choose an alternative. Any area/threshold/coarse spatial ranking needs evidence and further design approval. |
| Multi-agency release scope | External gates remain. | Before RC, explicitly decide whether v1.0 ships as JMA-only with comparison deferred. Conditional subset is allowed by the guide, but completion must be labeled accurately. |
| CWA | No credential configured; full source dossier incomplete. | Decide whether to pursue a free membership/credential later; owner supplies through secure settings only after auth/logging review. No account or service activation now. |
| JTWC | Prior upstream 403; legal/technical access unverified. | Reconsider only after an authorized documented access change; no intervention or unchanged retry requested now. |
| Host and disaster recovery | Single-host accepted in principle; no host/reboot/off-host restore proof. | Identify already-owned resources and explicitly authorize any private activation later. Accept no unattended-operation claim while missing. |
| Qualitative datum | Owner accepts approximate viewing; exact realization unverified. | Preserve notice and block precise calculation; no need to re-approve existing qualitative direction. |
| Freshness/retention | 8h stale/24h display expiry and ≤90d history are engineering policies. | Confirm or revise policy during product review; no “safe basin” inference. Fix client inconsistency without silently changing thresholds. |
| Accessibility/localization | Automated evidence useful, manual/physical checks missing. | Owner/advisory review wording, touch targets and representative screens; retain explicit unverified status. |
| Standards adoption | Current AICP reviewed; no historical pin or selective UGDS adoption found. | Approve documentation references/applicability prospectively if desired; no retroactive certification. |

## Zero-expenditure architecture recommendation

Keep Node 24/curl/SQLite and local development/replay on existing authorized resources. Existing static assets require no tile subscription. Saved specimens enable reproducible offline product work. Existing compute still has availability/quota limits; “no new expenditure” is not a claim of unlimited free service.

| Option | Benefit / limitation | Cost and authority |
|---|---|---|
| Existing workspace / owned computer | Best immediate review/testing route; no new vendor integration. Sleeping/session shutdown prevents reliable unattended collection. | No new service spend. Existing resource limits apply; no new service activation in this task. |
| Already-owned always-on Linux machine | Matches architecture and can later support real timer/reboot tests; still needs capacity, power/network and permission assessment. | Incremental power/traffic/storage may be nonzero; verify $0 feasibility before use. No activation authorized. |
| Free-tier serverless/static offers | Potential future alternative, but quotas, billing enrollment and Node/curl/local-SQLite mismatch require evidence. | Do not enroll, enable billing or migrate. “Free tier” is not evidence of zero financial obligation. |
| Dedicated paid Linux VM + independent backup/monitor | Better operational continuity than an ephemeral workspace; would support host-loss recovery tests. | ADR's **$7–20 USD/month is an unverified planning estimate**, not a quote. Excluded under $0 constraint; no procurement recommendation for this cycle. Free alternative: continue local review with explicit availability limits. |

No need to choose a hosting provider to finish M3-P. No indefinite live-collection promise can be made on an ephemeral workspace. Reliable operation remains an RC evidence gate unless an existing suitable resource is later authorized; it is not solved by renaming the prototype.

## Proposed documentation and approval status

| Artifact | Status / change |
|---|---|
| This reconciliation and [offline finding](m3-expiry-probe.json) | New factual review; owner acceptance pending. |
| [ADR 0002 draft](../adr/0002-product-reconciliation-proposed.md) | Approved directions transcribed from current assignment; new fallback/scope proposals explicitly pending. Does not silently amend the guide. |
| [M3-P implementation brief](m3-product-completion-brief.md) | Proposed only; no execution authorized. |
| [PROJECT_STATE.md](../../PROJECT_STATE.md) | Proposed compact handoff index; adoption pending, links to authority/evidence. |
| [Reusable standards proposal](../proposals/standards-applicability-and-milestone-lineage.md) | Separate AICP §9 candidate; standards repository, versions and project pins unchanged. |
| Guide v1.0, ADR 0001, old reports, runtime/product code | Unchanged. If adopted later, add forward pointers and a versioned decision amendment rather than rewriting historical evidence. |

Recommended next milestone: **M3-P — Product completion pass**, limited to truthful display expiry, source/bilingual completeness, and an approved uncertainty-first Auto contract. Full Taiwan ranking and independently verified comparisons remain explicit evidence gates; no M4/RC readiness claim follows automatically. Stop here for owner review.
