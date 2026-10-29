# M3-P — product completion verification and owner review

Date: 2026-10-29, Asia/Taipei. **Implemented for owner review; not owner-accepted, deployed or production ready.** Development branch: `development/m3-p-product-completion`. Base: approved review `02dc7c2f1f1e61b5626f247bb9d1b9d8548c75e9`, including M3-O implementation `b09928a4ed758e0c053e9da6eaad264cbdf4625f`. The delivery commit contains this report and its evidence; use `git rev-parse HEAD` on the delivered branch to pin the complete snapshot. The final handoff supplies the exact SHA.

Authority: [owner implementation authorization](briefs/m3-p-authorization.md), [ADR 0002 dispositions](adr/0002-product-reconciliation-proposed.md), [scoped guide amendment](amendments/design-guide-v1.0-m3p.md), AICP 1.1.0 at `cb74fe9497d07370f44a18a09fec124ab99848ec`. Original Guide v1.0 and M3-O test/screenshot evidence are preserved. No governing standards were modified.

## Result

Client/server now share the original explicit-validity, >8h stale and >24h display-expiry policies. Cached centers, forecast overlays, forecast details and focus candidates expire locally during an API outage; resume/visibility/online hooks re-evaluate before network completion. Auto shows a neutral regional overview with no selected priority, including a single available storm. Manual choice remains until explicit return to Auto, and ineligibility is explained without choosing another storm.

Verified source motion direction/speed and known data labels are presented in both languages without changing native values. Source stations distinguish integration status, partial ingestion, failed collection, local API loss, stale/expired, and no usable current bulletin. Selected-bulletin issue/control/analysis/retrieval times remain distinct from check/success times. Native terminology is inspectable. See [motion/terminology evidence](sources/jma-motion-and-labels.md).

Existing SQLite/WAL, raw bytes/hashes, corrections, durable cursor/backoff, lease recovery, bounded retention and backup tools are retained. No actual live archive was written for testing. No migration, host activation or new source adapter was introduced.

## Executed verification

| Command / check | Observed result and evidence |
|---|---|
| `npm test` | **97 passed, 0 failed/skipped**, four files: existing 72 retained plus 25 product cases. Archive/provenance/correction/crash/retention/backup regressions included. |
| `npm run build` | TypeScript and Vite passed. JS remains approximately 997 kB / 275 kB gzip; existing large-bundle warning persists. No performance certification claimed. |
| `PREVIEW_URL=http://127.0.0.1:4183 npm run test:browser` | Existing demo interactions, locale, keyboard, empty/outage, map failure, responsive checks; **7 axe scans, zero violations**. [Results](m3p-demo-browser-results.json). |
| `PREVIEW_URL=http://127.0.0.1:4183 npm run test:live-browser` | Saved-official-specimen controlled replay, neutral initial view, manual update/camera/locale, source failures and mobile map-first; **5 axe scans, zero violations**. [Results](m3p-browser-results.json). |
| `PREVIEW_URL=http://127.0.0.1:4183 npm run test:product-browser` | **25 acceptance groups**, **16 axe scans, zero violations**, **20 labeled controlled screenshots**. [Results and case names](m3p-acceptance-results.json). |
| Read-only expiry comparison | Former +25h discrepancy now returns zero current systems on both client and server. [Output and tested-file digests](m3p-expiry-verification.json). |
| Source isolation | Product suite blocks external origins; no unexpected network origins or live JMA requests. Other browser suites abort/intercept the API. Existing fixture/raw files are read, not imported into live storage. |

Environment: Node 24.19.0, npm 11.9.0, existing lockfile/dependencies, system Chromium 154.0.8037.57, software WebGL. Browser screenshots are **actual running frontend renders with intercepted saved official specimens and explicitly controlled mutations**, not current weather observations. Test banner and file manifests identify replay. No actual-source collection, unattended operation or newly issued source change is claimed. Existing test-runtime evidence is not a fresh production-only install. Remote CI, real OS sleep and physical phones were not independently verified in this cycle.

To reproduce locally without starting an API or collector:

