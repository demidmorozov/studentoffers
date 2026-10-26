# Unified directory review — 26 October 2026

## Current publication and design update

The directory now publishes 49 records: 12 with official-source checks and 37 research snapshots. Converse Bank Student Card is published through the existing verified-update data flow, with 1,000 AMD annual servicing, 4% annual AMD balance interest, free internet banking, one free associated current account, and bank-approved university eligibility. Its official product page was inspected on 26 October 2026. All five bank cards share the same category, selection, search, detail, and comparison components.

The regular 15% Yerevan student transport offer is now the first Transport & Travel listing. It shows the site-owner's 30-, 90-, and 365-day pass prices and PSN-linked municipal eligibility steps. The physical Telcell transport card is a recommendation. Current fares were not independently confirmed because the official transport site exposed no readable terms. The old transportation detail URL now redirects directly to the regular offer's canonical detail URL.

All page surfaces use white backgrounds with black type and neutral borders. Selected filters use borders, weight, and underlines. The header keeps its branding; the footer contains only the copyright and independent-information note. Contact is removed from pages, navigation, and the route inventory. About contains only the requested replacement copy.

Validation: Astro/TypeScript reports no errors, warnings, or hints. The production build generates 65 HTML pages, and 1,237 internal links/assets/anchors pass. All 37 data/browser tests passed, including transport prices, search and bank-card filters, layout, navigation, white surfaces, screenshots, and accessibility. Tests used a temporary preview configuration on port 4322. Desktop/mobile previews are saved in ignored `test-results/`.

## English compilation import

The current implementation retains 36 listings from the user-supplied English compilation identified in the data as `Studentoffers_Codex_English_Import.txt`. The original chat attachment is not stored in this checkout. Import provenance is preserved in `src/data/research-import.ts`; these records have a research date of 26 October 2026, status Verification Required, no independent verification date, and no successful source-check date.

After the compilation import, the directory published 48 records: the 11 source-checked records listed below and 37 research snapshots. Sixteen matching IDs are recorded as skipped so the original, richer records and their publication decisions remain intact. General references are labeled as references. Missing exact URLs are explained without creating provider links.

ESNcard partners require ESNcard membership independently of ordinary student ID. Yell Extreme Park uses one record across three categories. The two general Visa promotions require an eligible Visa card and are not linked to a particular student card; their recorded expiry is 31 December 2026. Tuition assistance appears as information on the banking page, outside the offer list and comparison table.

The import expands transport, entertainment, museums, electronics, fitness, food, ESNcard partners, and software. It does not establish live availability.

Compilation import validation: Astro/TypeScript reports no errors, warnings, or hints; the production build generates 65 HTML pages; all 1,426 internal links/assets/anchors pass; all 34 data/browser tests pass. Browser tests used a temporary configuration on port 4322 because port 4321 was already occupied. Offer terms were not independently rechecked during this continuation.

## Original source-check review

The following describes the review before the English compilation import.

The consolidated input identified by the user as `research/Pasted text(1).txt` was not present in this checkout when checked. That file was not imported during the original review; the later English compilation import is described above.

Available inputs: the three original ODT documents and local `fix4.odt` (Apple Music and Spotify). Original research records remain in the structured data even when unpublished. No source-check date is inferred from import or HTTP reachability.

## Source-checked records

11 records: four bank-card products (Armeconombank Visa Student, Acba Visa Student, Fast Bank Visa Gold AknCard, Fast Bank ArCa Classic); three Ucom student plans; Spotify Premium Student; and three Armeconombank cashback benefits linked to the parent Visa Student record.

Official sources inspected:

- https://www.aeb.am/en/individual/cards/visa-student — student proof, issuance, servicing, foreign-ID account-opening charge, MCC 4789 / 5814 / 7997 cashback, shared monthly cap, taxation and payout exclusions.
- https://acba.am/en/individual/cards/visa-student — standard annual fee, age limit, identity/PSN requirements, non-resident account-opening charge. The ambiguous free-card promotion is excluded from published claims.
- https://www.fastbank.am/landings/visa-student and the linked student special-offer page — one free card, servicing, enrollment proof, product-specific Visa Gold details. ArCa terms are kept separate.
- https://www.ucom.am/en/level-up-student1 plus current prepaid/postpaid tariff pages — student data uplift, enrollment procedure, prices, renewal period, regional activation and current MTS Russia exclusion. These are paid plans, not free service.
- https://www.spotify.com/am/student/ and Spotify student support — Armenian price, accredited-institution/SheerID restrictions, age condition, renewal and payment-country conditions. One record appears in Software and Entertainment.

Each source-checked record stores its own successful check date and sources. Eligibility and verification requirements remain distinct from source verification. The bank-card filter accepts a product selection only. A card application does not imply the applicant already holds that card; strict filtering applies to benefits requiring it. The filter’s local storage contains only product selection and strict-mode preference.

## Unpublished records

| Entry | Reason |
| --- | --- |
| Ameriabank Visa Classic Student | Product page exposed navigation without readable terms. |
| AraratBank Mastercard Student | Tariff readable; issuance and student eligibility/proof unresolved. |
| Converse Student Card | Approved-university list and application requirements not fully checked. |
| Amio Mastercard Student | English tariff defers to Armenian terms; student eligibility/promotion ambiguity remains. Resident status must not be conflated with citizenship. |
| Unibank ArCa U-Teenager | Promotion confirms 18–21 QR applicants; separate product terms and 14–17 eligibility unchecked. |
| VTB iStudent | Discontinued; historical record retained. |
| Ameriabank student financing | Readable current financing terms unavailable. |
| Armeconombank student credit | Linked credit agreement/full borrowing costs unchecked. |
| VTB education loan | Official loan URL retrieval failed. |
| Evocabank student financing | Document list does not establish complete product terms. |
| Converse student financing | Research does not establish a specific current product and full terms. |
| Yerevan student transport pass | Official eligibility page exposed no readable fares/conditions. |
| Apple Music Student | General student plan confirmed; Armenian student price/availability unresolved. |

The discussed Ameriabank Booking.com cashback was not published: no current official terms confirming its student-card eligibility or benefit were established. The 2025 Ameriabank cashback campaign found during checking is expired and is not evidence of a current Booking.com benefit.

Drafts never generate detail pages, category cards, comparison rows, search records or sitemap entries. Shared parent requirements are resolved at build time, so updating one parent updates every linked benefit. Cross-category records have one canonical detail URL.

## Routes and validation

`/discounts/` is the unified directory. `/global-discounts/` redirects to it through Cloudflare Pages `_redirects`. Transportation redirects to `/discounts/transport-travel/`; the former unverified transport-pass URL redirects to that category. Redirect targets are checked against published routes. Astro’s local preview does not apply Cloudflare redirect rules.

Original review validation: Astro/TypeScript diagnostics had no errors or warnings; the production build generated 28 HTML pages; 588 internal links/assets/anchors passed; all 29 data/browser tests passed. Coverage includes eight widths (320–1440 px), card selection persistence, strict/cardless filtering, combined search, blocked storage, no-JavaScript rendering, linked-parent updates, multi-category identity, draft exclusion and WCAG AA checks on desktop/mobile. Screenshots are saved in ignored `test-results/`.
