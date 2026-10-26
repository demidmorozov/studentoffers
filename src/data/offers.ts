import { bankCards, bankLoans } from './banking';
import { mobileOffers } from './mobile';
import { transportationOffers } from './transportation';
import type { Offer, ResearchOffer } from './types';
import { assertOfferData, cleanSourceUrl, publishedOffers } from '../lib/offer-data';
import { cardBenefits, checkedDate, draftReasons, musicResearch, verifiedUpdates } from './verified';
import { researchOffers } from './research-import';

function importResearch(raw: ResearchOffer): Offer {
  const category = raw.category === 'transportation' ? 'transport-travel' : raw.category;
  const reason = draftReasons[raw.slug] ?? 'Material terms have not been successfully verified.';
  return {
    ...raw, id: raw.slug, category, categories: [category], publication: 'draft', draftReason: reason,
    benefitType: raw.kind === 'card' ? 'bank-card' : raw.kind === 'loan' ? 'financing' : 'paid-plan',
    price: null, expiresAt: null, requirements: { verification: raw.documents },
    verifiedDate: null,
    sourceVerification: { state: 'unverified', lastAttempted: checkedDate, lastChecked: null, note: reason },
    sources: raw.sources.map(source => ({ ...source, url: cleanSourceUrl(source.url) })),
  };
}

function confirm(offer: Offer, note: string): Offer {
  return { ...offer, publication: 'published', draftReason: undefined, status: 'Active', verifiedDate: checkedDate,
    verificationNote: note, sourceVerification: { state: 'verified', lastAttempted: checkedDate, lastChecked: checkedDate, note } };
}

const imported = [...bankCards, ...mobileOffers, ...transportationOffers, ...bankLoans, ...musicResearch()].map(importResearch);
const reviewed = imported.map(offer => {
  const update = verifiedUpdates[offer.id];
  if (update) {
    const merged = { ...offer, ...update };
    merged.requirements = { verification: merged.documents };
    return confirm(merged, 'Official product page and the displayed material terms were inspected on 26 October 2026. Bank approval and the stated eligibility requirements still apply.');
  }
  if (offer.kind === 'mobile') {
    // Student page establishes the uplift; separate current tariff pages establish the prices.
    const isPostpaid = offer.slug === 'ucom-level-up-3000';
    const regional = offer.slug.endsWith('regional');
    const amount = isPostpaid ? 3000 : regional ? 2000 : 2500;
    const data = isPostpaid ? 120 : 40;
    return confirm({ ...offer, price: { amount, currency: 'AMD', period: isPostpaid ? 'month' : '30 days' },
      benefit: `${data} GB`, benefitLabel: `${amount.toLocaleString('en-US')} AMD / ${isPostpaid ? 'month' : '30 days'} · paid plan`,
      summary: `Student mobile plan with ${data} GB for two years, subject to enrollment verification.`,
      highlights: [isPostpaid ? 'Postpaid subscription' : 'Prepaid plan', regional ? 'Regional activation required' : 'Enrollment proof required'],
      facts: [['Price', `${amount.toLocaleString('en-US')} AMD / ${isPostpaid ? 'month' : '30 days'}`], ['Student data', `${data} GB`], ['Benefit duration', '2 years']],
      restrictions: ['One student ID and passport combination can activate this benefit only once.', 'Calls to MTS Russia are excluded from the bundled international minutes.', ...(regional ? ['Activation at eligible regional service centers only.'] : []), ...(isPostpaid ? ['Postpaid billing applies; usage outside the bundle is charged separately.'] : ['Bundle renews after 30 days when the required balance is available.'])],
      sections: [], promotion: undefined,
    }, 'Official Ucom student page and current prepaid/postpaid tariffs checked. Student proof, price, data uplift and exclusions were confirmed; the current postpaid tariff excludes MTS Russia.');
  }
  if (offer.id === 'spotify-premium-student') {
    return confirm({ ...offer, categories: ['software', 'entertainment'], price: { amount: 2.99, currency: 'USD', period: 'month' },
      requirements: { university: 'Institution accepted by SheerID', verification: ['SheerID enrollment approval required.'] },
    }, 'Official Armenia Student page confirms the monthly price, enrollment verification, age condition and renewal rules. Spotify support confirms account-country and payment restrictions.');
  }
  if (offer.id === 'apple-music-student') {
    const reason = 'Apple support confirms a student plan, but the Armenian subscription page did not establish local student pricing or availability.';
    return { ...offer, categories: ['software', 'entertainment'] as Offer['categories'], draftReason: reason,
      sourceVerification: { ...offer.sourceVerification, note: reason } };
  }
  return offer;
});

const parent = reviewed.find(offer => offer.id === 'armeconombank-visa-student')!;
const benefits: Offer[] = cardBenefits.map(benefit => confirm({
  ...parent, id: benefit.slug, slug: benefit.slug, category: benefit.category, categories: [benefit.category],
  parentId: parent.id, kind: 'benefit', benefitType: 'cashback', price: null,
  name: benefit.name, benefit: benefit.benefit, benefitLabel: `cashback · ${benefit.label.toLowerCase()}`,
  summary: `${benefit.label} with Armeconombank Visa Student.`,
  highlights: [`Merchant code ${benefit.mcc}`], tags: ['Cashback'],
  facts: [['Eligible merchant code', benefit.mcc]], eligibility: [], documents: [], requirements: { verification: [] },
  restrictions: [`Payment must use merchant category code ${benefit.mcc}.`],
  steps: ['Pay with the qualifying card at an eligible merchant.', 'Cashback is credited by the final business day of the following month.'],
  comparison: undefined, sections: [], promotion: undefined,
}, 'Official Visa Student tariff confirms this cashback rate and merchant code. Shared card eligibility, monthly cap and exclusions are inherited from the parent card.'));

const fastVisa = reviewed.find(offer => offer.id === 'fast-bank-student')!;
const fastArca: Offer = { ...fastVisa, id: 'fast-bank-arca-classic-student', slug: 'fast-bank-arca-classic-student', name: 'ArCa Classic AknCard',
  summary: 'Students at Armenian educational institutions can choose an ArCa Classic under the bank’s one-free-card offer.',
  facts: [['Student offer', 'One free card'], ['Servicing', 'Free throughout card validity']],
  comparison: { issuance: 'One card free', annual: 'Free for card validity', cashback: 'Not specified', interest: 'Not specified', currencies: 'Confirm with bank', age: 'Bank approval', studentId: 'Enrollment proof required' },
};
export const allOffers: Offer[] = [...reviewed, fastArca, ...benefits, ...researchOffers];
assertOfferData(allOffers);
export const offers = publishedOffers(allOffers, new Date().toISOString().slice(0, 10));
export const drafts = allOffers.filter(offer => !offers.some(published => published.id === offer.id));
export const offersInCategory = (slug: string) => offers.filter(offer => offer.categories.includes(slug as Offer['category']));
export const disclaimer = 'Offer conditions may change. Confirm availability, fees, and eligibility with the official provider before applying.';
export const formatDate = (value: string | null) => value ? new Date(`${value}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) : 'Not published';
