# M0 — Completed JMA-first feasibility review

**M0 is complete for the scoped JMA-first decision; M2 is implemented locally for review.** The newly permitted XML and Digital Agency documentation has been read. See [M0 completion and evidence](m0-completion.md) and [M2 prototype, validation and remaining operational risks](../m2-review.md).

Both added domains are active and returned HTTP 200. No previous network settings were re-applied. CWA and JTWC remain unresolved secondary sources. Nothing was deployed publicly or published by the agent.

The following earlier audit is retained for discovery history. Its references to blocked XML/license documentation and pending M2 are **superseded** by the completion report above.

---

Updated 2026-10-29 Asia/Taipei. **The original six-domain network blocker is resolved in the newly published environment.** No configuration was re-applied, no draft was changed and no application was deployed.

## Recommendation

**Conditional GO for a JMA-first M2 implementation; NO-GO for production release or multi-agency comparison.** Official JMA XML discovery, a real forecast bulletin, geometry/time inspection and a documented reuse basis are verified. Full source feasibility is not closed: detailed XML specifications/polling limits, revision/lifecycle cases and long-term forecast archive availability still need work. CWA needs a member credential and a successful track sample. JTWC is denied by its upstream/CDN.

| Source | Verified this session | Remaining gate | Decision |
|---|---|---|---|
| [JMA](jma.md) | Official XML feed + linked VPTW61 bulletin HTTP 200; 1 analysis + 6 forecast centers; published attribution/reuse terms | XML PULL/schema documentation host, cadence/quotas, revisions/retirement, wind averaging, archive depth | Preferred first adapter; conditional GO for M2 |
| [CWA](cwa.md) | Official API schema identifies `W-C0034-005`; platform terms inspected; documented endpoint returns 401 without code | Secure member authorization code, actual track payload and dataset semantics | Not yet a verified second feed |
| [JTWC](jtwc.md) | Proxy CONNECT 200; CloudFront response 403 `Request blocked` | Permitted reliable source access, formats and terms | Exclude from initial claimed coverage |
| [IBTrACS](ibtracs.md) | Official catalog 200, version 4r01, historical formats, distribution terms/caveats | Detailed historical schema, sample and reference methodology | Historical only; deferred |

## Active network and controlled checks

The fresh running instance reports `observations_current=true`, restricted networking in state `enforced`, and all six custom domains. The machine's network-policy snapshot agrees. See [active policy evidence](evidence/2026-10-29/active-network.json) and [request results with URLs, timestamps and hashes](evidence/2026-10-29/http-observations.json). The old CONNECT-denied evidence is retained as historical context, not current status.

Allowed domains: `opendata.cwa.gov.tw`, `www.cwa.gov.tw`, `www.data.jma.go.jp`, `www.jma.go.jp`, `www.metoc.navy.mil`, `www.ncei.noaa.gov`. JMA/CWA/NOAA documentation now returns 200. JTWC's 403 is an origin/CDN response after CONNECT succeeds; it is **not** the original allowlist failure. No repeated unchanged denial was attempted, no TLS checks disabled, and no alternate route used.

Two newly discovered **documentation** hosts remain outside this policy. Each returned one proxy CONNECT 403:

- `xml.kishou.go.jp`: official XML PULL operation and format specifications linked by JMA's portal.
- `www.digital.go.jp`: Public Data License 1.0 linked by JMA terms. The reachable JMA English notice already states the CC BY 4.0 alternative, but the referenced original should still be reviewed directly.

If continuing detailed specification verification, add those exact two names to the existing restricted allowed-domain list in the **storm-chaser environment settings → network/Internet access**, preserve existing entries, and save/apply through the product. They enable additional outbound HTTPS destinations; no inbound ports, wildcard access or new secret is needed. No setting change was made by this audit.

## Verified specimen and validation

- [JMA raw VPTW61 XML](evidence/2026-10-29/jma-vptw61.xml), unchanged and attributed in the [dossier](jma.md).
- [Inspection output](evidence/2026-10-29/jma-specimen-verification.json): 1 analysis point, 6 forecast centers, finite in-range coordinates, explicit source timezones, increasing forecast valid times. Forecast lead hours are derived from analysis time, not report issuance.
- Reproduce offline: `python3 scripts/verify-jma-evidence.py`. This is specimen inspection, **not a live adapter**, contract suite, scheduler or real update observation.
- [JMA terms](evidence/2026-10-29/jma-reuse-terms.txt), [developer guidance](evidence/2026-10-29/jma-data-use-guidance.txt), [CWA official schema excerpt](evidence/2026-10-29/cwa-track-api-excerpt.json), [CWA platform terms](evidence/2026-10-29/cwa-platform-terms.json).

Only a small permitted JMA raw specimen is retained, with unchanged bytes, provenance hash and source attribution. No CWA track data, JTWC chart or unsupported historical forecast was obtained. M1 continues to use explicit synthetic fixtures; this audit does not wire the sample into the app or claim operational freshness.

## Remaining M0 / release gates

1. Read the official XML PULL/specification documents, confirm polling/load guidance and all coordinate/missing-value/revision/lifecycle semantics. Keep issue, analysis, valid, control and retrieval times distinct.
2. Verify source-specific wind averaging, correction/cancellation and empty/retirement behavior with authoritative documents and actual samples. Do not infer it from one ordinary advisory.
3. If CWA is selected, configure its member code securely for server-side query authentication, then inspect a successful payload and member-tier quotas. No secret values in chat, logs, source control or client assets.
4. Preserve explicit original-chart link fallbacks until asset-specific paths, notices and technical embedding behavior are verified. General data reuse is not a guarantee for every graphic.
5. Do not claim multi-agency comparison until two independent track sources pass; do not substitute IBTrACS for forecasts.
6. M2 must implement and test the real adapter/archive/health pipeline. No live integration, scheduler, real-time change observation or deployment was performed here.

## Geography independently verified

The vendored basemap is Natural Earth 1:110m country geometry, retrieved from the [upstream repository](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson). The [retrieved upstream README](evidence/natural-earth-upstream-readme.md) explicitly describes the dataset as public domain and free for any type of project. Asset SHA-256: `6866c877d39cba9c357620878839b336d569f8c662d3cfab4cb1dbe2d39c977f`. This is general geographic context, not official cyclone evidence, a navigation map, or an assertion of boundaries. Coarse coastlines are unsuitable for operational impact calculations.
