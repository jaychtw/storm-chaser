# Consolidated standards handoff v1.0 — proposals only

2026-10-29, Asia/Taipei. **Not approved for implementation. No shared-standard changes authorized.** This record consolidates [earlier applicability/lineage candidates](standards-applicability-and-milestone-lineage.md), the [V1-F retrospective](../v1/retrospective.md) and the [lifecycle retrospective](../v1/lifecycle-retrospective.md). Earlier owner endorsement was for future review, not approval to apply an amendment.

## Governing references and current inspection

- Storm Chaser remains pinned to [AICP 1.1.0 at `cb74fe9497d07370f44a18a09fec124ab99848ec`](https://github.com/jaychtw/game-development-standards/blob/cb74fe9497d07370f44a18a09fec124ab99848ec/AI-COLLABORATION-PROTOCOL.md). No selective or game-wide UGDS adoption is invented.
- Read the pinned protocol and templates, then checked standards `main`, which resolved to **`374143e614ed9d95bf2c413fb13711e802f2133c`** during closure. Its [AICP](https://github.com/jaychtw/game-development-standards/blob/374143e614ed9d95bf2c413fb13711e802f2133c/AI-COLLABORATION-PROTOCOL.md) reports **1.1.1** and adds §10 portfolio-publication guidance. This is inspection, not adoption or a new task.
- At that newer immutable reference, `CODEX-BRIEF.md` and `GDD-TEMPLATE.md` remain byte-identical to the project's pinned baseline. README, state and conversation templates have portfolio-status additions. Assess recommendations against those current files, not an assumed obsolete template.
- New portfolio guidance keeps project and portfolio deployments separate. Storm Chaser has neither release/publication authority nor a public project URL; no portal entry, artwork, account or deployment work is proposed or performed.
- No modification, commit, tag or push to `game-development-standards` is authorized. Public Storm Chaser docs contain technical records only, no credentials or private transcript. Separate ChatGPT Project conversations were not retrieved.

## Existing rules already sufficient

| Lesson / issue | Existing guidance | Disposition |
|---|---|---|
| Milestone drift, conflict and supersession | AICP §§3/5/6: distinguish intent/behavior/evidence, record material scope decisions | Keep core protocol; optional field S-02 helps apply it when scope changes. |
| Feature/software acceptance vs tests/deployment | AICP §§2/6; current state template separates owner acceptance, project deployment and portfolio publication | No new gate. S-04 improves a phase example for accepted local-only software. |
| Cross-conversation design preservation | AICP §§4/5/7, state/conversation templates | No amendment; link approved decisions and unavailable context explicitly. |
| Proportionate closure lessons and promotion | AICP §§8/9 | Already explicit; no mandatory new report or automatic standards adoption. |
| App versus game requirements | AICP §1 explicitly limits apps to adopted UGDS provisions; current conversation starter agrees | Conflicting defaults remain in two game-oriented templates: S-01. |
| Stale/expired retained data, malformed reply, irregular source times | AICP §6 requires suitable acceptance/evidence; these are technical domain contracts | Keep Storm Chaser tests/references. Candidate technical examples only if useful later; no generic meteorological thresholds. |
| Experiential originality, neutral Auto, scope deferrals and $0 | Project GDD amendments, ADRs and owner authority; AICP §§2/5 preserve constraints | Project-specific; do not impose a timeline, relevance policy or $0 architecture universally. |
| Performance/security evidence limitations | AICP §6 evidence labels and no public-readiness inference | No protocol amendment; retain source/environment/date/sample limits in reports. |

## S-01 — clarify template applicability (earlier candidate A)

**Status:** Proposed template clarification. **Targets:** current [`templates/CODEX-BRIEF.md`](https://github.com/jaychtw/game-development-standards/blob/374143e614ed9d95bf2c413fb13711e802f2133c/templates/CODEX-BRIEF.md) and [`templates/GDD-TEMPLATE.md`](https://github.com/jaychtw/game-development-standards/blob/374143e614ed9d95bf2c413fb13711e802f2133c/templates/GDD-TEMPLATE.md).

**Gap:** The brief says “No verified UGDS, no implementation” for all assignments and the GDD defaults to whole-UGDS adoption. They are game templates, but the repository also offers them for application work. Mechanical application conflicts with AICP §1. This is a wording/applicability gap, not evidence that this project's implementation was blocked by the template.

**Smallest candidate amendment:** add a project-type/applicability field and qualify the existing preflight/adoption sections, leaving game requirements intact:

> Project type / adopted standards: [game adopting pinned UGDS / non-game app with explicitly adopted provisions and immutable references]. For games adopting UGDS, the mandatory pinned-UGDS preflight and game acceptance requirements below remain binding. For non-game apps, read AICP and the approved product specification; list only explicitly adopted UGDS provisions and their pinned source. Do not infer whole-UGDS adoption from using this template.

In the GDD, introduce its whole-standard adoption paragraph with “For games adopting UGDS” and use an explicit adopted-provisions field for other apps. No automatic change to project acceptance criteria or existing game pins.

**Evidence/rationale:** [M3 reconciliation authority analysis](../reviews/m3-reconciliation.md#authority-and-evidence) and the existing candidate A; aligns templates with the already-approved protocol. **Tradeoff:** a short applicability choice; avoids an unnecessary separate process or duplicate standard. **Compatibility:** games retain all adopted gates; non-game apps gain an explicit path without unapproved game-loop/art obligations.

## S-02 — conditional milestone-lineage field (earlier candidate B)

**Status:** Proposed optional template field. **Primary target:** `templates/CODEX-BRIEF.md`, under Objective and boundaries; state index may link that brief rather than duplicate its matrix.

**Gap:** AICP already requires the decision; a reused milestone name can still obscure omitted objectives in a short assignment. Proposed one-line prompt, **only for materially changed scope**:

> Milestone lineage, if scope changed: [original objective(s); this brief's authorized subset/additions; outstanding or explicitly deferred objectives and approval reference]. Completion of this brief does not complete omitted objectives.

**Evidence/rationale:** original M3 comparison/relevance versus [M3-O](../m3-verification.md), [reconciliation](../reviews/m3-reconciliation.md), [ADR 0002](../adr/0002-product-reconciliation-proposed.md) and later [scope freeze](../adr/0004-v1-scope-freeze.md). **Tradeoff:** one conditional line; no mandatory matrix/document/new gate. **Compatibility:** applies to scope-changing game or app briefs; ordinary unchanged milestones need nothing extra.

## S-03 — conditional startup-side-effects field

**Status:** Proposed technical briefing clarification from V1-F; not a new AICP obligation. **Target:** `templates/CODEX-BRIEF.md`, engineering boundaries/local verification instructions, or a suitable existing operations reference chosen during separate standards review.

**Gap:** “Local startup” can hide a network collector or timer, despite a review-only brief. Existing authority rules prohibit unapproved activation but do not help an operator identify which command activates it. Small candidate prompt:

> For runnable services: identify startup commands and their network, background-job and filesystem effects; state which explicit command enables collection/scheduling, and give a review-safe launch path where applicable.

**Evidence/rationale:** [M3-E API source](https://github.com/jaychtw/storm-chaser/blob/129a3af3a13e882d8d92bcfd0360fdfa83b01cf7/server/index.ts) embedded a collector by default; [V1-F reader/package checks](../v1/verification.md) removed/tested that implicit activation. The reader may initialize its local archive, so “no collection” must not become an inaccurate “no writes” claim. **Tradeoff:** useful only where commands have material side effects; no scheduler or read-only architecture mandated for all projects. **Compatibility:** games with background networking can use it; frontend-only games/apps can omit it. Prefer this technical prompt over changing the core protocol.

## S-04 — represent closed local software in the state template

**Status:** Proposed small example/field clarification. **Target:** current [`templates/PROJECT_STATE.md`](https://github.com/jaychtw/game-development-standards/blob/374143e614ed9d95bf2c413fb13711e802f2133c/templates/PROJECT_STATE.md).

**Gap:** the phase examples end at “staging / released”; they do not show accepted software that closes without public release. The template already allows owner-approval references and separate deployments, so a new approval process is unnecessary. Smallest amendment:

> Current phase: [exploration / design / implementation / QA / staging / released / closed — accepted local software]. For a closed local baseline, identify the exact accepted source commit and owner-acceptance record; keep deployment/publication status separate.

**Evidence/rationale:** [Storm Chaser closure](../v1/closure-v1.0.md) records acceptance of `1.0.0-rc.1` without a tag/public release. **Tradeoff:** an example rather than another required artifact; projects may use their own lifecycle terms. **Compatibility:** local/private game builds and non-game tools both benefit; existing release/deployment fields stay intact. No portfolio publishing entitlement added.

## S-05 — current standards release-metadata discrepancy

**Status:** Proposed maintenance correction, not a new process rule. **Target:** [`CHANGELOG.md`](https://github.com/jaychtw/game-development-standards/blob/374143e614ed9d95bf2c413fb13711e802f2133c/CHANGELOG.md).

**Observed:** AICP/README report 1.1.1 at the inspected current commit, while its changelog has no AICP 1.1.1 entry (latest AICP entry is 1.1.0). AICP §8 already calls for a version/changelog record. Smallest recommendation: the standards owner adds an accurate entry for the actual §10 and companion template changes, after confirming their approval/versioning provenance. Do not invent approval dates, retag prior commits or treat the missing note as evidence the new policy was unauthorized. This does not block the pinned Storm Chaser closure. **Compatibility:** documentation hygiene only; no game/app behavior or acceptance change.

## Approval and versioning path — separate task, not started

1. Owner/advisory standards review may accept, revise, defer or reject each S-item independently. These are reviewable candidate words, not applied patches, adopted obligations or authority to start a standards branch.
2. If explicitly authorized later, prepare a narrow standards-only diff against its then-current immutable baseline. Check existing game examples/pins remain valid, non-game applicability is explicit, and prompts remain conditional. Prefer template changes; no UGDS product-quality change or core AICP expansion is justified here.
3. Record the owner approval reference and a named template revision plus changelog entry. If the standards owner chooses to amend AICP text, assign the appropriate next semantic version and changelog entry; do not silently edit 1.1.0/1.1.1 or their historic tags. S-05 should accurately document the already-published revision, not rewrite its approval history. This handoff assigns no new standards version.
4. Existing projects keep their pins/acceptance criteria. Any future Storm Chaser standards adoption requires a separate prospective owner record; closure does not reopen the product or update the pin.

No compulsory recurring review, background agent, new external tool, expense, portfolio entry or cross-repository implementation is proposed. Source-specific integrity examples and measured performance findings remain project/technical references until further evidence justifies promotion. **Stop with proposals delivered in the Storm Chaser documentation branch.**
