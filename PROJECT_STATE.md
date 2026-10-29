# Storm Chaser — proposed project state

**Proposed handoff index; adoption pending.** Snapshot only: the guide and explicit owner decisions establish intent; code/evidence establish behavior. No automatic milestone or release approval.

- Repository: https://github.com/jaychtw/storm-chaser
- Reviewed: 2026-10-29, Asia/Taipei; owner: product owner; implementation: Codex; advisory design/product collaborator: ChatGPT.
- Implementation snapshot: `b09928a4ed758e0c053e9da6eaad264cbdf4625f`, confirmed remote `main`; subsequent documentation drafts are prepared for publication on `review/m3-reconciliation`, without merge into `main` or product changes.
- Phase: delivered M3 operational hardening awaiting review; original M3 comparison/relevance incomplete. “M3-O/M3-P” labels are proposed.
- Acceptance: M2 conditionally accepted in supplied history; M3 owner acceptance not established. Push is review availability, not acceptance.
- Deployment/expenditure: **none authorized**. No hosting procurement, paid activation or next implementation cycle authorized.
- Standards read: AICP 1.1.0 / UGDS 1.0.0 at [`cb74fe9497d07370f44a18a09fec124ab99848ec`](https://github.com/jaychtw/game-development-standards/tree/cb74fe9497d07370f44a18a09fec124ab99848ec). Prospective AICP pin proposed; no historical UGDS adoption/pin found. Apply app requirements from the approved guide; no game-specific obligations imposed.

Storm Chaser is a bilingual public-information map for western North Pacific/South China Sea cyclones with Taiwan-first attention, original-source evidence and honest limitations. It is not an official warning service or independent hazard forecast.

Authoritative navigation:

- [Approved Guide v1.0](docs/Storm_Chaser_Design_Guide_v1.0.md)
- [M0/source dossiers](docs/sources/m0-completion.md), [datum audit](docs/m3-datum-audit.md)
- [M3 report](docs/m3-verification.md), [ADR 0001](docs/adr/0001-jma-operations.md), [operations](docs/m3-operations.md)
- [Current reconciliation/matrix](docs/reviews/m3-reconciliation.md), [proposed ADR 0002](docs/adr/0002-product-reconciliation-proposed.md), [proposed M3-P brief](docs/reviews/m3-product-completion-brief.md)

Approved latest directions (current owner reconciliation assignment): retain explainable Taiwan relevance objective with honest fallback; conditional verified multi-agency integration; accept qualitative approximate plotting with limitations; accept single-host architecture in principle; **$0 new expenditure**. No deployment or service activation follows. See ADR 0002 D-001–D-005 for rationale and approval provenance.

Implemented: JMA XML pipeline, provenance/raw archive, correction/lifecycle guards, SQLite/WAL, bounded collection/retention, durable cursor/lease, local backup tooling, bilingual Night Operations/map-first UI and clearly separate demos. Prior report: 72 tests/build passed, 12 axe scans with zero violations, actual one-system API-to-map capture; these were inspected, **not rerun** in reconciliation.

Open: Taiwan ranking absent (newest-bulletin default only); second feed blocked (CWA credentials/verification, JTWC upstream access/terms); motion/native-label/source-state gaps; cached API snapshot expiry mismatch reproduced offline. Actual systemd dispatch/reboot/soak, off-host restore, physical-device/screen-reader checks and RC edge/security/rollback remain unverified. Local backups and an ephemeral workspace do not establish continuous operation.

Next authorized step: publish the documentation drafts to the dedicated review branch, then stop for owner/advisory review. Publication does not adopt this index or approve proposals. **Do not start M3-P** until explicitly authorized. Do not bypass sources, fill weather gaps, activate services, spend money or deploy. Preserve working hardening and existing datum/source limitations.

Continuity: available context is repository evidence plus supplied conversation; separate ChatGPT Project history not retrieved. Latest review adds draft documents only. Update this index after an approved decision/verified milestone; link evidence instead of copying specifications. Never silently promote a proposal or reported check to approval/fresh verification.
