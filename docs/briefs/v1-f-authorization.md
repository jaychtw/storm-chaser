# Storm Chaser — V1-F: Version 1.0 Finalization

**Repository:** https://github.com/jaychtw/storm-chaser  
**Baseline commit:** `129a3af3a13e882d8d92bcfd0360fdfa83b01cf7`  
**Baseline branch:** `development/m3-e-forecast-time-explorer`  
**Milestone:** V1-F — Product Scope Freeze and Software Finalization  
**Expenditure limit:** $0 new expenditure  
**Public deployment:** Not authorized  
**Main branch merge:** Not authorized without separate approval

## 1. Authorization and context

The product owner has completed the M3-E review and approved moving Storm Chaser toward a bounded v1.0 product.

The owner accepts Forecast-Time Explorer for inclusion in the v1.0 product scope and approves freezing disproportionately difficult or externally dependent functionality.

Before beginning, read:

- AICP v1.1.0 at standards commit `cb74fe9497d07370f44a18a09fec124ab99848ec`.
- The original Storm Chaser Design Guide and approved amendments.
- ADR 0001, ADR 0002 and ADR 0003.
- `PROJECT_STATE.md`.
- M3-O, M3-P and M3-E verification reports.
- M3-E design rationale and proposed GDD amendment.
- Existing tests and release-readiness documentation.

Use the approved decisions below as the current product direction. Preserve historical records and distinguish source-backed verification from owner acceptance.

## 2. Approved v1.0 product definition

**Storm Chaser v1.0 — JMA-first Experiential Cyclone Viewer**

The product transforms existing, lawfully usable public meteorological information into a distinctive, accessible, integrated experience.

Its originality is primarily in organization, presentation and interaction, not in producing independent meteorological information.

The frozen v1.0 functionality includes:

1. Western North Pacific/South China Sea interactive regional map.
2. Official JMA storm-center and forecast-position visualization.
3. Manual storm selection and neutral uncertain Auto overview.
4. Forecast-Time Explorer using discrete officially published analysis and forecast times.
5. Source-reported motion, intensity and other validated native values.
6. English and Traditional Chinese UI.
7. Approved Night Operations identity and responsive map-first design.
8. Source attribution, provenance, original bulletin links and official-chart page fallbacks.
9. Accurate fresh/stale/expired/unavailable/partial information states.
10. Local collection, archival, retention and recovery capabilities within previously approved architecture.

No independent forecasting, impact assessment or unsupported storm-priority ranking is authorized.

## 3. Feature freeze and deferrals

Record the following as deliberately deferred, not forgotten or silently completed:

| Capability | Reason for deferral | Reopening criterion |
|---|---|---|
| Taiwan relevance ranking | No approved validated relevance methodology | Reliable evidence and owner-approved ranking rules |
| CWA integration | Authorized credential and actual payload verification outstanding | Lawful access, validated semantics and feasible operation |
| JTWC integration | Access/reuse feasibility unverified | Verified permitted access and reuse conditions |
| Multi-agency comparison | Requires independent validated feeds | At least two usable, compatible sources |
| Historical cycle browsing and Time Travel | Beyond frozen initial experience | Validated historical coverage and demonstrated user value |
| Forecast Showdown | Requires defensible cycle alignment and comparison methodology | Approved methodological design and suitable source data |
| Precise impact/proximity calculations | Datum and interpretation limitations | Adequate source evidence and separate authorization |
| Additional perspective/disclosure features | Not required for current coherent experience | Evidence of meaningful user benefit |

Do not treat these deferrals as bugs or blockers against the frozen v1.0 scope.

Record them in a deferred-capabilities register with clear reopening conditions.

Do not delete their original rationale or historical specifications.

## 4. First workstream — reconcile documentation

Create a versioned v1.0 scope-freeze decision record.

Adopt the approved experience-first philosophy and Forecast-Time Explorer interaction in an appropriately versioned GDD amendment.

Update ADR 0003, `PROJECT_STATE.md` and README navigation to distinguish:

- Approved product identity.
- Accepted feature scope.
- Deferred functionality.
- Completed and unverified technical requirements.
- Software-package completion.
- Owner release acceptance.
- Public operational readiness.

Use a conservative local-first delivery assumption until the product owner explicitly confirms another delivery model.

Do not imply that accepting the feature scope constitutes production deployment acceptance.

## 5. Second workstream — consolidate the software

Integrate and stabilize the approved M3-O, M3-P and M3-E capabilities.

