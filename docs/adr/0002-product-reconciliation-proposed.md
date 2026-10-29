> V1-F supersession: Taiwan ranking and externally dependent comparison features are deliberately deferred from frozen v1.0, not forgotten or completed. [ADR 0004](0004-v1-scope-freeze.md) and the [register](../v1/deferred-capabilities.md) govern current scope; the earlier objectives/rationale below are historical.

# ADR 0002 — product objectives and M3 reconciliation

Date: 2026-10-29, Asia/Taipei. **Approved in part; remaining proposals identified below.** Filename retained for review-link continuity. Original proposed record is preserved at review commit `02dc7c2f1f1e61b5626f247bb9d1b9d8548c75e9`.

## Context and approval provenance

The [Guide v1.0](../Storm_Chaser_Design_Guide_v1.0.md) defines original M3 as comparison/relevance. Delivered M3 operational hardening at `b09928a4ed758e0c053e9da6eaad264cbdf4625f` did not complete those objectives; [reconciliation](../reviews/m3-reconciliation.md) records the gap.

The owner's reconciliation assignment approved D-001–D-005. The later [Final Implementation Authorization](../briefs/m3-p-authorization.md) approves this bounded M3-P cycle from review commit `02dc7c2`, resolves the Auto choice, adopts the project-state index/AICP pin and establishes the decisions below. No separate ChatGPT Project history or durable conversation URL was available. This records project instructions, not inferred acceptance of unperformed checks.

## Approved decisions

| ID | Decision | Rationale and consequences |
|---|---|---|
| D-001 | Retain explainable Taiwan relevance ranking as a v1.0 objective. | Source-supported attention aid only; no invented scores, warning associations, precision or confidence. The ranking algorithm itself remains unimplemented and unapproved. |
| D-002 | Additional sources remain conditional on independently verified lawful access and validated data. | JMA only. CWA credentials/semantics and JTWC access/reuse remain blocked. No bypass, enrollment or new adapter in M3-P. Two feeds required to claim comparison. |
| D-003 | Qualitative approximate plotting accepted with prominent datum limitations. | No exact EPSG realization established; no precise distance, intersection or impact calculations. |
| D-004 | Single-host Node/curl/SQLite/systemd direction accepted in principle. | Preserve hardening; no infrastructure procurement/activation, real host dispatch/soak or production-readiness claim. |
| D-005 | $0 new expenditure. | No purchases/subscriptions/billing/financial commitments. Paid alternatives documented separately only; free-tier branding does not authorize activation. |
| D-006 | Uncertain Auto is a neutral regional overview with no selected priority, even for one storm. | Supersedes P-002's recency-default and retained arbitrary Auto choice. Manual selection remains explicit, persistent and reversible; ineligibility is explained without substitution. |
| D-007 | Adopt M3-O / M3-P lineage and authorize bounded expiry, presentation and usability work. | Preserves original unresolved objectives and completed hardening. Local tests/replay permitted; M3-P is an owner-review gate. |
| D-008 | Defer historical issuance-cycle browsing; retain current-cycle evidence. | No Time Travel/cycle-browser expansion. Official-page links satisfy charts; no scraping/embedding required. |
| D-009 | Adopt PROJECT_STATE.md and prospective AICP 1.1.0 pin at `cb74fe9497d07370f44a18a09fec124ab99848ec`. | Compact durable handoff, not a second GDD; no retroactive UGDS certification. |

Night Operations, bilingual EN/zh-TW, map-first mobile, unchanged native weather values, bounded archival retention, demo/live separation and JMA-primary provenance remain approved.

## Original proposal disposition

| Original proposal | Status after Final Implementation Authorization |
|---|---|
| P-001, M3-O/M3-P labels | Approved as D-007. |
| P-002, stable Auto with disclosed newest-bulletin startup | **Superseded** by D-006. Never implement recency as priority. |
| P-003, expiry/source/motion/localization repairs | Approved bounded implementation scope, not acceptance of the resulting build. |
| P-004, chart fallback plus possible mobile consolidation | Chart fallback approved as D-008. A compact accordion may be prototyped, but material layout changes still require visual review; none is assumed approved. |
| P-005, historical cycle browser deferral | Approved as D-008. |
| P-006, project-state/AICP pin | Approved as D-009. |

## Remaining proposals / external gates

- Taiwan ranking methodology, eligible evidence, thresholds and warning associations: **open; further explicit approval required before implementation**. No numerical confidence or geodesic ranking introduced.
- CWA/JTWC integration and a future JMA-only release-subset decision: **not approved by M3-P**. Existing conditional-subset rule is preserved; comparison remains incomplete.
- Material visual refinements/accordion, physical-device and screen-reader acceptance: owner review pending; automated scans do not supply approval.
- Operational host, off-host backup, alerts, RC acceptance, merge to main and deployment: **not authorized**. Single-host acceptance in principle does not remove reliability evidence gates.
- [Standards proposal](../proposals/standards-applicability-and-milestone-lineage.md): endorsed for future review only; no modification of the standards repository authorized.

## Consequences and review gate

The [scoped guide amendment](../amendments/design-guide-v1.0-m3p.md) records affected requirements without overwriting original Guide v1.0 or M3-O evidence. M3-P may be committed/pushed to a development branch; completion must stop for owner review. Code/test delivery, source push, visual approval, owner acceptance and deployment are distinct states. No unresolved proposal becomes approved by inclusion in this ADR.
