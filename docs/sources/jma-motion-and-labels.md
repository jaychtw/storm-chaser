# M3-P — JMA motion and presentation terminology

Reviewed 2026-10-29 Asia/Taipei, using saved official documentation and specimens; **no new source request**. JMA remains the sole integrated source. No category harmonization, speed conversion or inferred direction is introduced.

The [saved product manual](evidence/m0-completion/vptw61-manual.txt), printed p12 (text lines 354–368), documents `CenterPart/jmx_eb:Direction`, `type="移動方向"`, `unit="１６方位漢字"`. Values are 16 compass directions; an empty element can carry `condition="不定"` / `description="不定"`. Center speed is separately reported in knots and km/h; null numeric content can have `ゆっくり` (slowly) or `ほとんど停滞` (almost stationary). The [actual saved specimen](evidence/2026-10-29/jma-vptw61.xml), lines 57–59, reports west, 13 knots and 25 km/h at its analysis time. Later forecasts include slow/null speed. This is a dated specimen, not current weather.

Manual provenance/official bundle URL and hash: [M0 document manifest](evidence/m0-completion/documents.json). Source: Japan Meteorological Agency website. Extract organization and UI terminology are Storm Chaser's responsibility, not an official JMA translation.

Normalization reads the **center's** direction only; it must not read wind-area or probability-circle radius directions. Preserve native value/type/unit/condition/description and the parent advisory's URL/hash/retrieval/source times. Unsupported direction types/units/values are quarantined rather than reinterpreted. Direction is optional so pre-M3-P snapshots remain readable without migration or invented data; missing direction is shown as unreported. No bearing is calculated from connectors. Numeric speeds remain independent native measurements, not reconciled conversions.

| Native term | English UI | zh-TW UI |
|---|---|---|
| 最大風速 | Maximum wind (10-minute mean) | 最大風速（10 分鐘平均） |
| 最大瞬間風速 | Maximum instantaneous wind | 最大瞬間風速 |
| 中心気圧 | Central pressure | 中心氣壓 |
| 移動方向 / 移動速度 | Reported direction / Reported speed | 來源發布的移動方向／移動速度 |
| ノット | knots | 節 |
| 中心付近 | Near the center | 中心附近 |
| ゆっくり | Slowly, with numeric value unreported | 緩慢移動，數值未提供 |
| ほとんど停滞 | Almost stationary, with numeric value unreported | 幾乎停滯，數值未提供 |
| 不定 | Undetermined | 未定 |
| 台風(TY) | Typhoon (TY) | 颱風 (TY) |
| 台風(TS) / 台風(STS) | JMA tropical cyclone (TS/STS), retaining each native code | JMA 熱帶氣旋 (TS/STS)，保留各來源代碼 |
| 熱帯低気圧(TD) / 温帯低気圧(LOW) | Tropical depression (TD) / Extratropical cyclone (LOW) | 熱帶性低氣壓 (TD)／溫帶氣旋 (LOW) |

The generic TS/STS label deliberately preserves the JMA code rather than calling all Japanese `台風` entries English “Typhoon” or assigning a CWA intensity class. Native class strings are available in the source-terminology disclosure. Sixteen-point compass labels are lexical mappings, e.g. `北西` → Northwest / 西北; they do not add numeric bearings or precision. Full direction strings remain in source metadata.

Known labels are maintained centrally in `src/data-labels.ts` / `src/i18n.ts`. Unknown terms stay visible with an explicit “Untranslated source term” / 「未翻譯的來源用語」 label, including unknown conditions. Numeric descriptions and official prose are retained in native terminology/source links; they are not automatically translated as authoritative text. Owner language/visual acceptance remains a separate review gate.
