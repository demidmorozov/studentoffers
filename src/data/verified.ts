import type { Offer, ResearchOffer } from './types';

// These overrides contain only claims inspected on official sources on this date.
export const checkedDate = '2026-10-26';
export const verifiedUpdates: Record<string, Partial<Offer>> = {
  'armeconombank-visa-student': {
    benefit: 'Student card', benefitLabel: 'Cashback benefits listed separately',
    summary: 'An AMD student card with free servicing and category-based cashback.',
    highlights: ['1,000 AMD issuance', 'Free servicing'], tags: ['Cashback'],
    price: { amount: 1000, currency: 'AMD', period: 'issuance' },
    facts: [['Issuance', '1,000 AMD'], ['Servicing', 'Free'], ['Currency', 'AMD'], ['Validity', '5 years']],
    eligibility: ['Student status required; bank account-opening approval applies.'],
    documents: ['Document confirming student status.', 'Identity and account-opening documents requested by the bank.'],
    restrictions: ['Cashback shares a 5,000 AMD monthly cap before tax across eligible categories.', 'Only qualifying noncash payments count. Incorrect merchant codes may prevent cashback.', 'Closing the card during a reporting month forfeits that month’s cashback.', 'Non-Armenian identity documents incur a 50,000 AMD account-opening fee.'],
    steps: ['Apply to Armeconombank with student proof and identification.', 'Check account-opening charges before ordering.'],
    sections: [], promotion: undefined,
    comparison: { issuance: '1,000 AMD', annual: 'Free', cashback: 'Category-based; shared 5,000 AMD cap before tax', interest: 'Not specified', currencies: 'AMD', age: 'Bank approval', studentId: 'Required' },
  },
  'acba-visa-student': {
    benefit: 'Student card', benefitLabel: '2,500 AMD standard annual service fee',
    summary: 'A debit card for customers up to age 30 inclusive; a student ID is not required.',
    highlights: ['AMD · USD · EUR', 'Identity document and PSN required'], tags: ['No Student ID Required'],
    price: { amount: 2500, currency: 'AMD', period: 'year' },
    facts: [['Annual service fee', '2,500 AMD under the standard tariff'], ['Currencies', 'AMD, USD, EUR'], ['Validity', '60 months']],
    eligibility: ['Customers up to age 30 inclusive; bank approval applies.'],
    documents: ['Identity document and Public Services Number (or an accepted certificate).', 'Applicants under 14 also need written parental consent.'],
    restrictions: ['A first account for a non-resident normally has a 15,000 AMD opening charge; published exceptions apply.', 'The “one free card” promotion does not clearly establish an annual-fee waiver; no fee waiver is assumed here.'],
    steps: ['Apply online or at an Acba branch.', 'Present identification and your PSN at the branch to receive the card.'],
    sections: [], promotion: undefined,
    comparison: { issuance: 'Confirm at application', annual: '2,500 AMD standard tariff', cashback: 'Not specified', interest: 'Not specified', currencies: 'AMD, USD, EUR', age: 'Up to 30 inclusive', studentId: 'Not required; ID and PSN required' },
  },
  'fast-bank-student': {
    name: 'Visa Gold AknCard',
    benefit: 'Free card', benefitLabel: 'One card with free servicing',
    summary: 'Students at Armenian educational institutions can apply for a free Visa Gold AknCard.',
    highlights: ['Free servicing for card validity', 'Enrollment proof required'], tags: ['Free Cards'],
    price: { amount: 0, currency: 'AMD', period: 'issuance and servicing' },
    facts: [['Student offer', 'One free card'], ['Servicing', 'Free throughout card validity'], ['Visa Gold validity', '5 years'], ['Visa Gold currencies', 'AMD, USD, EUR, RUB']],
    eligibility: ['Enrollment at an Armenian educational institution; bank approval applies.'],
    documents: ['Student ID, enrollment certificate, or accepted Moodle enrollment proof.', 'School pupils use accepted emis.am enrollment proof.'],
    restrictions: ['Only one free card under this offer.', 'Visa Gold terms do not automatically apply to ArCa Classic.', 'Other transactions and services follow the bank’s current tariffs.'],
    steps: ['Visit a Fast Bank branch with enrollment proof and identification.', 'Choose the eligible card and confirm the remaining tariffs.'],
    sections: [], promotion: undefined,
    comparison: { issuance: 'One card free', annual: 'Free for card validity', cashback: 'Not specified', interest: 'See bank tariff', currencies: 'Visa Gold: AMD, USD, EUR, RUB', age: 'Bank approval', studentId: 'Enrollment proof required' },
  },
};

