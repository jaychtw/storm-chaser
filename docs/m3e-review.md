# M3-E — Forecast-Time Explorer POC and experiential review

2026-10-29 Asia/Taipei. **Working POC for owner review; not a production-integrated or accepted feature.** Development branch: `development/m3-e-forecast-time-explorer`. Baseline: `12dc2fc23ded833e8ba539fddd67caddde2af477`. The final handoff gives the exact delivery SHA; source/test digests are in [verification metadata](m3e-verification.json).

Authority: [M3-E owner assignment](briefs/m3-e-authorization.md), [ADR 0003](adr/0003-experience-layer-poc.md), approved Guide v1.0 and M3-P amendment, AICP 1.1.0 at `cb74fe9497d07370f44a18a09fec124ab99848ec`. M3-P visual design is now owner-accepted. Its reported technical evidence and this cycle's verification remain distinct from owner technical acceptance, M3-E visual/usability acceptance and public readiness. Original evidence and requirements are preserved.

## Rationale and implemented POC

The interaction answers **“What does this advisory publish for each forecast time?”** It turns the same verified JMA points into a repeatable chronological exploration: step, see the exact highlighted published center, read its time and inspect native evidence. The innovation is the experience layer, not new weather information or a new forecast.

The [concept/semantic contract](design/m3-e-forecast-time-explorer.md) was written before implementation. The bounded implementation adds one panel in the existing map column, with a native discrete slider and previous/next controls. It synchronizes with existing map markers and the original detailed time list. It preserves the approved shell, source stations, mobile map-first order, neutral Auto and manual selection. No broad layout redesign or secondary interaction was implemented.

Analysis is a distinct baseline; each future step is explicitly **a prediction, not an observation**. Current analyzed center stays visible when a forecast is emphasized. Forecast emphasis changes discretely on the existing exact marker; the camera does not move. No animated storm, autoplay, position tween, invented intermediate points, probability, impact judgment or wind conversion. This avoids implying physical movement along the cartographic connectors.

Steps are publication indices, **not a uniformly scaled elapsed-time axis**. The saved specimen has leads 0/12/24/45/69/93/117h. Actual valid time, lead and next-step gap are displayed; the 24→45h gap is 21h. This constraint is stated in both languages and in the slider's accessible description. The native values and original advisory URL/issue time stay attached to the selected record. No new issuance-cycle browser is introduced.

The panel's small source-evidence disclosure supports the required point context; it does not redesign global source cards or implement the broader progressive-disclosure proposal. The original detail/list route remains available.

## Before/after comparison

Both versions were actually built and rendered with the **same saved JMA specimen, fixed replay time, viewport, locale and +45h point**. The baseline was exported from the exact Git commit into an isolated temporary directory; no checkout reset, backend, collector or data store was needed. All screenshots carry a visible controlled-replay banner. A mobile offscreen WebGL capture artifact was corrected by bringing the map into view and allowing a paint before recapture; the comparison is not a claimed improvement in the underlying basemap.

| Aspect | Before M3-E: M3-P | M3-E POC |
|---|---|---|
| Entry | Select a map marker, or open details and choose a time button. | Published-step timeline directly below the map; previous/next and native keyboard/mouse/touch slider. |
| Temporal structure | Individual times available, but exploration is a series of separate point selections. | Ordered steps, selected lead/valid time, count and explicit irregular interval to the next record. |
| Map feedback | Selected-point details appear; no distinct persistent forecast-time highlight. | Exact corresponding forecast marker gains a static emphasis; analysis stays visually separate. |
| Context | Point values in the detailed panel. | Selected coordinates/valid time/issue/source near the timeline; expandable native point values; original detail route retained. |
| Mobile | Time list/point detail require opening the system details. | Can step without opening the long system detail panel; 44px controls and touch-emulated navigation verified. |
| Cost/semantics | Existing source and backend. | Same source, values, backend and geometry; no dependency/service/asset added. |

This is not universally fewer clicks: a single visible map marker can already be a fast route. The added value is a discoverable, consistent time sequence and synchronized emphasis when users do not know which marker to choose, or markers overlap. User preference and comprehension remain hypotheses until human review.

Actual comparison links:

| View | Before: exact M3-P build | After: M3-E +45h selection |
|---|---|---|
| Desktop EN | [Before](screenshots/m3e/before-desktop-en-plus45.png) | [After](screenshots/m3e/after-desktop-en-plus45.png) |
| Desktop zh-TW | [Before](screenshots/m3e/before-desktop-zh-TW-plus45.png) | [After](screenshots/m3e/after-desktop-zh-TW-plus45.png) |
| Mobile EN | [Before](screenshots/m3e/before-mobile-en-plus45.png) | [After](screenshots/m3e/after-mobile-en-plus45.png) |
| Mobile zh-TW | [Before](screenshots/m3e/before-mobile-zh-TW-plus45.png) | [After](screenshots/m3e/after-mobile-zh-TW-plus45.png) |

