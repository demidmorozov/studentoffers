import type { Offer } from './types';

const note = 'Prices and claiming steps supplied by the site owner on 26 October 2026. The official transport site did not expose readable terms during the source check; current fares and individual eligibility should be confirmed with Yerevan Municipality or Telcell.';

export const transportationOffers: Offer[] = [{
  id: 'yerevan-student-transport', slug: 'yerevan-student-transport',
  category: 'transport-travel', categories: ['transport-travel'], kind: 'transport', benefitType: 'discount',
  provider: 'Yerevan Public Transport / Telcell', name: '15% Student Discount on Yerevan Public Transport',
  benefit: '15% off', benefitLabel: '30-, 90-, and 365-day student transport passes',
  summary: 'Eligible students can purchase discounted Yerevan transport subscriptions: 7,650 AMD for 30 days, 20,400 AMD for 90 days, or 76,500 AMD for 365 days.',
  highlights: ['30 days: 7,650 AMD instead of 9,000 AMD', '90 days: 20,400 AMD instead of 24,000 AMD', '365 days: 76,500 AMD instead of 90,000 AMD'],
  publication: 'published', publicationBasis: 'research-snapshot', status: 'Verification Required',
  tags: ['Public Transport', 'Student Verification'], price: null, expiresAt: null,
  facts: [['Student discount', '15%'], ['30-day pass', '7,650 AMD instead of 9,000 AMD'], ['90-day pass', '20,400 AMD instead of 24,000 AMD'], ['365-day pass', '76,500 AMD instead of 90,000 AMD']],
  eligibility: ['Students who qualify for the Yerevan municipal transport discount.', 'Student status must be registered in the relevant municipal system.'],
  documents: ['Identity document and Public Services Number (PSN/SSN), when required.'],
  requirements: { verification: ['Student status must be registered against your Public Services Number (PSN/SSN).', 'Present your identity document and PSN when required.'] },
  steps: ['Make sure your student status is registered against your Public Services Number (PSN/SSN).', 'If your student status is not recognized, contact Telcell or the Yerevan Municipality to resolve the issue.', 'Present your identity document and PSN when required.', 'Purchase the discounted transport subscription.'],
  restrictions: ['Municipal student eligibility must be confirmed in the relevant system.'],
  sections: [{ title: 'Recommended way to use your pass', items: ['Use a physical Telcell transport card to store and use your subscription. This is a recommendation, not a mandatory requirement.'] }],
  sources: [{ label: 'Official Yerevan transport system', url: 'https://transport.yerevan.am/' }],
  researchFile: 'Site-owner transport update supplied in chat on 26 October 2026', researchDate: '2026-10-26', reviewedDate: '2026-10-26', verifiedDate: null,
  verificationNote: note,
  sourceVerification: { state: 'unverified', lastAttempted: '2026-10-26', lastChecked: null, note },
}];
