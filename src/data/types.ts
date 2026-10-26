export type OfferStatus = 'Active' | 'Verification Required' | 'Expired' | 'Archived';
export interface Source { label: string; url: string; }
export interface Section { title: string; items: string[]; status?: OfferStatus; }
export interface Offer {
  slug: string;
  category: 'banking' | 'mobile-internet' | 'transportation';
  kind: 'card' | 'loan' | 'mobile' | 'transport';
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
export const offerPath = (offer: Offer) => `/discounts/${offer.category}/${offer.slug}/`;