Additional evidence: [stale desktop EN](screenshots/m3e/after-desktop-en-stale.png), [stale mobile zh-TW](screenshots/m3e/after-mobile-zh-TW-stale.png), [expired desktop EN](screenshots/m3e/after-desktop-en-expired.png), [expired mobile zh-TW](screenshots/m3e/after-mobile-zh-TW-expired.png), [insufficient forecasts](screenshots/m3e/after-desktop-en-insufficient.png). Full names/checks: [explorer results](m3e-explorer-results.json).

## Seven-question experiential assessment

These are evidence-supported **engineering/design judgments**, not measured user outcomes or owner acceptance.

| Evaluation question | Assessment and evidence | What remains to validate |
|---|---|---|
| 1. Different from selecting existing markers? | Yes in interaction structure: a sequential time lens, visible ordinal/lead/gap, synchronized persistent highlight and nearby context. It does not add source information. | Whether the distinct interaction is compelling enough to retain. |
| 2. Easier temporal comprehension? | Ordered native times and explicit 21h/24h gaps expose structure hidden by spatial marker browsing. | Casual users may mistake equal slider spacing for equal elapsed time despite the label; test this specifically. |
| 3. Encourage exploration without losing clarity? | Reversible previous/next and Home/End provide a low-risk route; prediction/analysis labels, source link and camera stability preserve context. | Engagement and discovery are unmeasured; no autoplay used to create apparent activity. |
| 4. Understandable without extensive instructions? | A short bilingual instruction and familiar native control; arrows have accessible names. | No independent first-use/casual-user study. Ask a reviewer to find +45h and explain the analysis/forecast distinction without coaching. |
| 5. Useful on mobile? | Actual 390px renders, touch taps, and 320/390/768/1440 overflow checks pass. Time selection is outside the collapsed details. | Physical-device thumb ergonomics, slow devices and a map/controls-at-once view need owner/device review; the panel still adds vertical content. |
| 6. Faithful to official information? | Selected time/coordinates match saved source records; native units/missing values preserved. Parent/point expiry and stale behavior tested. | No current-weather observation or meteorological/scientific validation performed this cycle; existing datum/schema/source limits remain. |
| 7. Complexity justified? | Small client-only component/model, existing MapLibre and data; no new library/backend. Native slider DOM is retained during drag. | The slider duplicates an existing list and needs explanatory microcopy; retain only if owner/human feedback supports its benefit. |

Recommended owner review task: select IN-FA, go to +24h then +45h, explain the time gap, identify which position is a prediction and which is analysis, inspect native source evidence, return to Auto, and repeat on a phone-sized view. Success requires the explanation to match the source, not merely completing clicks. No numerical comprehension target is invented from untested participants.

## Secondary opportunities — assessed, not implemented

Effort estimates are rough local engineering scope, not quotes, dates or spending commitments.

| Opportunity | User benefit | Existing data needed | Complexity / limitations | Effort and recommendation |
|---|---|---|---|---|
| Broader progressive disclosure | Reduce the long source/metadata wall for casual visitors while preserving a clear path to evidence. Baseline/POC mobile captures demonstrate the vertical burden. | Existing source health, native point fields, issue/valid/retrieval metadata and official links; no new source. | Need clear always-visible coverage/stale/datum warnings and keyboard focus. Hiding required limitations would defeat trust. Existing mobile details are already collapsed, so further gain must be demonstrated. | Small, roughly 1–2 focused development days plus review. **Best next exploration candidate only after this POC is accepted**, because reducing source clutter adds a benefit independent of the time lens. Not authorized for implementation here; validate a small comparison first. |
| Forecast-horizon-centered perspective across storms | Let visitors ask what information is published for a selected horizon rather than entering through one storm. | Current advisory points for each eligible storm, native lead/valid/issue times and missingness. | Mixed issue times and irregular leads cannot be silently aligned. No record at an exact horizon must mean “unavailable,” not interpolation. One real system at the prior capture limits empirical demonstration; must not become a relevance ranking. | Medium, roughly 3–5 focused development days plus semantic/UX review. **Not recommended now**: duplicates much of the time explorer and introduces cycle-alignment complexity without demonstrated added demand. |

No second interaction, cross-storm aggregation, source accordion or temporal matching engine was implemented. No original required functionality was cancelled.

## Executed verification

| Command | Observed result |
|---|---|
| `npm test` | **110 passed, 0 failed/skipped**, five files: existing 97 retained plus 13 explorer semantic cases. Includes archive/provenance/corrections/restart/retention regressions. |
| `npm run build` | TypeScript/Vite pass. ~1,004 kB JS /277 kB gzip; existing large-bundle warning persists. No new dependencies. |
| `npm run test:browser` | Demo regression passed; 7 axe scans, zero violations. [Results](m3e-demo-browser-results.json). |
| `npm run test:live-browser` | Saved-official pipeline/UI regression passed; 5 axe scans, zero violations. [Results](m3e-pipeline-browser-results.json). |
| `npm run test:product-browser` | All 25 M3-P acceptance groups passed; 16 axe scans, zero violations. [Results](m3e-product-acceptance-results.json). |
| `npm run test:explorer-browser` with both local URLs | **25 explorer checks**, 13 axe scans, zero violations; **17 actual replay screenshots**, including four matched before/after pairs. [Results](m3e-explorer-results.json). |
| `npm run review:explorer -- --smoke` | Local manual-review harness smoke passed: persistent replay banner, frozen clock, neutral Auto and published-step selection. Headful interaction is not claimed tested in this cloud run. |

