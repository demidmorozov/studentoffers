import type { CategorySlug, Offer, Source } from './types';
import { cleanSourceUrl } from '../lib/offer-data';

// User-supplied English compilation; its snapshot date is not a live source check.
export const importResearchDate = '2026-10-26';
const provenance = 'English research supplied in chat — Studentoffers_Codex_English_Import.txt';
const sourceNote = 'Imported from the 26 October 2026 research snapshot. Official sources were not independently rechecked for this import.';
const source = (label: string, url: string, kind?: 'reference'): Source => ({ label, url: cleanSourceUrl(url), ...(kind ? { kind } : {}) });
type Entry = Pick<Offer, 'id' | 'provider' | 'name' | 'category' | 'benefit' | 'benefitLabel' | 'summary'> & Partial<Omit<Offer, 'id' | 'provider' | 'name' | 'category' | 'benefit' | 'benefitLabel' | 'summary'>>;
function entry(data: Entry): Offer {
  return {
    slug: data.id, categories: [data.category], kind: 'discount', benefitType: 'discount',
    publication: 'published', publicationBasis: 'research-snapshot', status: 'Verification Required',
    price: null, expiresAt: null, highlights: [], tags: [], facts: [], eligibility: [], documents: [], restrictions: [], sources: [],
    requirements: { verification: [] },
    researchFile: provenance, researchDate: importResearchDate, reviewedDate: new Date().toISOString().slice(0, 10),
    verifiedDate: null, verificationNote: sourceNote,
    sourceVerification: { state: 'unverified', lastAttempted: null, lastChecked: null, note: sourceNote },
    ...data,
  };
}
const studentId = { verification: ['Present a valid student ID.'] };
const esnSources = [source('ESN Armenia partner directory', 'https://esn.am/our-partners/'), source('ESNcard', 'https://www.esncard.org/')];
const esnEligibility = ['Requires a valid ESNcard; an ordinary student ID is not a substitute.'];
const esnSections = [{ title: 'Getting an ESNcard', items: ['Eligibility is decided by the local ESN chapter. Depending on the chapter, eligible groups may include Erasmus+ students, international degree students, academic mobility participants, and certain volunteering programs.', 'Enrollment at an Armenian university does not automatically confer eligibility or a free ESNcard.'] }];

