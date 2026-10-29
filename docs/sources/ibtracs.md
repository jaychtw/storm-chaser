# IBTrACS — historical-reference catalog verified

Updated 2026-10-29 Asia/Taipei. The [NOAA NCEI official catalog](https://www.ncei.noaa.gov/products/international-best-track-archive) returns HTTP 200. It describes a combined recent/historical **best-track** dataset, not an archive of forecasts as issued. No historical data file was downloaded; this remains deferred beyond M1.

Verified catalog facts:

- Current listed version: **4r01**, June 2024 release; DOI `10.25921/82ty-9e16`, NCEI DSI 9637.
- Linked formats: netCDF, CSV, shapefile; linked subsets include the western Pacific (`WP`). CSV missing values are blank; other formats use `-9999.0` according to the page.
- The current-version section says **updated weekly**. A separate description of older v04 features says best tracks updated daily; do not promote the older wording into a current cadence guarantee. No live change was observed.
- Terms state full/open scientific access and provider agreements allowing distribution for global tropical-cyclone research, with WMO Resolution 40 as the guide for commercial use. The full external WMO policy was not inspected; do not label all uses unrestricted/public domain.
- Catalog requests dataset and BAMS-paper citations. Optional user registration is described as voluntary.
- Catalog warns about inter-agency differences, including wind-averaging periods. Do not assume comparable wind intensity or error-reference truth from merged records alone.

Direct official catalog links for later work:

- [Technical details](https://www.ncei.noaa.gov/sites/default/files/2025-04/IBTrACS_version4r01_Technical_Details.pdf)
- [Column documentation](https://www.ncei.noaa.gov/sites/default/files/2025-09/IBTrACS_v04r01_column_documentation.pdf)
- [Versioned CSV directory](https://www.ncei.noaa.gov/data/international-best-track-archive-for-climate-stewardship-ibtracs/v04r01/access/csv/)

Actual coordinate/time/native-ID/unit conventions, revision handling, column metadata, best-track choice and commercial/reuse restrictions require those documents and samples before historical implementation. Forecast Showdown and Time Travel additionally require genuine historical **forecast advisories** with matched issuance times and licensed retention; IBTrACS alone cannot supply them. It is never a live forecast fallback.
