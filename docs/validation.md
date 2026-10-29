> M0 update, 2026-10-29 Asia/Taipei: the original network blocker is resolved and official-source verification resumed. See [current audit](sources/README.md). The M1 screenshots and checks below remain the original visual-prototype results, not a current source-health dashboard.

# M0 / M1 validation and design review

Validated locally on 2026-10-29 Asia/Taipei. No remote CI run, deployment, environment publication, fresh-task restoration or live weather ingestion is claimed.

## Executed results

| Check | Result |
|---|---|
| Clean locked install: `npm ci --no-audit --no-fund` | Passed |
| TypeScript + Vite: `npm run build` | Passed; bundle-size advisory for MapLibre-containing JS (975 kB / 267 kB gzip) |
| Unit tests: `npm test` | 7 passed, 0 failed, 0 skipped |
| Browser: `PREVIEW_URL=http://127.0.0.1:4173 npm run test:browser` | Passed against built preview |
| Axe WCAG A/AA scans | 7 scenario/locale/viewport scans, 0 violations; see [machine-readable results](browser-results.json) |
| Responsive overflow | No horizontal overflow at 320, 390, 768, 1024 and 1440 px |
| Public agency probes | Failed; M0 operational gate remains blocked, not passed |
| Live integration / scheduling / archives | Not implemented or tested (M2+) |
| Git whitespace check | Passed |

The browser suite verifies actual WebGL map/forecast-marker rendering, manual selection, return to Auto, path visibility, forecast point valid time, locale persistence after reload, selection retention across locale changes, truthful no-system/outage scenarios, keyboard storm selection, source-link availability after WebGL failure, and overflow. Pan/zoom and marker placement were visually inspected. Seven axe scans are useful automated checks, not a complete manual accessibility certification or real-device test.

A screenshot review caught forecast markers participating in normal layout instead of absolute geographic placement. This was corrected and screenshots regenerated; the browser suite now checks marker positioning mode. Nearby points can overlap at regional zoom: zoom in, use the path toggles to isolate a path, or use keyboard focus to inspect them. Source links are external-page fallbacks; no original chart image is implied or embedded.

## Review screenshots

| State | Desktop | Mobile |
|---|---|---|
| Two synthetic systems, English | [Desktop](screenshots/desktop-en-multi.png) | [Mobile](screenshots/mobile-en-multi.png) |
| Traditional Chinese / manual selection on desktop | [Desktop](screenshots/desktop-zh-manual.png) | [Mobile](screenshots/mobile-zh-multi.png) |
| No systems, Traditional Chinese | [Desktop](screenshots/desktop-zh-empty.png) | [Mobile](screenshots/mobile-zh-empty.png) |
| Simulated outage | [Desktop, EN](screenshots/desktop-en-outage.png) | [Mobile, zh-TW](screenshots/mobile-zh-outage.png) |

Review the central map prominence, restrained red identity, peripheral source cards, mobile stacking, bilingual typography and source-status clarity before M2. These are a visual review candidate, not an operational release candidate. Changes remain in the working tree; no release commit has been created.

## Remaining release gates

- [x] Responsive bilingual visual prototype with explicit synthetic labeling.
- [x] Local geographic map and keyboard-accessible storm/forecast controls.
- [x] Truthful source placeholders, external official links and independent-product disclaimer.
- [x] Reproducible commands, screenshots and automated prototype checks.
- [x] Apply the original six official-domain network settings; verify JMA feed and a real forecast specimen.
- [ ] Complete detailed M0 specifications, cadence/lifecycle cases and any second-source verification.
- [ ] One permitted real track source end to end; two before any comparison claim.
- [ ] M2 pipeline, canonical validation, immutable archive, idempotency/revisions and health API.
- [ ] M3 verified adapters, deterministic relevance rules, source freshness and manual-focus persistence across real updates.
- [ ] Real historical replay, source change observation and scheduled collection evidence.
- [ ] Full M4 security, manual accessibility, operational costs, monitoring, backups and rollback.
- [ ] Explicit owner release approval before deployment.
