> Historical proposal from review commit `02dc7c2`. The owner subsequently authorized bounded M3-P in the [Final Implementation Authorization](../briefs/m3-p-authorization.md). Its neutral Auto rule supersedes this draft’s recency-default alternative; consult [ADR 0002](../adr/0002-product-reconciliation-proposed.md) and the [guide amendment](../amendments/design-guide-v1.0-m3p.md). Original draft content remains below for lineage.

# Proposed implementation brief — M3-P product completion

Date: 2026-10-29, Asia/Taipei. **Proposed; not authorized to begin.** Owner: product owner. Implementation: Codex. Design/product review: owner with advisory ChatGPT. Source baseline: `b09928a4ed758e0c053e9da6eaad264cbdf4625f` (resolve the approved starting revision again before implementation).

Review publication: the owner authorized committing and pushing documentation to **`review/m3-reconciliation` only**, without merging into `main`. Publication does not approve this brief, its proposed interaction rules or M3-P execution.

## Objective and authority

Preserve delivered M3 operational hardening and close the bounded product/data-display gaps in the [reconciliation](m3-reconciliation.md). Restore a clear path toward the approved Taiwan relevance objective without manufacturing evidence. This cycle must not be reported as full original M3 completion unless its conditional source/ranking gates actually pass.

Authority: [Guide v1.0](../Storm_Chaser_Design_Guide_v1.0.md), prospective [ADR 0002](../adr/0002-product-reconciliation-proposed.md), [datum audit](../m3-datum-audit.md), JMA [M0 evidence](../sources/m0-completion.md), [ADR 0001](../adr/0001-jma-operations.md) as limited by $0 authorization, and AICP 1.1.0 at standards `cb74fe9497d07370f44a18a09fec124ab99848ec`. No UGDS game-specific obligation is silently adopted.

## In scope and order

### P0 — display validity during local API failure

Re-evaluate advisory-level explicit validity and current 24-hour expiry in the browser even when the last API snapshot is retained. Preserve raw/archive content and current 8-hour stale/24-hour expiry policies. Separate “last-known expired record” from a current eligible system. An expired record may be available in explicitly labeled historical details, but must not supply current forecast overlays or priority candidates. Do not infer dissipation or basin clearance from expiry.

Proposed display contract (pending owner review): eligibility, freshness and archival retention are separate dimensions. A stale record can remain eligible; an archived record is not necessarily current or expired.

| Information state | Meaning | Proposed outage behavior |
|---|---|---|
| Current / fresh | Advisory is eligible under explicit source validity and local age policy, with sufficiently recent successful collection. | Recalculate age and validity from preserved source timestamps and the current client clock. A failed local API request must not renew freshness or advisory validity. |
| Stale, still eligible | Last-known advisory remains within its display validity, but source age, collection age or local API failure makes freshness uncertain. | Retain it with prominent stale/last-known labeling, original issue/valid/retrieval times and the connection limitation. Do not describe the center as a newly observed position. |
| Expired | Explicit source validity has ended, or the existing local 24-hour display-age limit has been exceeded. | Exclude from current centers, forecast overlays and Auto candidates even if individual forecast valid times remain in the future. Explain whether source validity or local display policy caused exclusion; neither proves dissipation. |
| Archived | Raw or normalized information retained under the existing bounded storage policy; this is storage status, not meteorological freshness. | Do not delete archived evidence merely because display eligibility ends. Label any historical view as archived with source/as-of context. Do not present the browser cache as a verified archive or promise access while the API is unreachable. No new archive-browser feature is required. |

Evaluate expiry during failed refreshes and resumed/backgrounded sessions, not only after a successful API response. Expire a selected forecast-point detail consistently with its parent advisory. When source coverage cannot be checked, say so; do not convert an expired/empty current view into “no storms.” Client/server policy consistency must be testable without changing existing thresholds silently.

