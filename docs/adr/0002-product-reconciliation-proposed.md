# Proposed ADR 0002 — product objectives and M3 scope reconciliation

Date: 2026-10-29, Asia/Taipei. **Document status: proposed for review.** This record distinguishes directions the owner already approved from engineering/design proposals still awaiting approval. No guide text or governing standard is amended by preparing this file.

## Context

The [Guide v1.0](../Storm_Chaser_Design_Guide_v1.0.md) defines M3 as comparison/relevance. The subsequent owner brief assigned M3 operational hardening, now delivered at `b09928a4ed758e0c053e9da6eaad264cbdf4625f`. That work is useful but does not implement original Taiwan relevance or independent comparison. [Reconciliation/evidence](../reviews/m3-reconciliation.md) documents this difference.

Approval source for the five directions below: owner's **“Storm Chaser — M3 Reconciliation and Next-Cycle Planning”** assignment in this conversation, reviewed 2026-10-29 Asia/Taipei. No durable conversation URL was available. The assignment itself explicitly says review/planning only. This record stores the project decisions, not private conversation history.

## Approved directions — already authorized by owner

| ID | Decision | Rationale / consequences |
|---|---|---|
| D-001 | Retain Taiwan relevance-based Auto as a v1.0 objective; explainable source-supported attention ranking, with honest fallback where evidence is insufficient. | Preserves the original differentiator. Latest bulletin and nearest center must not silently replace relevance. No independent hazard forecast or fabricated confidence. Exact rules/fallback still require review. |
| D-002 | Multi-agency integration remains conditional on independently verified legally permitted sources. | Preserve JMA primary; defer CWA/JTWC until authentication/access, terms and semantics pass. No bypass. Two independent track feeds are required to claim comparison. |
| D-003 | Accept approximate qualitative center visualization with prominent source/datum limitations. | Existing regional plotting may continue. Exact EPSG realization is not newly established. No precise impact, coastal-intersection or proximity calculation without sufficient evidence and further approval. |
| D-004 | Accept the proposed single-host architecture in principle only. | Preserve Node/curl/SQLite and scheduler assets. This supersedes ADR 0001's architecture-selection uncertainty, not its unverified host evidence. No host procurement/activation/deployment authority. |
| D-005 | Zero expenditure: no purchases, subscriptions, paid activation or financial commitment. | Prefer existing resources; do not assume “free tier” is risk-free or approve billing. Document superior/necessary paid options separately without implementing them. ADR 0001 cost estimates remain historical planning, not a budget. |

Existing preserved directions: Night Operations, bilingual EN/zh-TW, mobile map-first, JMA-first provenance, raw data retention subject to bounds, native measurements without invented values, demo/live separation, no public deployment and explicit review gates.

## Proposed decisions — not yet approved

| ID | Proposal | Rationale / alternative |
|---|---|---|
| P-001 | Use M3-O for delivered operational hardening and M3-P for the bounded proposed product pass, keeping original M3 objectives open. | Avoid two incompatible meanings of “M3 complete.” Alternative: owner chooses another explicit lineage label; do not retrospectively rewrite completed reports. |
| P-002 | Under insufficient evidence, show “Priority uncertain,” preserve eligible prior Auto selection, and disclose any deterministic latest-bulletin startup as a display default. | Prevents thrashing/false relevance. Alternative: neutral regional view/no selected storm until manual choice. Neither option completes relevance ranking. |
| P-003 | Close cached-expiry, source issue/partial-state, motion and native-label localization gaps before broader feature work. | Concrete inspected/reproduced product deficiencies. Preserve current backend and visual direction. |
| P-004 | Keep official-page chart fallback for v1.0; consolidate source cards on mobile if usability review supports it. | Meets evidence-access objective without unverified embedding. No asset rights are inferred. |
| P-005 | Defer user-facing historical cycle browsing until a focused later scope; always show the current source cycle now. | Guide §3 includes cycle selection, but comparison is blocked and Time Travel is later. Owner must approve this simplification; do not silently remove the original interaction. |
| P-006 | Adopt the compact PROJECT_STATE index and pin AICP 1.1.0 to standards commit `cb74fe9497d07370f44a18a09fec124ab99848ec` prospectively. | Reproducible handoffs without duplicating the GDD. No global UGDS adoption or retroactive certification. |

## Consequences and boundaries

The owner-approved directions are binding for planning now. Proposed UI/fallback rules, M3-P execution, milestone acceptance, JMA-only RC scope and any deployment are not approved by this record. Obtain targeted authorization before dependent implementation; avoid re-requesting approval for D-001–D-005 themselves.

No numerical relevance score, new geometric threshold, warning association by name, averaging conversion or source substitute is justified by this decision. A verified single source can support a limited product, but remaining objectives must stay visible. The operating architecture remains a one-host failure domain with bounded retention/local backups; no off-host reliability evidence is invented.

When adopted, add a short forward pointer to ADR 0001/README and a versioned guide amendment citing accepted proposal IDs. Preserve Guide v1.0 and historical reports as the original approved baseline. Record acceptance/rejection of each proposal separately; do not mark the whole ADR approved merely because its first table transcribes approved directions.

## Approval ledger

- D-001–D-005: **approved by explicit current owner assignment**; transcription subject to review for accuracy.
- P-001–P-006: **proposed; owner decision pending**.
- M3-O owner acceptance: **not established by available records**.
- M3-P implementation: **not authorized**.
- Expenditure, hosting activation, deployment: **not authorized**.
