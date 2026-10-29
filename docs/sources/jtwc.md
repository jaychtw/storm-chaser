# JTWC dossier — upstream/CDN access denied

Updated 2026-10-29 Asia/Taipei.

The allowed official URL `https://www.metoc.navy.mil/jtwc/jtwc.html` was requested once in the fresh environment. **Proxy CONNECT succeeded (200); destination response was HTTP 403.** The HTML identifies CloudFront and says `Request blocked` / `The request could not be satisfied`. See [HTTP evidence](evidence/2026-10-29/http-observations.json).

This is distinct from the old environment's proxy CONNECT denial. The six-domain allowlist is now enforced; adding `www.metoc.navy.mil` again cannot resolve this response. The observed error alone does not establish whether the cause is WAF policy, location, traffic, or an upstream configuration problem. No anti-bot bypass, mirror substitution, alternate route, repeated unchanged request or credential guessing was attempted.

| Requirement | Audit result |
|---|---|
| Official product / live format | Not inspected beyond the denial page. No public JSON API, ATCF path or stable downloadable product is assumed. |
| Automated retrieval / authentication | Access conditions and permission remain unverified; this is not evidence that a token is required. |
| Reuse / archival rights | Unverified; do not infer permission from a government domain. |
| Sample / cadence / quotas | No permitted successful payload; unknown. |
| Native identity / naming | Unknown; future matching must preserve basin/season/native IDs and cannot use names alone. |
| Issue / valid times / revisions | Unknown. |
| Coordinates / wind units / averaging period | Unknown; no intensity comparison or conversion is justified. |
| Original charts / embed policy | Unknown; official external link only. No chart or source data copied. |
| Archives | Unknown; no inferred archive endpoint. |
| Fallback | Mark unsupported/unavailable in any future source status; isolate failure from verified feeds. |

**Recommendation:** exclude JTWC from initial live coverage until permitted stable access and reuse terms can be verified. No action on the six existing domain settings is indicated. Do not claim multi-agency comparison completion on the basis of JMA plus a JTWC link card.