const museumReference = source('Visit Yerevan research reference', 'https://www.visityerevan.am/', 'reference');
const museumData: { id: string; provider: string; standard: number; student: number; sources: Source[] }[] = [
  { id: 'history-museum-student-admission', provider: 'History Museum of Armenia', standard: 2500, student: 1250, sources: [source('Hours and admission', 'https://historymuseum.am/en/hours-and-admission/')] },
  { id: 'national-gallery-student-admission', provider: 'National Gallery of Armenia', standard: 2500, student: 1250, sources: [source('Visit the National Gallery', 'https://www.gallery.am/en/visit')] },
  { id: 'matenadaran-student-admission', provider: 'Matenadaran', standard: 2000, student: 300, sources: [source('Museum working hours and tickets', 'https://matenadaran.am/en/matenadaran/museum-and-gallery/working-hours-and-tickets/')] },
  { id: 'yerevan-history-museum-student-admission', provider: 'Yerevan History Museum', standard: 1500, student: 1000, sources: [museumReference] },
  { id: 'modern-art-museum-student-admission', provider: 'Yerevan Museum of Modern Art', standard: 1500, student: 1000, sources: [museumReference] },
  { id: 'nature-museum-student-admission', provider: 'State Museum of Nature of Armenia', standard: 1000, student: 700, sources: [museumReference] },
  { id: 'museum-of-illusions-student-admission', provider: 'Museum of Illusions', standard: 6500, student: 5000, sources: [] },
  { id: 'hayart-student-admission', provider: 'HayArt Center', standard: 3000, student: 1500, sources: [museumReference] },
  { id: 'geological-museum-student-admission', provider: 'Geological Museum', standard: 1000, student: 500, sources: [museumReference] },
  { id: 'gevorg-grigoryan-student-admission', provider: 'Gevorg Grigoryan Studio-Museum', standard: 1000, student: 500, sources: [museumReference] },
  { id: 'derenik-demirchyan-student-admission', provider: 'Derenik Demirchyan House-Museum', standard: 1000, student: 500, sources: [museumReference] },
  { id: 'silva-kaputikyan-student-admission', provider: 'Silva Kaputikyan House-Museum', standard: 1000, student: 500, sources: [museumReference] },
  { id: 'lusik-aguletsi-student-admission', provider: 'Lusik Aguletsi House-Museum', standard: 1500, student: 1000, sources: [museumReference] },
];
const museums = museumData.map(museum => entry({
  id: museum.id, provider: museum.provider, name: 'Student museum admission', category: 'entertainment',
  benefit: `${museum.student.toLocaleString('en-US')} AMD`, benefitLabel: 'student admission · eligibility conditions apply',
  summary: `Student admission listed at ${museum.student.toLocaleString('en-US')} AMD, compared with ${museum.standard.toLocaleString('en-US')} AMD standard admission in the research.`,
  price: { amount: museum.student, currency: 'AMD', period: 'admission' },
  facts: [['Standard admission', `${museum.standard.toLocaleString('en-US')} AMD`], ['Student admission', `${museum.student.toLocaleString('en-US')} AMD`]],
  tags: ['Student Verification'], highlights: ['Citizenship and visitor-category rules may apply'],
  eligibility: ['Must qualify for the museum’s own student admission category.'],
  requirements: { verification: ['Accepted student-status evidence was not specified; confirm it with the museum.'] },
  restrictions: ['Some museums distinguish Armenian students, Armenian citizens, and foreign visitors. Provider-specific nationality rules were not supplied in this compilation.', 'Foreign citizenship plus enrollment at an Armenian university does not automatically establish eligibility for the listed student price.'],
  sources: museum.sources,
  ...(museum.sources.length === 0 ? { sourceNote: 'The research mentions the Museum of Illusions official website but supplies no exact URL.' } : museum.sources[0].kind === 'reference' ? { sourceNote: 'Only the provided city tourism reference is available; no museum-specific admission URL was supplied.' } : {}),
  ...(museum.id === 'museum-of-illusions-student-admission' ? { sections: [{ title: 'Student group admission', items: ['Groups of 4–12 students: 4,500 AMD per person.', 'Groups of 13 or more students: 4,000 AMD per person.'] }] } : {}),
}));

const reebok = [
  { id: 'reebok-driven-genz-gym', name: 'Driven GenZ Gym', amount: 35000 },
  { id: 'reebok-driven-genz-pool', name: 'Driven GenZ Swimming Pool', amount: 35000 },
  { id: 'reebok-driven-genz-unlimited', name: 'Driven GenZ Unlimited Access', amount: 49000 },
].map(plan => entry({
  id: plan.id, provider: 'Reebok Sports Club', name: plan.name, category: 'sports', kind: 'subscription', benefitType: 'paid-plan',
  benefit: `${plan.amount.toLocaleString('en-US')} AMD`, benefitLabel: 'per month · paid student membership',
  summary: `${plan.name} student membership, with access daily from 14:00 to 19:00.`,
  price: { amount: plan.amount, currency: 'AMD', period: 'month' },
  highlights: ['Daily access: 14:00–19:00'], tags: ['Student ID'],
  eligibility: ['Students able to present the required proof.'],
  requirements: { verification: ['Present a valid student ID and passport.'] },
  restrictions: ['The researched access window is 14:00–19:00 daily.', 'No additional age limit or membership exclusions were supplied.'],
  sources: [source('Driven GenZ packages', 'https://reeboksportsclub.com/package-category/driven-genz/')],
}));

