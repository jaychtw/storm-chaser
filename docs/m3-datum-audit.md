# M3 — coordinate datum decision

Reviewed 2026-10-29, Asia/Taipei. **The omission is now audited and represented explicitly. It is not relabeled as a verified EPSG:4326 source CRS.**

## Evidence

The [JMA XML dictionary](https://xml.kishou.go.jp/jmaxml_20260129_dictionary.xlsx) defines `type.Coordinate`, decimal-degree/degree-minute center position types, and an optional `datum` attribute. Its exact explanatory text is:

> 測地系を示す（日本測地系の場合のみ表現する）。

Meaning: indicates the datum, expressed only for the Japanese datum. The documented value is `日本測地系`. The [JMA schema bundle](https://xml.kishou.go.jp/jmaxml_20241031_Schema(xsd).zip), member `jmx_eb.xsd`, makes `datum` optional and enumerates only that value. [Dictionary extraction](sources/evidence/m3/datum-dictionary.txt), [schema excerpt](sources/evidence/m3/datum-schema.xml) and [retrieval hashes](sources/evidence/m3/documents.json) preserve the evidence. Source: Japan Meteorological Agency website; extraction/organization by Storm Chaser.

The previously reviewed XML format §1.3.5 prescribes **ISO 6709 coordinate encoding**. That is latitude/longitude representation, not proof of a particular geodetic datum realization. The typhoon manual gives decimal centers at 0.1-degree precision and a separate degree-minute representation. The inspected actual bulletin and all 23 selected official examples omit `datum` on their decimal centers. The linked [XML FAQ](https://xml.kishou.go.jp/qanda.html) supplied no additional datum/WGS declaration in the inspected text.

## Precise interpretation

- `datum` is a **horizontal reference-system qualifier**, not a missing wind/position measurement. Its omission is intentional under the dictionary convention; it is not an XML error by itself.
- The evidence establishes the **legacy-Japanese-datum exception mechanism**. It does not explicitly identify an EPSG code, WGS84 realization, reference epoch or datum transformation for the inspected typhoon product. We must not turn that absence into an independently verified WGS84 claim.
- The previous generic “unspecified source datum” risk is therefore resolved into a concrete, testable contract: native ISO 6709 decimal centers, omitted source qualifier, explicit WGS84-basemap display assumption, and rejection of an explicitly unsupported datum. Exact geodetic realization remains a documented release limitation, not an invented answer.

## Impact and safeguards

The normalized point records now contain `datum.encoding`, `sourceAttribute`, `interpretation`, `plottingAssumption`, and `precisionDegrees`. They preserve native values unchanged. Decimal latitude/longitude is reordered to longitude/latitude for GeoJSON. No datum transformation or interpolation is performed. Source point precision alone is coarse; it does **not** prove any datum difference is negligible. No numeric datum offset/error is claimed without an authoritative transformation or source clarification.

If `datum="日本測地系"` or another explicit qualifier appears, the parser quarantines the bulletin instead of silently plotting those coordinates on the current WGS84 basemap. The raw payload remains available subject to retention, and collection health shows a partial/stale state. Tests verify this guard. Both languages show an approximate-position/reference limitation next to the live map and in source details.

The prototype is suitable for qualitative regional viewing of source-reported centers with attribution. It must not claim survey accuracy, exact coast/land intersection, precise Taiwan closest-approach distances, independent impact probabilities or safety decisions from these points. Any future distance/relevance/impact feature must first obtain product-specific authoritative CRS clarification or use explicitly justified error bounds and separate owner review. No email or other contact with JMA was sent.