```sh
npm ci
npm test
npm run build
./node_modules/.bin/vite preview --host 127.0.0.1 --port 4183 --strictPort
# In a second terminal, against that loopback-only preview:
PREVIEW_URL=http://127.0.0.1:4183 npm run test:browser
PREVIEW_URL=http://127.0.0.1:4183 npm run test:live-browser
PREVIEW_URL=http://127.0.0.1:4183 npm run test:product-browser
```

Browser scripts save new M3-P evidence paths. They do not overwrite M3-O artifacts. The workflow includes the product acceptance suite for future CI; publishing this cycle uses `[skip ci]` to avoid starting remote CI jobs under the $0 constraint. No remote result is asserted.

## Product acceptance matrix

| Requirement | Status for M3-P | Evidence / practical limit |
|---|---|---|
| Explicit validity and existing age thresholds shared | Implemented and verified | Shared `eligibility`; unit boundary/parity cases at +0/8/16/24/25/72h. Explicit validity tested at its exact cutoff. No policy-threshold change. |
| Local expiry during persistent failed API | Implemented and verified | Browser retains the original API snapshot, aborts requests, jumps time and removes centers/overlays/details without another successful response. Explicit validity and >24h policy exercised separately. |
| Sleep/resume, background restoration, offline/recovery | Implemented and verified in simulation | Clock jump without intervening timer dispatch plus pageshow, focus, hidden→visible events; running local timer case; browser offline mode and online recovery. Real hardware/OS suspension not tested. |
| Current vs stale vs expired vs archived | Implemented and verified | Stale-but-eligible can remain with last-known labels/timestamps. Expired current data is excluded even with future point-valid times. Source/local expiry reasons and bounded archive/cache distinction are visible. Unit check proves raw/snapshot retention unchanged. No new historical browser. |
| Neutral uncertain Auto for zero/one/multiple storms | Implemented and verified | No pressed priority card/active marker/forecast overlay in live Auto. All eligible centers and list choices remain discoverable; bulletin order is not used by focus logic. |
| Manual choice, retirement, return to Auto, recovery | Implemented and verified | Manual ID persists across revision/reorder/locale; missing/ineligible selection shows explanation, no replacement. Same ID can recover. Auto explicitly restores neutral regional view. |
| Actual Taiwan relevance ranking | **Not implemented; objective remains open** | No validated criterion set or owner-approved ranking methodology. No distance/impact/window/official-warning inference introduced. |
| Reported motion and native values | Implemented and verified for supported fields | Manual p12 validates center direction; specimen/native speeds, null slow condition, missing direction and unknown unit/type tests. Legacy snapshots without new optional direction stay readable/unreported. |
| Known field/class/unit/condition localization | Implemented and verified for supported mappings | EN/zh-TW screenshots and assertions; native terminology disclosure; unknown terms explicitly marked untranslated. No wind averaging conversion or invented zero; no official prose translation. Full future-vocabulary coverage not claimed. |
| Honest bilingual source states | Implemented and verified | Separate partial/collection failure/API outage/stale/expired/no-current cases, CWA credential/verification and JTWC previous-denial gates. Last check/success and source times separated. API reachability cannot renew meteorological validity. |
| Keyboard refresh/changed forecast point | Implemented and verified | Stable control keys restore focus across redraw; removed point drops detail and recovers focus to details summary or loss notice. Manual camera/selection and current forecast detail survive supported revision. |
| Touch/overflow/mobile source access | Implemented and verified in emulation | 44px map/forecast/control targets and alternate forecast-time list; real Chromium touch-emulated taps, map-first layout and no horizontal overflow at 320/390/768/1440. Source jump focuses source heading. No material accordion redesign adopted. |
| Chart access | Implemented and verified fallback | Official page links remain labeled, not source-specific embedded chart assets. Owner-approved fallback; no embedding/scraping. |
| Multi-agency comparison | **Blocked / not implemented** | JMA only; no CWA credentials, JTWC access bypass, storm matching, aligned cycles or comparison claims. |
| Historical issuance-cycle browser | **Deferred by owner** | Current cycle/validity visible; archive preserved subject to retention. No Time Travel/Showdown. |
| M3-O hardening preservation | Implemented and verified locally | Existing 72 regression tests still pass. No real systemd/reboot/soak/off-host restore evidence added. |
| Visual/linguistic owner acceptance | **Pending review** | Automated scans and agent screenshot inspection support review; not owner approval or screen-reader/physical-device certification. |
| RC / public operation | **Not authorized / not verified** | No main merge, deployment, public preview, remote infrastructure or expenditure. |

