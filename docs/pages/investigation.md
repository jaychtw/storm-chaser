> Historical investigation. Financial gate subsequently supported by owner evidence; see [distribution milestone](distribution.md) for implementation and current verification.

# Pages distribution milestone — Stage A investigation

Owner authorization: “Storm Chaser — GitHub Pages Deployment Authorization”, supplied in this conversation. This separately reopens bounded public distribution; it does not rewrite the original local-first closure. Accepted main remains `bbfbbee1fc2213152d6004031da0a623c6ae0823` (software `475dd767d6c18544996b4b9f0204b39dc8c01e3c`, version `1.0.0-rc.1`).

**Status: blocked at the $0 automation gate; no static edition or deployment workflow implemented or enabled.** The intended URL is https://jaychtw.github.io/storm-chaser/; it is not a verified deployment. No public smoke-test claim is made.

## Evidence and release boundaries

The current main SHA was rechecked. Pages is configured for Actions and the `github-pages` environment. Earlier owner UI attestation supplies settings unavailable through this integration. No security setting was changed. The local-first lifecycle remains CLOSED and its code, package, dependency lock, workflows, source safeguards and historical verification artifacts remain unchanged.

[Investigation evidence](investigation-evidence.json) records fresh source hashes and normalization results. One current long feed and one linked live bulletin were fetched with TLS validation through the configured proxy. The existing normalizer accepted seven published points in the inspected bulletin, with source issuance and control times preserved separately from retrieval time. This is not a complete new collection cycle, coverage proof or scheduler test. The 104 discovered VPTW60/61 links span a rolling window, not an archive of every storm or issuance.