Acceptance: controlled specimen at initial fresh time → API network failure → advance beyond explicit validity and separately beyond 24-hour age. Current centers/forecast overlays and Auto candidates exclude expired advisories, source/history timestamps remain inspectable where retained, both locales explain the gap, and no synthetic replacement appears. Test stale-but-unexpired retention separately. Prove behavior against browser clock advancement, not only a new server response.

### P1 — uncertainty-first focus contract

Before coding, owner reviews the proposed policy:

1. Evaluate only verified, currently eligible source records. The present source does not establish an associated Taiwan warning or a validated impact/proximity signal.
2. Where relevance evidence is insufficient, display **“Priority uncertain — Taiwan relevance cannot currently be ranked.”** Never give a relevance score or imply newest means most relevant.
3. Keep the prior eligible Auto selection stable. On first load with no prior selection, a deterministic latest-Control-time choice may be used **only as a disclosed display default**, with stable ID tie-break; it is not a relevance winner. If that default is declined, use a neutral regional view and ask users to select a storm.
4. Preserve manual focus until the user returns to Auto. If the selected system becomes ineligible, explicitly explain its removal and offer eligible systems; do not silently switch a manual selection to a supposedly safer system. No storms means none selected.
5. Show the evidence limitation and source/issue/as-of context near the selector/map in both languages. No unsupported “confidence percentage.”

Build a small testable focus module separating candidate eligibility, evidence availability, selection and rationale. This supports later documented signals without requiring a new service. In this cycle, **do not implement geometric Taiwan ranking, coast intersection, nearest-approach distance, derived motion, probabilities or a warning association guessed from names**. A configurable country parameter may stay internal; expose Taiwan only.

Acceptance: multi-system controlled cases verify stable uncertain selection despite unrelated newest-advisory changes, deterministic startup, tie behavior, manual override, manual retirement, stale/expired/missing evidence, empty view, and locale preservation. Clearly mark cloned/mutated official specimens as controlled scenarios in isolated test storage. Never insert them into live collection. Report this as **fallback/contract completed, relevance ranking still limited**, unless independently supported ranking criteria are separately approved.

Proposed bilingual fallback text: **“Taiwan relevance uncertain. Showing the latest bulletin as a display default, not a relevance ranking.”** / **「尚無足夠資料判定對臺灣的相關性。此為依最新公告選取的預設顯示，並非臺灣相關性排序。」** Use that recency explanation only when recency actually selected the startup default. A retained Auto choice instead explains that the prior eligible display selection was kept; a manual choice explains user selection. Newest-bulletin arrival alone must not change the claimed relevance, and bulletin recency must never be described as evidence of Taiwan impact. Exact text and the startup alternative remain proposals.

An optional design dossier may compare future official-warning association and coarse ordinal source-supported relevance signals. It must identify source fields, validation evidence, ambiguity, datum implications, thresholds and counterexamples (including farther approaching vs nearer departing storms). It is a proposal, not permission to implement a new hazard model. No credible basis means retain “uncertain.”

### P1 — source stations and bilingual reported data

- Show selected-system JMA issue time separately from last check/success/retrieval. Generic official map links must not be labeled as a storm-specific chart or current chart cycle.
- Distinguish integration status, collection freshness and available data: JMA partial ingestion/quarantine, source failure, local API loss, stale-but-valid and expired/excluded; CWA not integrated/credential-and-verification gate; JTWC not integrated/access-and-rights gate. Use safe user-facing reasons, never raw credentials, stack traces or unsupported HTTP diagnoses.
- Display source-reported motion speed and missingness/conditions. Verify the documented native direction field before extending normalization; if unavailable, say unreported. Preserve values and source-native metadata; do not infer direction from drawn lines.
- Map known JMA field/class/unit labels to reviewed EN/zh-TW UI terminology while retaining native data/provenance and exposing the original as useful. Keep ten-minute maximum wind separate from gusts. Unknown native terms remain visible with an explicit untranslated/source label, rather than an invented translation. Do not translate source prose and claim it is official.
- Distinguish delayed/stale (`資料延遲` or owner-reviewed equivalent) from expired/excluded (`已失效／排除`, wording subject to review). Keep official warnings separate from application health and attention priority.

