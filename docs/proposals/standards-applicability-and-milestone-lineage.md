# Standards change candidates — application briefs and milestone lineage

Date: 2026-10-29, Asia/Taipei. **Proposal only**, under AICP 1.1.0 §9. Governing baseline inspected at standards commit `cb74fe9497d07370f44a18a09fec124ab99848ec`. No files, tags, versions or pins in `game-development-standards` were modified. No new universal obligation is adopted here.

## Observed lessons

1. Storm Chaser's approved guide calls M3 “Multi-source comparison and relevance”; the later authorized M3 brief concerns operational hardening. Both records can be accurate while the same milestone label obscures an incomplete objective. See the [project reconciliation](../reviews/m3-reconciliation.md). This is a project-local scope lineage issue with a plausible cross-project lesson; recurrence across projects is not established.
2. AICP explicitly covers non-game apps and says apply only expressly adopted UGDS provisions. However, `templates/CODEX-BRIEF.md` has an unconditional mandatory UGDS preflight and game-specific acceptance/workflow. Applying it mechanically to an app can create an unnecessary blocker or unsupported retroactive adoption. The template itself was not the Storm Chaser assignment; no such blocker was imposed in this review.

## Candidate A — brief/template applicability clarification

Route: standards `templates/CODEX-BRIEF.md`, optional small companion change to GDD template. **Do not revise UGDS game-quality requirements.**

Proposed insertion:

> For games adopting UGDS, complete the mandatory pinned-UGDS preflight below. For non-game applications, read AICP and the approved product specification, identify only explicitly adopted UGDS provisions, and record their pinned source and applicability. Do not silently adopt game-specific obligations or treat a current standards branch as an approved historical pin.

Impact: clarifies the existing AICP boundary; avoids conflicting template instructions and false certification. Tradeoff: the brief needs a short project-type/applicability field. Existing game pins/gates remain unchanged. Owner standards review should confirm wording before any template revision; if adopted, record it in CHANGELOG under a named template revision. Do not automatically update adopting projects.

## Candidate B — scope lineage, with no new bureaucracy

Route: optional one-line field in the brief/state templates, supported by existing AICP §§3/5/6. AICP already requires conflicts and material decisions to be explicit; a new mandatory reconciliation document is unnecessary.

Proposed field:

> Milestone lineage: original objective(s), this brief's authorized subset/additions, unresolved objectives, and acceptance status. A completed brief does not complete omitted objectives.

Impact: prevents delivery labels from overwriting product intent; useful when an owner redirects a cycle. Tradeoff: one line of maintenance; use only when scope differs materially. This single project supports a lightweight template clarification, not a new universal QA gate. Prefer the template field over another AICP version unless standards review identifies a real protocol gap.

## Change-control path

Present candidates for owner/advisory standards review. If accepted, prepare a separate standards change with exact diff, changelog/revision, compatibility statement and owner approval. No cross-repository push is authorized by this planning assignment. Pinning a revised standard in Storm Chaser requires its own explicit prospective record; do not silently replace the reference inspected here.

No UGDS product-quality amendment is proposed from this cycle: bilingual, responsive, evidence and honest-readiness practices already exist. Storm-specific source, datum and expiry rules belong in Storm Chaser, not a universal game standard.
