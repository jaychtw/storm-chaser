# Storm Chaser — M3-P Product Completion
## Final Implementation Authorization

**Project:** Storm Chaser  
**Repository:** https://github.com/jaychtw/storm-chaser  
**Review branch:** `review/m3-reconciliation`  
**Approved review commit:** `02dc7c2f1f1e61b5626f247bb9d1b9d8548c75e9`  
**Implementation baseline:** `b09928a4ed758e0c053e9da6eaad264cbdf4625f`  
**Milestone:** M3-P — Product Completion  
**Authorization:** Approved by product owner  
**Financial limit:** $0 new expenditure  
**Deployment authorization:** None

## 1. Governing authority

Before implementation, read:

1. `AI-COLLABORATION-PROTOCOL.md` from https://github.com/jaychtw/game-development-standards
2. `docs/Storm_Chaser_Design_Guide_v1.0.md`
3. `docs/reviews/m3-reconciliation.md`
4. `docs/reviews/m3-product-completion-brief.md`
5. `docs/adr/0002-product-reconciliation-proposed.md`
6. `PROJECT_STATE.md`
7. Relevant source dossiers, datum audit, M3 verification, operational architecture and existing tests.

Use AICP v1.1.0 at standards commit `cb74fe9497d07370f44a18a09fec124ab99848ec` as the approved prospective collaboration reference.

Storm Chaser is an application, not a game. Do not mechanically impose game-specific UGDS obligations.

The latest explicit owner decisions below govern the affected scope. Preserve original requirements and historical evidence, documenting changes and superseded decisions rather than silently rewriting them.

## 2. Approved decisions

The product owner approves the following:

- **Taiwan relevance:** Retain explainable Taiwan relevance-based Auto focus as a v1.0 objective. Do not fabricate scores, geographic precision, warning associations or meteorological confidence.
- **Multi-agency coverage:** Keep additional source integration conditional on verified lawful access and validated data. JMA remains the only integrated source.
- **Geographic precision:** Continue qualitative geographic visualization with explicit datum limitations. No unvalidated impact, coastal-intersection or closest-approach calculations.
- **Architecture:** Retain the existing single-host Node.js/SQLite/systemd design in principle. Do not activate or procure infrastructure.
- **Expenditure:** No new spending, subscriptions, paid services, billing enrollment or financial commitments. Document genuinely necessary or superior paid alternatives separately, with their benefits, costs and available free alternatives.
- **Milestone lineage:** Adopt M3-O for delivered operational hardening and M3-P for the present bounded product-completion cycle. Preserve the original M3 objectives and historical reports.
- **Historical cycle browsing:** Defer the user-facing historical issuance-cycle browser. Preserve clear current-cycle issue and validity information.
- **Official charts:** Existing clearly labeled official-page link fallbacks satisfy the approved chart-access requirement. No scraping, embedding or asset procurement is required.

These are approved decisions, not suggestions for Codex to reconsider without new evidence.

## 3. M3-P implementation objectives

### P0 — Correct cached-data expiry

Highest implementation priority.

Fix the reproduced discrepancy in which cached storm advisories and forecast overlays remain visible as current after their server-side validity or display-expiry limit has elapsed during an API outage.

Requirements:

- Apply explicit advisory validity and the existing local 24-hour display-expiry policy consistently on client and server.
- Preserve the existing 8-hour stale threshold unless independently justified changes receive owner approval.
- Do not treat successful API contact as proof of meteorological freshness.
- Distinguish current, stale-but-eligible, expired, and archived information.
- Remove expired advisories and their forecast overlays from current map presentation and Auto candidates.
- Preserve historical/raw evidence according to existing retention policies.
- Explain expired or unavailable coverage without implying that storms have dissipated or that the basin is clear.
- Ensure selected forecast-point details and map layers honor the same expiry rules.

Verification must cover network failure, advancing time, browser sleep/resume, background-tab restoration, offline operation, and recovery after reconnection.

Do not rely solely on receiving a new server response to expire cached information.