## Representative visual evidence

All are controlled replay with an explicit banner, not current-weather screenshots:

- [Desktop EN neutral Auto](screenshots/m3p/desktop-en-auto-uncertain.png) · [Desktop zh-TW neutral Auto](screenshots/m3p/desktop-zh-TW-auto-uncertain.png)
- [Desktop EN current manual/motion](screenshots/m3p/desktop-en-manual-current.png) · [Desktop zh-TW current manual/motion](screenshots/m3p/desktop-zh-TW-manual-current.png)
- [Desktop EN partial](screenshots/m3p/desktop-en-partial.png) · [Desktop zh-TW stale/API outage](screenshots/m3p/desktop-zh-TW-api-stale.png)
- [Desktop EN expired outage](screenshots/m3p/desktop-en-expired-outage.png) · [Desktop zh-TW expired outage](screenshots/m3p/desktop-zh-TW-expired-outage.png)
- [Mobile EN Auto](screenshots/m3p/mobile-en-auto-uncertain.png) · [Mobile zh-TW Auto](screenshots/m3p/mobile-zh-TW-auto-uncertain.png)
- [Mobile EN manual](screenshots/m3p/mobile-en-manual-current.png) · [Mobile zh-TW manual](screenshots/m3p/mobile-zh-TW-manual-current.png)
- [Mobile EN stale](screenshots/m3p/mobile-en-stale-outage.png) · [Mobile zh-TW expired](screenshots/m3p/mobile-zh-TW-expired-outage.png)
- [Mobile EN unavailable](screenshots/m3p/mobile-en-unavailable.png) · [Mobile zh-TW unavailable](screenshots/m3p/mobile-zh-TW-unavailable.png)

The controlled second storm intentionally overlaps the first center to exercise accessible list discovery when markers overlap. It is not a second real source/system claim. The desktop/sidebar and mobile map-first structure are retained; compact source jump and forecast list are minor interaction repairs. Material further layout changes remain for owner review.

## Unresolved requirements and release risks

1. **Relevance:** no operational Taiwan ranking or official Taiwan warning association. Neutral Auto is the approved honest fallback, not completion of that original objective. Require source-supported methodology and further owner approval for ranking.
2. **Sources:** CWA still needs lawful credential setup and actual payload/cadence/unit/time/reuse verification; JTWC remains previously denied/unverified. No unchanged retries or bypasses. No multi-agency comparison claim.
3. **Source/datum scope:** qualitative centers only; exact CRS realization, all future schema variants, same-control anomalies and same-URL mutations retain M3-O limitations. No quantitative impact/proximity calculation is enabled.
4. **Operations:** no systemd activation, unattended dispatch, genuine multi-day source-change observation, host-loss/off-host restore, independent alerts or public edge/security/rollback rehearsal. Local tests do not establish continuous service.
5. **Experience:** source cards remain verbose; native vocabulary can expand; markers can overlap. Accessible list alternatives help but do not replace owner/physical-phone/screen-reader review. Browser event simulation is not a real suspended machine. Client time must be reasonably correct for display-age decisions.
6. **Cost/release:** $0 new expenditure remains binding. Existing resources can support local review, not an unlimited availability promise. ADR 0001's $7–20/month planning estimate remains historical, unverified and unauthorized; no paid option is necessary for this cycle. No service, subscription or billing enrollment occurred.

## Continuity and lessons

[PROJECT_STATE](../PROJECT_STATE.md) is adopted; [ADR 0002](adr/0002-product-reconciliation-proposed.md) records resolved/superseded proposals. Review scope is distinct from owner acceptance. Existing [standards/template candidates](proposals/standards-applicability-and-milestone-lineage.md) remain endorsed for future review only; no cross-repository edits occurred.

Technical lesson: validity must be evaluated in both server materialization and retained client views, including resume without timer delivery. Regression tests must withhold fresh responses and advance time; returning an already-expired server payload cannot prove this behavior. This lesson belongs in this project's tests/technical reference, not a new mandatory game standard. No additional universal standard change is justified from this cycle alone.

**Stop at M3-P owner review.** No next-cycle work, merge into main, public release or deployment follows automatically.
