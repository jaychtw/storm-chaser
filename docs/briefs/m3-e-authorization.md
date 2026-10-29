# Storm Chaser — M3-E Experiential Design

**Repository:** https://github.com/jaychtw/storm-chaser  
**Starting revision:** `12dc2fc23ded833e8ba539fddd67caddde2af477`  
**Milestone:** M3-E — Experiential Design and Signature Interaction POC  
**Financial constraint:** $0 new expenditure  
**Deployment:** Not authorized

## 1. Project direction

Storm Chaser is an independent, bilingual tropical-cyclone information experience.

Its primary innovation should come from transforming existing, publicly available and lawfully reusable meteorological information into a more engaging, intuitive, structured and distinctive experience.

We do not seek firsthand observations, proprietary weather data or independent forecasting capabilities.

**Design objective:** Give users a compelling reason to prefer experiencing existing meteorological information through Storm Chaser.

Preserve the approved Night Operations visual identity, information-integrity standards, official-source attribution, English/Traditional Chinese support, mobile map-first design and previous engineering work.

## 2. Governing context

Review the current approved design guide, amendments, ADRs, `PROJECT_STATE.md`, M3-P verification and AICP v1.1.0 at standards commit `cb74fe9497d07370f44a18a09fec124ab99848ec`.

The product owner has accepted M3-P's visual design. Update the project-state record to reflect that acceptance while preserving the distinction between visual acceptance, reported technical verification and public release readiness.

The following experiential priority is now approved:

**Originality of presentation and interaction is more important than novelty of underlying information.**

This refines the product's priorities without silently cancelling previously approved functionality.

## 3. First signature interaction: Forecast-Time Explorer

Design and implement a representative interactive POC using existing, verified JMA forecast information.

The experience should allow users to navigate discrete, officially published forecast times and observe the corresponding changes in map emphasis and contextual information.

Required characteristics:

- A clear, accessible forecast timeline or equivalent interaction.
- Synchronization between selected forecast time, officially reported forecast position and accompanying source information.
- Distinct visual treatment of analysis position and future forecast positions.
- Clear labels identifying forecast data as predictions, not observed or actual storm movement.
- No interpolated positions presented as official information.
- No invented forecasts, probabilities, impact assessments or intensity conversions.
- Usable desktop keyboard, mouse and mobile touch interactions.
- English and Traditional Chinese localization.
- Reduced-motion compatibility and restrained animation.
- Preservation of source issue time, forecast-valid time, native values and attribution.
- Graceful behavior for missing, expired, stale or insufficient forecast information.

Explore whether transitions between officially reported points can improve comprehension without implying physical movement between those points. If any animated transition risks misrepresenting meteorological meaning, use discrete stepping instead.

Do not introduce a new historical issuance-cycle browser. This interaction explores points within the currently selected advisory, not previously issued forecast cycles.

## 4. Secondary design exploration

Evaluate two additional experiential opportunities without automatically implementing them:

**Progressive disclosure:** A simple overview for casual visitors that can expand into detailed meteorological evidence without cluttering the main map.

**Alternative information perspectives:** Other ways to organize the same source information, such as forecast-horizon-centered exploration rather than storm-centered navigation.

Document the potential user benefit, required existing data, interaction complexity, limitations and development effort.

Recommend one only if it creates meaningful additional value beyond the Forecast-Time Explorer.

Do not expand the implementation scope without owner approval.

## 5. Design and implementation approach

Use the existing MapLibre interface, data structures and retained source specimens.

First establish the interaction concept and its data-semantic constraints. Then implement a representative working POC, using the existing development environment.

Avoid a major redesign, new backend, speculative ranking engine, external dependency or asset-production pipeline.

Preserve the approved M3-P behavior, especially neutral uncertain Auto, manual selection, client-side expiry and source-state honesty.

If the proposed interaction requires a material alteration of the approved layout or meteorological semantics, produce a design comparison and request approval before making that alteration.

## 6. Evaluation criteria

Evaluate the POC against these questions:

1. Does it provide a meaningfully different experience from simply selecting forecast markers on the existing map?
2. Does it make the temporal structure of a forecast easier to comprehend?
3. Does it encourage exploration without sacrificing information clarity?
4. Can casual users understand the interaction without extensive instructions?
5. Does the experience remain useful on mobile?
6. Does it faithfully represent official source information?
7. Is the added complexity justified by an identifiable user benefit?

Avoid judging success solely by animation quality, feature count or automated test results.

## 7. Verification

Run the existing unit, build and browser suites and introduce focused tests for timeline navigation, selected-point accuracy, localization, expiry, stale data, keyboard use and touch interaction.

Use saved official specimens and labeled controlled replay. Keep synthetic and live data isolated.

Provide actual running-interface screenshots for desktop and mobile in both languages, plus a comparison with the pre-M3-E experience.

Clearly distinguish automated verification from human usability and visual acceptance.

## 8. Deliverables

Provide:

1. A concise experiential design rationale.
2. A functional Forecast-Time Explorer POC.
3. Before/after interaction comparison explaining the new experiential value.
4. Desktop/mobile screenshots and reproducible local review instructions.
5. Test results and limitations.
6. Assessment of the two secondary experiential opportunities.
7. Proposed GDD amendment emphasizing experience-layer innovation.
8. Updated `PROJECT_STATE.md` with accurate milestone and decision status.
9. Exact development commit SHA and review links.

## 9. Boundaries and stop conditions

You may implement and test the bounded POC on a dedicated development branch.

Do not merge into `main`, activate services, create public previews, procure infrastructure, enroll in paid or free-tier services, incur expenditure, or deploy.

Do not alter Taiwan relevance methodology or add CWA/JTWC integrations.

Do not represent a POC as a production-ready feature.

Stop after delivering the POC and review evidence. The product owner will decide whether the interaction is accepted, revised or rejected before production integration or further experiential expansion.

**Guiding principle: Same evidence, new perspective, better experience.**