### P1 — Implement uncertainty-first Auto focus

**Approved behavior superseding the proposed newest-bulletin startup default:**

When Taiwan relevance cannot be established from validated source-supported criteria, Auto should present a **neutral regional map overview**, with no storm represented as the highest-priority candidate.

Display a bilingual explanation equivalent to:

- EN: "Taiwan relevance cannot currently be determined from the available information. Select a storm to explore its reported track."
- zh-TW: "目前資料不足以判定各風暴與臺灣的相關性。請選取風暴以查看其官方發布的路徑資訊。"

Requirements:

1. Auto ranking may operate only when sufficient, validated relevance evidence and an approved ranking methodology exist.
2. No newest-bulletin, nearest-center or arbitrary ordering may masquerade as Taiwan relevance.
3. A neutral overview must retain accessible discovery of all currently eligible storms.
4. Manual storm selection must remain available and persist until the user explicitly returns to Auto.
5. Returning to Auto under uncertain evidence restores the neutral overview rather than selecting a speculative priority.
6. If a manually selected storm expires or becomes ineligible, explain the loss of current eligibility, provide access to other eligible storms, and do not silently select another storm.
7. Preserve map/camera interaction where reasonable; avoid unexpected recentering during automatic updates.
8. Do not treat one available storm as evidence that its relevance to Taiwan is established.
9. Keep the eventual relevance-ranking objective explicitly open.

Implement a small, testable separation between candidate eligibility, evidence availability, focus selection and explanation.

Do not introduce geographic ranking thresholds, derived motion, new warning associations, confidence percentages or impact forecasts in this cycle.

### P1 — Restore missing reported information

Address the following documented product gaps:

**Storm motion**

- Show source-reported motion information when verified and available.
- Preserve native values, units, conditions and provenance.
- Validate the source's direction field before displaying direction.
- Explicitly identify unavailable information rather than inventing values or deriving direction from map geometry.

**Localization**

- Correct known Japanese field/class/unit labels appearing directly in the English and Traditional Chinese UI.
- Use documented, reviewed terminology.
- Preserve access to original source-native terminology where useful.
- Do not pass machine-translated official prose off as an authoritative translation.
- Preserve native wind conventions and distinguish sustained wind, gusts, pressure and missing values.

**Source states**

Distinguish:

- Source integrated versus not integrated.
- Successful retrieval versus data issuance/validity.
- Partial ingestion versus full successful collection.
- Upstream collection failure versus local API connectivity failure.
- Stale but eligible versus expired and excluded.
- No currently usable bulletin versus confirmed absence of storms.

Provide concise, comprehensible explanations in both languages.

Keep relevant source issue/control/valid/retrieval/check timestamps distinct and correctly attributed.

### P2 — Focused usability and accessibility regression

Investigate and repair, where reproducible:

- Keyboard focus loss during automatic data refresh.
- Disappearing or invalid selected forecast-point controls.
- Accidental camera reset during ordinary updates.
- Mobile source-access friction.
- Crowded markers and small touch targets.
- Overflow or illegibility in either language.

Test representative widths of 320, 390, 768 and 1440 CSS pixels, desktop keyboard interactions, mobile touch emulation and both languages.

Preserve the approved Night Operations identity and mobile map-first hierarchy.

A compact source accordion may be prototyped when it offers a measurable usability improvement, but material visual/layout changes require owner review before final acceptance. Avoid redesigning the interface merely for novelty.

## 4. Explicit exclusions

Do not implement or activate:

- New CWA/JTWC integration or credential enrollment.
- New paid or free-tier infrastructure services.
- Hosting procurement, production servers or public previews.
- Installed systemd services or unattended collection.
- Public deployment, release-candidate publication or DNS changes.
- Independent meteorological hazard prediction.
- Unsupported geographic distance, landfall or impact calculations.
- New historical cycle browsing or Time Travel.
- Forecast Showdown, notifications, telemetry or AI-generated weather conclusions.
- Database/framework migrations without an independently demonstrated blocking defect.
- Changes to unrelated repositories without separate authorization.

