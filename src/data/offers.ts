import { bankCards, bankLoans } from './banking';
import { mobileOffers } from './mobile';
import { transportationOffers } from './transportation';
export const offers = [...bankCards, ...mobileOffers, ...transportationOffers, ...bankLoans];
export const disclaimer = 'Offer conditions may change. Confirm availability, fees, and eligibility with the official provider before applying.';
export const formatDate = (value: string | null) => value ? new Date(`${value}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) : 'Not provided in the source document';
