> V1-F disposition: the owner has accepted Forecast-Time Explorer for frozen v1.0 scope. See [ADR 0004](0004-v1-scope-freeze.md). The POC-era record below remains historical; scope acceptance is not software/release/public-operation acceptance.

# ADR 0003 — experience priority and Forecast-Time Explorer POC

2026-10-29 Asia/Taipei. **Historical M3-E direction/scope record; feature subsequently accepted by V1-F.** Starting revision: `12dc2fc23ded833e8ba539fddd67caddde2af477`. Approval source: owner's [M3-E assignment](../briefs/m3-e-authorization.md), supplied in this conversation. No separate prior Project conversation was retrieved.

| ID | Decision | Status and consequence |
|---|---|---|
| E-001 | Prioritize originality of presentation/interaction over novelty of underlying weather information. | Owner-approved. Reuse verified lawful existing evidence; no firsthand/proprietary-data or independent-forecasting objective. Earlier required capabilities remain intact. |
| E-002 | M3-P visual design is accepted. | Explicit owner acceptance of baseline visual design; not proof of technical/release acceptance, human usability, physical-device coverage or continuous operation. |
| E-003 | Authorize a bounded Forecast-Time Explorer POC using current-advisory JMA points. | Owner-approved implementation scope on a dedicated development branch. No historical issuance browser, new backend/dependency or expanded ranking/source integration. |
| E-004 | Use discrete emphasis instead of animated storm travel. | POC implementation choice within authorized semantics. Prevents implied observed movement or intermediate official positions; no automatic camera movement or autoplay. Owner may review/revise the interaction. |
| E-005 | Progressive disclosure and alternative information perspectives are exploration only. | Assess benefits, data, complexity, limitations and effort; do not implement a secondary expansion automatically. |

Preserved from ADR 0002: JMA primary; additional providers conditional; approximate datum; neutral uncertain Auto, persistent manual selection and client expiry; Night Operations/bilingual/map-first; single-host architecture in principle; **$0 new expenditure**, no hosting/paid/free-tier enrollment, service activation, public preview, main merge or deployment.

The POC's presence on a development branch is not acceptance into the release scope. [Proposed guide amendment](../amendments/design-guide-v1.0-m3e-proposed.md) records candidate specification language; it stays proposed pending owner review. The owner decides whether to accept, revise or reject M3-E. Technical tests, agent evaluation, owner visual acceptance and production readiness remain separate.
