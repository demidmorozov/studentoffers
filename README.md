# StudentOffers

A lightweight, English-language directory of student benefits and opportunities in Armenia. Built with Astro, TypeScript, Tailwind CSS, self-hosted Inter, and Lucide icons. Static output; no database, accounts, or backend.

## Local development

Use Node.js 24 (configured in `.node-version`) and npm. Astro requires Node.js 22.23.4 or newer; this project was tested with Node.js 24.18.0.

```sh
npm ci
npm run dev
```

Open the local URL printed by Astro, normally `http://localhost:4321`.

To preview the production output:

```sh
npm run build
npm run preview
```

## What is implemented

- Responsive directory with pure white surfaces, black typography, neutral borders, semantic navigation, native mobile menu, breadcrumbs, and a custom 404. The header retains the brand; the footer contains only copyright and the independent-information note.
- One unified directory with nine categories for local and international offers available to students studying in Armenia. Transport & Travel includes accommodation. Replaced geographic URLs have Cloudflare Pages redirects.
- Published listings include 12 records with official-source checks, 36 explicitly labeled research snapshots from the supplied English compilation, and the site-owner update for the regular 15% Yerevan student transport discount. Converse Bank Student Card is included in all five-card listings, selection options, and comparisons. Snapshot dates are separate from source-check dates; missing exact URLs remain visible. The import and original review are documented in `docs/unified-directory-review.md`.
- Live search across providers, offer names, categories, benefits and eligibility. Optional bank-card selection persists across categories, includes offers requiring no specific card, supports a strict toggle, and has active-state/result counts and reset controls. Other eligibility requirements remain visible.
- Banking comparison uses published card products only. Distinct cashback benefits reference parent cards; multi-category offers retain one record and one canonical detail page.
- Honest empty states in categories without supplied research. No fictional jobs, scholarships, contact details, or testimonials.
- Minimal About page, research policy, and submission guidelines. The Contact page and its navigation links are removed. Suggestions use the existing GitHub issue tracker; the site does not collect personal information.
- Descriptive metadata, configurable canonical and Open Graph URLs, sitemap, robots.txt, and Cloudflare security/cache headers.

The homepage and detail pages need no client-side application framework. Live filtering uses one small external JavaScript module, about 1.9 KB uncompressed. Listings and native navigation remain accessible with JavaScript disabled.

## Cloudflare Pages

Connect **this existing repository** to Cloudflare Pages. Do not add a server adapter: this site uses Astro's static output.

| Setting | Value |
| --- | --- |
| Framework preset | Astro |
| Root directory | Repository root |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | `24` (set `NODE_VERSION=24` if the Pages build environment requires it) |
| Production environment variable | `SITE_URL` = the actual absolute HTTPS origin assigned to this site |

Set `SITE_URL` in the Pages build environment after the deployment hostname is known, then rebuild. For a custom domain, change it to that actual origin and rebuild. No production domain is hardcoded or assumed. Avoid using a production `SITE_URL` for a preview deployment unless its canonical URLs should point to production.

With `SITE_URL` configured, the build emits absolute canonical URLs, Open Graph URL/image metadata, a populated `/sitemap.xml`, and a sitemap reference in `/robots.txt`. Without it, local builds still succeed, domain-dependent tags are omitted, and the sitemap has no URL entries. **Configure this variable before the public launch.**

`wrangler.toml` declares the Pages output directory for optional Wrangler deployment. `public/_headers` is copied into `dist` and applied by Cloudflare Pages. The custom `404.html` preserves proper missing-page behavior instead of an SPA catch-all. No credentials or environment files are required in Git.

## Project structure