const esnPartners: { id: string; provider: string; amount: number; category: CategorySlug; categories?: CategorySlug[] }[] = [
  { id: 'hybuys-esncard-discount', provider: 'HyBuys', amount: 20, category: 'shopping' },
  { id: 'yell-extreme-park-esncard-discount', provider: 'Yell Extreme Park', amount: 10, category: 'sports', categories: ['sports', 'entertainment', 'transport-travel'] },
  { id: 'como-esncard-discount', provider: 'como', amount: 10, category: 'shopping' },
  { id: 'ibis-yerevan-esncard-discount', provider: 'ibis Yerevan Center', amount: 10, category: 'transport-travel' },
  { id: 'cowo-esncard-discount', provider: 'COWO', amount: 50, category: 'shopping' },
  { id: 'apaga-resort-esncard-discount', provider: 'Apaga Resort', amount: 10, category: 'transport-travel' },
  { id: 'calumet-esncard-discount', provider: 'Calumet', amount: 10, category: 'entertainment' },
];
const esnOffers = esnPartners.map(partner => entry({
  id: partner.id, provider: partner.provider, name: 'ESNcard partner discount', category: partner.category,
  ...(partner.categories ? { categories: partner.categories } : {}),
  benefit: `${partner.amount}% off`, benefitLabel: 'ESNcard partner offer',
  summary: `${partner.amount}% ESNcard partner discount at ${partner.provider}, as listed in the research.`,
  highlights: ['ESNcard required'], tags: ['ESNcard'], eligibility: esnEligibility,
  requirements: { membership: 'ESNcard', verification: ['Present a valid ESNcard.'] },
  restrictions: ['The research does not specify the exact eligible purchases, services, redemption process, or exclusions. Confirm the offer’s scope with the partner.', 'A regular student ID does not replace an ESNcard.'],
  sections: esnSections, sources: esnSources,
}));

