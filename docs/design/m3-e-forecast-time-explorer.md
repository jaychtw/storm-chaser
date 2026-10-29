# M3-E interaction concept — Forecast-Time Explorer

2026-10-29 Asia/Taipei. Bounded POC authorized by the [M3-E assignment](../briefs/m3-e-authorization.md); experiential/visual acceptance of the new interaction remains pending. Baseline: `12dc2fc23ded833e8ba539fddd67caddde2af477`. M3-P visual design is accepted by the owner; that does not establish production readiness.

## Concept established before implementation

**Question:** “What does this advisory publish for each forecast time?” A small panel below the existing map provides previous/next published steps and an accessible discrete timeline. The selected time highlights its exact published map marker and shows that point's native information, valid time and advisory issue/source link. The existing storm list, neutral Auto, map hierarchy and detailed evidence stay in place.

Start at the advisory's analyzed center, visually labeled **Analysis**. Subsequent steps are **Forecast / prediction**, not observations. Include only the actual published forecast points that remain current under the existing display policies. Step spacing represents an ordered list, not elapsed-time scale; show actual lead hours, UTC+08:00 valid times and the gap to the next published point. Never assume 12-hour increments.

The native range control uses integer step indices; keyboard arrows/Home/End and previous/next buttons move among records, not intermediate positions. The original forecast-time list remains an alternate direct-selection route inside system details. Map-marker selection and timeline selection synchronize. No autoplay, moving storm sprite, animated line drawing, smooth position tween or camera flight. Discrete emphasis is more honest than a transition that could imply a modeled path between points. Respect reduced motion by using no essential motion at all.

The component operates only after explicit storm selection in live mode. Auto remains neutral even with a single storm. Demo fixtures remain separate; no synthetic timeline is relabeled as official JMA information. This explores one currently selected advisory, not historical issuance cycles.

## Semantic and failure contract

- Read source coordinates/values without interpolation, intensity conversion, inferred movement, probabilities or impact calculations. Preserve datum notice, issue/valid/retrieval/source provenance and missing fields.
- Stale-but-eligible points may be explored with conspicuous last-known labeling; a successful API response does not renew meteorological freshness.
- Expiry applies before timeline construction and on resume, offline and refresh. If a selected point disappears, explain it and show the analyzed baseline only while its parent advisory is still eligible. Never silently select another storm or forecast time.
- No forecast points: explain insufficiency; no invented timeline. No selected/eligible storm: prompt or expiry explanation, controls unavailable.
- Respect an explicitly hidden JMA forecast layer; explain why exploration is unavailable rather than silently re-enabling it.
- Keep keyboard focus and camera stable during stepping and ordinary refresh. Native slider DOM must remain stable while dragging; only its selected readout/map emphasis changes.

## Expected value vs M3-P

M3-P requires finding a small marker or a time button inside details, then reading a separate point detail. The POC brings a chronological sequence, explicit next/previous controls, actual time gaps and synchronized position/source context beside the map. It offers a repeatable exploration path even when markers overlap. The hypothesis is better comprehension of forecast timing, not more forecast accuracy. Evaluation must include the actual running composition and owner/casual-user feedback, not only test counts.

Secondary explorations, test outcomes, before/after evidence and a seven-question assessment will be recorded in the delivery report. No secondary interaction or broad redesign is authorized by this concept.