Current [JMA terms](https://www.jma.go.jp/jma/kishou/info/coment.html) require source attribution and identification of edits/conversion; edited material must not appear government-authored. [XML PULL guidance](https://xml.kishou.go.jp/xmlpull.html) describes hourly long-feed updates covering several days, source-IP blocking at 10 GB/day and operational interruptions. Preserve PDL1.0, third-party exceptions and the existing no-independent-warning/forecast distinction. The previous dossier remains supporting context, not a blanket legal clearance for every future asset.

## Smallest proposed architecture — not implemented

- Preserve the Node/SQLite local-first edition. Use the same collector, normalizer, eligibility functions and defensive snapshot contract for a separately labeled Pages edition.
- Build frontend assets with Vite base `/storm-chaser/`. Correct the root-relative country GeoJSON, brand navigation and API fetch paths. Browser data requests must be same-origin static JSON; official links remain ordinary external links.
- Produce a validated `LiveSnapshot` plus a versioned publication envelope. Keep source issuance/control/validity, collection success, collection attempt and publication time separate. Publishing must never renew an old source timestamp.
- Keep previous usable data only while existing expiry rules permit it. A partial cycle must remain explicitly partial; failure must not become a fresh empty basin. Missing/invalid JSON must fail closed. Local expiry must continue without successful network requests.
- Upload only an allowlisted `dist` directory containing frontend, local geography, notices and sanitized normalized JSON. Never include SQLite, WAL, raw archives, debug files, credentials, specimens or test reports. Do not publish untrusted source strings through executable HTML.

A fresh SQLite archive on every scheduled invocation is insufficient **without additional reconciliation and completeness controls**. The observed long feed contains 104 candidate bulletin URLs; the existing collector caps new downloads at 100/cycle and also has a 150-second cycle bound. Sorting and reaching a cap must not appear as complete collection. Short feeds cover a shorter arrival window; long feeds are rolling, not permanent. Cancellation/tombstone ordering, conditional request metadata, deduplication, budget/backoff and failures must survive jobs or have an equivalent explicitly validated recovery model.

Proposed durable method: a dedicated auditable state branch containing size-bounded normalized latest-unit state, cancellation records, source URL/hash receipts, a bounded deduplication window, cursor/backoff metadata and continuity markers. No SQLite or raw archive is put in Pages. Writes require strict schema/hash checks, fixed branch/path selection, non-force compare-before-update and a single concurrency group. A state-loss/window-gap recovery must stay partial/unavailable until reconciliation is verified; an Actions cache alone cannot establish durable continuity. Detailed retention bounds, source-replay/provenance checks and recovery tests remain implementation work. This is a candidate, not a proven operating design.

## Proposed workflow and cadence — not enabled

Use a dedicated workflow with `workflow_dispatch` for source deployments and a conservative 30-minute scheduled data refresh, only from verified main. No ordinary push deployment. One concurrency group with cancellation disabled prevents overlapping collection/state/deployment transactions. Set finite job/request/size limits. Keep existing software checks separate.

Use standard `ubuntu-latest`, Node 24, `npm ci --no-audit --no-fund`, correct Vite base, GitHub's official configure/upload/deploy Pages actions and the existing `github-pages` environment. Pin reviewed action revisions. Permissions: `contents: read` by default; narrowly scope `contents: write` only to state updates, `pages: write` and `id-token: write` only to deployment. Do not broaden repository defaults. No deployment occurs from the investigation branch.

At most 48 scheduled attempts/day (about 1,440/30-day month); a ten-minute job ceiling bounds standard-runner compute to 14,400 minutes/month, although actual jobs should be far shorter. Constrain each Pages artifact to 5 MiB and retain for one day: up to approximately 240 MiB of scheduled artifacts plus manual runs/other repository and account artifacts. Avoid persistent raw/database artifacts and avoid accumulating npm/build caches. Measure the actual artifact and retained peak before enabling this proposal. Existing browser checks already retain an approximately 5 MB review artifact; this observation does not establish account-wide headroom.

Jobs may be delayed, disabled or fail. Existing 15-minute collection-age handling would truthfully mark a 30-minute cadence stale between updates; do not silently loosen source-validity thresholds. Explain periodic refresh in both languages. No guaranteed interval, warning-service or continuous-availability claim. Quota exhaustion must stop publication; the deployed client must age through stale/expired/unavailable states without fabricating a clear basin.

## $0 gate — outstanding owner information

Official [Actions billing guidance](https://docs.github.com/en/billing/concepts/product-billing/github-actions) and its [public-runner rule](https://github.com/github/docs/blob/main/data/reusables/actions/actions-billing.md) establish free standard GitHub-hosted compute for public repositories. The repository is public. Larger runners are unnecessary and must not be used.

Artifacts use shared account storage; a small repository artifact does not prove available account-wide allowance. GitHub documents storage accrual and possible charges beyond allowances. The account billing usage API returned **403 Resource not accessible by integration**. Payment-method/budget enforcement and account-wide available allowance were not verified. **Do not enable artifact-producing scheduled automation on an unsupported claim that the entire model is free.**

Smallest owner intervention: verify available shared artifact allowance and an enforced $0 overage block in GitHub Billing, or supply an equivalent owner-verified no-charge arrangement. No token, payment enrollment, purchase or security bypass is requested. After that, implement and measure bounded retention; fail before upload when artifact bounds are exceeded. If those conditions cannot be met, retain the already verified local-first edition and leave Pages disabled.

[Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits): 1 GB published site, soft 100 GB/month bandwidth, deployment timeout ten minutes, possible rate limiting. Custom Actions builds are exempt from the soft ten-builds/hour limit. Exceeding service limits may make the site unavailable; no paid fallback or capacity purchase is authorized.

## Fresh security review

[Fresh npm audit](dependency-audit.json): six affected packages reported (three critical, two high, one moderate). These are package-level advisory classifications, not proof of an exploitable application path.

- MapLibre 5.10.0: [GHSA-jrc7-96c5-q579](https://github.com/advisories/GHSA-jrc7-96c5-q579), critical attribution HTML sanitizer issue; advisory identifies 6.4.1 as patched. The accepted app disables attribution control, does not use Popup HTML and builds map labels with `textContent`. No current untrusted attribution path was found. Any new edition must preserve this boundary; do not silently add third-party attribution HTML. A major-version upgrade requires compatibility and visual checks, not `npm audit fix --force`.
- fast-xml-parser 5.3.6: entity-processing and XMLBuilder advisories. Existing parser disables entity processing, rejects DOCTYPE/ENTITY declarations, caps XML size and does not use XMLBuilder. These controls mitigate the inspected paths; audit findings remain, and public collector review must verify those controls remain in effect.
- Vite, Vitest, mocker and tinypool: build/test-tool advisories. No development/UI server should be deployed; only static `dist` assets belong in Pages. Dependency upgrades or a documented reachability disposition and regressions remain part of implementation release review. No fresh security clearance is claimed.

No dependency was upgraded, no vulnerable path was demonstrated, and no security finding was hidden. These findings require explicit disposition during implementation; the billing gate is the present activation blocker.

## Verification status and remaining work

This milestone ran fresh network/source normalization, package graph/audit and read-only repository/Pages inspection. No new application tests/build/browser suites were run because no application implementation was made. Prior main-promotion results (131 tests/build, five browser suites/53 zero-violation axe scans, package/replay checks) remain historical results from earlier in this conversation, not tests of a static edition.

Once the $0 gate is resolved: implement bounded state/publication and subpath handling on this branch; test caps, incomplete feeds, cancellation, missing state, failures/delays, stale/expired/invalid/missing JSON and provenance; run all existing suites plus static-subpath bilingual desktop/mobile/keyboard/Explorer checks; inspect final artifact and fresh security findings; then promote and manually deploy only if Stage A passes. Verify the actual public URL after deployment, record exact source/deployment SHAs, and update project status separately from v1.0 closure. No implementation/publishing gate is waived by this report.

No deployment, release/tag, service activation, unattended collection, new enrollment or expenditure occurred. One bounded feed and one bulletin request plus official terms/security documentation requests were performed under this assignment. No temporary application service or scheduler was started.