```text
research/                 Original supplied ODT documents (preserved)
src/data/                 Typed category definitions and offer records
  banking.ts              Card products and separate financing references
  mobile.ts               Ucom student plans
  transportation.ts       Regular 15% Yerevan student transport discount
  types.ts                Shared offer, source, status, and section types
  research-import.ts      English research snapshots and import provenance
  offers.ts               Combined directory and formatting helpers
src/components/           Reusable navigation, cards, search, filters, tables, details
src/layouts/Layout.astro  Shared document, font, SEO, header, and footer
src/pages/                Static category, offer, about, search, and utility routes
src/lib/                  Client-side filtering and sitemap route inventory
src/styles/global.css    Design system and responsive styles
public/                   Favicon, social graphic, Cloudflare headers
scripts/                  ODT extraction and built-site link validation
tests/                    Playwright interaction, content, and accessibility checks
docs/research-audit.md    Research inventory, translation decisions, verification limits
```

## Adding or maintaining content

1. Read the primary research and preserve its original document in `research/`.
2. Add an `Offer` record to the relevant data module. Detail pages, cards, category counts, and sitemap routes derive from the data; presentation components do not need changes.
3. Populate fees, currencies, eligibility, documents, restrictions, and sources using documented information only. Use explicit “Not documented” wording for missing fields. Financing must disclose missing rates, costs, repayment terms, guarantees, and subsidy conditions.
4. Set `researchDate` only when the document supplies an exact date. `reviewedDate` is the date of site review. `verifiedDate` remains `null` until full independent verification is completed. Record partial checks and conflicts in `verificationNote`.
5. Publication normally requires a successful source check. The English import explicitly uses `publicationBasis: research-snapshot`, requires research provenance, and displays unverified status and missing-source notes. Use `Active` only after confirming material current terms and availability. Otherwise use `Verification Required`, `Expired`, or `Archived`. Products and promotions have separate statuses; review promotion end dates whenever updating or rebuilding. Status changes are editorial, not automatic.
6. Add only filters supported by the data through each record's `tags`. The “Free Cards” tag means both free issuance and free servicing under the documented conditions; free servicing alone does not qualify. Avoid applying current-benefit tags to archived products.
7. Run the checks below and rebuild after each content update. Static deployments do not fetch provider data at runtime.

`Category` definitions currently cover all requested sections. Additional offer categories can be supported by extending the typed category/kind unions and adding their records to `offers.ts`.

To inspect the ODT text and embedded official links without a third-party ODT reader:

```sh
python3 scripts/extract-research.py
```

## Validation

```sh
npm run check          # Astro + TypeScript diagnostics
npm run build          # Generate dist
npm run test:routes    # Check every built internal link, asset, and anchor
npx playwright install chromium
npm test               # Browser, responsive, no-JS, content, accessibility tests
npm run test:links     # External source reachability, requires network
npm audit             # Published dependency advisories
```

The browser suite starts and stops its own local production preview. Screenshots and failure traces go into ignored `test-results/`; external results go into ignored `external-link-report.json`. Reachability checks report failures for manual follow-up; HTTP success alone does not confirm an offer's terms. On restrictive hosts, Astro may need permission to initialize its local configuration directory and Playwright needs permission to launch a browser and bind a local port. `ASTRO_TELEMETRY_DISABLED=1` can disable Astro's optional telemetry.

The directory includes tests for publication gates, import provenance, missing sources, ESNcard and Visa requirements, linked benefits, multi-category identity, remembered bank-card filters, eight viewport widths, no-JavaScript rendering, content security policy and desktop/mobile WCAG AA checks. See `docs/unified-directory-review.md` for the publication inventory and validation results.

## Research limitations

The research is the primary content source. The English compilation is dated 26 October 2026 and has not been independently rechecked. Banking is dated 26 October 2026; mobile has no document date; the original transport document says 2026 without an exact date. The regular transport listing uses the site-owner update supplied on 26 October 2026 and clearly states that the transport site did not expose readable terms during checking. No unconfirmed offer is marked Active. The completed Amio promotion and Ameriabank scholarship are labeled Expired, and VTB iStudent is Archived. Full independent verification is still required before claiming current availability.

The English Amio tariff is hosted at the bank's documented PDF URL. Some other official sources are in Armenian; the StudentOffers interface and summaries remain in English. GitHub sign-in is required to submit an issue.

The existing MIT [LICENSE](LICENSE) is preserved.