const visaRequirements = { bankCardNetwork: 'Visa', verification: ['Requires an eligible Visa bank card under the specific promotion terms. Student status or a student Visa card alone does not establish eligibility.'] };
export const researchOffers: Offer[] = [
  entry({
    id: 'yerevan-student-orphan-transport', provider: 'Yerevan Public Transport', name: 'Student-orphan transport concession', category: 'transport-travel', kind: 'transport', benefitType: 'free-product',
    benefit: 'Free transport', benefitLabel: 'only for the qualifying municipal concession category',
    summary: 'Free qualifying transport for student orphans who satisfy Yerevan Municipality’s specific concession rules.',
    highlights: ['Specific municipal eligibility required'], tags: ['Student ID', 'Other Eligibility'],
    eligibility: ['Only students meeting the municipality’s student-orphan concession category.'],
    requirements: { verification: ['Entitlement must be established under the municipal concession rules; exact documents were not supplied.'] },
    restrictions: ['This is not free transport for every student.', 'Being enrolled alone does not establish the legal entitlement.'],
    sources: [source('Municipal transport concessions', 'https://transport.yerevan.am/privilege')],
  }),
  entry({
    id: 'cinema-star-student-tickets', provider: 'Cinema Star', name: 'Weekday student tickets', category: 'entertainment',
    benefit: 'From 1,000 AMD', benefitLabel: '2D: 1,000 AMD · 3D: 1,500 AMD',
    summary: 'Student-priced 2D and 3D screenings Monday through Friday, 10:00–17:00.',
    price: { amount: 1000, currency: 'AMD', period: '2D ticket' },
    facts: [['2D student ticket', '1,000 AMD'], ['3D student ticket', '1,500 AMD'], ['Time window', 'Monday–Friday, 10:00–17:00']],
    highlights: ['Valid student ID required', 'Monday–Friday, 10:00–17:00'], tags: ['Student ID'],
    requirements: studentId, eligibility: ['Students presenting a valid student ID.'],
    restrictions: ['Certain special formats and public holidays are excluded.', 'Online purchases are excluded.'],
    sources: [source('Cinema Star promotions', 'https://beta.cinemastar.am/en/promos')],
  }),
  entry({
    id: 'tashir-arena-student-discount', provider: 'Tashir Arena', name: 'Student event discount', category: 'entertainment',
    benefit: 'Up to 30% off', benefitLabel: 'varies by event · box office purchases',
    summary: 'A student-ID discount of up to 30%, depending on the event.',
    highlights: ['Box office only'], tags: ['Student ID'], requirements: studentId,
    eligibility: ['Student ID required.'], steps: ['Present your student ID when buying at the box office.'],
    restrictions: ['The actual discount depends on the event.', 'The offer does not apply to online purchases.'],
    sources: [source('Tashir Arena offers', 'https://tashirarena.am/ru/sales/')],
  }),
  ...museums,
  entry({
    id: 'ispace-student-education-discount', provider: 'iSpace Armenia', name: 'MacBook and iPad student discount', category: 'electronics',
    benefit: '3% off', benefitLabel: 'educational program · eligible MacBook and iPad purchases',
    summary: 'A 3% educational discount for students at Armenian universities, including the study formats described in the research.',
    highlights: ['Student ID required at pickup'], tags: ['Student ID'],
    eligibility: ['Students at Armenian universities, including full-time and part-time/distance-format students.'], requirements: studentId,
    facts: [['Availability in the research', 'Throughout the year, not only the start of the academic year']],
    steps: ['Order under the educational program.', 'If ordering online for pickup, show your student ID when collecting the order.'],
    restrictions: ['Applies to MacBook and iPad purchases under the educational program.', 'No other product-specific exclusions were supplied.'],
    sources: [source('iSpace educational program', 'https://ispace.am/ru/student')],
  }),
  ...reebok,
  entry({
    id: 'yerevan-quest-student-discount', provider: 'Yerevan Quest', name: 'Monday and Tuesday student discount', category: 'entertainment',
    benefit: '15% off', benefitLabel: 'Monday and Tuesday · student ID required',
    summary: 'A 15% student discount for Monday and Tuesday bookings.',
    highlights: ['Use STUDENT in the booking description'], tags: ['Student ID'], requirements: studentId,
    eligibility: ['Students presenting a valid student ID before the game.'],
    steps: ['Book online for Monday or Tuesday.', 'Enter STUDENT in the booking description field.', 'Show your student ID before the game.'],
    restrictions: ['Available on Monday and Tuesday.'],
    sources: [source('Yerevan Quest student offer reference', 'https://www.yerevanquest.am/en/s-projects-side-by-side')],
  }),
  entry({
    id: 'libananyan-student-discount', provider: 'Libananyan Food Factory', name: 'Student food discount', category: 'food-drinks',
    benefit: '10% off', benefitLabel: 'student ID required · end date not supplied',
    summary: 'A 10% student discount announced in September 2026.',
    highlights: ['Show a student ID'], tags: ['Student ID'], requirements: studentId, eligibility: ['Student ID required.'],
    facts: [['Announcement', 'September 2026'], ['Named locations', 'Yerevan Mall, Mega Mall, Erebuni Mall, Komitas, Tumanyan']],
    steps: ['Show your student ID when claiming the offer.'],
    restrictions: ['The research does not establish an end date or permanent availability.'],
    sourceNote: 'The research names restaurants10.com but supplies no exact announcement URL or official provider source.',
  }),
  ...esnOffers,
  entry({
    id: 'esn-armenia-selected-event-admission', provider: 'ESN Armenia Events', name: 'Selected-event admission with ESNcard', category: 'entertainment', benefitType: 'free-product',
    benefit: 'Free admission', benefitLabel: 'selected events only · ESNcard required',
    summary: 'ESNcard admission benefits for selected ESN Armenia events.',
    highlights: ['Selected events only'], tags: ['ESNcard'], eligibility: esnEligibility,
    requirements: { membership: 'ESNcard', verification: ['Present a valid ESNcard; check the selected event’s admission conditions.'] },
    restrictions: ['Not all ESN Armenia events are free.', 'The research does not provide a list of included events.'],
    sections: esnSections, sources: esnSources,
  }),
  entry({
    id: 'github-student-developer-pack', provider: 'GitHub', name: 'Student Developer Pack', category: 'software', benefitType: 'free-product',
    benefit: 'Free tools', benefitLabel: 'approved GitHub Education students',
    summary: 'Free access to a changing collection of developer, cloud, and learning tools through GitHub Education.',
    highlights: ['GitHub Education approval required'], tags: ['Student Verification'],
    eligibility: ['Students approved through GitHub Education verification; eligibility is not guaranteed for every institution or individual.'],
    requirements: { verification: ['Approved GitHub Education student verification.'] },
    restrictions: ['The collection of included tools changes; the research does not guarantee particular partner products or limits.'],
    sources: [source('GitHub Student Developer Pack', 'https://education.github.com/pack')],
  }),
  entry({
    id: 'github-copilot-student', provider: 'GitHub', name: 'Copilot Student', category: 'software', benefitType: 'free-product',
    benefit: 'Free student plan', benefitLabel: 'qualified, verified GitHub Education users',
    summary: 'A free GitHub Copilot student plan for qualified users with verified GitHub Education status.',
    highlights: ['GitHub Education approval required'], tags: ['Student Verification'],
    eligibility: ['Qualified users with approved GitHub Education student status; not all institutions or individuals automatically qualify.'],
    requirements: { verification: ['Approved GitHub Education student verification.'] },
    restrictions: ['Specific plan features and usage allowances were not supplied in the research.'],
    sources: [source('Provided GitHub Education reference', 'https://education.github.com/pack')],
    sourceNote: 'The supplied link is the Student Developer Pack reference; a separate Copilot Student terms URL was not supplied.',
  }),
  entry({
    id: 'jetbrains-student-educational-license', provider: 'JetBrains', name: 'Free educational license', category: 'software', benefitType: 'free-product',
    benefit: 'Free license', benefitLabel: 'eligible, verified academic users',
    summary: 'A free educational license subject to JetBrains student verification.',
    highlights: ['Academic verification required'], tags: ['Student Verification'],
    eligibility: ['Students accepted by the provider’s educational verification process.'],
    requirements: { verification: ['Verify using an eligible university email, ISIC, or GitHub Student Developer Pack verification, as described in the research.'] },
    restrictions: ['The research does not provide the complete license restrictions or renewal terms.'],
    sources: [source('JetBrains student pack', 'https://www.jetbrains.com/academy/student-pack/')],
  }),
  entry({
    id: 'notion-education-plus', provider: 'Notion', name: 'Education / Plus Plan', category: 'software', benefitType: 'free-product',
    benefit: 'Free education plan', benefitLabel: 'eligible academic email required',
    summary: 'A free Education/Plus Plan for eligible students who can use an accepted academic email.',
    highlights: ['Academic email required'], tags: ['Student Verification'],
    eligibility: ['Eligible students with an accepted academic/university email.'],
    requirements: { university: 'Eligible academic/university email', verification: ['Use an eligible academic/university email.'] },
    restrictions: ['Student ID by itself does not satisfy the cited email-based verification requirement.', 'The research does not supply the complete feature limits or renewal terms.'],
    sources: [source('Notion for education', 'https://www.notion.com/help/notion-for-education')],
  }),
  entry({
    id: 'figma-education', provider: 'Figma', name: 'Education plan', category: 'software', benefitType: 'free-product',
    benefit: 'Free education tools', benefitLabel: 'verified eligible academic users',
    summary: 'An education plan or free educational functionality for verified eligible users.',
    highlights: ['Academic-status verification required'], tags: ['Student Verification'],
    eligibility: ['Users accepted through Figma’s academic-status verification.'],
    requirements: { verification: ['Academic-status verification; the exact method was not supplied.'] },
    restrictions: ['The research does not specify the exact included features or verification method.'],
    sourceNote: 'No exact official Figma education offer URL was supplied in the research.',
  }),
  entry({
    id: 'visa-booking-wallet-cashback', provider: 'Booking.com / Visa', name: 'Eligible Visa Booking Wallet cashback', category: 'transport-travel', kind: 'benefit', benefitType: 'cashback',
    benefit: 'Up to 7%', benefitLabel: 'cashback to Booking Wallet after the stay',
    summary: 'A general Visa promotion for eligible prepaid accommodation bookings through the designated promotion page; not student-exclusive.',
    highlights: ['Eligible Visa bank card required', 'Not a student-exclusive promotion'], tags: ['Bank Card'], requirements: visaRequirements,
    eligibility: ['A Visa card that qualifies under the specific promotion terms; holding a student Visa card does not automatically qualify.'],
    facts: [['Cashback destination', 'Booking Wallet'], ['Research end date', '31 December 2026']], expiresAt: '2026-12-31',
    steps: ['Enter Booking.com through the designated Visa promotion page.', 'Prepay eligible accommodation using an eligible Visa card and satisfy the promotion terms.', 'Receive qualifying cashback in Booking Wallet after the stay.'],
    restrictions: ['A normal reservation started directly on Booking.com does not qualify for this promotion.', 'Cashback is not an instant price reduction.', 'No link to an individual student bank-card product is asserted without confirmation of that card’s eligibility.'],
    sources: [source('Visa Armenia Booking.com promotion', 'https://cis.visa.com/visa-in-armenia/promotions/booking.html')],
  }),
  entry({
    id: 'visa-cinema-star-card-discount', provider: 'Cinema Star / Visa', name: 'Eligible Visa cardholder cinema discount', category: 'entertainment', kind: 'benefit',
    benefit: 'Up to 15% off', benefitLabel: 'qualifying Visa cardholders · not student-exclusive',
    summary: 'A Visa cardholder cinema promotion separate from Cinema Star’s weekday student-ID tickets.',
    highlights: ['Eligible Visa bank card required', 'Not the student-ID ticket offer'], tags: ['Bank Card'], requirements: visaRequirements,
    eligibility: ['A Visa card that qualifies under the specific promotion terms; student status alone is insufficient.'],
    restrictions: ['The research does not identify the qualifying card tiers, purchase process, or full exclusions.', 'A student Visa card does not automatically qualify.'],
    expiresAt: '2026-12-31', sourceNote: 'No exact direct Visa/Cinema Star promotion URL was supplied in the research.',
  }),
];

// Matches are kept intact, including existing unpublished records and their richer details.
export const skippedExistingIds = [
  'yerevan-student-transport',
  'ucom-level-up-2500', 'ucom-level-up-3000', 'ucom-level-up-2000-regional',
  'armeconombank-visa-student', 'aeb-student-transport-cashback', 'aeb-student-fast-food-cashback', 'aeb-student-sports-cashback',
  'fast-bank-student', 'fast-bank-arca-classic-student', 'ameriabank-visa-student', 'acba-visa-student',
  'converse-student-card', 'amio-mastercard-student', 'unibank-u-teenager', 'spotify-premium-student',
];

export const tuitionAssistance = {
  id: 'armenia-tuition-assistance-reference',
  title: 'Tuition compensation and education assistance',
  description: 'Partial tuition compensation or education assistance may depend on social status, academic achievement, legal criteria, and university regulations. Amounts and application requirements vary; this is not a universal student discount.',
  sourceUrl: 'https://escs.am/',
  sourceLabel: 'Ministry of Education informational reference',
  researchDate: importResearchDate,
};
