# CWA dossier — API documented, credential missing

Updated 2026-10-29 Asia/Taipei. **Network access works; live track verification is blocked by authentication.**

## Verified official discovery

The [official Swagger page](https://opendata.cwa.gov.tw/dist/opendata-swagger.html) loads [its initializer](https://opendata.cwa.gov.tw/dist/static/od-swagger/od-swagger.js), which names **`/apidoc/v1`** as the API definition. That [definition](https://opendata.cwa.gov.tw/apidoc/v1) returns Swagger 2.0 **YAML**, not JSON. Its base path is `/api`. This discovery chain and actual response hashes are in [HTTP observations](evidence/2026-10-29/http-observations.json).

| Requirement | Verified finding / remaining limit |
|---|---|
| Track product | `W-C0034-005`: `颱風消息與警報-熱帶氣旋路徑`. Documented GET `https://opendata.cwa.gov.tw/api/v1/rest/datastore/W-C0034-005`. No endpoint was inferred from an invented dataset ID. |
| Warning product | `W-C0034-001`: `颱風消息與警報-颱風警報`; distinguish warnings from the track dataset. |
| Authentication | Both operations require query parameter `Authorization`, described as the platform member authorization code. One no-key track request with `format=JSON` returned **HTTP 401**, body `401 Forbidden: Authorization key is not correct.` This confirms access reaches the service. |
| Existing credentials | No runtime secret bindings; `CWA_API_KEY`, `CWA_TOKEN`, `CWA_AUTHORIZATION` were checked by presence only and are absent. No credentials were printed, invented or requested in chat. |
| Query capabilities | `Dataset=AnalysisData/ForecastData`, `CwaTdNo`, `DateTime`, `ForecastHour` (documented 6–120), `timeFrom`, `timeTo`, `sort`, JSON/XML format. Excerpt: [actual API operations](evidence/2026-10-29/cwa-track-api-excerpt.json). |
| Sample payload | No successful authenticated track payload. Request parameters do **not** prove actual response geometry, units, naming, timestamp timezone or active/empty behavior. |
| Identity | `CwaTdNo` and native warning typhoon-name/number filters are documented. Complete native record IDs, season/basin rules and cross-agency mapping remain unverified. |
| Issue / valid times / revisions | Time filters documented with timezone-less examples. Actual payload timezone, forecast valid-time semantics, revisions and corrections need a real payload and dataset documentation. Do not assume Taiwan time from UI location. |
| Coordinates / wind / pressure | Actual encoding, unit fields and wind averaging period remain unverified. |
| Cadence / rate limits | No verified dataset cadence or member-tier quota yet. Platform terms prohibit abnormal usage that harms service; do not treat a proposed 10–15 minute poll as an approved SLA. |
| Archive availability | Time filters are not proof of historical retention. API retention depth and permanent advisory lookup unverified. |
| Original charts | [Official typhoon page](https://www.cwa.gov.tw/V8/C/P/Typhoon/TY_NEWS.html) returns 200. Stable original image and asset-specific reuse/embed terms are not verified. Page-link fallback retained; no iframe or image is embedded. |
| Failure fallback | Future collector must separate 401, throttling, outage, stale and valid-empty responses. Current prototype uses fixtures; it does not claim live source recovery. |

## Terms verified from the platform itself

The published frontend maps `/about/rules` to its terms module; the module [linked by that frontend](https://opendata.cwa.gov.tw/dist/js/30.5de985aa.js) contains the actual EN/zh-TW use rules. [Extracted terms](evidence/2026-10-29/cwa-platform-terms.json) preserve attribution and source URLs. They grant reproduction, distribution, public transmission, adaptation and sublicensing without purpose/time/geography limitations for covered open data, require the provider's attribution statement, exclude patents/trademarks, and state compatibility with CC BY 4.0. Membership/usage obligations and change/withdrawal caveats remain applicable. This does not automatically authorize all graphics from the general CWA website.

The initial guessed general-site `/V8/C/Member/appendix.html` returned 404 and is **not** relied on as a license. The warning-document URL linked in the API returned 200 but did not establish the track response schema in this audit.

## Next step

Obtain a CWA platform member authorization code and bind it securely for a server-side collector in environment settings, never in chat, committed files, URLs in logs or the client bundle. Before choosing the binding mechanism, verify that it supports the API's documented query-parameter authentication without leaking values. No secret requirement or environment draft was changed here. Then make a controlled authenticated request and inspect the actual payload, dataset-specific terms, cadence and quotas. JMA-first work can proceed independently; CWA is not yet a verified second track feed.
