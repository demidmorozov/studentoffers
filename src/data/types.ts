export type OfferStatus = 'Active' | 'Verification Required' | 'Expired' | 'Archived';
export interface Source { label: string; url: string; }
export interface Section { title: string; items: string[]; status?: OfferStatus; }
export type CategorySlug = 'food-drinks' | 'banking' | 'mobile-internet' | 'electronics' | 'entertainment' | 'transport-travel' | 'shopping' | 'sports' | 'software';
export type BenefitType = 'cashback' | 'discount' | 'free-product' | 'paid-plan' | 'bank-card' | 'financing';
export interface ResearchOffer {
  slug: string;
  category: CategorySlug | 'transportation';
  kind: 'card' | 'loan' | 'mobile' | 'transport' | 'benefit' | 'subscription' | 'discount';
  provider: string;
  name: string;
  benefit: string;
  benefitLabel: string;
  summary: string;
  highlights: string[];
  status: OfferStatus;
  tags: string[];
  facts: [string, string][];
  eligibility: string[];
  documents: string[];
  restrictions: string[];
  steps?: string[];
  sections?: Section[];
  sources: Source[];
  researchFile: string;
  researchDate: string | null;
  researchPeriod?: string;
  reviewedDate: string;
  verifiedDate: string | null;
  verificationNote: string;
  promotion?: { start?: string; end?: string; description: string; status: OfferStatus };
  comparison?: { issuance: string; annual: string; cashback: string; interest: string; currencies: string; age: string; studentId: string; };
  prices?: { name: string; standard: string; student: string; wallet: string }[];
}
export interface Offer extends Omit<ResearchOffer, 'category'> {
  id: string;
  category: CategorySlug;
  categories: CategorySlug[];
  publication: 'published' | 'draft';
  draftReason?: string;
  benefitType: BenefitType;
  price: { amount: number; currency: string; period?: string } | null;
  parentId?: string;
  requirements: { bankCardId?: string; membership?: string; university?: string; verification: string[] };
  sourceVerification: { state: 'verified' | 'unverified'; lastAttempted: string | null; lastChecked: string | null; note: string };
  expiresAt: string | null;
}
export const offerPath = (offer: Offer) => `/discounts/${offer.category}/${offer.slug}/`;