Existing authorized local development, controlled test execution and isolated fixtures may be used.

Actual JMA network collection is not required for M3-P acceptance. Any additional live-source verification must be bounded, permitted and reported separately; do not run unattended collection.

## 5. Implementation autonomy

You are authorized to implement the bounded M3-P requirements and perform ordinary engineering refactoring necessary to achieve them.

You do not need approval for minor internal implementation choices, test organization, localized data mappings supported by source evidence, or narrowly scoped defect repairs.

Escalate material product-design changes, newly required external services, source interpretation conflicts, unsupported meteorological assumptions, significant architectural changes or scope expansions.

Where uncertainty affects only one component, continue other authorized work rather than stopping the entire cycle unnecessarily.

## 6. Documentation and decision records

In the Storm Chaser repository:

1. Integrate the approved reconciliation review into the development history without overwriting original M3 evidence.
2. Update ADR 0002 to distinguish approved decisions from remaining proposals. Do not imply approval of unresolved matters.
3. Adopt and update `PROJECT_STATE.md` as the compact handoff index, with accurate milestone, revision, acceptance and deployment states.
4. Preserve historical GDD v1.0 and M3 reports; create forward references or a versioned amendment for superseding decisions.
5. Record M3-O and M3-P scope lineage clearly.
6. Keep blocked multi-agency comparison and unresolved Taiwan relevance ranking visible as unfinished original product objectives.

The separate standards improvement proposal is endorsed for future standards review, but **this assignment does not authorize modifications to `game-development-standards`**.

Do not silently revise UGDS or AICP, alter historical standards pins or certify unperformed requirements.

## 7. Verification and acceptance

Run the existing automated suites and add regression coverage for the changed behavior.

At minimum:

- Unit and integration tests for advisory eligibility, explicit validity, expiry and stale handling.
- Browser tests proving client-side expiry during persistent API failure without a successful refresh.
- Tests for sleep/resume and visibility restoration.
- Multi-storm tests verifying neutral Auto mode, manual selection, expiration and recovery.
- Source-state combinations and partial ingestion.
- Bilingual terminology and missing-data behavior.
- Keyboard and touch interactions.
- Responsive layouts and accessibility checks.
- Existing archival, provenance, correction, persistence and operational regressions.
- Production build verification.

Preserve or improve upon the existing 72-test baseline; report exact results rather than treating that number as an immutable requirement.

Produce actual desktop/mobile screenshots showing relevant current, stale, expired, unavailable, Auto-uncertain and manual-selection states as applicable.

Distinguish automated evidence from visual approval, physical-device testing and real-world meteorological validation.

Use isolated storage and controlled specimens for replay. Never contaminate live archives with synthetic information.

## 8. Completion deliverables

At the end of M3-P, provide:

1. Implementation summary and exact commit SHA.
2. Updated product requirement/acceptance matrix.
3. Test commands, results, failures and limitations.
4. Desktop/mobile bilingual visual evidence.
5. Confirmation of expiry and Auto-focus acceptance criteria.
6. Updated decision records and `PROJECT_STATE.md`.
7. Explicit list of unresolved Taiwan relevance, source-integration and release-readiness requirements.
8. Any consequential lessons suitable for future standards or template review, without automatically modifying those standards.

You may commit and push the completed authorized work to an appropriate development branch. Do not merge into `main` without separately established authorization. Do not deploy or publish a preview.

## 9. Mandatory stopping conditions

Stop and request product-owner approval before:

- Any expenditure or financial commitment.
- Any external service or infrastructure activation.
- Material changes to approved meteorological semantics or product behavior outside this brief.
- Introducing a relevance-ranking algorithm not supported by validated evidence and explicit owner approval.
- Merging into `main`, preparing a public release, or deploying the application.

**M3-P completion is a review gate, not release authorization.**

Deliver the implementation and evidence for review, then stop.

**Governing objective:** Make Storm Chaser more trustworthy, more understandable and more faithful to its approved product vision while preserving the substantial engineering work already completed.