export const draftReasons: Record<string, string> = {
  'ameriabank-visa-student': 'Official product page returned navigation without readable product terms. Fees, benefits and eligibility remain unresolved.',
  'araratbank-mastercard-student': 'Official tariff is readable, but student eligibility, required proof and issuance fee remain unspecified.',
  'converse-student-card': 'Official product tariff is readable; the approved-university list and complete application requirements have not been checked.',
  'amio-mastercard-student': 'Official English tariff is readable but defers to Armenian terms; student eligibility and the expired promotion require clarification. Resident status must not be conflated with citizenship.',
  'unibank-u-teenager': 'Promotion page confirms 18–21 QR applications; the separate card terms and researched 14–17 eligibility remain unchecked.',
  'vtb-istudent': 'Discontinued product; retained as an unpublished historical record.',
  'yerevan-student-transport': 'Official eligibility page returned no readable fares or conditions. Researched prices cannot be confirmed.',
  'ameriabank-student-financing': 'Official page did not expose financing terms; repayment costs and eligibility remain unconfirmed.',
  'armeconombank-student-credit': 'Card page mentions a credit line but the linked loan terms and full borrowing costs have not been checked.',
  'vtb-student-loan': 'Official loan URL could not be retrieved; current availability and costs are unknown.',
  'evocabank-student-loan': 'Official document page is readable but complete product prices, repayment terms and eligibility remain unconfirmed.',
  'converse-student-financing': 'Research does not establish a specific currently available financing product or its full terms.',
};

// Distinct benefits point to one parent. Shared eligibility and cap live on the parent.
export const cardBenefits = [
  { slug: 'aeb-student-fast-food-cashback', category: 'food-drinks', name: 'Student fast-food cashback', benefit: '2%', mcc: '5814', label: 'Fast-food and self-service payments' },
  { slug: 'aeb-student-transport-cashback', category: 'transport-travel', name: 'Student transport cashback', benefit: '5%', mcc: '4789', label: 'Qualifying urban and intercity transport payments' },
  { slug: 'aeb-student-sports-cashback', category: 'sports', name: 'Student sports-club cashback', benefit: '1%', mcc: '7997', label: 'Qualifying sports-club payments' },
] as const;

export function musicResearch(): ResearchOffer[] {
  return [
    { slug: 'spotify-premium-student', provider: 'Spotify', name: 'Premium Student', benefit: 'US$2.99', benefitLabel: 'per month · paid student subscription', summary: 'A discounted Premium subscription for eligible higher-education students in Armenia.', category: 'software', kind: 'subscription', status: 'Active', highlights: ['SheerID approval required', 'Eligible institution required'], tags: ['Paid Student Plans'], facts: [['Price', 'US$2.99 per month']], eligibility: ['Above age 18 and enrolled at an accredited institution accepted by SheerID.'], documents: ['Enrollment verified through SheerID.'], restrictions: ['Reverify every 12 months; student pricing is available for up to 4 years.', 'Your account country and payment method must match where you study.', 'The introductory trial is unavailable to previous Premium trial users.'], steps: ['Open the official Armenia Student page.', 'Complete SheerID verification, then return to Spotify to subscribe.'], sources: [{ label: 'Spotify Armenia Premium Student', url: 'https://www.spotify.com/am/student/' }, { label: 'Spotify student verification and payment conditions', url: 'https://support.spotify.com/article/premium-student/' }] },
    { slug: 'apple-music-student', provider: 'Apple', name: 'Apple Music Student', benefit: 'Student plan', benefitLabel: 'Armenian price unconfirmed', summary: 'Research lists an Apple Music student subscription; current Armenian pricing and availability need confirmation.', category: 'software', kind: 'subscription', status: 'Verification Required', highlights: ['Student verification required'], tags: [], facts: [['Research price (unconfirmed)', 'US$3.49 instead of US$6.49 per month']], eligibility: ['Eligible higher-education enrollment; Armenian subscription availability remains unconfirmed.'], documents: ['Student status verification through the provider’s supported process.'], restrictions: ['Do not publish the researched price until the Armenian checkout confirms it.'], sources: [{ label: 'Apple student subscription requirements', url: 'https://support.apple.com/en-us/106008' }, { label: 'Apple Music Armenia', url: 'https://music.apple.com/am/subscribe' }] },
  ].map(offer => ({ ...offer, researchFile: 'fix4.odt', researchDate: null, reviewedDate: checkedDate, verifiedDate: null, verificationNote: 'Imported from the local fix4.odt; import is not source verification.' } as ResearchOffer));
}
