# V1-F retrospective — bounded completion

2026-10-29 Asia/Taipei. Project-local lessons; shared standards unchanged. AICP 1.1.0 §9 at `cb74fe9497d07370f44a18a09fec124ab99848ec` governs any future promotion.

| Observed lesson | Evidence / impact | Destination and disposition |
|---|---|---|
| Explicit scope freeze makes completion assessable. | Earlier v1 ranking/extra-source goals remained open after operational/experiential milestones. Owner-approved freeze now records them as deferrals with reopening criteria. | Project ADR/register adopted. Existing milestone-lineage template proposal remains separately reviewable; no new universal gate added. |
| Default startup commands need explicit side-effect descriptions. | The old API command could start an embedded collector; local-first finalization now makes it a read-only reader and tests that no collector is invoked. | Candidate brief/template clarification: identify network/timer/write side effects of start commands. Propose only through standards review; no automatic AICP/UGDS change. |
| One selection contract prevents route drift. | Marker/list/timeline routes now resolve current published records through one function, preserving irregular leads and expiry. | Technical implementation/tests in this repo; no mandatory cross-project architecture. |
| Audit freshness and execution environment belong in evidence. | Offline npm audit returned zero, with no fresh advisory assurance. Clean-directory install/build and production-only smoke were verified separately from public operation. | Evidence/reporting practice consistent with existing AICP. No duplicate standards amendment needed. |
| Optimize against a measured delivery context. | Local map readiness 1.18–2.23s; constrained simulation 7.48–8.27s. MapLibre dominates the bundle; local software remains usable, remote/device budgets are not established. | Keep measured warning/limitations; no speculative framework rewrite or warning suppression. Reassess for an explicitly chosen future service/device target. |

No new source, disclosure/perspective feature, infrastructure or expenditure was introduced. Owner acceptance, public operation and deferred capability reopening remain separate decisions. A single cycle's emulation does not establish universal usability/performance standards.