Priorities:

- Remove avoidable duplication and demonstrably defective interaction behavior.
- Ensure Forecast-Time Explorer and original forecast selection agree on source time, point identity, expiry and selection.
- Preserve exact published forecast times, including irregular intervals.
- Verify map behavior, camera state, source links, keyboard controls and mobile layouts.
- Review localization consistency across navigation, measurements, source explanations and forecast-time interactions.
- Preserve failure/expiry integrity and source-data isolation.
- Maintain the existing source pipeline, archival safeguards and bounded storage.

Do not introduce new frameworks, external providers, paid dependencies or major architectural changes merely to modernize the code.

Do not implement additional experiential features during finalization.

## 6. Third workstream — reproducibility and packaging

Prepare Storm Chaser as a coherent software package suitable for installation and local operation on existing authorized resources.

Deliver:

- Supported runtime and dependency specifications.
- Reproducible build and test instructions.
- Local installation/start/stop instructions.
- Clear distinction between frontend-only controlled demonstration and live JMA-backed local operation.
- Required configuration and environment variables.
- Basic backup/restore documentation.
- Data retention and operational limitations.
- Troubleshooting and known-issues documentation.

Instructions for live local collection may be documented, but do not activate an unattended service, enroll an external account, procure hosting or change the owner's environment without separate authorization.

Do not promise uninterrupted operation on an ephemeral workspace.

## 7. Fourth workstream — final software QA

Run the established suites and extend coverage only where necessary for the frozen scope.

Verify:

- Existing 110-test baseline or its transparently justified successor.
- All applicable browser regression suites.
- Forecast-Time Explorer interactions.
- Explicit source validity and local data expiry.
- Neutral Auto/manual selection and retirement.
- Current/stale/partial/expired/unavailable states.
- Bilingual terminology and accessibility.
- Representative desktop and mobile viewport behavior.
- No synthetic information in official collection or live archives.
- Archive, retention, recovery and provenance regressions.
- TypeScript and production build.

Report exact results, source commit, environment and evidence paths.

Review the existing JavaScript bundle-size warning. Measure or characterize its practical effect using available local tooling. Optimize only if there is a demonstrated user-facing or release-relevant problem; do not expand into a speculative framework rewrite.

Perform available static/local security and dependency checks without activating outside services or spending money. Record checks requiring an operational host as unverified, not passed.

## 8. Acceptance criteria

V1-F is ready for owner acceptance when:

1. All frozen v1.0 features are present and integrated.
2. Relevant regression tests pass or exceptions are fully documented and assessed.
3. Known integrity defects with material user consequences are resolved.
4. English and Traditional Chinese presentation remains consistent.
5. The user can explore a JMA advisory geographically and chronologically without fabricated positions or implied independent predictions.
6. The application clearly identifies missing, stale and expired information.
7. A supported local installation and operation path is documented and reproducible with existing authorized resources.
8. All frozen or externally blocked capabilities are accurately documented.
9. No expenditure, external activation, public deployment or unauthorized merge occurs.

If a criterion cannot be verified without paid infrastructure, actual host operation, physical devices or external access, report it explicitly and distinguish it from the completed software scope.

## 9. Deliverables

Prepare a reviewable development branch containing:

1. Finalized application code.
2. Versioned v1.0 scope-freeze ADR and GDD amendment.
3. Deferred-capabilities register.
4. Updated `PROJECT_STATE.md`.
5. Installation, operation and troubleshooting instructions.
6. Acceptance matrix and verification report.
7. Final desktop/mobile bilingual screenshots.
8. Software limitations and separate public-service readiness checklist.
9. Exact commit SHA and GitHub review links.
10. A concise retrospective identifying reusable cross-project lessons, without modifying shared standards automatically.

## 10. Explicit restrictions

**Do not:**

- Merge into `main` without explicit approval.
- Create a public release or publish a public preview.
- Deploy or activate hosting.
- Start unattended meteorological collection.
- Purchase, subscribe, activate billing or enroll in external paid/free-tier services.
- Expand the feature scope without approval.
- Claim that local tests prove continuous public-service reliability.
- Change shared AICP/UGDS standards in this assignment.
- Report frozen requirements as implemented when they are deferred.

Commit and push the bounded V1-F work to a dedicated development branch for review.

Stop at the product-owner acceptance gate.

**Primary objective:** Finish the product we have chosen, not enlarge the product we imagined.