Acceptance: saved specimen values match raw/normalized/UI records in both locales; issue/control/valid/retrieval/check times are not interchanged. Missing, partial, expired, source-down and local-API-down are tested separately. Native units retain identity, no averaging conversion or silent zero fill. Every displayed source link remains attributable. Charts stay official-page fallback unless a separately verified asset is approved; no scraping/iframe work is required.

Proposed source-state explanations for owner/advisory language review:

| Evidence/state | English explanation | Traditional Chinese explanation |
|---|---|---|
| Recent successful collection | Recent JMA collection succeeded. Check the bulletin issue and valid times for this storm. | 最近一次 JMA 蒐集成功。請另確認此風暴公告的發布時間與有效時間。 |
| Partial collection | Some JMA records could not be processed. Last-known usable records remain; coverage may be incomplete. | 部分 JMA 紀錄無法處理。保留上次可用資料，涵蓋範圍可能不完整。 |
| Collection failed | The latest collection attempt failed. Upstream availability is not confirmed; last-known usable records may remain. | 最近一次蒐集失敗，尚無法確認上游來源是否可用；可能仍保留上次可用資料。 |
| Local API unreachable | This page cannot reach the local data API. Current source status cannot be checked. | 此頁面無法連線至本機資料 API，目前無法確認來源狀態。 |
| Stale but eligible | Last-known data is delayed or cannot be refreshed. It remains within the display validity limit; check source times. | 上次取得的資料已延遲或無法更新，但仍在顯示有效期限內；請確認來源時間。 |
| Expired / excluded | This record exceeded source validity or the local display-age limit and is excluded from current views. This does not establish a clear basin. | 此紀錄已超過來源有效期限或本機顯示期限，因此不納入目前畫面；這不代表海域內沒有風暴。 |
| No usable current bulletin | No current usable bulletin is available in the collected window. Coverage is limited; this is not a no-storm confirmation. | 蒐集時段內沒有目前可用的公告。涵蓋範圍有限，這並非沒有風暴的確認。 |
| CWA not integrated | CWA integration awaits authorized credentials and independent data verification. Official page link only. | CWA 尚未串接，仍待取得授權憑證並獨立驗證資料；目前僅提供官方頁面連結。 |
| JTWC not integrated | JTWC integration awaits permitted access and reuse verification. The previous access check was denied. Official page link only. | JTWC 尚未串接，仍待確認合規存取與再利用條件；先前存取查核遭拒，目前僅提供官方頁面連結。 |

These are proposed application explanations, not translations of official advisories. Render simultaneous conditions together where needed, such as partial coverage plus a stale selected record. Never describe a past denial as a new check, infer upstream failure solely from local API loss, or equate “not integrated” with “no storm reported.” Verify both-language combinations, unknown/missing motion, preserved native motion conditions, and untranslated-term fallbacks rather than testing labels in isolation.

### P2 — focused usability regression

Reproduce keyboard focus loss across a 30-second refresh, then apply a narrow repair if confirmed. Preserve DOM focus, selected forecast point validity, manual camera, locale and disclosure state during supported updates; announce substantive changes unobtrusively. Expired/removed controls need a logical focus recovery path.

Review crowded forecast markers and mobile source access. Prefer the existing keyboard-operable list plus a compact source disclosure rather than a new navigation framework. A source accordion is optional within the approved map-first direction; capture before/after evidence and get owner acceptance of wording/layout. Keep warning/disclaimer/datum context readable without forcing the user through all source cards.

Acceptance: actual rendered 320, 390, 768 and 1440px layouts, both languages, keyboard and touch emulation; no unintended overflow, camera reset or disappeared focus. Test zoom/forecast selection, Auto/manual, source links and outage recovery. Report screen-reader, physical-device and independent usability checks separately; automated audits cannot certify them.

