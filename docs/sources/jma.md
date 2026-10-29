> M3 updates: [datum dictionary/schema audit](../m3-datum-audit.md) and [expanded official example/lifecycle verification](../m3-verification.md). Earlier “unverified” entries are historical; the exact EPSG realization remains explicitly unconfirmed.

> **Superseded completion status:** XML PULL/specification and PDL1.0 access now work and have been reviewed. Wind averaging, cadence, lifecycle and correction rules are documented in [M0 completion](m0-completion.md). [M2](../m2-review.md) now implements the scoped JMA integration. The specimen findings below remain valid; old “not verified”/blocked entries describe the earlier audit stage.

# JMA / RSMC Tokyo dossier — verified live specimen

Updated 2026-10-29 Asia/Taipei. **Preferred first M2 adapter. Technical retrieval and forecast geometry verified; detailed specification/cadence work remains. No production integration or release approval.**

## Official evidence

- [Public XML index](https://www.data.jma.go.jp/developer/xml/feed/extra.xml): HTTP 200; Atom namespace `http://www.w3.org/2005/Atom`; 377 entries in the captured index, including six typhoon-related entries. Select products by the linked bulletin and verified product type, not by guessing file names.
- [Actual linked VPTW61 bulletin](https://www.data.jma.go.jp/developer/xml/data/20261028154121_0_VPTW61_010000.xml): HTTP 200; [immutable specimen](evidence/2026-10-29/jma-vptw61.xml), [offline verification](evidence/2026-10-29/jma-specimen-verification.json).
- [Official developer portal](https://www.data.jma.go.jp/developer/): explicitly describes XML PULL retrieval, no user registration, and potential maintenance delays. The earlier guessed `/developer/xml/index.html` returned 404; it is not used as documentation.
- [Developer use guidance PDF](https://www.data.jma.go.jp/developer/ryuui.pdf), [Japanese website terms](https://www.jma.go.jp/jma/kishou/info/coment.html), [English legal notice](https://www.jma.go.jp/jma/en/copyright.html). HTTP 200. Saved [terms excerpt](evidence/2026-10-29/jma-reuse-terms.txt) and [PDF text](evidence/2026-10-29/jma-data-use-guidance.txt).

## Actual payload semantics

| Requirement | Verified finding / remaining limit |
|---|---|
| Authoritative product | `台風解析・予報情報（５日予報）（Ｈ３０）`, filename product code `VPTW61`, `InfoKindVersion=1.0_2`. XML `Report`, `Head`, `Body` use different namespaces; do not strip namespaces and match unrelated elements. |
| Identity / naming | Specimen `EventID=TC2637`, native typhoon number `2631`, native name `IN-FA`, `Serial=46`, `InfoType=発表`, `Status=通常`. These are **as returned**, not cross-agency reconciled identities. Preserve season/basin/context; do not match on name alone. |
| Time semantics | `Head/ReportDateTime=2026-10-29T00:45:00+09:00` (15:45Z); `TargetDateTime=00:00+09:00` (15:00Z); `Control/DateTime=15:41:20Z`. They differ. XML filename/feed update is not a replacement for advisory issue time. Retrieval metadata is separate. |
| Geometry | One analysis center under `CenterPart/Coordinate`, six forecast centers under `CenterPart/ProbabilityCircle/BasePoint`. Choose `type=中心位置（度）`; the payload also contains degree-minute alternatives that must not be parsed as decimal degrees. Encoding is signed latitude then signed longitude, terminated by `/`, e.g. `+15.4+157.0/`. GeoJSON reverses that order to longitude, latitude. |
| Forecast horizons | Actual forecast valid times are +12, +24, +45, +69, +93, +117 hours **from the analysis time**, although the product has `TargetDuration=PT120H`. Derive valid times from each `DateTime`; do not assume evenly spaced horizons or measure them from report issuance. |
| Intensity / motion | Values are supplied in multiple native units: wind `ノット` and `m/s`; pressure `hPa`; motion speed `ノット` and `km/h`; directional Japanese strings. Maximum wind and instantaneous gust are distinct. Some speeds are missing numeric text and described as `ゆっくり`; preserve missingness, never substitute zero. |
| Wind averaging period | Not encoded explicitly in the inspected wind elements; **not verified** from a definitive specification. Do not silently assume/convert averaging periods. |
| Uncertainty | Native forecast probability-circle radii are present, with descriptions explicitly stating 70% center-containment probability, in `海里` and `km`. This is not a probability of impact on Taiwan. No redrawn cone or hazard probability is enabled. |
| Discovery auxiliary | `https://www.jma.go.jp/bosai/typhoon/data/targetTc.json` returned one record with EventID/number/issue/category matching the sample. It is a verified website response, **not a documented stable public API contract**. Prefer the documented XML PULL family. |
| Revisions / retirement | A serial and InfoType exist; correction/cancellation and lifecycle semantics are not proven by one ordinary bulletin. Need real samples and the specification. Content hashes and all source time fields must remain separate. |
| Freshness / cadence / rate limits | PULL retrieval and outage caveats verified; numeric polling limits and guaranteed publication cadence **not verified**. Several issuance cycles are linked in the current feed; no future changed payload was observed over wall-clock time and no scheduler was tested. |
| Archives | Multiple recent bulletins are discoverable, not proof of a permanent historical forecast archive. Long-term availability/retention SLA remains unverified. Preserve permitted local snapshots in M2. |
| Original chart | Official [typhoon map page](https://www.jma.go.jp/bosai/map.html#contents=typhoon). Link permission is explicitly stated in JMA's terms. A stable original image URL, hotlink support and any asset-specific notices have not been verified; use page-link fallback. |
| Failure behavior | Required future behavior: retain permitted last-known records with stale timestamps, independently report source failures, never turn unavailable data into an empty-storm claim. Not implemented by this audit. |

## Documented reuse basis

The inspected current JMA terms refer to Public Data License 1.0 and expressly permit use under **CC BY 4.0 in lieu of those terms**. They require source attribution, disclosure of edits, no suggestion that edited information is government-authored, and checks for third-party/specific-rights exceptions. The developer PDF says secondary use, including commercial use, is generally unrestricted subject to the Meteorological Service Act and individual notices. It specifically distinguishes redistribution from changing forecasts or issuing independent warnings. The PDF is dated 2017; the current website terms remain controlling.

Attribution for the specimen: **Source: Japan Meteorological Agency website — [original bulletin](https://www.data.jma.go.jp/developer/xml/data/20261028154121_0_VPTW61_010000.xml)**. Raw XML is unchanged. The verification JSON is an extracted/converted audit artifact created by Storm Chaser, not an official forecast bulletin. Preserve both attribution and edit disclosure in downstream views. No third-party rights notice was seen in the sampled XML; that is not a blanket ruling for all JMA assets. This is a documented reuse assessment, not a legal opinion or permission to produce independent forecasts.

## Remaining documentation access

The portal links to `https://xml.kishou.go.jp/xmlpull.html` and XML specifications on `xml.kishou.go.jp`. JMA terms link to `https://www.digital.go.jp/resources/open_data/public_data_license_v1.0`. Both hosts are outside the six-host policy and returned proxy CONNECT 403 once. No bypass or unchanged retry was attempted. Adding those exact hosts through environment settings would permit the remaining direct specification/license review; no configuration was changed in this audit.

Reproduce offline inspection with `python3 scripts/verify-jma-evidence.py`. It verifies this specimen only, not a production parser, scheduling, recovery, corrections or all schema variants.