Total: **41 automated accessibility scans, zero reported violations**. These scans do not certify screen-reader, physical-device, owner visual or casual-user usability acceptance. Node 24.19.0, npm 11.9.0, Chromium 154.0.8037.57 with software WebGL. Baseline frontend was built from its pinned source; no current JMA collection or live archive writes occurred. Test metadata/digests link the evidence to code. Prior M3-P artifacts were not overwritten. Remote CI is not claimed; delivery uses `[skip ci]` to avoid starting remote jobs under the $0 boundary.

Focused coverage includes ordered irregular times, exact source coordinates, native values/provenance, analysis vs forecast, estimate exclusion, missing/insufficient forecasts, keyboard Home/End/arrows, native mouse drag with stable control identity, touch stepping, locale preservation, stable camera, marker/list synchronization, hidden layer, reduced-motion mode, stale eligibility, individual point expiry, explicit parent validity and >24h expiry during failed API/resume. No intermediate source position can be selected.

## Reproducible local review

Requires Node 24, existing project dependencies and Chromium/Playwright; no weather credential. Run only a loopback frontend, **no API or collector**:

```sh
npm ci
npm test
npm run build
./node_modules/.bin/vite preview --host 127.0.0.1 --port 4183 --strictPort
```

In a second terminal on a graphical desktop:

```sh
PREVIEW_URL=http://127.0.0.1:4183 npm run review:explorer
# Optional phone-sized touch-emulated browser:
REVIEW_WIDTH=390 PREVIEW_URL=http://127.0.0.1:4183 npm run review:explorer
```

The harness opens a private local browser context, blocks external requests, supplies only the saved specimen to `/api/live`, freezes the Date clock at its replay time and displays a persistent bilingual “NOT CURRENT WEATHER” banner. It does not serve data, expose a preview, seed storage or start a collector. Official-source URLs are preserved, but external navigation is blocked in this isolated context; this is not a live source-access check. Select the storm and explore; close the browser/Ctrl+C when done, then stop the frontend. Headful mode needs a graphical display. For automated review in this cloud environment:

```sh
PREVIEW_URL=http://127.0.0.1:4183 npm run review:explorer -- --smoke
PREVIEW_URL=http://127.0.0.1:4183 npm run test:browser
PREVIEW_URL=http://127.0.0.1:4183 npm run test:live-browser
PREVIEW_URL=http://127.0.0.1:4183 npm run test:product-browser
PREVIEW_URL=http://127.0.0.1:4183 npm run test:explorer-browser
```

To regenerate the exact baseline comparison, export commit `12dc2fc` with `git archive` into a separate temporary directory, use the existing dependency installation, build it, and run its frontend on loopback port 4185. Set `BASELINE_URL=http://127.0.0.1:4185` with the last command. This optional baseline is recorded explicitly; a run without it must not claim fresh before/after evidence. Do not reset the working checkout or run either backend.

## Decision status, limitations and stop gate

- M3-P visual acceptance and the experience-first priority are **approved** in [ADR 0003](adr/0003-experience-layer-poc.md).
- The [GDD amendment v1.0.2](amendments/design-guide-v1.0-m3e-proposed.md) is **proposed wording**. POC adoption, new visual acceptance and any secondary expansion await owner review.
- Taiwan relevance methodology and multi-agency comparisons remain unfinished; neutral Auto and CWA/JTWC restrictions are unchanged. No historical issuance browser, source access bypass, new warnings or precise geography was added.
- Datum, schema variants, same-URL changes, long archive gaps, physical-device/screen-reader checks, actual unattended hosting, off-host restoration, edge/security/rollback and RC acceptance retain earlier limits. Source records are predictions, not independently validated truth.
- No expenditure, account/billing/free-tier enrollment, service/host activation, public preview, merge to main or deployment. Temporary loopback frontend processes used for tests are stopped at delivery; no collector was run.

[PROJECT_STATE](../PROJECT_STATE.md) indexes current status. Reusable lesson: a published-time control must expose irregular gaps and distinguish stepping through records from simulated motion. This is recorded as a project technical/design lesson; it is not sufficient evidence for a new universal AICP/UGDS rule. Existing standards proposals stay for separate review; no governing standards or unrelated repository was modified.

**Stop at M3-E POC review.** The owner decides accept/revise/reject before production integration or another experiential cycle.