## Explicitly out of scope

No new source adapter, account, API key enrollment, paid/free-tier service activation, hosting procurement, service/timer installation, external alerts, deployment, public preview, geographic impact calculations, uncertainty cone, consensus/intensity conversion, historical replay product, cycle-browser product, notifications, telemetry or framework/storage migration. Do not change live archive contents for tests. Existing single-host hardening remains intact.

## Continued $0 expenditure constraint

The owner's **$0 new-expenditure constraint remains approved and binding**. Publishing this brief does not authorize a purchase, subscription, billing enrollment, paid activation, hosting commitment or external service. Use existing authorized resources and saved specimens; a free-tier label does not justify activation or exposure to overage charges. Do not activate services under this documentation assignment. Any necessary paid option must stay a separate proposal stating its advantage, unverified/verified cost basis and free/existing-resource alternative; do not implement it. If the constraint prevents a verification step, report the gap instead of spending or implying the check passed.

## Autonomy and decisions

**Today:** only review/planning/document preparation and publication to the dedicated review branch are authorized. No merge into `main`. All implementation awaits the owner's next instruction.

**After bounded cycle authorization:** routine local code organization, expiry consistency fixes, isolated tests, label mappings grounded in reviewed documentation, truthful source-state rendering and reproducible evidence can proceed without repeated permission requests. Use existing free resources/dependencies. Development test servers may run only within the future authorized local implementation scope, with collection disabled or isolated as appropriate.

**Owner decisions before dependent work:** approve the fallback/startup behavior, material visual/interaction changes, any source/threshold/area ranking design, a JMA-only RC scope decision, any account/secret/external integration, and any release/deployment. No timeout is approval. Paid services remain prohibited rather than merely pending automatic approval.

Escalate only the affected part if evidence cannot support a source claim, a new undocumented field/variant changes meaning, or a necessary change would alter approved meteorological semantics or the datum contract. Complete independent authorized fixes; do not stall the entire cycle for a speculative enhancement.

## Verification and evidence

After future implementation, record the exact source commit, Node/npm/browser versions, commands, result counts and limitations. Use:

```sh
npm ci
npm test
npm run build
```

Run `npm run test:browser` and `npm run test:live-browser` against a local built preview with `/api/live` intercepted for controlled cases. Extend suites for expiry during API failure, partial state, focus persistence and multiple eligible systems; do not merely count page loads. Keep source/archive test directories isolated. Save both-language screenshots and machine-readable results under a new review-specific directory; do not overwrite historic M3 evidence. CI should exercise the same assertions; report remote CI independently if inspected.

Actual-source integration is a separate optional evidence track **only if included in the subsequent authorization**: one bounded due collection under existing JMA policy, real API-to-map capture, no fixtures. No active storm or changed payload at the time is a legitimate observation; do not force a specimen into live mode to satisfy a screenshot. No unattended soak or service activation is included in this brief.

Expected regression evidence: existing 72 cases still pass unless a documented meaningful consolidation changes the count; added consequential cases pass, TypeScript/build passes with any size warning disclosed, axe results reported, and manual visual review remains distinct. Preserve provenance, correction/cancellation, retention, lease/recovery and backup checks. Do not expand backend architecture without a demonstrated defect.

## Exit and release path

Deliver fixes, screenshots, acceptance matrix and source-supported focus limitations at **M3-P review**; stop. Do not equate fallback implementation with a completed Taiwan relevance engine or JMA-only with multi-agency comparison.

Only after owner review: decide source-subset release scope, identify a suitable existing $0 resource if any, authorize private operational validation separately, prove timer/reboot/recovery and independent backup restoration with available resources, collect a monitored 48–72-hour observation when possible, finish manual accessibility/security/dependency/rollback checks and prepare a pinned RC artifact. If the $0 constraint prevents reliable staging, record the blocker and remain a local prototype; do not activate a paid workaround.
