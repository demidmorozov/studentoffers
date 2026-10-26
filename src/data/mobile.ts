import type { Offer } from './types';
const plans = [
  { slug: 'ucom-level-up-2500', name: 'Level Up+ 2500', price: '2,500', data: '40', standard: '20', minutes: '1,000', sms: '500', type: 'Prepaid' },
  { slug: 'ucom-level-up-3000', name: 'Level Up+ 3000', price: '3,000', data: '120', standard: '40', minutes: '1,500', sms: '300', type: 'Postpaid' },
  { slug: 'ucom-level-up-2000-regional', name: 'Level Up+ 2000 Regional', price: '2,000', data: '40', standard: '20', minutes: '750', sms: '300', type: 'Prepaid', regional: true },
];
export const mobileOffers: Offer[] = plans.map(plan => ({
  slug: plan.slug, category: 'mobile-internet', kind: 'mobile', provider: 'Ucom', name: plan.name,
  benefit: `${plan.data} GB`, benefitLabel: `${plan.price} AMD / month`,
  summary: `Student mobile plan with ${plan.data} GB instead of ${plan.standard} GB for 2 years, without an additional charge for the increased data allowance.`,
  highlights: [`${plan.minutes} call minutes · ${plan.sms} SMS`, plan.regional ? 'Regional availability restrictions' : `${plan.type} mobile plan`],
  status: 'Verification Required', tags: [plan.type, ...(plan.regional ? ['Regional'] : [])],
  facts: [['Monthly price',`${plan.price} AMD`],['Student benefit',`${plan.data} GB instead of ${plan.standard} GB for 2 consecutive years, at no extra charge for the increased data allowance.`],['Price discount','No percentage price discount is documented. The benefit is additional data.'],['Included calls',`${plan.minutes} minutes to all Armenian mobile networks, USA, Canada, Russia (except MTS), and India, according to the research.`],['Included SMS',`${plan.sms} messages to local networks.`],['Payment type',plan.type],['Additional services','Special conditions for selected apps and Uplay Light; detailed app terms are not documented.'],['Offer end date','Not documented. The 2-year data benefit is not an enrollment deadline.'],['Age restrictions','Not documented.']],
  eligibility: ['Students who can provide the required enrollment proof.','Available to new and existing Ucom subscribers.','Number portability from another operator is supported.'],
  documents: ['Student ID or a stamped certificate from the educational institution.','Passport or another identity document.'],
  restrictions: ['One student ID and passport can be used to activate this student offer only once.',...(plan.regional ? ['Regional plan; connection availability depends on operator conditions. Eligible regions are not specified in the research.'] : []),...(plan.type === 'Postpaid' ? ['A subscriber agreement and monthly billing apply. Confirm the minimum contract term with Ucom.','The current retrieved student page omits the MTS exclusion in the postpaid column, while the supplied research includes it. Confirm eligible Russian networks directly with Ucom.'] : ['Prepaid payment; no postpaid agreement required according to the research.']), 'Confirm current price, SMS allowance, and app-specific restrictions with Ucom.'],
  steps: ['Visit a Ucom sales and service center.','Present student proof and your identity document.','Ask the operator to confirm plan availability and activate the student data benefit.','For number portability, request transfer of your current number at the service center.'],
  sources: [{ label: 'Ucom student program', url: 'https://www.ucom.am/en/level-up-student1' },{ label: `${plan.type} tariffs`, url: plan.type === 'Postpaid' ? 'https://www.ucom.am/en/next_level' : 'https://www.ucom.am/en/prepaid-levelup' }],
  researchFile: 'Mobile & Internet.odt', researchDate: null, reviewedDate: '2026-10-26', verifiedDate: null,
  verificationNote: 'The supplied document has no research date. Official student page inspected on 26 October 2026 confirms the data uplift, 2-year duration, and student verification procedure, but does not establish all prices, SMS allowances, or contract conditions. Full verification remains incomplete.',
}));
