# Unified directory review — 26 October 2026

The consolidated input identified by the user as `research/Pasted text(1).txt` was not present in this checkout when checked. Its full import remains pending. Do not represent this review as an import of that file.

Available inputs: the three original ODT documents and local `fix4.odt` (Apple Music and Spotify). Original research records remain in the structured data even when unpublished. No source-check date is inferred from import or HTTP reachability.

## Published records

11 records: four bank-card products (Armeconombank Visa Student, Acba Visa Student, Fast Bank Visa Gold AknCard, Fast Bank ArCa Classic); three Ucom student plans; Spotify Premium Student; and three Armeconombank cashback benefits linked to the parent Visa Student record.

Official sources inspected:

- https://www.aeb.am/en/individual/cards/visa-student — student proof, issuance, servicing, foreign-ID account-opening charge, MCC 4789 / 5814 / 7997 cashback, shared monthly cap, taxation and payout exclusions.
- https://acba.am/en/individual/cards/visa-student — standard annual fee, age limit, identity/PSN requirements, non-resident account-opening charge. The ambiguous free-card promotion is excluded from published claims.
- https://www.fastbank.am/landings/visa-student and the linked student special-offer page — one free card, servicing, enrollment proof, product-specific Visa Gold details. ArCa terms are kept separate.
- https://www.ucom.am/en/level-up-student1 plus current prepaid/postpaid tariff pages — student data uplift, enrollment procedure, prices, renewal period, regional activation and current MTS Russia exclusion. These are paid plans, not free service.
- https://www.spotify.com/am/student/ and Spotify student support — Armenian price, accredited-institution/SheerID restrictions, age condition, renewal and payment-country conditions. One record appears in Software and Entertainment.

Each published record stores its own successful check date and sources. Eligibility and verification requirements remain distinct from source verification. The bank-card filter accepts a product selection only. A card application does not imply the applicant already holds that card; strict filtering applies to benefits requiring it. The filter’s local storage contains only product selection and strict-mode preference.

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

Validation: Astro/TypeScript diagnostics have no errors or warnings; production build generates 28 HTML pages; 588 internal links/assets/anchors pass; all 29 data/browser tests pass. Coverage includes eight widths (320–1440 px), card selection persistence, strict/cardless filtering, combined search, blocked storage, no-JavaScript rendering, linked-parent updates, multi-category identity, draft exclusion and WCAG AA checks on desktop/mobile. Screenshots are saved in ignored `test-results/`.
